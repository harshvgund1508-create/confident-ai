import React from 'react';
import { AlertCircle, Lightbulb, Target, ArrowRight } from 'lucide-react';

export default function WeaknessCard({ weaknessAnalysis, onStartExercise }) {
  if (!weaknessAnalysis || !weaknessAnalysis.primary_weakness) {
    return null;
  }

  const primary = weaknessAnalysis.primary_weakness;
  const secondary = weaknessAnalysis.secondary_weakness;

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      borderLeft: '4px solid var(--warning)',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,243,199,0.2) 100%)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--warning-light)',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Target size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', color: '#b45309' }}>
              Detected Focus Area
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {primary.title}
            </h3>
          </div>
        </div>

        <span className="badge badge-warning" style={{ fontSize: '0.8rem' }}>
          Current Score: {primary.score} / 100
        </span>
      </div>

      {/* Explanation & Coaching Tip */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
          <AlertCircle size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {primary.reason}
          </p>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          display: 'flex',
          gap: '0.65rem',
          alignItems: 'flex-start',
        }}>
          <Lightbulb size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '0.85rem', color: '#92400e', display: 'block', marginBottom: '0.15rem' }}>
              Actionable Coaching Recommendation:
            </strong>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0 }}>
              {primary.tip}
            </p>
          </div>
        </div>
      </div>

      {secondary && (
        <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px dashed #e2e8f0', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <strong>Secondary Growth Opportunity:</strong> {secondary.title} ({secondary.score}/100) — {secondary.tip}
        </div>
      )}
    </div>
  );
}
