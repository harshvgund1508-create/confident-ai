import React, { useState } from 'react';
import {
  Activity,
  User,
  Briefcase,
  HelpCircle,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Shield,
  Sparkles
} from 'lucide-react';
import AudioRecorder from '../components/AudioRecorder';
import { submitAssessment } from '../services/api';

const LIKERT_QUESTIONS = [
  {
    key: 'public_speaking_comfort',
    question: '1. How comfortable are you speaking in front of others?',
    subtext: 'Presenting to a class, team meeting, or large audience.',
    labels: ['Very Uncomfortable', 'Somewhat Hesitant', 'Moderate Comfort', 'Confident', 'Extremely Comfortable']
  },
  {
    key: 'interview_confidence',
    question: '2. How confident are you during formal interviews?',
    subtext: 'Handling hiring managers, behavioral questions, or panel Q&A.',
    labels: ['High Anxiety', 'Somewhat Nervous', 'Average Poise', 'Confident', 'Extremely Confident']
  },
  {
    key: 'hesitation_frequency',
    question: '3. How often do you hesitate or stall while speaking?',
    subtext: 'Frequent pauses, restarting sentences, or second-guessing words.',
    labels: ['Rarely / Never', 'Occasionally', 'Moderate', 'Frequently', 'Constantly']
  },
  {
    key: 'opinion_expression_comfort',
    question: '4. How comfortable are you expressing your personal opinion in discussions?',
    subtext: 'Disagreeing respectfully or sharing new viewpoints openly.',
    labels: ['Keep Silent', 'Reluctant', 'Balanced', 'Comfortable', 'Eagerly Share']
  },
  {
    key: 'nervousness_level',
    question: '5. How nervous do you feel when meeting new people or stakeholders?',
    subtext: 'Heart racing, tension, or reluctance to introduce yourself.',
    labels: ['Completely Calm', 'Mild Flutter', 'Noticeable', 'High Tension', 'Overwhelmed']
  },
  {
    key: 'unexpected_questions_comfort',
    question: '6. How comfortable are you answering surprise or unscripted questions?',
    subtext: 'Thinking on your feet when asked impromptu questions.',
    labels: ['Freeze Up', 'Struggle', 'Manage Okay', 'Adapt Well', 'Thrive Under Pressure']
  },
  {
    key: 'fear_of_judgment',
    question: '7. How often do you avoid speaking because of fear of judgment?',
    subtext: 'Worrying about being criticized or sounding foolish.',
    labels: ['Never Avoid', 'Rarely', 'Sometimes', 'Frequently', 'Almost Always']
  },
  {
    key: 'technical_explanation_comfort',
    question: '8. How confident are you explaining technical or complex concepts simply?',
    subtext: 'Translating code, data, or project architecture to non-technical peers.',
    labels: ['Find It Hard', 'Somewhat Confusing', 'Average Clarity', 'Clear & Articulate', 'Master Communicator']
  }
];

