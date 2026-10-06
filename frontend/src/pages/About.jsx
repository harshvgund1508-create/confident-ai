import React from 'react';
import {
  Info,
  Shield,
  Brain,
  Cpu,
  Layers,
  Sparkles,
  Lock,
  Code2,
  Heart,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export default function About({ setActiveTab }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
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
          <Info size={14} />
          <span>About ConfidentAI</span>
        </div>
        <h1 className="section-title">Personal Confidence Booster</h1>
        <p className="section-subtitle">
          An end-to-end Machine Learning web application designed to assess, explain, and improve interpersonal communication and confidence.
        </p>
      </div>

      {/* 1. PROJECT OBJECTIVES & MOTIVATION */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} style={{ color: 'var(--primary)' }} />
          Motivation & Problem Statement
        </h2>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Communication anxiety and presentation hesitation affect millions of students and early-career candidates during academic defenses, job interviews, and public speaking engagements. Traditional solutions either rely on expensive private coaching or generic chatbots that provide arbitrary feedback without measurable baseline metrics.
        </p>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0 }}>
          <strong>ConfidentAI</strong> bridges this gap through a complete, reproducible Machine Learning pipeline that extracts acoustic delivery signals and linguistic indicators, applies multi-model regression & classification, detects specific weak areas, and delivers personalized deliberate practice exercises.
        </p>
      </div>

      {/* 2. SYSTEM ARCHITECTURE & TECH STACK */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} style={{ color: 'var(--secondary)' }} />
          System Architecture & Technical Stack
        </h2>

        <div className="grid-2" style={{ gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-muted)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Machine Learning & NLP
            </h3>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
              <li><strong>Python 3.14 & Scikit-learn:</strong> Multi-model training (Random Forest, Gradient Boosting, Linear Regression).</li>
              <li><strong>Librosa & SoundFile:</strong> Acoustic RMS energy, pause intervals, spectral centroid & MFCCs.</li>
              <li><strong>TextBlob & Regex:</strong> Sentiment polarity, vocabulary diversity, and filler word detection.</li>
              <li><strong>Joblib:</strong> Pipeline serialization and model persistence.</li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-muted)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.5rem' }}>
              Backend & Frontend Infrastructure
            </h3>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
              <li><strong>FastAPI:</strong> High-performance async REST API endpoints.</li>
              <li><strong>SQLite + SQLAlchemy:</strong> Lightweight local ORM database.</li>
              <li><strong>React 19 + Vite:</strong> Component-driven user interface with responsive CSS design system.</li>
              <li><strong>Recharts:</strong> Interactive radar, area, line, and bar charts.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. ETHICS, SAFETY & PRIVACY SAFEGUARDS */}
      <div className="glass-panel" style={{
        padding: '2rem',
        borderLeft: '4px solid #10b981',
        background: 'linear-gradient(135deg, rgba(236,253,245,0.8) 0%, #ffffff 100%)',
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={20} style={{ color: '#059669' }} />
          Responsible AI, Ethics & Privacy Principles
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
            <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Strictly Non-Clinical / Non-Diagnostic:</strong> ConfidentAI evaluates communication delivery indicators (e.g. speaking pace, filler words, clarity index). It does not diagnose psychological, clinical, or anxiety disorders.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
            <Lock size={18} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Zero Permanent Audio Storage:</strong> Audio recordings are processed in ephemeral memory buffers to extract acoustic metrics and are immediately discarded. No biometric voiceprints or raw voice recordings are stored.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
            <Brain size={18} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Transparent Explainable AI:</strong> Model predictions are accompanied by feature attribution factor decompositions, ensuring users understand why they received a given assessment score.
            </div>
          </div>
        </div>
      </div>

      {/* 4. CALL TO ACTION */}
      <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => setActiveTab('assessment')}
        >
          <span>Start Confidence Assessment</span>
        </button>
      </div>
    </div>
  );
}
