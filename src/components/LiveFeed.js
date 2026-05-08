'use client';
import { useState, useEffect } from 'react';

export default function LiveFeed({ items }) {
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState('in'); // 'in' | 'hold' | 'out'

  useEffect(() => {
    if (!items || items.length <= 1) return;

    let timeout;

    if (phase === 'in') {
      // Hold for 3.5s then start exit
      timeout = setTimeout(() => setPhase('out'), 3500);
    } else if (phase === 'out') {
      // After exit animation (400ms), move to next and bring in
      timeout = setTimeout(() => {
        setCurrent(prev => (prev + 1) % items.length);
        setPhase('in');
      }, 400);
    }

    return () => clearTimeout(timeout);
  }, [phase, items]);

  if (!items || items.length === 0) return null;

  const item = items[current];
  const medal = item.pos === '1st' ? '🥇' : item.pos === '2nd' ? '🥈' : '🥉';
  const borderColor = item.pos === '1st' ? 'var(--gold)' : item.pos === '2nd' ? 'var(--silver)' : 'var(--bronze)';

  const isIn = phase === 'in';

  return (
    <div style={{
      overflow: 'hidden',
      borderBottom: `1px solid rgba(255,255,255,0.06)`,
      borderTop: `2px solid ${borderColor}`,
      background: 'rgba(10,10,15,0.8)',
      backdropFilter: 'blur(10px)',
      padding: '0.6rem 5%',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      minHeight: '60px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        transform: isIn ? 'translateX(0)' : 'translateX(60px)',
        opacity: isIn ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        flex: 1,
        minWidth: 0,
      }}>
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{medal}</span>
        <span style={{
          fontSize: '0.88rem',
          color: 'rgba(255,255,255,0.85)',
          lineHeight: '1.5',
          flex: 1
        }}>{item.text}</span>
        <span style={{
          background: `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))`,
          borderRadius: '8px',
          padding: '0.15rem 0.6rem',
          fontSize: '0.78rem',
          fontWeight: '700',
          flexShrink: 0,
          whiteSpace: 'nowrap'
        }}>+{item.pts} pts</span>
      </div>
    </div>
  );
}
