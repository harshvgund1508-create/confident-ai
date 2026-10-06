"""
Recommendations and Exercises API Routes for ConfidentAI
"""

import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.db import get_db
from backend.database.models import Assessment
from backend.services.recommendation_service import EXERCISE_CATALOG, get_recommendations_for_weakness

router = APIRouter(prefix="/api", tags=["Recommendations & Exercises"])

@router.get("/exercises")
def get_all_exercises():
    """
    Returns the complete catalog of confidence building exercises.
    """
    return {
        "count": len(EXERCISE_CATALOG),
        "exercises": EXERCISE_CATALOG
    }

@router.get("/recommendations")
def get_current_recommendations(db: Session = Depends(get_db)):
    """
    Returns targeted recommendations based on the user's latest assessment.
    """
    latest = db.query(Assessment).order_by(Assessment.created_at.desc()).first()

    if not latest:
        # Default baseline recommendations if no assessment has taken place yet
        default_recs = get_recommendations_for_weakness("fluency", {"fluency": 60, "speaking": 65})
        return {
            "has_assessment": False,
            "message": "Take your first assessment to receive personalized weakness-targeted exercises.",
            "primary_weakness": "Speaking Fluency (Default Starter)",
            "primary_exercise": default_recs["primary_recommended_exercise"],
            "secondary_exercise": default_recs["secondary_recommended_exercise"],
            "all_exercises": EXERCISE_CATALOG
        }

    sub_scores = json.loads(latest.sub_scores_json) if latest.sub_scores_json else {}
    lowest_key = min(sub_scores, key=sub_scores.get) if sub_scores else "fluency"
    recs = get_recommendations_for_weakness(lowest_key, sub_scores)

    return {
        "has_assessment": True,
        "assessment_id": latest.id,
        "latest_score": latest.confidence_score,
        "primary_weakness": latest.weakness_primary,
        "weakness_reason": latest.weakness_reason,
        "weakness_tip": latest.weakness_tip,
        "primary_exercise": recs["primary_recommended_exercise"],
        "secondary_exercise": recs["secondary_recommended_exercise"],
        "all_exercises": EXERCISE_CATALOG
    }
