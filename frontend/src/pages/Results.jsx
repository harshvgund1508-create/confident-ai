import React, { useState } from 'react';
import {
  Award,
  BarChart3,
  Dumbbell,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Share2,
  HelpCircle,
  TrendingUp,
  Brain
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import SubScoreRadar from '../components/SubScoreRadar';
import SubScoreBars from '../components/SubScoreBars';
import WeaknessCard from '../components/WeaknessCard';
import ExplainabilityCard from '../components/ExplainabilityCard';
import ExerciseModal from '../components/ExerciseModal';

export default function Results({ result, setActiveTab }) {
  const [selectedExercise, setSelectedExercise] = useState(null);

  if (!result) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
        <Sparkles size={48} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Assessment Data Yet</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Take your first self-assessment and speech task to generate your personalized ML confidence diagnostic.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => setActiveTab('assessment')}
        >
          Take Assessment Now
        </button>
      </div>
    );
  }

  const {
    confidence_score = 74.0,
    confidence_category = 'Moderate',
    category_probabilities = {},
    sub_scores = {},
    weakness_analysis = {},
    explainability = {},
    recommendations = {},
    user_name = 'Candidate',
    target_role = 'Job Seeker',
    nlp_metrics = {},
    speech_metrics = {}
  } = result;

  const primaryExercise = recommendations.primary_recommended_exercise || {
    key: 'no_pause_challenge',
    title: '30-Second No-Pause Challenge',
    target_skill: 'Speaking Fluency & Flow',
    duration_seconds: 30,
    difficulty: 'Beginner',
    prompt_text: 'Speak for 30 seconds on a familiar topic without stopping.',
    instructions: 'Start speaking immediately and avoid pauses.'
  };

  const secondaryExercise = recommendations.secondary_recommended_exercise;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
            <Brain size={16} />
            <span>ML Confidence Diagnostic Report</span>
          </div>
          <h1 className="section-title" style={{ marginBottom: '0.2rem' }}>
            Assessment Results for {user_name}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Target: <strong>{target_role}</strong> • Analyzed using Random Forest Regressor & Classifier
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('assessment')}
          >
            <RotateCcw size={14} />
            <span>Retake Assessment</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 size={14} />
            <span>View Progress Dashboard</span>
          </button>
        </div>
      </div>

      {/* TOP SECTION: SCORE GAUGE & SUB-SCORE CHARTS */}
      <div className="grid-2">
        {/* Overall Score Card */}
        <div className="glass-panel" style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        }}>
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Overall Confidence Score
          </div>

          <ScoreGauge
            score={confidence_score}
            category={confidence_category}
            size={220}
          />

          {/* Model Class Probabilities */}
          {Object.keys(category_probabilities).length > 0 && (
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '1.5rem',
              padding: '0.5rem 0.85rem',
              background: 'var(--bg-muted)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
            }}>
              {Object.entries(category_probabilities).map(([cls, pct]) => (
                <span key={cls} style={{ color: cls === confidence_category ? 'var(--primary)' : 'var(--text-muted)', fontWeight: cls === confidence_category ? 700 : 500 }}>
                  {cls}: {pct}%
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sub-Score Breakdown (Radar & Metrics) */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Multidimensional Skill Breakdown
            </h2>
            <span className="badge badge-primary">5 Core Dimensions</span>
          </div>

          <SubScoreRadar subScores={sub_scores} />

          <div style={{ marginTop: '0.5rem' }}>
            <SubScoreBars subScores={sub_scores} />
          </div>
        </div>
      </div>

      {/* WEAKNESS DETECTION CARD */}
      <WeaknessCard
        weaknessAnalysis={weakness_analysis}
        onStartExercise={() => setSelectedExercise(primaryExercise)}
      />

      {/* MODEL EXPLAINABILITY: WHY DID I GET THIS SCORE? */}
      <ExplainabilityCard explainability={explainability} />

      {/* RECOMMENDED PRACTICE WORKOUT */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Dumbbell size={16} />
              <span>Personalized Confidence Workout</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Recommended Exercise for You
            </h2>
          </div>
          <span className="badge badge-success">Targeted for Your Weak Area</span>
        </div>

        <div className="grid-2" style={{ gap: '1.25rem' }}>
          {/* Primary Recommended Exercise */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.04) 0%, rgba(124, 58, 237, 0.08) 100%)',
            border: '2px solid rgba(79, 70, 229, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">{primaryExercise.target_skill}</span>
                <span className="badge badge-secondary">{primaryExercise.difficulty}</span>
                <span className="badge badge-warning">
                  <Clock size={12} /> {primaryExercise.duration_seconds}s
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                {primaryExercise.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                “{primaryExercise.prompt_text}”
              </p>
            </div>

            <button
              id="start-primary-exercise-btn"
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => setSelectedExercise(primaryExercise)}
            >
              <Dumbbell size={16} />
              <span>Start This Challenge Now</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Secondary Exercise */}
          {secondaryExercise && (
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-secondary">{secondaryExercise.target_skill}</span>
                  <span className="badge badge-primary">{secondaryExercise.difficulty}</span>
                  <span className="badge badge-warning">
                    <Clock size={12} /> {secondaryExercise.duration_seconds}s
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  {secondaryExercise.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  “{secondaryExercise.prompt_text}”
                </p>
              </div>

              <button
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => setSelectedExercise(secondaryExercise)}
              >
                <span>Practice Companion Drill</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL WORKOUT PLAYER */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onCompleted={(ex) => {
            // Optional callback
          }}
        />
      )}
    </div>
  );
}
