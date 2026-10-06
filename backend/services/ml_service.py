"""
ML Service for ConfidentAI
Singleton loader for the trained ML predictor pipeline.
"""

from ml.predict import ConfidencePredictor

_predictor_instance = None

def get_predictor() -> ConfidencePredictor:
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = ConfidencePredictor()
    return _predictor_instance
