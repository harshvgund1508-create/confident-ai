"""
NLP Service for ConfidentAI
Analyzes written responses or speech transcripts:
- Filler words and hesitation phrases detection
- Sentiment analysis (TextBlob / Lexicon)
- Vocabulary diversity & lexical richness
- Clarity index computation
- Safe, non-diagnostic communication indicators
"""

import re
from typing import Dict, Any, List
try:
    from textblob import TextBlob
    HAS_TEXTBLOB = True
except ImportError:
    HAS_TEXTBLOB = False

# Common filler words and hesitation phrases
FILLER_WORDS = [
    "um", "uh", "er", "ah", "like", "actually", "basically",
    "literally", "honestly", "really", "so", "well", "kinda", "sorta"
]

HESITATION_PHRASES = [
    "you know", "i mean", "i think", "i guess", "sort of", "kind of",
    "to be honest", "maybe like", "if that makes sense", "or something like that",
    "i'm not sure but", "i don't know"
]

POSITIVE_MARKERS = [
    "proud", "achieved", "learned", "succeeded", "confident", "enthusiastic",
    "excited", "passionate", "improved", "growth", "effective", "led", "solved",
    "accomplished", "happy", "valuable", "grateful", "opportunity", "built"
]

NEGATIVE_MARKERS = [
    "failed", "terrible", "awful", "cannot", "struggled", "scared", "fear",
    "anxious", "embarrassed", "worthless", "horrible", "impossible", "panicked"
]

def analyze_text_response(text: str, speaking_duration_sec: float = 45.0) -> Dict[str, Any]:
    """
    Performs comprehensive NLP analysis on user text response or transcribed speech.
    """
    cleaned_text = text.strip() if text else ""
    if not cleaned_text:
        # Default placeholder when no text is provided
        return {
            "word_count": 0,
            "character_count": 0,
            "sentence_count": 0,
            "vocabulary_diversity": 0.0,
            "filler_word_count": 0,
            "filler_words_detected": [],
            "hesitation_phrases_count": 0,
            "hesitation_phrases_detected": [],
            "sentiment_score": 0.20,
            "sentiment_label": "Neutral",
            "clarity_score": 65.0,
            "positive_indicators_count": 0,
            "negative_indicators_count": 0,
            "words_per_minute": 130.0,
            "communication_summary": "Communication indicators suggest standard baseline pacing."
        }

    # Tokenize words
    raw_tokens = re.findall(r"\b[A-Za-z0-9']+\b", cleaned_text.lower())
    total_words = len(raw_tokens)
    unique_words = len(set(raw_tokens))
    char_count = len(cleaned_text)

    # Sentences
    sentences = [s.strip() for s in re.split(r"[.!?]+", cleaned_text) if s.strip()]
    sentence_count = max(len(sentences), 1)

    # Vocabulary diversity (Type-Token Ratio adjusted for length)
    if total_words > 0:
        # Heap's Law root TTR: unique / sqrt(total) normalized
        vocab_diversity = round(min(unique_words / (total_words ** 0.55 * 1.5), 1.0), 3)
    else:
        vocab_diversity = 0.5

    # Filler words detection (whole words)
    detected_fillers = []
    filler_count = 0
    for token in raw_tokens:
        if token in FILLER_WORDS:
            filler_count += 1
            if token not in detected_fillers:
                detected_fillers.append(token)

    # Hesitation phrases detection
    detected_phrases = []
    phrase_count = 0
    text_lower = cleaned_text.lower()
    for phrase in HESITATION_PHRASES:
        occurrences = len(re.findall(r"\b" + re.escape(phrase) + r"\b", text_lower))
        if occurrences > 0:
            phrase_count += occurrences
            detected_phrases.append(f"{phrase} ({occurrences}x)")

    # Sentiment analysis
    sentiment_score = 0.25
    if HAS_TEXTBLOB and cleaned_text:
        try:
            blob = TextBlob(cleaned_text)
            sentiment_score = float(blob.sentiment.polarity)
        except Exception:
            sentiment_score = 0.25

    # Count positive / negative markers
    pos_count = sum(1 for t in raw_tokens if t in POSITIVE_MARKERS)
    neg_count = sum(1 for t in raw_tokens if t in NEGATIVE_MARKERS)

    # Adjust sentiment with markers if TextBlob unavailable or close to 0
    if not HAS_TEXTBLOB:
        net_markers = pos_count - neg_count
        sentiment_score = max(-0.8, min(0.8, net_markers * 0.15 + 0.2))

    sentiment_label = "Positive" if sentiment_score > 0.15 else ("Negative" if sentiment_score < -0.10 else "Neutral")

    # Clarity score (0-100)
    # Ideal avg sentence length: 12-20 words
    avg_sentence_len = total_words / sentence_count if sentence_count > 0 else 15
    sentence_penalty = abs(avg_sentence_len - 15) * 1.2

    # High filler ratio penalty
    filler_ratio = (filler_count + phrase_count) / max(total_words, 10)
    filler_penalty = min(filler_ratio * 150.0, 35.0)

    base_clarity = 85.0
    clarity_score = round(max(25.0, min(99.0, base_clarity + (vocab_diversity * 20.0) - sentence_penalty - filler_penalty)), 1)

    # Calculate WPM based on duration
    wpm = round(float((total_words / max(speaking_duration_sec, 10.0)) * 60.0), 1)

    # Communication summary (strictly non-diagnostic)
    if filler_count > 5:
        summary = "Communication indicators suggest noticeable filler word density, which can be streamlined with short speaking intervals."
    elif clarity_score >= 80:
        summary = "Communication indicators suggest strong syntactic structure, rich vocabulary diversity, and clear message flow."
    elif wpm < 110:
        summary = "Communication indicators suggest deliberate, measured pacing with opportunity to increase vocal dynamism."
    else:
        summary = "Communication indicators suggest steady conversational pacing and structured articulation."

    return {
        "word_count": total_words,
        "character_count": char_count,
        "sentence_count": sentence_count,
        "vocabulary_diversity": vocab_diversity,
        "filler_word_count": filler_count + phrase_count,
        "filler_words_detected": detected_fillers,
        "hesitation_phrases_count": phrase_count,
        "hesitation_phrases_detected": detected_phrases,
        "sentiment_score": round(sentiment_score, 3),
        "sentiment_label": sentiment_label,
        "clarity_score": clarity_score,
        "positive_indicators_count": pos_count,
        "negative_indicators_count": neg_count,
        "words_per_minute": wpm,
        "communication_summary": summary
    }
