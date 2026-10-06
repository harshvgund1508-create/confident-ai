"""
API & ML Integration Tests for ConfidentAI
"""

import os
import json
from fastapi.testclient import TestClient
from backend.main import app
from ml.predict import ConfidencePredictor

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "ConfidentAI" in data["app_name"]

def test_ml_predictor_directly():
    predictor = ConfidencePredictor()
    sample_input = {
        "public_speaking_comfort": 4,
        "interview_confidence": 4,
        "hesitation_frequency": 2,
        "opinion_expression_comfort": 4,
        "nervousness_level": 2,
        "unexpected_questions_comfort": 4,
        "fear_of_judgment": 2,
        "technical_explanation_comfort": 4,
        "speaking_duration": 45.0,
        "words_per_minute": 140.0,
        "response_length_words": 105,
        "pause_frequency": 5.0,
        "filler_word_count": 2,
        "speech_consistency": 0.85,
        "sentiment_score": 0.40,
        "clarity_score": 82.0
    }
    result = predictor.predict(sample_input)
    assert "confidence_score" in result
    assert 10.0 <= result["confidence_score"] <= 100.0
    assert result["category"] in ["Low", "Moderate", "High"]
    assert "sub_scores" in result
    assert "speaking" in result["sub_scores"]
    assert "weakness_analysis" in result
    assert "explainability" in result

def test_analyze_text_endpoint():
    payload = {
        "text": "Hello, um, I actually think that, like, building machine learning models is very exciting and rewarding.",
        "speaking_duration": 30.0
    }
    response = client.post("/api/analyze-text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["word_count"] > 10
    assert data["filler_word_count"] >= 2
    assert "clarity_score" in data
    assert "sentiment_score" in data

def test_assessment_flow_endpoint():
    form_data = {
        "public_speaking_comfort": 3,
        "interview_confidence": 3,
        "hesitation_frequency": 3,
        "opinion_expression_comfort": 3,
        "nervousness_level": 3,
        "unexpected_questions_comfort": 3,
        "fear_of_judgment": 3,
        "technical_explanation_comfort": 3,
        "user_name": "Test Student",
        "target_role": "Software Engineering Intern",
        "response_text": "I am passionate about software engineering and I built a real-time web application.",
        "speaking_duration_sec": 40.0
    }
    response = client.post("/api/assessment", data=form_data)
    assert response.status_code == 200
    data = response.json()
    assert "confidence_score" in data
    assert "category_probabilities" in data
    assert "sub_scores" in data
    assert "recommendations" in data
    assert data["user_name"] == "Test Student"

def test_progress_and_history_endpoints():
    response = client.get("/api/progress")
    assert response.status_code == 200
    data = response.json()
    assert "assessments_count" in data

    hist_resp = client.get("/api/history")
    assert hist_resp.status_code == 200
    hist = hist_resp.json()
    assert isinstance(hist, list)

def test_model_metrics_endpoint():
    response = client.get("/api/model-metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "regression_models" in data["metrics"]
    assert "classification_models" in data["metrics"]
    assert "feature_importance_regression" in data["metrics"]
    assert "confusion_matrix" in data["metrics"]

def test_demo_seed_endpoint():
    response = client.post("/api/demo/seed")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True

    # Check that progress is now seeded
    progress_resp = client.get("/api/progress")
    progress_data = progress_resp.json()
    assert progress_data["has_data"] is True
    assert progress_data["assessments_count"] >= 4
    assert progress_data["improvement_points"] > 0

if __name__ == "__main__":
    print("Running ConfidentAI API & ML Pipeline Test Suite...")
    test_root_endpoint()
    print("  [OK] Root API health check passed")
    test_ml_predictor_directly()
    print("  [OK] Direct ML Predictor & Explainability test passed")
    test_analyze_text_endpoint()
    print("  [OK] NLP text analysis endpoint test passed")
    test_assessment_flow_endpoint()
    print("  [OK] Assessment creation, inference & persistence passed")
    test_progress_and_history_endpoints()
    print("  [OK] Progress metrics and history retrieval passed")
    test_model_metrics_endpoint()
    print("  [OK] Academic ML model metrics & confusion matrix passed")
    test_demo_seed_endpoint()
    print("  [OK] Demo journey seeding & progression tracking passed")
    print("ALL TESTS PASSED WITH 100% SUCCESS!")

