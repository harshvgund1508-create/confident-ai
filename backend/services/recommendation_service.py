"""
Recommendation Service for ConfidentAI
Selects personalized exercises based on detected communication weaknesses and sub-scores.
"""

from typing import Dict, Any, List

EXERCISE_CATALOG = [
    {
        "key": "no_pause_challenge",
        "title": "30-Second No-Pause Challenge",
        "target_skill": "Fluency & Hesitation Reduction",
        "category": "Fluency",
        "duration_seconds": 30,
        "difficulty": "Beginner",
        "prompt_text": "Describe your favorite hobby or a recent project without stopping, pausing for more than 1 second, or restarting.",
        "instructions": "1. Tap Start Timer.\n2. Start speaking immediately on the topic.\n3. If you get stuck, use filler-free bridge words like 'Additionally...' or 'Another aspect is...' rather than stopping.\n4. Complete the full 30 seconds smoothly.",
        "coaching_benefit": "Trains vocal momentum and eliminates micro-freezes during spontaneous answers."
    },
    {
        "key": "timed_speech_60s",
        "title": "60-Second Conversational Pacing Sprint",
        "target_skill": "Speaking Tempo & Cadence",
        "category": "Pacing",
        "duration_seconds": 60,
        "difficulty": "Beginner",
        "prompt_text": "Explain why you chose your academic field or career path in exactly 60 seconds at a balanced 140 WPM pace.",
        "instructions": "1. Aim for approximately 130–150 words total.\n2. Keep your breaths steady at the end of full sentences.\n3. Avoid speeding up near the end.",
        "coaching_benefit": "Calibrates internal tempo to prevent hurried speech or dragging pauses."
    },
    {
        "key": "mock_interview_intro",
        "title": "Mock Interview: 'Tell Me About Yourself'",
        "target_skill": "Interview Confidence & Structure",
        "category": "Interview",
        "duration_seconds": 60,
        "difficulty": "Intermediate",
        "prompt_text": "Deliver a crisp, professional 60-second elevator pitch answering: 'Tell me about yourself.'",
        "instructions": "1. Use the Present-Past-Future structure (Where you are now, key accomplishments, where you want to go).\n2. Highlight 1 specific project or skill.\n3. End with clear alignment for your target role.",
        "coaching_benefit": "Creates a battle-tested opening that sets a confident tone in any interview."
    },
    {
        "key": "one_minute_pitch",
        "title": "One-Minute Presentation Drill",
        "target_skill": "Public Speaking & Engagement",
        "category": "Public Speaking",
        "duration_seconds": 60,
        "difficulty": "Intermediate",
        "prompt_text": "Present on the topic: 'The most important skill students should learn in college.'",
        "instructions": "1. Hook the listener in the first 10 seconds.\n2. Provide 2 supporting arguments.\n3. Conclude with a memorable closing sentence.",
        "coaching_benefit": "Builds stage presence, projection, and structured thought delivery under time limits."
    },
    {
        "key": "explain_like_im_10",
        "title": "Explain Like I'm 10 (ELI10)",
        "target_skill": "Clarity & Simplicity",
        "category": "Clarity",
        "duration_seconds": 45,
        "difficulty": "Intermediate",
        "prompt_text": "Explain how the Internet, Cloud Computing, or Machine Learning works as if you are explaining it to a 10-year-old.",
        "instructions": "1. Avoid heavy technical jargon.\n2. Use a relatable real-world analogy (e.g., postal letters, library shelves).\n3. Keep sentences short and direct.",
        "coaching_benefit": "Dramatically improves linguistic clarity and demonstrates true conceptual mastery."
    },
    {
        "key": "prep_impromptu_framework",
        "title": "The PREP Impromptu Drill",
        "target_skill": "Unexpected Questions & Poise",
        "category": "Poise",
        "duration_seconds": 45,
        "difficulty": "Advanced",
        "prompt_text": "Answer spontaneously: 'Should remote work completely replace office work?' using Point-Reason-Example-Point.",
        "instructions": "1. State your Point directly (5s).\n2. Give your Reason (15s).\n3. Provide a concrete Example (15s).\n4. Restate your Point (10s).",
        "coaching_benefit": "Gives you a mental blueprint to answer any surprise question without freezing."
    },
    {
        "key": "vocal_projection_drill",
        "title": "Assertive Expression & Vocal Projection",
        "target_skill": "Assertiveness & Voice Consistency",
        "category": "Communication",
        "duration_seconds": 30,
        "difficulty": "Beginner",
        "prompt_text": "Speak the following statement with firm projection and open posture: 'I strongly recommend we adopt this solution because it saves 30% time.'",
        "instructions": "1. Stand or sit upright.\n2. Inhale deeply from the diaphragm.\n3. Speak clearly and sustain energy through the final word.",
        "coaching_benefit": "Strengthens vocal resonance and eliminates upward vocal fry inflection."
    }
]

def get_recommendations_for_weakness(weakness_key: str, sub_scores: Dict[str, int]) -> Dict[str, Any]:
    """
    Selects prioritized exercises matched to the user's primary and secondary weakness.
    """
    mapping = {
        "fluency": ("no_pause_challenge", "timed_speech_60s"),
        "speaking": ("timed_speech_60s", "vocal_projection_drill"),
        "response_confidence": ("prep_impromptu_framework", "mock_interview_intro"),
        "communication": ("vocal_projection_drill", "one_minute_pitch"),
        "clarity": ("explain_like_im_10", "prep_impromptu_framework")
    }

    primary_key, secondary_key = mapping.get(weakness_key, ("no_pause_challenge", "mock_interview_intro"))

    primary_ex = next((ex for ex in EXERCISE_CATALOG if ex["key"] == primary_key), EXERCISE_CATALOG[0])
    secondary_ex = next((ex for ex in EXERCISE_CATALOG if ex["key"] == secondary_key), EXERCISE_CATALOG[1])

    return {
        "primary_recommended_exercise": primary_ex,
        "secondary_recommended_exercise": secondary_ex,
        "all_exercises": EXERCISE_CATALOG
    }
