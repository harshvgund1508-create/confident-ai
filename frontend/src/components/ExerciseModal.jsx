import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Award, Clock, Flame, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { completeExercise } from '../services/api';

export default function ExerciseModal({ exercise, onClose, onCompleted }) {
  if (!exercise) return null;

  const totalDuration = exercise.duration_seconds || 60;
  const [timeLeft, setTimeLeft] = useState(totalDuration);
  const [isActive, setIsActive] = useState(false);
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeLeft(exercise.duration_seconds || 60);
    setIsActive(false);
    setIsCompleted(false);
  }, [exercise]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            try {
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalDuration);
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const timeSpent = totalDuration - timeLeft;
      await completeExercise({
        exercise_key: exercise.key,
        exercise_title: exercise.title,
        duration_spent_seconds: timeSpent > 0 ? timeSpent : totalDuration,
        reflection_notes: reflection,
        score_boost: 2.5
      });
      setIsCompleted(true);
      try {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      } catch (e) {}
      if (onCompleted) {
        onCompleted(exercise);
      }
    } catch (err) {
      console.error('Failed to log completed exercise:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress percentage for timer circle
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#ffffff',
        padding: '2rem',
        position: 'relative',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-muted)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)',
          }}
        >
          <X size={20} />
        </button>

        {/* Exercise Header */}
        <div style={{ marginBottom: '1.5rem', paddingRight: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary">{exercise.target_skill}</span>
            <span className="badge badge-secondary">{exercise.difficulty}</span>
            <span className="badge badge-warning">
              <Clock size={12} /> {exercise.duration_seconds}s Workout
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {exercise.title}
          </h2>
        </div>

        {/* Interactive Timer Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 20px rgba(49, 46, 129, 0.3)',
        }}>
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a5b4fc', marginBottom: '0.25rem' }}>
            Live Challenge Timer
          </div>

          <div style={{
            fontSize: '3.75rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '-0.03em',
            margin: '0.25rem 0',
          }}>
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', marginTop: '1rem' }}>
            <button
              id="exercise-toggle-timer-btn"
              onClick={handleToggleTimer}
              style={{
                background: isActive ? '#ef4444' : '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '0.65rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {isActive ? <Pause size={18} /> : <Play size={18} />}
              <span>{isActive ? 'Pause Timer' : timeLeft === totalDuration ? 'Start Challenge' : 'Resume'}</span>
            </button>

            <button
              onClick={handleResetTimer}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: 'none',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Prompt & Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            background: 'var(--bg-muted)',
            padding: '1.15rem',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--primary)',
          }}>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
              Speaking Prompt:
            </strong>
            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              “{exercise.prompt_text}”
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={16} style={{ color: 'var(--primary)' }} />
              Instructions & Technique:
            </h4>
            <div style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              whiteSpace: 'pre-line',
              lineHeight: 1.6,
              background: '#ffffff',
              border: '1px solid var(--border)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
            }}>
              {exercise.instructions}
            </div>
          </div>
        </div>

        {/* Reflection Notes & Completion */}
        {!isCompleted ? (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">
                Post-Exercise Notes & Reflection (Optional):
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Felt much smoother in the second half, avoided 3 pause hesitations."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
              />
            </div>

            <button
              id="complete-exercise-btn"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem' }}
              disabled={isSubmitting}
              onClick={handleComplete}
            >
              <CheckCircle2 size={18} />
              <span>{isSubmitting ? 'Logging Workout...' : 'Mark as Completed & Claim +2.5 Boost'}</span>
            </button>
          </div>
        ) : (
          <div style={{
            background: 'var(--success-light)',
            border: '1px solid #a7f3d0',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'center',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
            }}>
              <CheckCircle2 size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065f46', marginBottom: '0.25rem' }}>
              Great Job! Workout Completed!
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#047857', marginBottom: '1rem' }}>
              Your practice session was recorded. Keep building your speaking momentum!
            </p>
            <button
              className="btn btn-secondary"
              onClick={onClose}
              style={{ width: '100%' }}
            >
              Close Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
