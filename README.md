# ConfidentAI – Personal Confidence Booster
> **AI/ML Powered Communication Diagnostic & Confidence Coaching Web Application**

[![Python 3.14+](https://img.shields.io/badge/Python-3.14+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E.svg?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 1. Project Overview

**ConfidentAI** is a full-stack Machine Learning application that estimates a user's communication confidence from self-assessments, acoustic speech delivery metrics, and NLP linguistic features. It identifies specific weak areas (such as speaking fluency, hesitation, or pacing), explains the model's predictions transparently, and provides personalized, timed micro-exercises to improve confidence over time.

### Complete Machine Learning Pipeline:
$$\text{Data Ingestion} \longrightarrow \text{Preprocessing} \longrightarrow \text{Feature Engineering} \longrightarrow \text{Model Training} \longrightarrow \text{Evaluation} \longrightarrow \text{Prediction} \longrightarrow \text{Recommendations} \longrightarrow \text{Progress Tracking}$$

---

## 2. Key Features

- **Multimodal Assessment:** 8-question Likert self-evaluation + 30–60s spoken/written self-introduction.
- **Acoustic Speech Analysis:** Extracts Words Per Minute (WPM), pause intervals, silence duration, and pitch consistency in-memory via Librosa & Web Audio API.
- **NLP Linguistic Analysis:** Computes sentiment polarity, vocabulary diversity, sentence clarity, and detects filler words/hesitation phrases (`"um"`, `"like"`, `"actually"`, `"you know"`).
- **Multi-Model Machine Learning:**
  - **Regression (Score 0–100):** Random Forest Regressor ($R^2 = 0.967$), Linear Regression ($R^2 = 0.975$, MAE: $2.29$), Gradient Boosting, Decision Tree.
  - **Classification (Low / Moderate / High):** Random Forest Classifier ($91.6\%$), Logistic Regression ($92.4\%$), Decision Tree, Gradient Boosting.
- **Explainable AI (XAI):** Transparent *"Why did I get this score?"* breakdown with positive model drivers and improvement opportunities.
- **Personalized Exercise Gym:** Interactive challenge player with live countdown timers (30-Second No-Pause Challenge, Mock Interview pitch, ELI10 simplicity drill).
- **Progress Tracking & Dashboard:** Longitudinal charts showing confidence score improvements over time (e.g., Assessment 1: 54 $\rightarrow$ Assessment 4: 74, $+20$ points improvement).
- **Viva Demo Mode:** One-click simulation for college evaluations and presentations.
- **Privacy-Preserving & Ethical:** In-memory audio processing without permanent voice recording retention; non-clinical communication indicators.

---

## 3. Project Structure

```
confident-ai/
│
├── backend/
│   ├── database/
│   │   ├── db.py                 # SQLite SQLAlchemy engine & session
│   │   └── models.py             # Assessment, Exercise, and Progress models
│   ├── routes/
│   │   ├── assessment.py         # POST /api/assessment, POST /api/predict
│   │   ├── progress.py           # GET /api/progress, GET /api/history
│   │   ├── recommendations.py    # GET /api/recommendations, GET /api/exercises
│   │   ├── model_metrics.py      # GET /api/model-metrics
│   │   └── demo.py               # POST /api/demo/seed, GET /api/demo/profiles
│   ├── services/
│   │   ├── audio_service.py      # Acoustic signal processing (Librosa/SoundFile)
│   │   ├── nlp_service.py        # Text analysis & filler word detector
│   │   ├── ml_service.py         # Model loader singleton
│   │   └── recommendation_service.py # Weakness to exercise mapper
│   └── main.py                   # FastAPI application entrypoint
│
├── ml/
│   ├── dataset/
│   │   └── generate_dataset.py   # Synthetic dataset generator (2,500 samples)
│   ├── preprocessing.py          # Scaling & split pipeline
│   ├── feature_engineering.py    # Domain composite features (SEI, API, PO, FC)
│   ├── train.py                  # Multi-model training script & joblib exporter
│   ├── evaluate.py               # Standalone evaluation & verification script
│   ├── predict.py                # Inference engine & explainability logic
│   └── saved_models/             # Persisted .joblib models & evaluation_metrics.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation header
│   │   │   ├── Footer.jsx        # Footer with privacy notice
│   │   │   ├── AudioRecorder.jsx # Live Web Audio waveform canvas & recorder
│   │   │   ├── ScoreGauge.jsx    # Animated circular score progress gauge
│   │   │   ├── SubScoreRadar.jsx # 5-Dimension skill radar chart
│   │   │   ├── SubScoreBars.jsx  # Skill progress bars
│   │   │   ├── WeaknessCard.jsx  # Primary focus area & coaching tip
│   │   │   ├── ExplainabilityCard.jsx # Feature attribution factors
│   │   │   └── ExerciseModal.jsx # Live countdown timer & workout modal
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero, pipeline overview & stats
│   │   │   ├── Assessment.jsx    # 8 Likert questions + speech task
│   │   │   ├── Results.jsx       # Diagnostic report & recommendations
│   │   │   ├── Dashboard.jsx     # Growth trajectory line charts & logs
│   │   │   ├── Exercises.jsx     # Filterable confidence workout library
│   │   │   ├── MLInsights.jsx    # Academic ML benchmarks & live sandbox
│   │   │   ├── DemoMode.jsx      # 1-Click college presentation demo
│   │   │   └── About.jsx         # Ethics, architecture & objectives
│   │   ├── services/
│   │   │   └── api.js            # API client
│   │   ├── styles/
│   │   │   └── index.css         # Modern design system
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── data/
│   ├── confidence_dataset.csv    # 2,500 sample dataset
│   └── README.md                 # Dataset documentation & schema
│
├── docs/
│   └── project_report.md         # Formal academic project report
│
├── notebooks/
│   └── confidence_analysis.ipynb # Jupyter EDA & model training notebook
│
├── tests/
│   └── test_api.py               # Automated unit & integration test suite
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

## 4. Setup & Running Instructions

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ and npm

---

### Step 1: Install Python Dependencies
```bash
pip install -r requirements.txt
```

---

### Step 2: (Optional) Re-train Machine Learning Models
```bash
python -m ml.dataset.generate_dataset
python -m ml.train
python -m ml.evaluate
```

---

### Step 3: Run Backend Server (FastAPI)
```bash
python -m uvicorn backend.main:app --reload --port 8000
```
Backend API docs available at: `http://localhost:8000/docs`

---

### Step 4: Run Frontend Client (React + Vite)
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open browser at: `http://localhost:5173`

---

## 5. Running Automated Tests

Run the backend and ML pipeline test suite:
```bash
python -m tests.test_api
```
All 7 integration tests will run:
- Root API health check
- Direct ML Predictor & Feature attribution
- NLP text & filler word extraction
- Assessment creation, inference & persistence
- Progress metrics & history retrieval
- Academic model metrics & confusion matrix
- Demo journey seeding & progression tracking

---

## 6. Model Evaluation Summary

### Regression (Confidence Score 0–100)
| Model | MAE | RMSE | $R^2$ Score |
| :--- | :--- | :--- | :--- |
| **Linear Regression** | **2.297** | **2.899** | **0.9746** |
| Gradient Boosting | 2.517 | 3.137 | 0.9702 |
| **Random Forest Regressor** | 2.668 | 3.290 | 0.9673 |
| Decision Tree | 3.584 | 4.426 | 0.9408 |

### Classification (Low / Moderate / High)
| Model | Accuracy | Precision | Recall | F1-Score |
| :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression** | **92.40%** | **0.9242** | **0.9240** | **0.9241** |
| Gradient Boosting | 92.20% | 0.9223 | 0.9220 | 0.9221 |
| **Random Forest Classifier** | 91.60% | 0.9178 | 0.9160 | 0.9164 |
| Decision Tree | 89.40% | 0.8943 | 0.8940 | 0.8941 |

---

## 7. Ethical & Privacy Safeguards

1. **Non-Clinical Guarantee:** ConfidentAI is an educational communication coaching tool. It evaluates communication indicators and speech delivery patterns; it is **not** a clinical diagnostic tool for psychological conditions.
2. **Ephemeral Audio Processing:** Voice recordings are analyzed in-memory to extract acoustic metrics and are immediately discarded without permanent retention.
3. **Transparent Explainability:** Model predictions clearly explain that feature importances reflect statistical model contributions, not psychological causation.

---

## 8. License & Academic Citation

Developed as an Academic Machine Learning Capstone Project. Released under the MIT License.
