"""
ConfidentAI - Backend Main Application
FastAPI REST API server integrating:
- Machine Learning inference and feature engineering
- NLP & Speech acoustic feature extraction
- Progress tracking and database persistence
- Demo mode for college presentations & academic defense
"""

import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database.db import engine, Base, SessionLocal
from backend.database.models import Exercise, CompletedExercise, Assessment
from backend.services.recommendation_service import EXERCISE_CATALOG
from backend.routes.assessment import router as assessment_router
from backend.routes.progress import router as progress_router
from backend.routes.recommendations import router as recommendations_router
from backend.routes.model_metrics import router as model_metrics_router
from backend.routes.demo import router as demo_router

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed standard exercise catalog if database is fresh
def init_db():
    db = SessionLocal()
    try:
        count = db.query(Exercise).count()
        if count == 0:
            for item in EXERCISE_CATALOG:
                ex = Exercise(
                    key=item["key"],
                    title=item["title"],
                    target_skill=item["target_skill"],
                    category=item["category"],
                    duration_seconds=item["duration_seconds"],
                    difficulty=item["difficulty"],
                    prompt_text=item["prompt_text"],
                    instructions=item["instructions"],
                    coaching_benefit=item["coaching_benefit"]
                )
                db.add(ex)
            db.commit()
            print("Seeded default exercise catalog into database.")
    except Exception as e:
        print(f"Database initialization note: {e}")
    finally:
        db.close()

init_db()

app = FastAPI(
    title="ConfidentAI API",
    description="Machine Learning Powered Personal Communication & Confidence Booster API",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default ports 5173, 3000, 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(assessment_router)
app.include_router(progress_router)
app.include_router(recommendations_router)
app.include_router(model_metrics_router)
app.include_router(demo_router)

@app.get("/")
def root():
    return {
        "app_name": "ConfidentAI – Personal Confidence Booster API",
        "status": "online",
        "version": "1.0.0",
        "endpoints": [
            "/api/assessment",
            "/api/predict",
            "/api/analyze-text",
            "/api/analyze-audio",
            "/api/history",
            "/api/progress",
            "/api/recommendations",
            "/api/exercises",
            "/api/model-metrics",
            "/api/demo/profiles",
            "/api/demo/seed"
        ]
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
