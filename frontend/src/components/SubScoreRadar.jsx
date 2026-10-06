import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export default function SubScoreRadar({ subScores = {} }) {
  const data = [
    { subject: 'Speaking', score: subScores.speaking || 68, fullMark: 100 },
    { subject: 'Communication', score: subScores.communication || 81, fullMark: 100 },
    { subject: 'Clarity', score: subScores.clarity || 76, fullMark: 100 },
    { subject: 'Response Conf.', score: subScores.response_confidence || 72, fullMark: 100 },
    { subject: 'Fluency', score: subScores.fluency || 65, fullMark: 100 },
  ];

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#4f46e5"
            fill="#6366f1"
            fillOpacity={0.45}
          />
          <Tooltip
            formatter={(value) => [`${value} / 100`, 'Skill Score']}
            contentStyle={{
              background: '#ffffff',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              fontWeight: 600,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
