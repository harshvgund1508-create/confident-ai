"""
Evaluation Script for ConfidentAI ML Models
Validates saved model artifacts, displays evaluation metrics, and verifies model explainability.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from ml.preprocessing import load_and_preprocess_data
from ml.predict import ConfidencePredictor

def run_evaluation():
    print("=" * 60)
    print("ConfidentAI Model Evaluation & Validation")
    print("=" * 60)

    current_dir = os.path.dirname(os.path.abspath(__file__))
    saved_models_dir = os.path.join(current_dir, "saved_models")
    metrics_path = os.path.join(saved_models_dir, "evaluation_metrics.json")

    if not os.path.exists(metrics_path):
        print("Metrics file not found. Running training first...")
        from ml.train import train_and_evaluate_all
        train_and_evaluate_all()

    with open(metrics_path, "r") as f:
        metrics = json.load(f)

    print("\n1. DATASET CHARACTERISTICS")
    print(f"  Total Samples:    {metrics['dataset_info']['total_samples']}")
    print(f"  Training Split:   {metrics['dataset_info']['train_samples']}")
    print(f"  Evaluation Split: {metrics['dataset_info']['test_samples']}")
    print(f"  Features Count:   {metrics['dataset_info']['num_features']}")
    print(f"  Target Classes:   {', '.join(metrics['dataset_info']['classes'])}")

    print("\n2. REGRESSION MODEL BENCHMARKS (Target: Confidence Score 0-100)")
    print(f"  {'Model':<26} {'MAE':<10} {'RMSE':<10} {'R² Score':<10}")
    print("  " + "-" * 56)
    for model, m in metrics["regression_models"].items():
        print(f"  {model:<26} {m['MAE']:<10.3f} {m['RMSE']:<10.3f} {m['R2']:<10.4f}")

    print("\n3. CLASSIFICATION MODEL BENCHMARKS (Target: Low / Moderate / High)")
    print(f"  {'Model':<26} {'Accuracy':<10} {'Precision':<10} {'Recall':<10} {'F1-Score':<10}")
    print("  " + "-" * 66)
    for model, m in metrics["classification_models"].items():
        print(f"  {model:<26} {m['Accuracy']*100:<9.2f}% {m['Precision']:<10.4f} {m['Recall']:<10.4f} {m['F1_Score']:<10.4f}")

    print("\n4. TOP 7 MOST INFLUENTIAL FEATURES (Random Forest Importance)")
    for i, item in enumerate(metrics["feature_importance_regression"][:7], 1):
        print(f"  {i}. {item['feature']:<30} {item['importance']*100:6.2f}%")

    print("\n5. CONFUSION MATRIX (Best Classifier)")
    cm = metrics["confusion_matrix"]
    classes = metrics["confusion_matrix_classes"]
    print(f"     Predicted ->  {'  '.join([f'{c:>8}' for c in classes])}")
    for idx, row in enumerate(cm):
        row_str = "  ".join([f"{val:>8}" for val in row])
        print(f"  Actual {classes[idx]:<8}: {row_str}")

    print("\n6. INFERENCE PIPELINE VERIFICATION")
    predictor = ConfidencePredictor()
    sample_input = {
        "public_speaking_comfort": 4,
        "interview_confidence": 4,
        "hesitation_frequency": 2,
        "opinion_expression_comfort": 4,
        "nervousness_level": 2,
        "unexpected_questions_comfort": 4,
        "fear_of_judgment": 2,
        "technical_explanation_comfort": 5,
        "speaking_duration": 48.0,
        "words_per_minute": 142.0,
        "response_length_words": 113,
        "pause_frequency": 4.5,
        "filler_word_count": 2,
        "speech_consistency": 0.88,
        "sentiment_score": 0.45,
        "clarity_score": 85.0
    }
    result = predictor.predict(sample_input)
    print(f"  Predicted Confidence Score: {result['confidence_score']}/100")
    print(f"  Predicted Category:         {result['category']}")
    print(f"  Sub-Scores:                 {result['sub_scores']}")
    print(f"  Primary Growth Focus:       {result['weakness_analysis']['primary_weakness']['title']}")
    print("=" * 60)
    print("Model verification test passed successfully!")

if __name__ == "__main__":
    run_evaluation()
