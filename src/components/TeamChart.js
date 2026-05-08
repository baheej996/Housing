'use client';
import { useMemo } from 'react';

export default function TeamChart({ results, teams }) {
  const chartData = useMemo(() => {
    if (!results || results.length === 0 || !teams || teams.length === 0) return null;

    // 1. Get unique dates and sort them
    const dates = [...new Set(results.map(r => r.Timestamp))].sort((a, b) => new Date(a) - new Date(b));
    
    // 2. Calculate cumulative points for each team at each date
    const teamPaths = teams.map(team => {
      let cumulative = 0;
      const points = dates.map(date => {
        const dailyPoints = results
          .filter(r => r.Timestamp === date && r.Team_ID === team.Team_Name)
          .reduce((sum, r) => sum + (parseInt(r.Points_Awarded) || 0), 0);
        cumulative += dailyPoints;
        return cumulative;
      });
      return { name: team.Team_Name, points };
    });

    return { dates, teamPaths };
  }, [results, teams]);

  if (!chartData) return null;

  const { teamPaths, dates } = chartData;
  const maxPoints = Math.max(...teamPaths.flatMap(t => t.points), 10);
  const width = 1000;
  const height = 400;
  const padding = 40;

  // Helper to map data to SVG coordinates
  const getX = (index) => padding + (index * (width - padding * 2)) / (dates.length - 1 || 1);
  const getY = (val) => height - padding - (val * (height - padding * 2)) / maxPoints;

  // Colors for teams
  const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div style={{ width: '100%', overflow: 'hidden', padding: '1rem 0' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          {/* Gradients for area fills */}
          {teamPaths.map((t, i) => (
            <linearGradient key={`grad-${i}`} id={`fill-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity="0" />
            </linearGradient>
          ))}
          {/* Glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line key={i} x1={padding} y1={getY(maxPoints * p)} x2={width - padding} y2={getY(maxPoints * p)} 
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}

        {/* Team Lines & Areas */}
        {teamPaths.map((t, i) => {
          const pathData = t.points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p)}`).join(' ');
          
          // Curved path logic (Simple version for reliability)
          let d = `M ${getX(0)} ${getY(t.points[0])}`;
          for (let idx = 0; idx < t.points.length - 1; idx++) {
            const x1 = getX(idx);
            const y1 = getY(t.points[idx]);
            const x2 = getX(idx + 1);
            const y2 = getY(t.points[idx + 1]);
            const cx = (x1 + x2) / 2;
            d += ` C ${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`;
          }

          const areaD = `${d} L ${getX(t.points.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;

          return (
            <g key={i}>
              <path d={areaD} fill={`url(#fill-${i})`} />
              <path d={d} fill="none" stroke={colors[i % colors.length]} strokeWidth="4" 
                strokeLinecap="round" filter="url(#glow)" style={{ transition: 'all 1s ease' }} />
              {/* Endpoint Dot */}
              <circle cx={getX(t.points.length - 1)} cy={getY(t.points[t.points.length - 1])} r="6" fill={colors[i % colors.length]} filter="url(#glow)" />
              <text x={getX(t.points.length - 1) + 10} y={getY(t.points[t.points.length - 1]) - 10} 
                fill={colors[i % colors.length]} fontSize="14" fontWeight="bold">
                {t.points[t.points.length - 1]}
              </text>
            </g>
          );
        })}

        {/* X-Axis Labels */}
        {dates.map((date, i) => (
          <text key={i} x={getX(i)} y={height - 10} fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="middle">
            {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </text>
        ))}
      </svg>
      
      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        {teamPaths.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: colors[i % colors.length] }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: '600' }}>{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
