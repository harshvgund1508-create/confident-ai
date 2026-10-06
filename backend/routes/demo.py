"""
Demo Mode & Presentation Seed API Routes for ConfidentAI
Provides one-click demo data seeding for college presentations and live viva demonstrations.
"""

import json
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.db import get_db
from backend.database.models import Assessment, CompletedExercise

router = APIRouter(prefix="/api/demo", tags=["Demo Mode"])

SAMPLE_PROFILES = [
    {
        "id": "student_beginner",
        "title": "College Student – First-Time Tech Interviewee",
        "user_name": "Alex Chen",
        "target_role": "Software Engineering Intern",
        "description": "High anxiety regarding live technical coding explanations and noticeable filler words.",
        "sample_likert": {
            "public_speaking_comfort": 2,
            "interview_confidence": 2,
            "hesitation_frequency": 4,
            "opinion_expression_comfort": 3,
            "nervousness_level": 4,
            "unexpected_questions_comfort": 2,
            "fear_of_judgment": 4,
            "technical_explanation_comfort": 3
        },
        "sample_text": "Um, hello. I am, like, really passionate about coding in Python and, uh, I built a web scraper project. Actually, it was kind of hard at first, you know, but I think I managed to finish it."
    },
    {
        "id": "job_seeker_intermediate",
        "title": "Job Seeker – Developing Fluency",
        "user_name": "Priya Sharma",
        "target_role": "Data Analyst Candidate",
        "description": "Solid technical grasp, but experiences pacing slowdowns when asked surprise behavioral questions.",
        "sample_likert": {
            "public_speaking_comfort": 3,
            "interview_confidence": 3,
            "hesitation_frequency": 3,
            "opinion_expression_comfort": 4,
            "nervousness_level": 3,
            "unexpected_questions_comfort": 3,
            "fear_of_judgment": 3,
            "technical_explanation_comfort": 4
        },
        "sample_text": "Good morning. I recently graduated with a degree in Computer Science and led our capstone data analytics dashboard. I am confident in SQL and statistical modeling, and I look forward to contributing to your data team."
    },
    {
        "id": "public_speaker_advanced",
        "title": "Public Speaking Finalist – Advanced",
        "user_name": "Marcus Vance",
        "target_role": "Product Manager / Lead Presenter",
        "description": "High confidence, articulate pacing, strong vocabulary diversity and structured delivery.",
        "sample_likert": {
            "public_speaking_comfort": 5,
            "interview_confidence": 5,
            "hesitation_frequency": 1,
            "opinion_expression_comfort": 5,
            "nervousness_level": 1,
            "unexpected_questions_comfort": 5,
            "fear_of_judgment": 1,
            "technical_explanation_comfort": 5
        },
        "sample_text": "Hello everyone. Over the past three years, I have architected and scaled machine learning products serving over 50,000 active users. My strength lies in bridging deep technical engineering with clear, empathetic stakeholder communication."
    }
]

@router.get("/profiles")
def get_demo_profiles():
    """
    Returns pre-configured candidate profiles for quick demonstration.
    """
    return SAMPLE_PROFILES

