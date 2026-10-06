"""
Progress and History API Routes for ConfidentAI
Tracks assessment progression over time, calculates improvement deltas,
and manages interactive exercise completion logs.
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.database.db import get_db
from backend.database.models import Assessment, CompletedExercise

router = APIRouter(prefix="/api", tags=["Progress & History"])

@router.get("/history")
def get_assessment_history(limit: int = 20, db: Session = Depends(get_db)):
    """
    Returns ordered list of historical assessments.
    """
    assessments = db.query(Assessment).order_by(Assessment.created_at.desc()).limit(limit).all()

    results = []
    for a in assessments:
        results.append({
            "id": a.id,
            "created_at": a.created_at.isoformat(),
            "user_name": a.user_name,
            "target_role": a.target_role,
            "confidence_score": a.confidence_score,
            "confidence_category": a.confidence_category,
            "weakness_primary": a.weakness_primary,
            "sub_scores": json.loads(a.sub_scores_json) if a.sub_scores_json else {},
            "audio_present": a.audio_present
        })

    return results

@router.get("/progress")
def get_progress_summary(db: Session = Depends(get_db)):
    """
    Computes aggregated progress statistics:
    - Current score vs Initial score
    - Improvement percentage and point delta (+X points)
    - Trend line data series
    - Best score and category distribution
    - Completed exercises count
    """
    assessments = db.query(Assessment).order_by(Assessment.created_at.asc()).all()
    completed_exs = db.query(CompletedExercise).order_by(CompletedExercise.completed_at.desc()).all()

    if not assessments:
        return {
            "has_data": False,
            "assessments_count": 0,
            "completed_exercises_count": len(completed_exs),
            "current_score": 0,
            "previous_score": 0,
            "initial_score": 0,
            "best_score": 0,
            "improvement_points": 0,
            "improvement_percentage": 0.0,
            "trend_series": [],
            "recent_exercises": []
        }

    scores = [a.confidence_score for a in assessments]
    current_score = scores[-1]
    initial_score = scores[0]
    previous_score = scores[-2] if len(scores) > 1 else initial_score
    best_score = max(scores)

    improvement_points = round(current_score - initial_score, 1)
    improvement_percentage = round(((current_score - initial_score) / max(initial_score, 1.0)) * 100.0, 1)

    trend_series = []
    for idx, a in enumerate(assessments, 1):
        sub_scores = json.loads(a.sub_scores_json) if a.sub_scores_json else {}
        trend_series.append({
            "assessment_num": f"Assessment {idx}",
            "index": idx,
            "id": a.id,
            "date": a.created_at.strftime("%b %d, %H:%M"),
            "confidence_score": a.confidence_score,
            "speaking": sub_scores.get("speaking", 0),
            "communication": sub_scores.get("communication", 0),
            "clarity": sub_scores.get("clarity", 0),
            "response_confidence": sub_scores.get("response_confidence", 0),
            "fluency": sub_scores.get("fluency", 0),
            "category": a.confidence_category
        })

    recent_ex_list = [
        {
            "id": ex.id,
            "exercise_key": ex.exercise_key,
            "exercise_title": ex.exercise_title,
            "completed_at": ex.completed_at.strftime("%b %d, %H:%M"),
            "duration_spent_seconds": ex.duration_spent_seconds,
            "score_boost": ex.score_boost,
            "notes": ex.reflection_notes
        }
        for ex in completed_exs[:10]
    ]

    latest_assessment = assessments[-1]
    latest_subscores = json.loads(latest_assessment.sub_scores_json) if latest_assessment.sub_scores_json else {}

    return {
        "has_data": True,
        "assessments_count": len(assessments),
        "completed_exercises_count": len(completed_exs),
        "current_score": current_score,
        "previous_score": previous_score,
        "initial_score": initial_score,
        "best_score": best_score,
        "improvement_points": improvement_points,
        "improvement_percentage": improvement_percentage,
        "latest_category": latest_assessment.confidence_category,
        "latest_weakness": latest_assessment.weakness_primary,
        "latest_subscores": latest_subscores,
        "trend_series": trend_series,
        "recent_exercises": recent_ex_list
    }

@router.post("/exercises/complete")
def log_exercise_completion(payload: dict, db: Session = Depends(get_db)):
    """
    Logs an exercise completion with duration and reflection.
    """
    key = payload.get("exercise_key", "no_pause_challenge")
    title = payload.get("exercise_title", "Confidence Exercise")
    duration = int(payload.get("duration_spent_seconds", 45))
    notes = payload.get("reflection_notes", "")
    boost = float(payload.get("score_boost", 2.0))

    comp = CompletedExercise(
        exercise_key=key,
        exercise_title=title,
        duration_spent_seconds=duration,
        score_boost=boost,
        reflection_notes=notes
    )
    db.add(comp)
    db.commit()
    db.refresh(comp)

    return {
        "success": True,
        "message": f"Exercise '{title}' logged successfully!",
        "exercise_id": comp.id,
        "score_boost": boost
    }

@router.delete("/history/reset")
def reset_user_history(db: Session = Depends(get_db)):
    """
    Resets all assessment records and exercise logs to allow clean demonstration runs.
    """
    db.query(CompletedExercise).delete()
    db.query(Assessment).delete()
    db.commit()
    return {"success": True, "message": "History and progress data cleared."}
