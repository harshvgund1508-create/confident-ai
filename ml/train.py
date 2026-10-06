"""
Model Training Module for ConfidentAI
Trains and compares multiple regression and classification models:
- Regression: Linear Regression, Decision Tree, Gradient Boosting, Random Forest (Primary)
- Classification: Logistic Regression, Decision Tree, Gradient Boosting, Random Forest (Primary)
Calculates real metrics (MAE, RMSE, R2, Accuracy, Precision, Recall, F1, Confusion Matrix, Feature Importance)
and saves artifacts to ml/saved_models/.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, GradientBoostingRegressor, GradientBoostingClassifier
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

from ml.preprocessing import load_and_preprocess_data

def train_and_evaluate_all():
    print("=" * 60)
    print("Starting ConfidentAI ML Training Pipeline")
    print("=" * 60)

    current_dir = os.path.dirname(os.path.abspath(__file__))
    saved_models_dir = os.path.join(current_dir, "saved_models")
    os.makedirs(saved_models_dir, exist_ok=True)

    # 1. Preprocess and split
    data = load_and_preprocess_data()
    X_train_scaled = data["X_train_scaled"]
    X_test_scaled = data["X_test_scaled"]
    y_reg_train = data["y_reg_train"]
    y_reg_test = data["y_reg_test"]
    y_clf_train = data["y_clf_train"]
    y_clf_test = data["y_clf_test"]
    feature_names = data["feature_names"]
    class_names = data["class_names"]

    print(f"Training dataset size: {len(X_train_scaled)} samples, {len(feature_names)} features")
    print(f"Test dataset size:     {len(X_test_scaled)} samples")
    print("-" * 60)

    # 2. Train and Evaluate Regressors
    reg_models = {
        "Linear Regression": LinearRegression(),
        "Decision Tree": DecisionTreeRegressor(max_depth=6, random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=120, learning_rate=0.08, max_depth=4, random_state=42),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=150, max_depth=10, min_samples_split=4, random_state=42, n_jobs=-1)
    }

    reg_results = {}
    best_reg_name = None
    best_reg_r2 = -float("inf")
    best_reg_model = None

    print("REGRESSION MODEL COMPARISON:")
    for name, model in reg_models.items():
        model.fit(X_train_scaled, y_reg_train)
        y_pred = model.predict(X_test_scaled)

        mae = float(mean_absolute_error(y_reg_test, y_pred))
        mse = float(mean_squared_error(y_reg_test, y_pred))
        rmse = float(np.sqrt(mse))
        r2 = float(r2_score(y_reg_test, y_pred))

        reg_results[name] = {
            "MAE": round(mae, 3),
            "MSE": round(mse, 3),
            "RMSE": round(rmse, 3),
            "R2": round(r2, 4)
        }
        print(f"  [{name:24s}] -> MAE: {mae:6.3f} | RMSE: {rmse:6.3f} | R²: {r2:6.4f}")

        if r2 > best_reg_r2:
            best_reg_r2 = r2
            best_reg_name = name
            best_reg_model = model

    print(f"\n>> Best Regressor Selected: {best_reg_name} (R² = {best_reg_r2:.4f})")
    print("-" * 60)

    # 3. Train and Evaluate Classifiers
    clf_models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(max_depth=5, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, learning_rate=0.08, max_depth=3, random_state=42),
        "Random Forest Classifier": RandomForestClassifier(n_estimators=150, max_depth=10, min_samples_split=4, random_state=42, n_jobs=-1)
    }

    clf_results = {}
    best_clf_name = None
    best_clf_acc = -float("inf")
    best_clf_model = None

    print("CLASSIFICATION MODEL COMPARISON:")
    for name, model in clf_models.items():
        model.fit(X_train_scaled, y_clf_train)
        y_pred = model.predict(X_test_scaled)

        acc = float(accuracy_score(y_clf_test, y_pred))
        prec = float(precision_score(y_clf_test, y_pred, average="weighted", zero_division=0))
        rec = float(recall_score(y_clf_test, y_pred, average="weighted", zero_division=0))
        f1 = float(f1_score(y_clf_test, y_pred, average="weighted", zero_division=0))
        cm = confusion_matrix(y_clf_test, y_pred).tolist()

        clf_results[name] = {
            "Accuracy": round(acc, 4),
            "Precision": round(prec, 4),
            "Recall": round(rec, 4),
            "F1_Score": round(f1, 4),
            "Confusion_Matrix": cm
        }
        print(f"  [{name:24s}] -> Accuracy: {acc*100:6.2f}% | Precision: {prec:6.4f} | Recall: {rec:6.4f} | F1: {f1:6.4f}")

        if acc > best_clf_acc:
            best_clf_acc = acc
            best_clf_name = name
            best_clf_model = model

    print(f"\n>> Best Classifier Selected: {best_clf_name} (Accuracy = {best_clf_acc*100:.2f}%)")
    print("-" * 60)

    # 4. Feature Importance Calculation (From Random Forest Regressor & Classifier)
    rf_reg = reg_models["Random Forest Regressor"]
    rf_clf = clf_models["Random Forest Classifier"]

    feat_imp_reg = [
        {"feature": feat, "importance": round(float(imp), 4)}
        for feat, imp in zip(feature_names, rf_reg.feature_importances_)
    ]
    feat_imp_reg.sort(key=lambda x: x["importance"], reverse=True)

    feat_imp_clf = [
        {"feature": feat, "importance": round(float(imp), 4)}
        for feat, imp in zip(feature_names, rf_clf.feature_importances_)
    ]
    feat_imp_clf.sort(key=lambda x: x["importance"], reverse=True)

    # 5. Persist Models and Metadata
    joblib.dump(best_reg_model, os.path.join(saved_models_dir, "best_regressor.joblib"))
    joblib.dump(best_clf_model, os.path.join(saved_models_dir, "best_classifier.joblib"))
    joblib.dump(rf_reg, os.path.join(saved_models_dir, "rf_regressor.joblib"))
    joblib.dump(rf_clf, os.path.join(saved_models_dir, "rf_classifier.joblib"))
    joblib.dump(data["scaler"], os.path.join(saved_models_dir, "scaler.joblib"))
    joblib.dump(data["label_encoder"], os.path.join(saved_models_dir, "label_encoder.joblib"))

    # Metadata & Metrics JSON
    metrics_data = {
        "dataset_info": {
            "total_samples": len(data["df_raw"]),
            "train_samples": len(X_train_scaled),
            "test_samples": len(X_test_scaled),
            "num_features": len(feature_names),
            "feature_names": feature_names,
            "classes": class_names,
            "target_distribution": {
                "Low": int((data["df_raw"]["confidence_category"] == "Low").sum()),
                "Moderate": int((data["df_raw"]["confidence_category"] == "Moderate").sum()),
                "High": int((data["df_raw"]["confidence_category"] == "High").sum())
            }
        },
        "regression_models": reg_results,
        "best_regression_model": {
            "name": best_reg_name,
            "metrics": reg_results[best_reg_name]
        },
        "classification_models": clf_results,
        "best_classification_model": {
            "name": best_clf_name,
            "metrics": clf_results[best_clf_name]
        },
        "feature_importance_regression": feat_imp_reg,
        "feature_importance_classification": feat_imp_clf,
        "confusion_matrix_classes": class_names,
        "confusion_matrix": clf_results[best_clf_name]["Confusion_Matrix"]
    }

    metrics_path = os.path.join(saved_models_dir, "evaluation_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics_data, f, indent=2)

    metadata = {
        "model_version": "1.0.0",
        "primary_regressor": best_reg_name,
        "primary_classifier": best_clf_name,
        "feature_count": len(feature_names),
        "features": feature_names,
        "classes": class_names
    }
    with open(os.path.join(saved_models_dir, "model_metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nAll models and evaluation metrics successfully saved to:\n  {saved_models_dir}")
    print("=" * 60)
    return metrics_data

if __name__ == "__main__":
    train_and_evaluate_all()
