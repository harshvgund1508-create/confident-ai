import React from 'react';
import { HelpCircle, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ExplainabilityCard({ explainability }) {
  if (!explainability) return null;

  const positiveFactors = explainability.positive_factors || [];
  const negativeFactors = explainability.negative_factors || [];

  return (
    <div className="glass-card" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <HelpCircle size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Why Did I Get This Score?
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Model Feature Attribution & Communication Indicators
          </p>
        </div>
      </div>

      {/* Grid of Factors */}
      <div className="grid-2" style={{ marginTop: '1.25rem', gap: '1.25rem' }}>
        {/* Positive Drivers */}
        <div style={{
          background: 'rgba(236, 253, 245, 0.6)',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
            <CheckCircle2 size={18} style={{ color: '#059669' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#065f46' }}>
              Top Strengths Contributing Positively
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {positiveFactors.map((item, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                border: '1px solid #d1fae5',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.85rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#047857' }}>
                    {item.factor}
                  </span>
                  <span className="badge badge-success" style={{ fontSize: '0.675rem', padding: '0.15rem 0.45rem' }}>
                    + Positive Impact
                  </span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', margin: 0 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Work Drivers */}
        <div style={{
          background: 'rgba(254, 242, 242, 0.6)',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
            <AlertCircle size={18} style={{ color: '#dc2626' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#991b1b' }}>
              Opportunities for Improvement
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {negativeFactors.map((item, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                border: '1px solid #fee2e2',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.85rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#b91c1c' }}>
                    {item.factor}
                  </span>
                  <span className="badge badge-danger" style={{ fontSize: '0.675rem', padding: '0.15rem 0.45rem' }}>
                    Needs Work
                  </span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', margin: 0 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attribution Disclaimer */}
      <div style={{
        marginTop: '1.25rem',
        padding: '0.75rem 1rem',
        background: 'var(--bg-muted)',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
      }}>
        <Info size={16} style={{ flexShrink: 0, color: 'var(--primary)' }} />
        <span>
          <strong>ML Explainability Note:</strong> Feature contributions represent statistical feature weightings from the Random Forest model and acoustic/NLP signal processing, not psychological causation.
        </span>
      </div>
    </div>
  );
}
