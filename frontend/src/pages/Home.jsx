import React from 'react';
import {
  Sparkles,
  Activity,
  BarChart3,
  Brain,
  PlayCircle,
  Shield,
  ArrowRight,
  CheckCircle2,
  Mic,
  Cpu,
  Layers,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';

export default function Home({ setActiveTab }) {
  const steps = [
    { num: '01', title: 'Data Ingestion', desc: 'Synthesizes acoustic speech metrics, NLP features, and psychometric Likert indicators.' },
    { num: '02', title: 'Feature Engineering', desc: 'Extracts domain composites: Fluency Index, Pacing Optimality, and Anxiety Penalties.' },
    { num: '03', title: 'Multi-Model ML', desc: 'Evaluates Random Forest, Gradient Boosting, Linear Regression & Classifiers.' },
    { num: '04', title: 'Explainability & Growth', desc: 'Calculates feature contributions and matches targeted daily confidence exercises.' },
  ];

  const targetAudiences = [
    { title: 'College Students', desc: 'Overcome presentation anxiety and build classroom participation confidence.' },
    { title: 'Job & Internship Seekers', desc: 'Sharpen elevator pitches, interview fluency, and technical articulation.' },
    { title: 'Interview Candidates', desc: 'Master spontaneous behavioral questions with structured poise.' },
    { title: 'Public Speaking Beginners', desc: 'Calibrate steady pacing, eliminate filler words, and sustain vocal presence.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* HERO SECTION */}
      <section className="glass-panel" style={{
        padding: '3.5rem 2.5rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(238,242,255,0.85) 50%, rgba(245,243,255,0.8) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow orb */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
        }}>
          <Sparkles size={16} />
          <span>Machine Learning Powered Communication Coaching</span>
        </div>

        <h1 style={{
          fontSize: '3.25rem',
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 1.15,
          color: 'var(--text-main)',
          maxWidth: '840px',
          margin: '0 auto 1.25rem',
        }}>
          Build Confidence. Improve Communication.{' '}
          <span className="gradient-text">Track Your Growth.</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 2.25rem',
          lineHeight: 1.6,
        }}>
          ConfidentAI is an end-to-end ML platform that estimates your communication confidence from self-assessments and speech delivery, detects weak areas, and delivers personalized exercises.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <button
            id="hero-start-assessment-btn"
            className="btn btn-primary btn-lg"
            onClick={() => setActiveTab('assessment')}
          >
            <Activity size={20} />
            <span>Start Assessment</span>
            <ArrowRight size={18} />
          </button>

          <button
            id="hero-view-progress-btn"
            className="btn btn-secondary btn-lg"
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 size={18} />
            <span>View Progress</span>
          </button>

          <button
            id="hero-demo-mode-btn"
            className="btn btn-secondary btn-lg"
            onClick={() => setActiveTab('demo-mode')}
          >
            <PlayCircle size={18} />
            <span>Try Demo Mode</span>
          </button>
        </div>

        {/* Key Metrics Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          maxWidth: '850px',
          margin: '3rem auto 0',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>0.975 R²</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Model Predictive Fit</div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)' }}>2,500</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Trained Dataset Records</div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>92.4%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Classification Accuracy</div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>7 Workouts</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Targeted Skill Drills</div>
          </div>
        </div>
      </section>

      {/* COMPLETE ML PIPELINE SECTION */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title">The Complete Machine Learning Pipeline</h2>
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            From raw multimodal speech signals to explainable model predictions and personalized coaching.
          </p>
        </div>

        <div className="grid-4">
          {steps.map((step, idx) => (
            <div key={idx} className="glass-card glass-panel-hover" style={{ position: 'relative' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--primary)',
                fontFamily: 'var(--font-mono)',
                marginBottom: '0.5rem',
                opacity: 0.6,
              }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title">Designed for Real Career Growth</h2>
          <p className="section-subtitle">
            Combines audio acoustic processing, NLP linguistic modeling, and actionable habit coaching.
          </p>
        </div>

        <div className="grid-3">
          <div className="glass-card glass-panel-hover">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <Mic size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Multimodal Speech Analysis
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Calculates speaking rate (WPM), pauses, silence duration, and pitch consistency from your spoken self-introduction.
            </p>
          </div>

          <div className="glass-card glass-panel-hover">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--secondary-light)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <Brain size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Real ML Explainability
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Answers <em>"Why did I get this score?"</em> by decomposing model predictions into positive strengths and areas to develop.
            </p>
          </div>

          <div className="glass-card glass-panel-hover">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <Flame size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Targeted Skill Challenges
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Personalized workouts such as the 30-Second No-Pause Challenge and Mock Interview elevator pitch drills.
            </p>
          </div>
        </div>
      </section>

      {/* TARGET AUDIENCE CARDS */}
      <section className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '1.75rem' }}>
          Who ConfidentAI Is Built For
        </h2>
        <div className="grid-2" style={{ gap: '1.25rem' }}>
          {targetAudiences.map((item, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'flex-start',
            }}>
              <CheckCircle2 size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                  {item.title}
                </strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK START BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem 2.5rem',
        color: '#ffffff',
        textAlign: 'center',
        boxShadow: '0 12px 30px var(--primary-glow)',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Ready to Test Your Communication Confidence?
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', maxWidth: '560px', margin: '0 auto 1.75rem' }}>
          Takes only 2–3 minutes to answer 8 questions, complete an optional voice prompt, and receive your ML diagnostic report.
        </p>
        <button
          className="btn btn-secondary btn-lg"
          onClick={() => setActiveTab('assessment')}
          style={{ background: '#ffffff', color: 'var(--primary)', fontWeight: 800 }}
        >
          <Activity size={20} />
          <span>Launch Confidence Assessment</span>
        </button>
      </section>
    </div>
  );
}
