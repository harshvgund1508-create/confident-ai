import React, { useEffect, useState } from 'react';
import { Award, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ScoreGauge({ score = 74, category = 'Moderate', size = 200 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, Math.round(score)));
    if (end === 0) {
      setAnimatedScore(0);
      return;
    }
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Radius and circumference
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Category Colors
  let strokeColor = '#4f46e5';
  let badgeClass = 'badge-primary';
  let categoryLabel = category;
  let categoryIcon = Award;

  if (score < 55) {
    strokeColor = '#ef4444';
    badgeClass = 'badge-danger';
    categoryLabel = 'Developing Confidence';
    categoryIcon = AlertTriangle;
  } else if (score <= 75) {
    strokeColor = '#7c3aed';
    badgeClass = 'badge-primary';
    categoryLabel = 'Moderately High Confidence';
    categoryIcon = TrendingUp;
  } else {
    strokeColor = '#10b981';
    badgeClass = 'badge-success';
    categoryLabel = 'High Mastery Confidence';
    categoryIcon = CheckCircle2;
  }

  const CategoryIconComponent = categoryIcon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div className="gauge-container" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.4s ease',
              filter: `drop-shadow(0 2px 6px ${strokeColor}44)`
            }}
          />
        </svg>

        {/* Center Text Display */}
        <div className="gauge-center-text">
          <div className="gauge-value" style={{ color: strokeColor }}>
            {animatedScore}
          </div>
          <div className="gauge-max">/ 100</div>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <span className={`badge ${badgeClass}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
          <CategoryIconComponent size={16} />
          <span>{categoryLabel}</span>
        </span>
      </div>
    </div>
  );
}
