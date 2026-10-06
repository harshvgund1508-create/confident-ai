"""
ConfidentAI Dataset Generator
Generates a realistic synthetic educational dataset for communication and confidence assessment.
Dataset: 2,500 records with realistic multivariate correlations, non-linear interactions, and natural noise.
Clearly labeled: "Synthetic educational dataset created for prototype development."
"""

import os
import numpy as np
import pandas as pd

def generate_confidence_dataset(num_samples: int = 2500, random_state: int = 42) -> pd.DataFrame:
    np.random.seed(random_state)

    # Underlying latent trait: true_latent_confidence ~ Normal(0, 1)
    # This creates natural correlations across psychological and behavioral features.
    latent_trait = np.random.normal(loc=0.0, scale=1.0, size=num_samples)

    # 1. Likert Self-Assessment Features (1-5 scale)
    # Positive items: mean increases with latent trait
    def to_likert(vals, low=1, high=5):
        clipped = np.clip(np.round(vals), low, high)
        return clipped.astype(int)

    # Positive dimensions
    pub_speak = to_likert(3.0 + 1.1 * latent_trait + np.random.normal(0, 0.65, num_samples))
    interview = to_likert(2.9 + 1.05 * latent_trait + np.random.normal(0, 0.68, num_samples))
    opinion_expr = to_likert(3.2 + 0.95 * latent_trait + np.random.normal(0, 0.60, num_samples))
    unexp_quest = to_likert(2.8 + 1.15 * latent_trait + np.random.normal(0, 0.70, num_samples))
    tech_explain = to_likert(3.1 + 0.90 * latent_trait + np.random.normal(0, 0.75, num_samples))

    # Negative dimensions (inversely related to confidence)
    hesitation_likert = to_likert(3.2 - 1.1 * latent_trait + np.random.normal(0, 0.65, num_samples))
    nervousness = to_likert(3.3 - 1.2 * latent_trait + np.random.normal(0, 0.62, num_samples))
    fear_judgment = to_likert(3.1 - 1.05 * latent_trait + np.random.normal(0, 0.70, num_samples))

    # 2. Behavioral Speech & Audio Features
    # Speaking duration (15 to 75 seconds)
    speaking_duration = np.clip(
        42.0 + 7.5 * latent_trait + np.random.normal(0, 8.0, num_samples),
        15.0, 75.0
    ).round(1)

    # Words per minute: optimal is ~135-155 WPM
    # Low confidence -> slower or very hesitant (~85-115) or occasional frantic stutter (~185)
    # High confidence -> smooth, articulate (~135-155)
    base_wpm = 135.0 + 18.0 * latent_trait + np.random.normal(0, 14.0, num_samples)
    words_per_minute = np.clip(base_wpm, 75.0, 210.0).round(1)

    # Response word count calculated from duration and WPM
    response_length_words = np.clip(
        np.round((speaking_duration / 60.0) * words_per_minute),
        18, 220
    ).astype(int)

    # Pause frequency (pauses per minute: 2 to 24)
    pause_frequency = np.clip(
        11.5 - 4.5 * latent_trait + np.random.normal(0, 2.5, num_samples),
        1.5, 24.0
    ).round(1)

    # Filler words count (0 to 18 words)
    filler_word_count = np.clip(
        np.round(6.0 - 2.8 * latent_trait + np.random.normal(0, 1.8, num_samples)),
        0, 18
    ).astype(int)

    # Speech consistency (0.35 to 0.98): pitch/energy stability
    speech_consistency = np.clip(
        0.70 + 0.12 * latent_trait + np.random.normal(0, 0.08, num_samples),
        0.30, 0.98
    ).round(3)

    # 3. Text / NLP Metrics
    # Sentiment score (-0.4 to 0.9)
    sentiment_score = np.clip(
        0.35 + 0.22 * latent_trait + np.random.normal(0, 0.18, num_samples),
        -0.45, 0.95
    ).round(3)

    # Clarity score (30 to 98)
    clarity_score = np.clip(
        68.0 + 12.0 * latent_trait + np.random.normal(0, 7.5, num_samples),
        25.0, 99.0
    ).round(1)

    # 4. Target Variable Calculation (Ground Truth with Domain Formula + Natural Noise)
    # Domain Weights
    # Self-efficacy component (0-100 scale):
    pos_likert_avg = (pub_speak + interview + opinion_expr + unexp_quest + tech_explain) / 5.0  # 1-5
    neg_likert_avg = (hesitation_likert + nervousness + fear_judgment) / 3.0  # 1-5
    likert_score = ((pos_likert_avg - 1) / 4.0 * 60) + ((5 - neg_likert_avg) / 4.0 * 40)  # 0-100

    # Behavioral Fluency component (0-100 scale):
    # WPM optimality penalty: peak at 145 wpm
    wpm_score = 100.0 - np.minimum(np.abs(words_per_minute - 145.0) * 1.3, 50.0)
    pause_score = np.clip(100.0 - (pause_frequency - 2.0) * 4.5, 20.0, 100.0)
    filler_score = np.clip(100.0 - (filler_word_count * 5.5), 15.0, 100.0)
    fluency_score = (wpm_score * 0.35) + (pause_score * 0.35) + (filler_score * 0.30)

    # Communication & NLP component (0-100 scale):
    nlp_score = (clarity_score * 0.60) + ((sentiment_score + 0.5) / 1.5 * 100.0 * 0.20) + (speech_consistency * 100.0 * 0.20)

    # Composite Ground Truth Target:
    raw_confidence = (
        0.45 * likert_score +
        0.30 * fluency_score +
        0.25 * nlp_score +
        np.random.normal(0, 2.8, num_samples) # Natural human variance
    )
    confidence_score = np.clip(np.round(raw_confidence, 1), 12.0, 99.0)

    # Categorical target
    # Low: < 55, Moderate: 55 - 75, High: > 75
    categories = []
    for score in confidence_score:
        if score < 55.0:
            categories.append("Low")
        elif score <= 75.0:
            categories.append("Moderate")
        else:
            categories.append("High")

    df = pd.DataFrame({
        "public_speaking_comfort": pub_speak,
        "interview_confidence": interview,
        "hesitation_frequency": hesitation_likert,
        "opinion_expression_comfort": opinion_expr,
        "nervousness_level": nervousness,
        "unexpected_questions_comfort": unexp_quest,
        "fear_of_judgment": fear_judgment,
        "technical_explanation_comfort": tech_explain,
        "speaking_duration": speaking_duration,
        "words_per_minute": words_per_minute,
        "response_length_words": response_length_words,
        "pause_frequency": pause_frequency,
        "filler_word_count": filler_word_count,
        "speech_consistency": speech_consistency,
        "sentiment_score": sentiment_score,
        "clarity_score": clarity_score,
        "confidence_score": confidence_score,
        "confidence_category": categories
    })

    return df

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(current_dir, "..", ".."))
    data_dir = os.path.join(project_root, "data")
    os.makedirs(data_dir, exist_ok=True)

    df = generate_confidence_dataset(num_samples=2500, random_state=42)
    csv_path = os.path.join(data_dir, "confidence_dataset.csv")
    df.to_csv(csv_path, index=False)

    print(f"Generated dataset with {len(df)} rows and {len(df.columns)} columns.")
    print(f"Saved to: {csv_path}")
    print("\nDataset Summary:")
    print(df.describe().round(2))
    print("\nClass Distribution:")
    print(df["confidence_category"].value_counts(normalize=True).round(3))
