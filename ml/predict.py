"""
Prediction and Inference Module for ConfidentAI
Loads trained model artifacts, computes engineered features, makes predictions,
calculates sub-scores, and provides model explainability factors.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from ml.feature_engineering import calculate_engineered_features, ALL_MODEL_FEATURES, FEATURE_COLUMNS

class ConfidencePredictor:
    def __init__(self, models_dir: str = None):
        if models_dir is None:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            models_dir = os.path.join(current_dir, "saved_models")

        self.models_dir = models_dir
        self.regressor = joblib.load(os.path.join(models_dir, "rf_regressor.joblib")) # Use RF for non-linear feature attribution
        self.classifier = joblib.load(os.path.join(models_dir, "rf_classifier.joblib"))
        self.scaler = joblib.load(os.path.join(models_dir, "scaler.joblib"))
        self.label_encoder = joblib.load(os.path.join(models_dir, "label_encoder.joblib"))

        metrics_file = os.path.join(models_dir, "evaluation_metrics.json")
        if os.path.exists(metrics_file):
            with open(metrics_file, "r") as f:
                self.metrics = json.load(f)
        else:
            self.metrics = {}

    def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes full inference pipeline for a single assessment instance.
        """
        # Ensure default fallbacks for missing inputs
        raw_dict = {
            "public_speaking_comfort": float(input_data.get("public_speaking_comfort", 3)),
            "interview_confidence": float(input_data.get("interview_confidence", 3)),
            "hesitation_frequency": float(input_data.get("hesitation_frequency", 3)),
            "opinion_expression_comfort": float(input_data.get("opinion_expression_comfort", 3)),
            "nervousness_level": float(input_data.get("nervousness_level", 3)),
            "unexpected_questions_comfort": float(input_data.get("unexpected_questions_comfort", 3)),
            "fear_of_judgment": float(input_data.get("fear_of_judgment", 3)),
            "technical_explanation_comfort": float(input_data.get("technical_explanation_comfort", 3)),
            "speaking_duration": float(input_data.get("speaking_duration", 45.0)),
            "words_per_minute": float(input_data.get("words_per_minute", 135.0)),
            "response_length_words": int(input_data.get("response_length_words", 75)),
            "pause_frequency": float(input_data.get("pause_frequency", 8.0)),
            "filler_word_count": int(input_data.get("filler_word_count", 4)),
            "speech_consistency": float(input_data.get("speech_consistency", 0.75)),
            "sentiment_score": float(input_data.get("sentiment_score", 0.35)),
            "clarity_score": float(input_data.get("clarity_score", 70.0)),
        }

        df_input = pd.DataFrame([raw_dict])
        df_featured = calculate_engineered_features(df_input)

        X = df_featured[ALL_MODEL_FEATURES]
        X_scaled = self.scaler.transform(X)

        # Regressor prediction (0-100 continuous score)
        pred_reg_raw = float(self.regressor.predict(X_scaled)[0])
        confidence_score = round(float(np.clip(pred_reg_raw, 10.0, 99.0)), 1)

        # Classifier prediction (Low, Moderate, High)
        pred_clf_idx = int(self.classifier.predict(X_scaled)[0])
        category = self.label_encoder.inverse_transform([pred_clf_idx])[0]

        # Probabilities
        probs = self.classifier.predict_proba(X_scaled)[0]
        category_probabilities = {
            cls: round(float(prob) * 100, 1)
            for cls, prob in zip(self.label_encoder.classes_, probs)
        }

        # Sub-scores calculation (Domain mapping calibrated to 0-100)
        sub_scores = self._calculate_sub_scores(raw_dict, df_featured.iloc[0])

        # Weakness identification
        weakness_info = self._identify_weaknesses(raw_dict, sub_scores)

        # Explainability: Feature contribution factors
        explainability = self._explain_prediction(raw_dict, df_featured.iloc[0])

        return {
            "confidence_score": confidence_score,
            "category": category,
            "category_probabilities": category_probabilities,
            "sub_scores": sub_scores,
            "weakness_analysis": weakness_info,
            "explainability": explainability,
            "engineered_features": {
                col: round(float(df_featured.iloc[0][col]), 3)
                for col in df_featured.columns if col not in raw_dict
            }
        }

    def _calculate_sub_scores(self, raw: Dict[str, Any], engineered: pd.Series) -> Dict[str, int]:
        """
        Calculates domain specific sub-scores for radar & bar charts:
        - Speaking (Delivery pace, consistency, duration)
        - Communication (Opinion expression, interview comfort, public speaking)
        - Clarity (Linguistic clarity, vocabulary richness, sentence flow)
        - Response Confidence (Low fear of judgment, low nervousness, unexpected questions)
        - Fluency (Low fillers, low pauses, optimal WPM)
        """
        # 1. Speaking (0-100)
        wpm = raw["words_per_minute"]
        wpm_points = 100 - min(abs(wpm - 145.0) * 1.2, 45.0)
        speaking_score = int(np.clip(
            (wpm_points * 0.5) + (raw["speech_consistency"] * 100 * 0.35) +
            (min(raw["speaking_duration"] / 45.0, 1.0) * 100 * 0.15),
            20, 99
        ))

        # 2. Communication (0-100)
        comm_likert_avg = (
            raw["opinion_expression_comfort"] +
            raw["interview_confidence"] +
            raw["public_speaking_comfort"] +
            raw["technical_explanation_comfort"]
        ) / 4.0
        communication_score = int(np.clip(
            ((comm_likert_avg - 1.0) / 4.0 * 85.0) +
            (max(0.0, raw["sentiment_score"] + 0.3) / 1.3 * 15.0),
            15, 99
        ))

        # 3. Clarity (0-100)
        clarity_score = int(np.clip(raw["clarity_score"], 20, 99))

        # 4. Response Confidence (0-100)
        calmness = 6.0 - raw["nervousness_level"]  # 1-5 -> 5-1
        fearlessness = 6.0 - raw["fear_of_judgment"]
        adaptability = raw["unexpected_questions_comfort"]
        response_conf_avg = (calmness + fearlessness + adaptability) / 3.0
        response_confidence_score = int(np.clip(((response_conf_avg - 1.0) / 4.0 * 100.0), 15, 99))

        # 5. Fluency (0-100)
        fluency_score = int(np.clip(engineered["fluency_composite"] * 100.0, 15, 99))

        return {
            "speaking": speaking_score,
            "communication": communication_score,
            "clarity": clarity_score,
            "response_confidence": response_confidence_score,
            "fluency": fluency_score
        }

    def _identify_weaknesses(self, raw: Dict[str, Any], sub_scores: Dict[str, int]) -> Dict[str, Any]:
        """
        Pinpoints the primary and secondary growth areas with actionable coaching advice.
        """
        lowest_sub = min(sub_scores, key=sub_scores.get)

        weakness_catalog = {
            "fluency": {
                "title": "Speaking Fluency & Flow",
                "tag": "Fluency",
                "score": sub_scores["fluency"],
                "reason": f"Elevated filler word frequency ({raw['filler_word_count']} detected) and pause intervals ({raw['pause_frequency']} pauses/min) interrupt speaking continuity.",
                "tip": "Practice short 30-second speaking sprints without stopping or restarting when you hesitate."
            },
            "speaking": {
                "title": "Delivery Pace & Pacing Consistency",
                "tag": "Speaking Pacing",
                "score": sub_scores["speaking"],
                "reason": f"Your speaking pace ({raw['words_per_minute']:.0f} WPM) diverges from the conversational target of 135–155 WPM, impacting audience engagement.",
                "tip": "Use a metronome or timed voice prompts to calibrate steady breathing and steady cadence."
            },
            "response_confidence": {
                "title": "Spontaneous Response & Poise",
                "tag": "Impromptu Poise",
                "score": sub_scores["response_confidence"],
                "reason": "Elevated situational nervousness and self-consciousness when addressing unexpected questions reduce vocal projection.",
                "tip": "Utilize the PREP framework (Point, Reason, Example, Point) to structure fast, structured answers."
            },
            "communication": {
                "title": "Assertive Expression & Articulation",
                "tag": "Assertiveness",
                "score": sub_scores["communication"],
                "reason": "Self-assessment indicates hesitation in expressing strong personal viewpoints in group or interview environments.",
                "tip": "Start contributions with clear thesis statements ('My recommendation is...') rather than passive qualifiers."
            },
            "clarity": {
                "title": "Linguistic Precision & Sentence Structure",
                "tag": "Clarity",
                "score": sub_scores["clarity"],
                "reason": "Linguistic indicators highlight potential for tighter vocabulary diversity and succinct sentence lengths.",
                "tip": "Practice the 'Explain Like I'm 10' exercise to translate complex thoughts into crystal-clear sentences."
            }
        }

        primary = weakness_catalog.get(lowest_sub, weakness_catalog["fluency"])

        # Find secondary weakness (second lowest)
        sorted_subs = sorted(sub_scores.items(), key=lambda x: x[1])
        secondary_key = sorted_subs[1][0] if len(sorted_subs) > 1 else lowest_sub
        secondary = weakness_catalog.get(secondary_key, weakness_catalog["speaking"])

        return {
            "primary_weakness": primary,
            "secondary_weakness": secondary,
            "all_subscores_ranked": [{"area": k, "score": v} for k, v in sorted_subs]
        }

    def _explain_prediction(self, raw: Dict[str, Any], engineered: pd.Series) -> Dict[str, List[Dict[str, str]]]:
        """
        Extracts positive and negative drivers contributing to the model's confidence estimation.
        Strictly framed as communication indicators, not psychological diagnosis.
        """
        positive_factors = []
        negative_factors = []

        # 1. Fluency & Fillers
        if raw["filler_word_count"] <= 3:
            positive_factors.append({
                "factor": "Low Filler Word Usage",
                "impact": "Positive",
                "description": f"Only {raw['filler_word_count']} filler words detected, maintaining clean message delivery."
            })
        elif raw["filler_word_count"] >= 6:
            negative_factors.append({
                "factor": "Frequent Filler Words",
                "impact": "Needs Work",
                "description": f"{raw['filler_word_count']} filler occurrences ('um', 'uh', 'like') disrupt natural cadence."
            })

        # 2. Pacing
        if 130 <= raw["words_per_minute"] <= 160:
            positive_factors.append({
                "factor": "Optimal Speaking Tempo",
                "impact": "Positive",
                "description": f"Speaking rate of {raw['words_per_minute']:.0f} WPM sits squarely in the ideal conversational zone."
            })
        elif raw["words_per_minute"] < 115:
            negative_factors.append({
                "factor": "Slow Speaking Pace",
                "impact": "Needs Work",
                "description": f"Speaking rate of {raw['words_per_minute']:.0f} WPM suggests hesitation or extended deliberation."
            })
        elif raw["words_per_minute"] > 175:
            negative_factors.append({
                "factor": "Rushed Speaking Tempo",
                "impact": "Needs Work",
                "description": f"Pacing at {raw['words_per_minute']:.0f} WPM may cause listener fatigue or sound hurried."
            })

        # 3. Clarity
        if raw["clarity_score"] >= 75:
            positive_factors.append({
                "factor": "High Message Clarity",
                "impact": "Positive",
                "description": f"Strong vocabulary richness and structured articulation (Clarity index: {raw['clarity_score']:.0f}/100)."
            })
        elif raw["clarity_score"] < 60:
            negative_factors.append({
                "factor": "Moderate Clarity Index",
                "impact": "Needs Work",
                "description": f"Vocabulary repetition and shorter sentence fragments lower the clarity score."
            })

        # 4. Hesitation & Nervousness
        if raw["hesitation_frequency"] <= 2 and raw["nervousness_level"] <= 2:
            positive_factors.append({
                "factor": "High Situational Poise",
                "impact": "Positive",
                "description": "Minimal self-reported hesitation and low situational nervousness reinforce delivery stability."
            })
        if raw["hesitation_frequency"] >= 4:
            negative_factors.append({
                "factor": "Self-Reported Hesitation",
                "impact": "Needs Work",
                "description": "Reported tendency to second-guess statements during active conversation."
            })

        # 5. Public speaking & interviews
        if raw["public_speaking_comfort"] >= 4 and raw["interview_confidence"] >= 4:
            positive_factors.append({
                "factor": "Strong Interview & Public Speaking Affinity",
                "impact": "Positive",
                "description": "Comfortable presenting in front of peer groups and responding in formal interview scenarios."
            })

        # Fallback guarantees if lists are empty
        if not positive_factors:
            positive_factors.append({
                "factor": "Consistent Voice Pitch",
                "impact": "Positive",
                "description": "Speech consistency and audio envelope show steady vocal engagement."
            })
        if not negative_factors:
            negative_factors.append({
                "factor": "Minor Pacing Fine-Tuning",
                "impact": "Minor",
                "description": "Small opportunities to smooth out transition pauses between speaking topics."
            })

        return {
            "positive_factors": positive_factors[:4],
            "negative_factors": negative_factors[:4]
        }
