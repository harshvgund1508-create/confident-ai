"""
Database models for ConfidentAI.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, Text, DateTime, Boolean
from backend.database.db import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_name = Column(String(100), default="Student Candidate")
    target_role = Column(String(100), default="Job/Internship Seeker")

    # Scores
    confidence_score = Column(Float, nullable=False)
    confidence_category = Column(String(50), nullable=False)  # Low, Moderate, High

    # Sub-scores stored as JSON text
    sub_scores_json = Column(Text, nullable=False)

    # Weakness
    weakness_primary = Column(String(100), nullable=False)
    weakness_reason = Column(Text, nullable=True)
    weakness_tip = Column(Text, nullable=True)

    # Detailed features & raw inputs (JSON)
    likert_inputs_json = Column(Text, nullable=False)
    speech_metrics_json = Column(Text, nullable=True)
    text_metrics_json = Column(Text, nullable=True)
    explainability_json = Column(Text, nullable=True)
    audio_present = Column(Boolean, default=False)
    response_text = Column(Text, nullable=True)

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    key = Column(String(50), unique=True, index=True)
    title = Column(String(120), nullable=False)
    target_skill = Column(String(80), nullable=False)
    category = Column(String(60), nullable=False)
    duration_seconds = Column(Integer, default=60)
    difficulty = Column(String(20), default="Beginner")  # Beginner, Intermediate, Advanced
    prompt_text = Column(Text, nullable=False)
    instructions = Column(Text, nullable=False)
    coaching_benefit = Column(Text, nullable=False)

class CompletedExercise(Base):
    __tablename__ = "completed_exercises"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    exercise_key = Column(String(50), index=True)
    exercise_title = Column(String(120))
    completed_at = Column(DateTime, default=datetime.utcnow)
    duration_spent_seconds = Column(Integer, default=60)
    score_boost = Column(Float, default=2.5)
    reflection_notes = Column(Text, nullable=True)
