import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Clock,
  Award,
  Filter,
  Play,
  CheckCircle2,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { getExercises } from '../services/api';
import ExerciseModal from '../components/ExerciseModal';

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [completedKeys, setCompletedKeys] = useState([]);

  useEffect(() => {
    getExercises()
      .then((data) => {
        setExercises(data.exercises || []);
      })
      .catch((err) => console.error('Failed to load exercises:', err));
  }, []);

  const categories = ['All', 'Fluency', 'Pacing', 'Interview', 'Public Speaking', 'Clarity', 'Poise', 'Communication'];

  const filteredExercises = selectedFilter === 'All'
    ? exercises
    : exercises.filter((ex) => ex.category === selectedFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto' }}>
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
          <Dumbbell size={14} />
          <span>Interactive Confidence Gym</span>
        </div>
        <h1 className="section-title">Personalized Confidence Workouts</h1>
        <p className="section-subtitle">
          Practice targeted, timed verbal exercises designed to eliminate filler words, steady your cadence, and master impromptu communication.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}>
        {categories.map((cat) => {
          const isSelected = selectedFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                background: isSelected ? 'var(--primary)' : '#ffffff',
                color: isSelected ? '#ffffff' : 'var(--text-muted)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid-3">
        {filteredExercises.map((ex) => {
          const isDone = completedKeys.includes(ex.key);
          return (
            <div
              key={ex.key}
              className="glass-card glass-panel-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: '3px solid var(--primary)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.725rem' }}>
                    {ex.target_skill}
                  </span>
                  <span className="badge badge-warning" style={{ fontSize: '0.725rem' }}>
                    <Clock size={11} /> {ex.duration_seconds}s
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                  {ex.title}
                </h3>

                <div style={{
                  background: 'var(--bg-muted)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontStyle: 'italic',
                  color: 'var(--text-main)',
                  marginBottom: '0.85rem',
                }}>
                  “{ex.prompt_text}”
                </div>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {ex.coaching_benefit}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.775rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Difficulty: <strong>{ex.difficulty}</strong></span>
                  <span style={{ color: '#059669', fontWeight: 600 }}>+2.5 Pt Boost</span>
                </div>

                <button
                  id={`exercise-card-btn-${ex.key}`}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.875rem' }}
                  onClick={() => setSelectedExercise(ex)}
                >
                  <Play size={14} />
                  <span>Start Interactive Challenge</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Player */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onCompleted={(ex) => {
            setCompletedKeys((prev) => [...prev, ex.key]);
          }}
        />
      )}
    </div>
  );
}
