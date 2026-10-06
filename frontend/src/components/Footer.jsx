import React from 'react';
import { Shield, Sparkles, Brain, Cpu, Heart } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid var(--border)',
      padding: '2.5rem 1.5rem 2rem',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
      }}>
        {/* Top Disclaimer Banner */}
        <div style={{
          background: 'var(--bg-muted)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          marginBottom: '2rem',
        }}>
          <Shield size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text-main)' }}>Educational & Privacy Notice:</strong> ConfidentAI is an educational Machine Learning communication coaching system. It evaluates communication indicators and speech delivery patterns; it is not a clinical or psychological diagnostic tool. Recorded audio is processed ephemerally in memory and is never permanently retained.
          </div>
        </div>

        {/* Footer Columns */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Sparkles size={18} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>ConfidentAI</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>– Personal Confidence Booster</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Data → Preprocessing → Feature Engineering → Multi-Model ML → Explainability → Recommendations
            </p>
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.875rem' }}>
            <button 
              onClick={() => setActiveTab('assessment')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              Assessment
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('ml-insights')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              ML Insights
            </button>
            <button 
              onClick={() => setActiveTab('demo-mode')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              Demo Mode
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              About
            </button>
          </div>
        </div>

        {/* Bottom Credits & Tech Stack */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          paddingTop: '1.25rem',
          fontSize: '0.8rem',
          color: 'var(--text-light)',
        }}>
          <div>
            Built with Scikit-learn, FastAPI, React, Librosa & SQLite • Academic ML Capstone Project
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Made for college students, job seekers & public speakers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