@router.post("/seed")
def seed_demo_journey(db: Session = Depends(get_db)):
    """
    Clears existing records and seeds a 4-step progressive confidence trajectory:
    Assessment 1 (54) -> Assessment 2 (61) -> Assessment 3 (68) -> Assessment 4 (74)
    Along with completed exercises demonstrating +20pt progress.
    """
    # Clean old records
    db.query(CompletedExercise).delete()
    db.query(Assessment).delete()
    db.commit()

    now = datetime.utcnow()

    # Step 1: Initial Baseline Assessment (54 - Low)
    a1 = Assessment(
        created_at=now - timedelta(days=14),
        user_name="Jordan Reed",
        target_role="Software Intern Candidate",
        confidence_score=54.2,
        confidence_category="Low",
        sub_scores_json=json.dumps({
            "speaking": 52,
            "communication": 58,
            "clarity": 61,
            "response_confidence": 46,
            "fluency": 48
        }),
        weakness_primary="Speaking Fluency & Flow",
        weakness_reason="Frequent pauses and 8 filler words detected during speech sample.",
        weakness_tip="Practice short 30-second speaking sprints without stopping or restarting.",
        likert_inputs_json=json.dumps({"public_speaking_comfort": 2, "interview_confidence": 2, "hesitation_frequency": 4, "nervousness_level": 4}),
        speech_metrics_json=json.dumps({"words_per_minute": 112, "pause_frequency": 14.2, "speaking_duration": 48}),
        text_metrics_json=json.dumps({"filler_word_count": 8, "clarity_score": 61.0, "sentiment_score": 0.15}),
        explainability_json=json.dumps({
            "positive_factors": [{"factor": "Steady Tone", "impact": "Positive", "description": "Good baseline vocal pitch."}],
            "negative_factors": [{"factor": "Frequent Filler Words", "impact": "Needs Work", "description": "8 filler words detected."}]
        }),
        audio_present=True,
        response_text="Um, hi. I'm Jordan. I guess I'm, like, trying to get better at interviews."
    )
    db.add(a1)

    # Completed Exercise 1
    e1 = CompletedExercise(
        exercise_key="no_pause_challenge",
        exercise_title="30-Second No-Pause Challenge",
        completed_at=now - timedelta(days=11),
        duration_spent_seconds=30,
        score_boost=3.0,
        reflection_notes="Felt much more aware of 'um' fillers after completing 3 repetitions!"
    )
    db.add(e1)

    # Step 2: Assessment 2 (61 - Moderate)
    a2 = Assessment(
        created_at=now - timedelta(days=9),
        user_name="Jordan Reed",
        target_role="Software Intern Candidate",
        confidence_score=61.5,
        confidence_category="Moderate",
        sub_scores_json=json.dumps({
            "speaking": 60,
            "communication": 64,
            "clarity": 67,
            "response_confidence": 55,
            "fluency": 58
        }),
        weakness_primary="Delivery Pace & Pacing Consistency",
        weakness_reason="Speaking pace improved to 124 WPM, approaching conversational range.",
        weakness_tip="Use a metronome to calibrate steady breathing and cadence.",
        likert_inputs_json=json.dumps({"public_speaking_comfort": 3, "interview_confidence": 3, "hesitation_frequency": 3, "nervousness_level": 3}),
        speech_metrics_json=json.dumps({"words_per_minute": 124, "pause_frequency": 9.5, "speaking_duration": 45}),
        text_metrics_json=json.dumps({"filler_word_count": 5, "clarity_score": 67.0, "sentiment_score": 0.28}),
        explainability_json=json.dumps({
            "positive_factors": [{"factor": "Reduced Fillers", "impact": "Positive", "description": "Filler words dropped to 5."}],
            "negative_factors": [{"factor": "Pacing Variation", "impact": "Needs Work", "description": "Slight slowdown near complex technical terms."}]
        }),
        audio_present=True,
        response_text="Hello, I am Jordan. I have worked on Python backend development and improved my project workflow."
    )
    db.add(a2)

    # Completed Exercise 2
    e2 = CompletedExercise(
        exercise_key="timed_speech_60s",
        exercise_title="60-Second Conversational Pacing Sprint",
        completed_at=now - timedelta(days=6),
        duration_spent_seconds=60,
        score_boost=3.5,
        reflection_notes="Pacing felt natural and hit 140 words in 60s without rushing."
    )
    db.add(e2)

    # Step 3: Assessment 3 (68 - Moderate)
    a3 = Assessment(
        created_at=now - timedelta(days=4),
        user_name="Jordan Reed",
        target_role="Software Intern Candidate",
        confidence_score=68.4,
        confidence_category="Moderate",
        sub_scores_json=json.dumps({
            "speaking": 68,
            "communication": 72,
            "clarity": 73,
            "response_confidence": 64,
            "fluency": 66
        }),
        weakness_primary="Spontaneous Response & Poise",
        weakness_reason="Opportunity to strengthen impromptu answers for unexpected questions.",
        weakness_tip="Apply the PREP framework: Point, Reason, Example, Point.",
        likert_inputs_json=json.dumps({"public_speaking_comfort": 3, "interview_confidence": 4, "hesitation_frequency": 2, "nervousness_level": 2}),
        speech_metrics_json=json.dumps({"words_per_minute": 136, "pause_frequency": 6.8, "speaking_duration": 46}),
        text_metrics_json=json.dumps({"filler_word_count": 3, "clarity_score": 73.0, "sentiment_score": 0.38}),
        explainability_json=json.dumps({
            "positive_factors": [{"factor": "Strong Conversational Tempo", "impact": "Positive", "description": "136 WPM conversational speed."}],
            "negative_factors": [{"factor": "Minor Impromptu Hesitation", "impact": "Needs Work", "description": "Slight hesitation on surprise prompts."}]
        }),
        audio_present=True,
        response_text="Hi, I am Jordan. I am proud of leading our university hackathon team where we created an automated analytics pipeline."
    )
    db.add(a3)

    # Completed Exercise 3
    e3 = CompletedExercise(
        exercise_key="mock_interview_intro",
        exercise_title="Mock Interview: 'Tell Me About Yourself'",
        completed_at=now - timedelta(days=2),
        duration_spent_seconds=60,
        score_boost=3.0,
        reflection_notes="Structured my answer using Present-Past-Future. Felt significantly more confident!"
    )
    db.add(e3)

    # Step 4: Assessment 4 (74.0 - Moderately High Confidence)
    a4 = Assessment(
        created_at=now - timedelta(hours=3),
        user_name="Jordan Reed",
        target_role="Software Intern Candidate",
        confidence_score=74.0,
        confidence_category="Moderate",
        sub_scores_json=json.dumps({
            "speaking": 76,
            "communication": 81,
            "clarity": 78,
            "response_confidence": 72,
            "fluency": 74
        }),
        weakness_primary="Speaking Fluency & Flow",
        weakness_reason="Your responses contain minor pauses and filler words. Practicing short, timed responses can help improve fluency.",
        weakness_tip="Use the 30-Second No-Pause Challenge to lock in frictionless delivery.",
        likert_inputs_json=json.dumps({"public_speaking_comfort": 4, "interview_confidence": 4, "hesitation_frequency": 2, "nervousness_level": 2}),
        speech_metrics_json=json.dumps({"words_per_minute": 142, "pause_frequency": 5.1, "speaking_duration": 48}),
        text_metrics_json=json.dumps({"filler_word_count": 2, "clarity_score": 78.0, "sentiment_score": 0.44}),
        explainability_json=json.dumps({
            "positive_factors": [
                {"factor": "Strong Communication", "impact": "Positive", "description": "Clear assertive articulation in self-introduction."},
                {"factor": "Good Response Length", "impact": "Positive", "description": "Well-balanced 48-second response."},
                {"factor": "Positive Language", "impact": "Positive", "description": "Enthusiastic tone and positive action verbs."}
            ],
            "negative_factors": [
                {"factor": "Minor Pauses", "impact": "Needs Work", "description": "Short 1-second transition pauses between points."},
                {"factor": "Occasional Fillers", "impact": "Needs Work", "description": "2 filler words ('like', 'you know') detected."}
            ]
        }),
        audio_present=True,
        response_text="Hello everyone, my name is Jordan. I am a Computer Science senior passionate about AI and distributed systems. One thing I am proud of is designing an open-source collaboration tool used by over 500 fellow students."
    )
    db.add(a4)

    db.commit()

    return {
        "success": True,
        "message": "Demo learning journey successfully seeded! (Assessments: 54 -> 61 -> 68 -> 74, with 3 completed exercises)",
        "total_improvement": "+19.8 points (+36.5% growth)"
    }
