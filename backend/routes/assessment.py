"""
Assessment API Routes for ConfidentAI
Handles confidence self-assessment, audio/text feature extraction, ML inference, and result persistence.
"""

import json
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from backend.database.db import get_db
from backend.database.models import Assessment
from backend.services.nlp_service import analyze_text_response
from backend.services.audio_service import analyze_audio_bytes
from backend.services.ml_service import get_predictor
from backend.services.recommendation_service import get_recommendations_for_weakness

router = APIRouter(prefix="/api", tags=["Assessment & Prediction"])

@router.post("/analyze-text")
async def analyze_text_endpoint(payload: dict):
    """
    Analyzes written text for sentiment, clarity, filler words, and vocabulary diversity.
    """
    text = payload.get("text", "")
    duration = float(payload.get("speaking_duration", 45.0))
    analysis = analyze_text_response(text, speaking_duration_sec=duration)
    return analysis

@router.post("/analyze-audio")
async def analyze_audio_endpoint(
    audio_file: UploadFile = File(...),
    transcript_words: Optional[int] = Form(0)
):
    """
    Analyzes an uploaded or recorded audio file and extracts acoustic features.
    Privacy note: Audio is processed in memory and never permanently stored.
    """
    try:
        content = await audio_file.read()
        features = analyze_audio_bytes(content, filename=audio_file.filename, transcript_words=transcript_words or 0)
        return features
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process audio: {str(e)}")

@router.post("/predict")
async def direct_predict_endpoint(payload: dict):
    """
    Direct ML inference endpoint accepting raw feature vector.
    """
    predictor = get_predictor()
    result = predictor.predict(payload)
    return result

