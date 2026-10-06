import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Award,
  Calendar,
  Flame,
  Dumbbell,
  Sparkles,
  ArrowUpRight,
  RotateCcw,
  PlayCircle,
  Clock,
  CheckCircle2,
  Trash2,
  Mic
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { getProgress, getHistory, resetHistory, seedDemoJourney } from '../services/api';
import ExerciseModal from '../components/ExerciseModal';

export default function Dashboard({ setActiveTab }) {
  const [progressData, setProgressData] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [prog, hist] = await Promise.all([
        getProgress(),
        getHistory(15)
      ]);
      setProgressData(prog);
      setHistoryList(hist);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to clear your assessment history?')) {
      await resetHistory();
      setNotification('Assessment history cleared.');
      fetchDashboardData();
    }
  };

  const handleSeedDemo = async () => {
    const res = await seedDemoJourney();
    setNotification(res.message || 'Demo journey seeded!');
    fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
          Loading your progress analytics...
        </div>
      </div>
    );
  }

  const hasData = progressData && progressData.has_data;
  const currentScore = progressData?.current_score || 74.0;
  const improvementPoints = progressData?.improvement_points || 0;
  const trendSeries = progressData?.trend_series || [];
  const latestSub = progressData?.latest_subscores || { speaking: 76, communication: 81, clarity: 78, response_confidence: 72, fluency: 74 };
  const latestWeakness = progressData?.latest_weakness || 'Speaking Fluency & Flow';

  const defaultChallenge = {
    key: 'timed_speech_60s',
    title: "2-Minute Speaking Challenge",
    target_skill: 'Speaking Fluency & Cadence',
    duration_seconds: 120,
    difficulty: 'Intermediate',
    prompt_text: "Deliver a 2-minute impromptu talk on: 'How technology can make education more accessible for everyone.'",
    instructions: "1. Maintain consistent cadence.\n2. Limit filler words to under 2.\n3. Keep pauses under 1 second."
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Notification Banner */}
      {notification && (
        <div style={{
          background: 'var(--primary-light)',
          border: '1px solid #c7d2fe',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          color: 'var(--primary)',
          fontWeight: 600,
        }}>
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title" style={{ marginBottom: '0.2rem' }}>
            Confidence Growth Dashboard
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Track assessment trajectories, model score progressions, and completed confidence workouts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            id="seed-demo-journey-btn"
            className="btn btn-secondary btn-sm"
            onClick={handleSeedDemo}
            title="Populates 4 progressive assessments for presentation demo"
          >
            <PlayCircle size={14} />
            <span>Load Demo Journey</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={handleReset}
            title="Reset history"
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('assessment')}
          >
            <Activity size={14} />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <Sparkles size={48} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Assessment Trajectory Yet</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            You haven't completed any assessments yet. Take your first assessment or click "Load Demo Journey" to explore sample progress charts.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('assessment')}>
              Take Assessment
            </button>
            <button className="btn btn-secondary" onClick={handleSeedDemo}>
              Load Demo Journey
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* TOP SECTION: OVERALL SCORE & SUB-METRIC CARDS */}
          <div className="grid-4">
            {/* Top Score Card */}
            <div className="glass-card" style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              color: '#ffffff',
              padding: '1.5rem',
            }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#a5b4fc', fontWeight: 700 }}>
                Your Confidence Score
              </div>
              <div style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0.25rem 0' }}>
                {currentScore} <span style={{ fontSize: '1rem', color: '#c7d2fe', fontWeight: 500 }}>/ 100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', color: '#6ee7b7' }}>
                <TrendingUp size={16} />
                <span>
                  {improvementPoints >= 0 ? `+${improvementPoints} points improvement` : `${improvementPoints} points`}
                </span>
              </div>
            </div>

            {/* Sub Metric: Communication */}
            <div className="glass-card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Communication</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed', margin: '0.25rem 0' }}>
                {latestSub.communication || 81} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assertive expression & articulation</div>
            </div>

            {/* Sub Metric: Fluency */}
            <div className="glass-card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Fluency & Flow</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', margin: '0.25rem 0' }}>
                {latestSub.fluency || 74} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Low fillers & steady pauses</div>
            </div>

            {/* Sub Metric: Clarity */}
            <div className="glass-card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Linguistic Clarity</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4', margin: '0.25rem 0' }}>
                {latestSub.clarity || 78} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vocabulary richness & structure</div>
            </div>
          </div>

          {/* MAIN CHARTS SECTION */}
          <div className="grid-2">
            {/* 1. Confidence Progress Trend Line Chart */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Confidence Progress Trajectory
                  </h2>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Assessment progression over time
                  </p>
                </div>
                {improvementPoints > 0 && (
                  <span className="badge badge-success" style={{ fontSize: '0.825rem' }}>
                    +{improvementPoints} pts growth
                  </span>
                )}
              </div>

              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendSeries}>
                    <defs>
                      <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="assessment_num" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis domain={[30, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip
                      formatter={(val) => [`${val} / 100`, 'Confidence Score']}
                      contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="confidence_score"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorConf)"
                      dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Multidimensional Skill Evolution */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Skill Progression Breakdown
                  </h2>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Evolution across the 5 core dimensions
                  </p>
                </div>
                <span className="badge badge-primary">Multivariate</span>
              </div>

              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="assessment_num" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis domain={[30, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                    <Line type="monotone" dataKey="communication" stroke="#7c3aed" strokeWidth={2} name="Communication" />
                    <Line type="monotone" dataKey="fluency" stroke="#f59e0b" strokeWidth={2} name="Fluency" />
                    <Line type="monotone" dataKey="clarity" stroke="#06b6d4" strokeWidth={2} name="Clarity" />
                    <Line type="monotone" dataKey="speaking" stroke="#4f46e5" strokeWidth={2} name="Speaking" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RECOMMENDATION & TODAY'S FOCUS SECTION */}
          <div className="grid-2">
            {/* Today's Focus */}
            <div className="glass-panel" style={{
              padding: '1.75rem',
              borderLeft: '4px solid var(--primary)',
              background: '#ffffff',
            }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--primary)', marginBottom: '0.35rem' }}>
                Today's Recommended Focus
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {latestWeakness}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Targeted practice sprints help smooth out vocal hesitations and build consistent delivery momentum.
              </p>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setSelectedExercise(defaultChallenge)}
                >
                  <Dumbbell size={14} />
                  <span>Start 2-Min Challenge</span>
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('exercises')}
                >
                  <span>Browse All Exercises</span>
                </button>
              </div>
            </div>

            {/* Quick Practice Challenge Card */}
            <div className="glass-panel" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, rgba(238,242,255,0.6) 0%, rgba(245,243,255,0.6) 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-warning">
                  <Clock size={12} /> 2-Minute Workout
                </span>
                <span className="badge badge-success">+2.5 Boost</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                {defaultChallenge.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                “{defaultChallenge.prompt_text}”
              </p>
              <button
                id="dashboard-start-challenge-btn"
                className="btn btn-primary btn-sm"
                style={{ width: '100%' }}
                onClick={() => setSelectedExercise(defaultChallenge)}
              >
                <PlayCircle size={15} />
                <span>Launch Interactive Workout</span>
              </button>
            </div>
          </div>

          {/* ASSESSMENT HISTORY TABLE */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Assessment History Log
              </h2>
              <span className="badge badge-primary">{historyList.length} Records</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>#</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Role</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Confidence Score</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Primary Focus</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Audio</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map((item, idx) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{historyList.length - idx}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>{item.target_role}</td>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 800, color: item.confidence_score > 75 ? '#10b981' : item.confidence_score > 55 ? '#4f46e5' : '#ef4444' }}>
                        {item.confidence_score} / 100
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span className={`badge ${item.confidence_category === 'High' ? 'badge-success' : item.confidence_category === 'Moderate' ? 'badge-primary' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                          {item.confidence_category}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                        {item.weakness_primary}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        {item.audio_present ? (
                          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                            <Mic size={10} /> Audio
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Text</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Interactive Workout Modal */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onCompleted={() => {
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}
