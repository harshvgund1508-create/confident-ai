"""
Model Metrics & Academic Insights API Routes for ConfidentAI
Serves real evaluation metrics, model comparison benchmarks, confusion matrix, and feature importances.
"""

import os
import json
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api", tags=["Model Metrics & Explainability"])

@router.get("/model-metrics")
def get_ml_metrics():
    """
    Returns authentic trained model evaluation metrics generated during training.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(current_dir, "..", ".."))
    metrics_path = os.path.join(project_root, "ml", "saved_models", "evaluation_metrics.json")
    metadata_path = os.path.join(project_root, "ml", "saved_models", "model_metadata.json")

    if not os.path.exists(metrics_path):
        from ml.train import train_and_evaluate_all
        train_and_evaluate_all()

    try:
        with open(metrics_path, "r") as f:
            metrics = json.load(f)

        with open(metadata_path, "r") as f:
            metadata = json.load(f)

        return {
            "status": "success",
            "metadata": metadata,
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load model metrics: {str(e)}")