@router.post("/assessment")
async def submit_assessment(
    public_speaking_comfort: int = Form(...),
    interview_confidence: int = Form(...),
    hesitation_frequency: int = Form(...),
    opinion_expression_comfort: int = Form(...),
    nervousness_level: int = Form(...),
    unexpected_questions_comfort: int = Form(...),
    fear_of_judgment: int = Form(...),
    technical_explanation_comfort: int = Form(...),
    user_name: Optional[str] = Form("Student Candidate"),
    target_role: Optional[str] = Form("Job/Internship Seeker"),
    response_text: Optional[str] = Form(""),
    speaking_duration_sec: Optional[float] = Form(45.0),
    audio_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Complete assessment pipeline:
    1. Parse Likert inputs
    2. Analyze text response (NLP)
    3. Analyze audio recording if uploaded (Audio signal processing)
    4. Run trained ML models (Random Forest Regressor & Classifier)
    5. Detect weakest area & recommendations
    6. Persist to database
    7. Return complete report
    """
    # 1. NLP Text Analysis
    nlp_metrics = analyze_text_response(response_text or "", speaking_duration_sec=speaking_duration_sec or 45.0)

    # 2. Audio Processing (or fallback to NLP derived values)
    audio_present = False
    if audio_file is not None:
        try:
            audio_bytes = await audio_file.read()
            if len(audio_bytes) > 200:
                audio_present = True
                audio_metrics = analyze_audio_bytes(
                    audio_bytes,
                    filename=audio_file.filename,
                    transcript_words=nlp_metrics["word_count"]
                )
            else:
                audio_metrics = analyze_audio_bytes(b"", transcript_words=nlp_metrics["word_count"])
        except Exception:
            audio_metrics = analyze_audio_bytes(b"", transcript_words=nlp_metrics["word_count"])
    else:
        audio_metrics = analyze_audio_bytes(b"", transcript_words=nlp_metrics["word_count"])

    # 3. Assemble complete feature vector for ML model
    # Priority: If text/audio metrics exist, use them; otherwise use calibrated defaults
    wpm = audio_metrics["words_per_minute"] if audio_present else (
        nlp_metrics["words_per_minute"] if nlp_metrics["word_count"] > 10 else 138.0
    )
    speaking_duration = audio_metrics["speaking_duration"] if audio_present else (
        speaking_duration_sec if speaking_duration_sec and speaking_duration_sec > 5 else 45.0
    )
    words_count = nlp_metrics["word_count"] if nlp_metrics["word_count"] > 0 else int((speaking_duration / 60.0) * wpm)
    filler_count = nlp_metrics["filler_word_count"] if nlp_metrics["word_count"] > 0 else (
        int(hesitation_frequency * 1.5)
    )
    pause_freq = audio_metrics["pause_frequency"] if audio_present else (
        float(hesitation_frequency * 2.2 + 2.0)
    )
    speech_consistency = audio_metrics["speech_consistency"] if audio_present else (
        0.90 - (nervousness_level * 0.05)
    )
    sentiment_score = nlp_metrics["sentiment_score"]
    clarity_score = nlp_metrics["clarity_score"]

    model_input = {
        "public_speaking_comfort": public_speaking_comfort,
        "interview_confidence": interview_confidence,
        "hesitation_frequency": hesitation_frequency,
        "opinion_expression_comfort": opinion_expression_comfort,
        "nervousness_level": nervousness_level,
        "unexpected_questions_comfort": unexpected_questions_comfort,
        "fear_of_judgment": fear_of_judgment,
        "technical_explanation_comfort": technical_explanation_comfort,
        "speaking_duration": speaking_duration,
        "words_per_minute": wpm,
        "response_length_words": words_count,
        "pause_frequency": pause_freq,
        "filler_word_count": filler_count,
        "speech_consistency": speech_consistency,
        "sentiment_score": sentiment_score,
        "clarity_score": clarity_score
    }

    # 4. Predict Confidence Score & Category
    predictor = get_predictor()
    ml_output = predictor.predict(model_input)

    # 5. Recommendation mapping
    weakness_info = ml_output["weakness_analysis"]
    primary_key = weakness_info["all_subscores_ranked"][0]["area"]
    recommendations = get_recommendations_for_weakness(primary_key, ml_output["sub_scores"])

    # 6. Database Record Persistence
    likert_data = {
        "public_speaking_comfort": public_speaking_comfort,
        "interview_confidence": interview_confidence,
        "hesitation_frequency": hesitation_frequency,
        "opinion_expression_comfort": opinion_expression_comfort,
        "nervousness_level": nervousness_level,
        "unexpected_questions_comfort": unexpected_questions_comfort,
        "fear_of_judgment": fear_of_judgment,
        "technical_explanation_comfort": technical_explanation_comfort
    }

    assessment_record = Assessment(
        user_name=user_name or "Student Candidate",
        target_role=target_role or "Job/Internship Seeker",
        confidence_score=ml_output["confidence_score"],
        confidence_category=ml_output["category"],
        sub_scores_json=json.dumps(ml_output["sub_scores"]),
        weakness_primary=weakness_info["primary_weakness"]["title"],
        weakness_reason=weakness_info["primary_weakness"]["reason"],
        weakness_tip=weakness_info["primary_weakness"]["tip"],
        likert_inputs_json=json.dumps(likert_data),
        speech_metrics_json=json.dumps(audio_metrics),
        text_metrics_json=json.dumps(nlp_metrics),
        explainability_json=json.dumps(ml_output["explainability"]),
        audio_present=audio_present,
        response_text=response_text
    )
    db.add(assessment_record)
    db.commit()
    db.refresh(assessment_record)

    return {
        "assessment_id": assessment_record.id,
        "timestamp": assessment_record.created_at.isoformat(),
        "user_name": assessment_record.user_name,
        "target_role": assessment_record.target_role,
        "confidence_score": ml_output["confidence_score"],
        "confidence_category": ml_output["category"],
        "category_probabilities": ml_output["category_probabilities"],
        "sub_scores": ml_output["sub_scores"],
        "weakness_analysis": weakness_info,
        "explainability": ml_output["explainability"],
        "recommendations": recommendations,
        "nlp_metrics": nlp_metrics,
        "speech_metrics": audio_metrics,
        "audio_present": audio_present,
        "disclaimer": "This communication assessment is an educational and skills-coaching tool powered by Machine Learning. It is not a clinical or psychological diagnosis."
    }
