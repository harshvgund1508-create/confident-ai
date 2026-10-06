# ConfidentAI Dataset Documentation

## 1. Overview & Disclaimer

> **Label:** Synthetic educational dataset created for prototype development.

This dataset contains **2,500 synthetic records** modeling interpersonal communication, self-assessed confidence, speech delivery metrics, and linguistic/NLP features. It was programmatically generated using a latent-variable psychometric model with non-linear interaction terms, behavioral pacing penalties, and natural human variance.

This dataset is designed specifically for training and evaluating machine learning models in academic, educational, and prototype development contexts. It is **not** a clinical diagnostic tool or medical dataset.

---

## 2. Dataset Fields & Schema

The dataset consists of **18 columns**: 16 predictive features, 1 continuous regression target, and 1 categorical classification target.

| Feature Name | Type | Range / Scale | Description |
| :--- | :--- | :--- | :--- |
| `public_speaking_comfort` | Integer | 1 – 5 | Likert: Comfort level when addressing groups or audiences. |
| `interview_confidence` | Integer | 1 – 5 | Likert: Self-assurance during formal interviews or Q&A. |
| `hesitation_frequency` | Integer | 1 – 5 | Likert: Self-perceived frequency of hesitations while speaking. |
| `opinion_expression_comfort` | Integer | 1 – 5 | Likert: Ease in sharing viewpoints openly in discussions. |
| `nervousness_level` | Integer | 1 – 5 | Likert: Felt physiological/situational anxiety in communication. |
| `unexpected_questions_comfort` | Integer | 1 – 5 | Likert: Adaptability when asked impromptu/unscripted questions. |
| `fear_of_judgment` | Integer | 1 – 5 | Likert: Sensitivity to peer or interviewer evaluation. |
| `technical_explanation_comfort`| Integer | 1 – 5 | Likert: Ability to articulate complex or technical ideas simply. |
| `speaking_duration` | Float | 15.0 – 75.0 (s) | Total duration of the recorded response in seconds. |
| `words_per_minute` | Float | 75.0 – 210.0 | Pacing metric: Calculated rate of speech (optimal ~135–155 WPM). |
| `response_length_words` | Integer | 18 – 220 | Total word count delivered in the speech/text sample. |
| `pause_frequency` | Float | 1.5 – 24.0 (min⁻¹)| Silent pauses (>0.5s) per minute of active speaking. |
| `filler_word_count` | Integer | 0 – 18 | Total occurrence of filler words (e.g., "um", "uh", "like", "actually"). |
| `speech_consistency` | Float | 0.30 – 0.98 | Acoustic stability metric derived from pitch variance and energy envelope. |
| `sentiment_score` | Float | -0.45 – +0.95 | Polarity score extracted via NLP sentiment analysis. |
| `clarity_score` | Float | 25.0 – 99.0 | Linguistic clarity score based on vocabulary diversity and syntax flow. |
| **`confidence_score`** *(Target)* | Float | 12.0 – 99.0 | Continuous composite communication & confidence index (0–100). |
| **`confidence_category`** *(Target)* | String | Low / Moderate / High | Binned class: Low (<55), Moderate (55–75), High (>75). |

---

## 3. Underlying Data Generation Dynamics

The dataset incorporates realistic human behavior patterns:
1. **Multivariate Correlation**: Self-confidence correlates positively with public speaking comfort, interview assurance, and clarity; it correlates negatively with nervousness, hesitation, and fear of judgment.
2. **Non-Linear Fluency Curves**: Speaking pace (WPM) follows an inverted-U curve where moderate conversational pace (~135-155 WPM) yields peak fluency, whereas both sluggish (<100 WPM) and frantic (>185 WPM) paces incur penalties.
3. **Linguistic Complexity & Pause Ratios**: Elevated filler words and high pause frequencies lower the fluency and communication sub-indices.
4. **Natural Variance**: Gaussian noise ($\sigma = 2.8$) is injected across all composite ground truth scores to emulate real-world human heterogeneity.

---

## 4. Ethical Safeguards & Usage

- **Scope**: Designed solely for educational demonstration, confidence coaching, and presentation skill development.
- **Privacy**: No Personally Identifiable Information (PII) or biometric voiceprints are retained.
