import React, { useState, useEffect } from 'react';
import {
  Brain,
  Cpu,
  BarChart3,
  Layers,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
  Table,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { getModelMetrics, directPredict } from '../services/api';

export default function MLInsights() {
  const [metricsData, setMetricsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Live Sandbox interactive inputs
  const [sandboxInputs, setSandboxInputs] = useState({
    public_speaking_comfort: 3,
    interview_confidence: 4,
    hesitation_frequency: 2,
    opinion_expression_comfort: 4,
    nervousness_level: 2,
    unexpected_questions_comfort: 3,
    fear_of_judgment: 2,
    technical_explanation_comfort: 4,
    speaking_duration: 48.0,
    words_per_minute: 142.0,
    response_length_words: 110,
    pause_frequency: 5.0,
    filler_word_count: 2,
    speech_consistency: 0.88,
    sentiment_score: 0.45,
    clarity_score: 82.0
  });

  const [sandboxPrediction, setSandboxPrediction] = useState(null);
  const [isSandboxPredicting, setIsSandboxPredicting] = useState(false);

  useEffect(() => {
    getModelMetrics()
      .then((data) => {
        setMetricsData(data.metrics);
      })
      .catch((err) => console.error('Failed to load ML metrics:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // Run initial sandbox prediction
  useEffect(() => {
    runSandboxInference();
  }, []);

  const runSandboxInference = async () => {
    setIsSandboxPredicting(true);
    try {
      const pred = await directPredict(sandboxInputs);
      setSandboxPrediction(pred);
    } catch (e) {
      console.error('Sandbox inference failed:', e);
    } finally {
      setIsSandboxPredicting(false);
    }
  };

  const handleSliderChange = (key, val) => {
    const updated = { ...sandboxInputs, [key]: parseFloat(val) };
    setSandboxInputs(updated);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
          Loading trained machine learning model benchmarks...
        </div>
      </div>
    );
  }

  const regressionModels = metricsData?.regression_models || {
    "Linear Regression": { MAE: 2.297, RMSE: 2.899, R2: 0.9746 },
    "Decision Tree": { MAE: 3.584, RMSE: 4.426, R2: 0.9408 },
    "Gradient Boosting": { MAE: 2.517, RMSE: 3.137, R2: 0.9702 },
    "Random Forest Regressor": { MAE: 2.668, RMSE: 3.290, R2: 0.9673 }
  };

  const classificationModels = metricsData?.classification_models || {
    "Logistic Regression": { Accuracy: 0.924, Precision: 0.9242, Recall: 0.924, F1_Score: 0.9241 },
    "Decision Tree": { Accuracy: 0.894, Precision: 0.8943, Recall: 0.894, F1_Score: 0.8941 },
    "Gradient Boosting": { Accuracy: 0.922, Precision: 0.9223, Recall: 0.922, F1_Score: 0.9221 },
    "Random Forest Classifier": { Accuracy: 0.916, Precision: 0.9178, Recall: 0.916, F1_Score: 0.9164 }
  };

  const featureImportance = (metricsData?.feature_importance_regression || []).slice(0, 8).map((f) => ({
    feature: f.feature.replace(/_/g, ' '),
    importancePct: Math.round(f.importance * 1000) / 10
  }));

  const confusionMatrix = metricsData?.confusion_matrix || [
    [92, 0, 9],
    [0, 194, 11],
    [8, 10, 176]
  ];
  const classes = metricsData?.confusion_matrix_classes || ['High', 'Low', 'Moderate'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          padding: '0.3rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
        }}>
          <Brain size={14} />
          <span>Academic Machine Learning Architecture & Evaluation</span>
        </div>
        <h1 className="section-title">ML Model Benchmarks & Explainability</h1>
        <p className="section-subtitle">
          Transparent evaluation of regression and classification models, loss metrics, confusion matrices, and feature importances.
        </p>
      </div>

      {/* 1. DATASET & ARCHITECTURE SUMMARY */}
      <div className="grid-4">
        <div className="glass-card">
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Dataset Size
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', margin: '0.2rem 0' }}>
            2,500 Samples
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            80% Train (2,000) / 20% Test (500)
          </div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Input Features
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)', margin: '0.2rem 0' }}>
            23 Dimensions
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            16 Raw + 7 Engineered Composites
          </div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Best Regressor R²
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '0.2rem 0' }}>
            0.975 R²
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            MAE: 2.29 pts / RMSE: 2.90 pts
          </div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Best Classifier
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', margin: '0.2rem 0' }}>
            92.4% Accuracy
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            F1-Score: 0.924 (Weighted)
          </div>
        </div>
      </div>

      {/* 2. MODEL COMPARISON TABLES (REGRESSION & CLASSIFICATION) */}
      <div className="grid-2">
        {/* Regression Table */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              1. Regression Models (Target: Score 0–100)
            </h2>
            <span className="badge badge-primary">Continuous Target</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem' }}>Algorithm</th>
                <th style={{ padding: '0.5rem' }}>MAE</th>
                <th style={{ padding: '0.5rem' }}>RMSE</th>
                <th style={{ padding: '0.5rem' }}>R² Score</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(regressionModels).map(([name, m]) => (
                <tr key={name} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {name}
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'var(--font-mono)' }}>{m.MAE}</td>
                  <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'var(--font-mono)' }}>{m.RMSE}</td>
                  <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: m.R2 > 0.96 ? '#059669' : 'var(--text-main)' }}>
                    {m.R2}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            * Evaluated on holdout 500-sample test set with StandardScaler transformation.
          </div>
        </div>

        {/* Classification Table */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              2. Classification Models (Low / Mod / High)
            </h2>
            <span className="badge badge-secondary">3-Class Target</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem' }}>Algorithm</th>
                <th style={{ padding: '0.5rem' }}>Accuracy</th>
                <th style={{ padding: '0.5rem' }}>Precision</th>
                <th style={{ padding: '0.5rem' }}>Recall</th>
                <th style={{ padding: '0.5rem' }}>F1</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(classificationModels).map(([name, m]) => (
                <tr key={name} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {name}
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#059669' }}>
                    {(m.Accuracy * 100).toFixed(1)}%
                  </td>
                  <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'var(--font-mono)' }}>{m.Precision}</td>
                  <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'var(--font-mono)' }}>{m.Recall}</td>
                  <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'var(--font-mono)' }}>{m.F1_Score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            * Stratified k-split test set with weighted average multi-class metrics.
          </div>
        </div>
      </div>

      {/* 3. FEATURE IMPORTANCE & CONFUSION MATRIX */}
      <div className="grid-2">
        {/* Feature Importance Bar Chart */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Feature Importance (Random Forest Attribution)
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Gini impurity reduction percentage across tree splits
          </p>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={featureImportance} margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" unit="%" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis dataKey="feature" type="category" tick={{ fill: '#334155', fontSize: 11 }} width={120} />
                <Tooltip formatter={(v) => [`${v}%`, 'Model Contribution']} />
                <Bar dataKey="importancePct" fill="#4f46e5" radius={[0, 6, 6, 0]}>
                  {featureImportance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : index === 1 ? '#7c3aed' : '#06b6d4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confusion Matrix Heatmap */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Confusion Matrix Heatmap (500 Test Samples)
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Actual vs Predicted class distribution for 3 confidence bands
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Predicted Class →
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(3, 1fr)', gap: '0.5rem', width: '100%', maxWidth: '380px' }}>
              {/* Header */}
              <div />
              {classes.map((c) => (
                <div key={c} style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-main)' }}>
                  {c}
                </div>
              ))}

              {/* Rows */}
              {confusionMatrix.map((row, rIdx) => (
                <React.Fragment key={rIdx}>
                  <div style={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {classes[rIdx]}
                  </div>
                  {row.map((val, cIdx) => {
                    const isDiagonal = rIdx === cIdx;
                    return (
                      <div
                        key={cIdx}
                        style={{
                          background: isDiagonal ? '#dcfce7' : val > 0 ? '#fee2e2' : '#f8fafc',
                          color: isDiagonal ? '#15803d' : val > 0 ? '#b91c1c' : '#94a3b8',
                          border: isDiagonal ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '0.75rem 0.25rem',
                          textAlign: 'center',
                          fontWeight: 800,
                          fontSize: '1rem',
                        }}
                      >
                        {val}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '1rem' }}>
              Diagonal elements represent correct predictions (Overall Accuracy: 92.4%).
            </div>
          </div>
        </div>
      </div>

      {/* 4. LIVE INTERACTIVE ML SANDBOX */}
      <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Sliders size={16} />
              <span>Interactive Model Sandbox</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Live Model Inference Tester
            </h2>
          </div>

          <button
            id="run-sandbox-inference-btn"
            className="btn btn-primary btn-sm"
            onClick={runSandboxInference}
            disabled={isSandboxPredicting}
          >
            <Zap size={14} />
            <span>{isSandboxPredicting ? 'Inferring...' : 'Execute Live Model Inference'}</span>
          </button>
        </div>

        <div className="grid-2" style={{ gap: '2rem' }}>
          {/* Sliders Input Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 600 }}>Public Speaking Comfort (1–5):</span>
                <strong style={{ color: 'var(--primary)' }}>{sandboxInputs.public_speaking_comfort}</strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={sandboxInputs.public_speaking_comfort}
                onChange={(e) => handleSliderChange('public_speaking_comfort', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 600 }}>Hesitation Frequency (1–5) [Inverted]:</span>
                <strong style={{ color: '#ef4444' }}>{sandboxInputs.hesitation_frequency}</strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={sandboxInputs.hesitation_frequency}
                onChange={(e) => handleSliderChange('hesitation_frequency', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 600 }}>Speaking Tempo ({sandboxInputs.words_per_minute} WPM):</span>
                <strong style={{ color: '#06b6d4' }}>{sandboxInputs.words_per_minute} WPM</strong>
              </div>
              <input
                type="range"
                min="80"
                max="200"
                step="5"
                value={sandboxInputs.words_per_minute}
                onChange={(e) => handleSliderChange('words_per_minute', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 600 }}>Filler Word Count:</span>
                <strong style={{ color: '#d97706' }}>{sandboxInputs.filler_word_count} fillers</strong>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={sandboxInputs.filler_word_count}
                onChange={(e) => handleSliderChange('filler_word_count', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 600 }}>Linguistic Clarity Score (25–100):</span>
                <strong style={{ color: '#10b981' }}>{sandboxInputs.clarity_score}</strong>
              </div>
              <input
                type="range"
                min="30"
                max="98"
                step="2"
                value={sandboxInputs.clarity_score}
                onChange={(e) => handleSliderChange('clarity_score', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Sandbox Live Output Result */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem' }}>
              Live Sandbox Prediction Result
            </div>

            {sandboxPrediction ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                    {sandboxPrediction.confidence_score}
                  </div>
                  <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>/ 100</div>
                  <span className={`badge ${sandboxPrediction.category === 'High' ? 'badge-success' : sandboxPrediction.category === 'Moderate' ? 'badge-primary' : 'badge-danger'}`}>
                    {sandboxPrediction.category} Confidence
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Class Probabilities: Low: {sandboxPrediction.category_probabilities?.Low}%, Moderate: {sandboxPrediction.category_probabilities?.Moderate}%, High: {sandboxPrediction.category_probabilities?.High}%
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Focus Area: {sandboxPrediction.weakness_analysis?.primary_weakness?.title}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    {sandboxPrediction.weakness_analysis?.primary_weakness?.tip}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Adjust the sliders to see instant model recalculations.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
