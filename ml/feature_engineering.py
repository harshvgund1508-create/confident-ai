"""
Feature Engineering Module for ConfidentAI
Calculates domain-specific interaction terms, fluency indices, and behavioral ratios.
"""

import numpy as np
import pandas as pd

FEATURE_COLUMNS = [
    "public_speaking_comfort",
    "interview_confidence",
    "hesitation_frequency",
    "opinion_expression_comfort",
    "nervousness_level",
    "unexpected_questions_comfort",
    "fear_of_judgment",
    "technical_explanation_comfort",
    "speaking_duration",
    "words_per_minute",
    "response_length_words",
    "pause_frequency",
    "filler_word_count",
    "speech_consistency",
    "sentiment_score",
    "clarity_score"
]

ENGINEERED_FEATURE_COLUMNS = [
    "self_efficacy_index",
    "anxiety_penalty_index",
    "pacing_optimality",
    "filler_density",
    "pause_ratio",
    "fluency_composite",
    "clarity_sentiment_interaction"
]

ALL_MODEL_FEATURES = FEATURE_COLUMNS + ENGINEERED_FEATURE_COLUMNS

def calculate_engineered_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes domain-specific engineered features from raw input features.
    """
    df = df.copy()

    # 1. Self-Efficacy Index: Average of positive Likert indicators (1-5 scaled to 0-1)
    pos_likert = (
        df["public_speaking_comfort"] +
        df["interview_confidence"] +
        df["opinion_expression_comfort"] +
        df["unexpected_questions_comfort"] +
        df["technical_explanation_comfort"]
    ) / 5.0
    df["self_efficacy_index"] = ((pos_likert - 1.0) / 4.0).clip(0.0, 1.0)

    # 2. Anxiety Penalty Index: Average of anxiety/hesitation indicators (1-5 scaled to 0-1)
    neg_likert = (
        df["hesitation_frequency"] +
        df["nervousness_level"] +
        df["fear_of_judgment"]
    ) / 3.0
    df["anxiety_penalty_index"] = ((neg_likert - 1.0) / 4.0).clip(0.0, 1.0)

    # 3. Pacing Optimality: Gaussian bell around ideal speaking rate (145 WPM)
    # Range: 0 to 1
    ideal_wpm = 145.0
    wpm_diff = np.abs(df["words_per_minute"] - ideal_wpm)
    df["pacing_optimality"] = np.exp(-0.5 * (wpm_diff / 35.0) ** 2).clip(0.0, 1.0)

    # 4. Filler Density: Fillers per 100 words
    safe_words = np.maximum(df["response_length_words"], 10)
    df["filler_density"] = (df["filler_word_count"] / safe_words * 100.0).clip(0.0, 30.0)

    # 5. Pause Ratio: Estimated pause duration relative to total speaking time
    safe_duration = np.maximum(df["speaking_duration"], 5.0)
    estimated_pause_seconds = df["pause_frequency"] * (safe_duration / 60.0) * 0.8  # ~0.8s avg pause
    df["pause_ratio"] = (estimated_pause_seconds / safe_duration).clip(0.0, 0.85)

    # 6. Fluency Composite: Harmonized score combining pacing, low fillers, and speech consistency
    filler_component = np.maximum(0.0, 1.0 - (df["filler_density"] / 12.0))
    pause_component = np.maximum(0.0, 1.0 - (df["pause_ratio"] / 0.5))
    df["fluency_composite"] = (
        0.35 * df["pacing_optimality"] +
        0.30 * filler_component +
        0.20 * pause_component +
        0.15 * df["speech_consistency"]
    ).clip(0.0, 1.0)

    # 7. Clarity & Sentiment Interaction
    norm_clarity = (df["clarity_score"] / 100.0).clip(0.0, 1.0)
    norm_sentiment = ((df["sentiment_score"] + 1.0) / 2.0).clip(0.0, 1.0)
    df["clarity_sentiment_interaction"] = (norm_clarity * norm_sentiment).clip(0.0, 1.0)

    return df
