'use client';
import { useState, useEffect } from 'react';

export default function LiveFeed({ items }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!items || items.length <= 1) return;

    const interval = setInterval(() => {
      // Slide out
      setVisible(false);

      setTimeout(() => {
        setCurrent(prev => (prev + 1) % items.length);
        // Slide in
        setVisible(true);
      }, 400); // wait for exit animation

    }, 4000); // show each item for 4 seconds

    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const item = items[current];
  const borderColor = item.pos === '1st' ? 'var(--gold)' : item.pos === '2nd' ? 'var(--silver)' : 'var(--bronze)';

  return (
    <section className="glass-card" style={{ marginBottom: '2.5rem', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h2 style={{ margin: 0 }}>🔔 Live <span className="gradient-text">Activity Feed</span></h2>
        <div style={{ display: 'flex', gap: '4px' }}>
          {items.map((_, i) => (
            <div key={i} onClick={() => { setVisible(false); setTimeout(() => { setCurrent(i); setVisible(true); }, 300); }} style={{
              width: i === current ? '20px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === current ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.4s ease',
              cursor: 'pointer'
            }} />
          ))}
        </div>
      </div>

      <div style={{
        transform: visible ? 'translateX(0)' : 'translateX(60px)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '16px', padding: '1.2rem 1.4rem',
          borderLeft: `4px solid ${borderColor}`,
        }}>
          <div style={{
            fontSize: '2rem', minWidth: '40px', textAlign: 'center'
          }}>
            {item.pos === '1st' ? '🥇' : item.pos === '2nd' ? '🥈' : '🥉'}
          </div>
          <p style={{ flex: 1, margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{item.text}</p>
          <span style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: '10px', padding: '0.3rem 0.8rem',
            fontSize: '0.85rem', fontWeight: '700', whiteSpace: 'nowrap'
          }}>+{item.pts} pts</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '0.8rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
        {current + 1} / {items.length}
      </div>
    </section>
  );
}
