import React, { useState } from 'react';
import {
  PlayCircle,
  User,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Award,
  Zap,
  RotateCcw,
  BarChart3,
  Dumbbell
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { seedDemoJourney, directPredict, submitAssessment } from '../services/api';
import ExerciseModal from '../components/ExerciseModal';

export default function DemoMode({ setActiveTab, onAssessmentComplete }) {
  const [demoState, setDemoState] = useState('initial'); // 'initial', 'exercise_active', 'improved'
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Demo user data
  const studentProfile = {
    name: 'Jordan Reed',
    role: 'College Student (Preparing for Technical Interviews)',
    beforeScore: 72.0,
    beforeCategory: 'Moderate',
    beforeWeakness: 'Speaking Fluency & Hesitation',
    beforeReason: 'Frequent pauses and 6 filler words detected in spontaneous answer.',
    recommendedExercise: {
      key: 'no_pause_challenge',
      title: '2-Minute Speaking Challenge',
      target_skill: 'Speaking Fluency & Flow',
      duration_seconds: 30, // 30s fast demo
      difficulty: 'Beginner',
      prompt_text: 'Describe your favorite coding project for 30 seconds without pausing or using filler words.',
      instructions: '1. Start speaking immediately.\n2. Keep vocal momentum moving forward.\n3. Eliminate "um" and "like".'
    },
    afterScore: 78.0,
    afterCategory: 'High',
    afterWeakness: 'Pacing Fine-Tuning',
    delta: '+6 points (+8.3% improvement)'
  };

  const handleSeedFullProgress = async () => {
    setIsSeeding(true);
    try {
      await seedDemoJourney();
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
      setActiveTab('dashboard');
    } catch (err) {
      console.error('Failed to seed demo:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCompleteDemoExercise = () => {
    setDemoState('improved');
    setSelectedExercise(null);
    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    } catch (e) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(238,242,255,0.9) 0%, rgba(245,243,255,0.9) 100%)',
        border: '1.5px solid #c7d2fe',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          padding: '0.35rem 0.95rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.825rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
        }}>
          <PlayCircle size={16} />
          <span>Interactive Viva & College Presentation Demo</span>
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Live Demonstration Mode
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
          Demonstrate the full lifecycle: <strong>Initial Assessment (Score: 72) → Weakness Detection (Hesitation) → 2-Minute Challenge Completion → Re-Assessment (Score: 78, +6 Improvement)</strong> in under 60 seconds.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button
            id="seed-presentation-journey-btn"
            className="btn btn-primary"
            onClick={handleSeedFullProgress}
            disabled={isSeeding}
          >
            <Sparkles size={18} />
            <span>{isSeeding ? 'Seeding 4-Step Journey...' : 'Seed 4-Step Progress Journey & View Dashboard'}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.85rem' }}>
          * Clearly labeled: Synthetic educational demo data created for academic demonstration.
        </div>
      </div>

      {/* STEP-BY-STEP LIVE INTERACTIVE SIMULATOR */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700 }}>
              Live Student Growth Simulator
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Candidate: {studentProfile.name} ({studentProfile.role})
            </h2>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setDemoState('initial')}
          >
            <RotateCcw size={14} />
            <span>Reset Demo Simulator</span>
          </button>
        </div>

        {/* BEFORE STATE (INITIAL ASSESSMENT) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            background: demoState === 'initial' ? 'rgba(238,242,255,0.4)' : '#ffffff',
            border: demoState === 'initial' ? '2px solid var(--primary)' : '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            opacity: demoState === 'initial' ? 1 : 0.85,
            transition: 'all 0.3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="badge badge-primary">Step 1: Baseline Assessment</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Analyzed via Random Forest Model</span>
            </div>

            <div className="grid-3" style={{ alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Confidence</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#4f46e5' }}>
                  {studentProfile.beforeScore} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
                </div>
                <span className="badge badge-primary">{studentProfile.beforeCategory} Confidence</span>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Detected Weak Area</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#d97706', margin: '0.2rem 0' }}>
                  {studentProfile.beforeWeakness}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  {studentProfile.beforeReason}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Recommended Action</div>
                <button
                  id="demo-launch-exercise-btn"
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => setSelectedExercise(studentProfile.recommendedExercise)}
                >
                  <Dumbbell size={14} />
                  <span>Launch 2-Min Challenge</span>
                </button>
              </div>
            </div>
          </div>

          {/* STEP 2: PRACTICE CHALLENGE TRIGGER */}
          {demoState === 'initial' && (
            <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Click <strong>"Launch 2-Min Challenge"</strong> above or simulate instant completion below:
              </p>
              <button
                id="demo-simulate-completion-btn"
                className="btn btn-primary"
                onClick={handleCompleteDemoExercise}
              >
                <Zap size={16} />
                <span>Simulate Completed Challenge & Run Follow-up Inference</span>
              </button>
            </div>
          )}

          {/* STEP 3: AFTER STATE (IMPROVED ASSESSMENT) */}
          {demoState === 'improved' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(236,253,245,0.7) 0%, #ffffff 100%)',
              border: '2px solid #10b981',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.15)',
              animation: 'fadeIn 0.5s ease-out',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-success">Step 2: Post-Workout Re-Assessment</span>
                <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                  <TrendingUp size={14} /> {studentProfile.delta}
                </span>
              </div>

              <div className="grid-3" style={{ alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>New Confidence Score</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>
                    {studentProfile.afterScore} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
                  </div>
                  <span className="badge badge-success">{studentProfile.afterCategory} Confidence</span>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Improvement Verification</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#047857', margin: '0.2rem 0' }}>
                    Fluency Restored
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Fillers dropped from 6 to 1; conversational cadence reached optimal 144 WPM.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <BarChart3 size={14} />
                    <span>View Growth on Dashboard</span>
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setDemoState('initial')}
                  >
                    <span>Replay Demo</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Modal */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onCompleted={() => {
            handleCompleteDemoExercise();
          }}
        />
      )}
    </div>
  );
}
