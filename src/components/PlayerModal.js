'use client';
import { useEffect } from 'react';
import CountUp from './CountUp';

export default function PlayerModal({ member, results, onClose }) {
  if (!member) return null;

  // Filter all results where this member won
  const memberWins = results.filter(r => r.Winner_ID === member.Member_Name);

  const golds   = memberWins.filter(r => r.Position === '1st');
  const silvers = memberWins.filter(r => r.Position === '2nd');
  const bronzes = memberWins.filter(r => r.Position === '3rd');

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div onClick={handleBackdrop} style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        background: 'rgba(20,20,30,0.95)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '32px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
        animation: 'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', marginBottom: '1rem'
            }}>
              {member.Member_Name?.[0]?.toUpperCase()}
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>{member.Member_Name}</h2>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>🛡️ {member.Team_ID}</span>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', width: '40px', height: '40px',
            borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>×</button>
        </div>

        {/* Total Points */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '20px', padding: '1.2rem',
          textAlign: 'center', marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700' }} className="gradient-text">
            <CountUp end={member.Individual_Points || member.points || 0} />
          </div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Total Points Scored</div>
        </div>

        {/* Medal Cabinet */}
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-dim)', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
          TROPHY CABINET
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Gold', emoji: '🥇', count: golds.length, color: 'var(--gold)' },
            { label: 'Silver', emoji: '🥈', count: silvers.length, color: 'var(--silver)' },
            { label: 'Bronze', emoji: '🥉', count: bronzes.length, color: 'var(--bronze)' },
          ].map(({ label, emoji, count, color }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '16px', padding: '1rem',
              textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)'
            }}>
              <div style={{ fontSize: '1.8rem' }}>{emoji}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color }}>{count}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Win History */}
        {memberWins.length > 0 && (
          <>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-dim)', fontSize: '0.85rem', letterSpacing: '0.1em' }}>WIN HISTORY</h3>
            <div style={{ display: 'grid', gap: '0.6rem', maxHeight: '200px', overflowY: 'auto' }}>
              {memberWins.map((w, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px', padding: '0.7rem 1rem',
                  fontSize: '0.9rem'
                }}>
                  <span>
                    {w.Position === '1st' ? '🥇' : w.Position === '2nd' ? '🥈' : '🥉'} {w.Program_ID}
                  </span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>+{w.Points_Awarded}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {memberWins.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            No wins recorded yet — but they're just getting started! 💪
          </p>
        )}
      </div>
    </div>
  );
}