export default function Assessment({ onAssessmentComplete, setActiveTab }) {
  const [userName, setUserName] = useState('Alex Chen');
  const [targetRole, setTargetRole] = useState('Job/Internship Seeker');

  const [likertAnswers, setLikertAnswers] = useState({
    public_speaking_comfort: 3,
    interview_confidence: 3,
    hesitation_frequency: 3,
    opinion_expression_comfort: 3,
    nervousness_level: 3,
    unexpected_questions_comfort: 3,
    fear_of_judgment: 3,
    technical_explanation_comfort: 3
  });

  const [audioMode, setAudioMode] = useState('audio');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioFilename, setAudioFilename] = useState(null);
  const [textResponse, setTextResponse] = useState('');
  const [speakingDuration, setSpeakingDuration] = useState(45.0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLikertChange = (key, value) => {
    setLikertAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleAudioReady = (blob, filename) => {
    setAudioBlob(blob);
    setAudioFilename(filename);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('user_name', userName || 'Student Candidate');
      formData.append('target_role', targetRole || 'Job/Internship Seeker');

      // Append Likert answers
      Object.keys(likertAnswers).forEach((key) => {
        formData.append(key, likertAnswers[key]);
      });

      formData.append('response_text', textResponse || '');
      formData.append('speaking_duration_sec', speakingDuration || 45.0);

      // Append Audio file if recorded or uploaded
      if (audioBlob) {
        formData.append('audio_file', audioBlob, audioFilename || 'speech_sample.wav');
      }

      const result = await submitAssessment(formData);
      if (onAssessmentComplete) {
        onAssessmentComplete(result);
      }
      setActiveTab('results');
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred during model inference.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
          <Sparkles size={14} />
          <span>Multimodal Confidence Assessment</span>
        </div>
        <h1 className="section-title">Communication & Confidence Diagnostic</h1>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Complete the 8-question self-evaluation and provide an optional 30–60 second speech response to generate your ML confidence score.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* SECTION 1: CANDIDATE PROFILE */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} style={{ color: 'var(--primary)' }} />
            Candidate Profile & Goals
          </h2>

          <div className="grid-2">
            <div>
              <label className="form-label">Candidate Name / Alias:</label>
              <input
                id="assessment-candidate-name"
                className="form-input"
                type="text"
                placeholder="e.g. Alex Chen"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Primary Goal / Target Role:</label>
              <select
                id="assessment-target-role"
                className="form-select"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              >
                <option value="College Student">College Student (Presentations & Academics)</option>
                <option value="Job/Internship Seeker">Job / Internship Seeker</option>
                <option value="Software / Tech Interview Candidate">Software / Tech Interview Candidate</option>
                <option value="Public Speaking Beginner">Public Speaking Beginner</option>
                <option value="Career Transitioner">Career Transitioner</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: 8 LIKERT SELF-ASSESSMENT QUESTIONS */}
        <div className="glass-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} style={{ color: 'var(--primary)' }} />
              Part 1: Communication Self-Assessment (1–5 Likert Scale)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Rate each statement honestly based on your typical feelings in conversations and presentations.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {LIKERT_QUESTIONS.map((q, qIdx) => {
              const selectedVal = likertAnswers[q.key] || 3;
              return (
                <div key={q.key} style={{
                  paddingBottom: qIdx < LIKERT_QUESTIONS.length - 1 ? '1.5rem' : '0',
                  borderBottom: qIdx < LIKERT_QUESTIONS.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                        {q.question}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {q.subtext}
                      </p>
                    </div>
                    <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                      Selected: {selectedVal} / 5
                    </span>
                  </div>

                  {/* 1-5 Likert Options */}
                  <div className="likert-group">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = selectedVal === val;
                      return (
                        <div
                          key={val}
                          id={`likert-${q.key}-${val}`}
                          className={`likert-option ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleLikertChange(q.key, val)}
                        >
                          <span className="likert-number">{val}</span>
                          <span className="likert-label">{q.labels[val - 1]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: SPEAKING RESPONSE (AUDIO / TEXT) */}
        <div>
          <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Part 2: Practical Speaking Task
            </h2>
            <span className="badge badge-secondary">Audio & NLP Extraction</span>
          </div>
          <AudioRecorder
            onAudioReady={handleAudioReady}
            textResponse={textResponse}
            setTextResponse={setTextResponse}
            speakingDuration={speakingDuration}
            setSpeakingDuration={setSpeakingDuration}
            mode={audioMode}
            setMode={setAudioMode}
          />
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: 'var(--danger-light)',
            border: '1px solid #fca5a5',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            color: '#b91c1c',
            fontSize: '0.9rem',
          }}>
            <strong>Submission Error:</strong> {errorMsg}
          </div>
        )}

        {/* SUBMISSION CTA */}
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button
            id="submit-assessment-btn"
            type="submit"
            className="btn btn-primary btn-lg pulse-glow"
            disabled={isLoading}
            style={{ width: '100%', maxWidth: '420px', padding: '1rem' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Running ML Diagnostic Models...</span>
              </>
            ) : (
              <>
                <Activity size={20} />
                <span>Generate ML Confidence Score</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p style={{ fontSize: '0.775rem', color: 'var(--text-light)', marginTop: '0.75rem' }}>
            Processes 16 multimodal features through Random Forest Regressor & Classifier models.
          </p>
        </div>
      </form>
    </div>
  );
}
