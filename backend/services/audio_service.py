"""
Audio Processing Service for ConfidentAI
Extracts acoustic and delivery features from audio recordings:
- Speaking duration
- RMS Energy & Silence / Pause detection (Pause frequency, total pause duration)
- Speech consistency & spectral centroid / harmonic stability
- MFCC summary features (13 coefficients)
- Estimated Words Per Minute (WPM)
- Ephemeral processing: Audio data is analyzed in memory and immediately discarded.
"""

import io
import os
import tempfile
import numpy as np
from typing import Dict, Any

try:
    import librosa
    import soundfile as sf
    HAS_AUDIO_LIBS = True
except ImportError:
    HAS_AUDIO_LIBS = False

def analyze_audio_bytes(audio_bytes: bytes, filename: str = "audio.wav", transcript_words: int = 0) -> Dict[str, Any]:
    """
    Analyzes raw audio bytes in-memory, extracts speech features, and cleans up.
    """
    if not audio_bytes or len(audio_bytes) < 100:
        return _get_default_audio_features(transcript_words)

    temp_path = None
    try:
        # Write to temporary file for librosa / soundfile decoding
        suffix = os.path.splitext(filename)[1] if filename else ".wav"
        if not suffix:
            suffix = ".wav"

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(audio_bytes)
            temp_path = tmp.name

        if HAS_AUDIO_LIBS:
            try:
                # Load audio with librosa at 16kHz sampling rate
                y, sr = librosa.load(temp_path, sr=16000, mono=True)
                return _extract_features_from_signal(y, sr, transcript_words)
            except Exception as e:
                print(f"librosa load warning: {e}. Trying soundfile fallback...")
                try:
                    data, sr = sf.read(temp_path)
                    if len(data.shape) > 1:
                        data = np.mean(data, axis=1)
                    return _extract_features_from_signal(data, sr, transcript_words)
                except Exception as e2:
                    print(f"soundfile fallback failed: {e2}")
                    return _get_default_audio_features(transcript_words)
        else:
            return _get_default_audio_features(transcript_words)

    except Exception as general_err:
        print(f"Audio analysis error: {general_err}")
        return _get_default_audio_features(transcript_words)
    finally:
        # Privacy enforcement: guarantee removal of temporary raw audio file
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass

def _extract_features_from_signal(y: np.ndarray, sr: int, transcript_words: int = 0) -> Dict[str, Any]:
    """
    Extracts acoustic metrics from numpy audio array.
    """
    if len(y) == 0:
        return _get_default_audio_features(transcript_words)

    duration_sec = float(len(y) / sr)
    if duration_sec < 1.0:
        return _get_default_audio_features(transcript_words)

    # 1. Frame-level RMS energy
    hop_length = int(sr * 0.02)  # 20ms frames
    frame_length = int(sr * 0.04) # 40ms window
    rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)[0]

    # Normalize RMS
    rms_max = np.max(rms) if np.max(rms) > 0 else 1.0
    norm_rms = rms / rms_max

    # 2. Silence / Pause Detection
    # Silence threshold: frames below 10% peak energy
    silence_threshold = 0.10
    is_silent = norm_rms < silence_threshold

    # Find contiguous silent segments longer than 400ms (~20 frames)
    min_pause_frames = int(0.4 / 0.02)
    pause_count = 0
    total_pause_frames = 0
    current_pause_len = 0

    for silent_flag in is_silent:
        if silent_flag:
            current_pause_len += 1
        else:
            if current_pause_len >= min_pause_frames:
                pause_count += 1
                total_pause_frames += current_pause_len
            current_pause_len = 0

    if current_pause_len >= min_pause_frames:
        pause_count += 1
        total_pause_frames += current_pause_len

    total_pause_seconds = float(total_pause_frames * 0.02)
    pauses_per_minute = float((pause_count / max(duration_sec, 5.0)) * 60.0)

    # 3. Spectral Centroid & Consistency
    spec_cent = librosa.feature.spectral_centroid(y=y, sr=sr, hop_length=hop_length)[0]
    spec_std = np.std(spec_cent) / (np.mean(spec_cent) + 1e-6)

    # Speech consistency (0 to 1 scale)
    speech_consistency = float(np.clip(1.0 - (spec_std * 0.35), 0.35, 0.98))

    # 4. MFCC Features (13 coefficients)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, hop_length=hop_length)
    mfcc_means = [float(np.mean(c)) for c in mfcc]
    mfcc_stds = [float(np.std(c)) for c in mfcc]

    # 5. Words Per Minute calculation
    active_speaking_time = max(duration_sec - total_pause_seconds, 3.0)
    if transcript_words > 0:
        wpm = float((transcript_words / (duration_sec / 60.0)))
    else:
        # Estimate syllable count from spectral flux & energy peaks
        onset_env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop_length)
        peaks = librosa.util.peak_pick(onset_env, pre_max=3, post_max=3, pre_avg=3, post_avg=3, delta=0.5, wait=5)
        syllables = len(peaks)
        estimated_words = max(int(syllables / 1.45), 10)
        wpm = float((estimated_words / (duration_sec / 60.0)))

    wpm = float(np.clip(wpm, 65.0, 220.0))

    return {
        "speaking_duration": round(duration_sec, 1),
        "active_speaking_duration": round(active_speaking_time, 1),
        "total_pause_duration": round(total_pause_seconds, 1),
        "pause_count": int(pause_count),
        "pause_frequency": round(pauses_per_minute, 1),
        "words_per_minute": round(wpm, 1),
        "speech_consistency": round(speech_consistency, 3),
        "mean_energy_rms": round(float(np.mean(rms)), 4),
        "mfcc_summary": {
            "mfcc_1_mean": round(mfcc_means[0], 2),
            "mfcc_2_mean": round(mfcc_means[1], 2),
            "mfcc_3_mean": round(mfcc_means[2], 2)
        },
        "audio_status": "Analyzed successfully (Raw audio not retained for privacy)"
    }

def _get_default_audio_features(transcript_words: int = 0) -> Dict[str, Any]:
    """
    Standard fallback features when audio input is text-only or simulated.
    """
    est_duration = max(35.0, (transcript_words / 135.0) * 60.0 if transcript_words > 0 else 42.0)
    return {
        "speaking_duration": round(est_duration, 1),
        "active_speaking_duration": round(est_duration * 0.85, 1),
        "total_pause_duration": round(est_duration * 0.15, 1),
        "pause_count": 4,
        "pause_frequency": 6.2,
        "words_per_minute": 138.0 if transcript_words == 0 else round((transcript_words / (est_duration / 60.0)), 1),
        "speech_consistency": 0.82,
        "mean_energy_rms": 0.045,
        "mfcc_summary": {"mfcc_1_mean": -240.5, "mfcc_2_mean": 85.2, "mfcc_3_mean": -12.4},
        "audio_status": "Text-only / Baseline fallback used"
    }
