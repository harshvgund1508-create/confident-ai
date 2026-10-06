"""
Preprocessing Module for ConfidentAI
Handles dataset loading, feature scaling, label encoding, and dataset splitting.
"""

import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from ml.feature_engineering import calculate_engineered_features, ALL_MODEL_FEATURES

def load_and_preprocess_data(csv_path: str = None, test_size: float = 0.2, random_state: int = 42):
    """
    Loads raw CSV data, computes engineered features, scales numerical inputs,
    and returns split train/test sets with fitted transformers.
    """
    if csv_path is None:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(current_dir, "..", "data", "confidence_dataset.csv")

    if not os.path.exists(csv_path):
        from ml.dataset.generate_dataset import generate_confidence_dataset
        df_gen = generate_confidence_dataset(2500, random_state=random_state)
        os.makedirs(os.path.dirname(csv_path), exist_ok=True)
        df_gen.to_csv(csv_path, index=False)

    df_raw = pd.read_csv(csv_path)
    df_feat = calculate_engineered_features(df_raw)

    X = df_feat[ALL_MODEL_FEATURES]
    y_reg = df_feat["confidence_score"]
    y_clf_raw = df_feat["confidence_category"]

    label_encoder = LabelEncoder()
    # Ensure ordered categories: Low, Moderate, High
    label_encoder.fit(["Low", "Moderate", "High"])
    y_clf = label_encoder.transform(y_clf_raw)

    X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
        X, y_reg, y_clf, test_size=test_size, random_state=random_state, stratify=y_clf
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    return {
        "X_train": X_train,
        "X_test": X_test,
        "X_train_scaled": X_train_scaled,
        "X_test_scaled": X_test_scaled,
        "y_reg_train": y_reg_train,
        "y_reg_test": y_reg_test,
        "y_clf_train": y_clf_train,
        "y_clf_test": y_clf_test,
        "scaler": scaler,
        "label_encoder": label_encoder,
        "feature_names": ALL_MODEL_FEATURES,
        "class_names": list(label_encoder.classes_),
        "df_raw": df_raw
    }
