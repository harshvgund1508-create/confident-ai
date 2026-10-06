import React from 'react';
import { Mic, MessageSquare, Sparkles, ShieldCheck, Waves } from 'lucide-react';

export default function SubScoreBars({ subScores = {} }) {
  const skills = [
    { key: 'speaking', label: 'Speaking Delivery & Tempo', score: subScores.speaking || 68, icon: Mic, color: '#4f46e5' },
    { key: 'communication', label: 'Communication & Expression', score: subScores.communication || 81, icon: MessageSquare, color: '#7c3aed' },
    { key: 'clarity', label: 'Linguistic Clarity & Precision', score: subScores.clarity || 76, icon: Sparkles, color: '#06b6d4' },
    { key: 'response_confidence', label: 'Response Poise & Adaptability', score: subScores.response_confidence || 72, icon: ShieldCheck, color: '#10b981' },
    { key: 'fluency', label: 'Fluency & Pacing Flow', score: subScores.fluency || 65, icon: Waves, color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {skills.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon size={16} style={{ color: item.color }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {item.label}
                </span>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: item.color }}>
                {item.score} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ 100</span>
              </span>
            </div>

            <div style={{
              width: '100%',
              height: '8px',
              background: '#e2e8f0',
              borderRadius: '999px',
              overflow: 'hidden',
            }}>
              <div
                style={{
                  width: `${Math.min(100, Math.max(0, item.score))}%`,
                  height: '100%',
                  background: item.color,
                  borderRadius: '999px',
                  transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
