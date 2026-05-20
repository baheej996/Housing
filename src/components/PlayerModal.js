'use client';
import { useEffect } from 'react';
import CountUp from './CountUp';
import { motion } from 'framer-motion';

export default function PlayerModal({ member, results, onClose }) {
  if (!member) return null;

  // Filter all results where this member won
  const memberWins = results.filter(r => r.Winner_ID === member.Member_Name);

  const golds   = memberWins.filter(r => r.Position === '1st');
  const silvers = memberWins.filter(r => r.Position === '2nd');
  const bronzes = memberWins.filter(r => r.Position === '3rd');

  const isNoor = member.Team_ID?.toUpperCase() === 'NOOR';
  const factionAccent = isNoor ? 'var(--accent-primary)' : '#ec4899';
  const factionGlow = isNoor ? 'rgba(0, 229, 255, 0.2)' : 'rgba(236, 72, 153, 0.2)';

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
    <motion.div 
      onClick={handleBackdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(5, 5, 7, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <motion.div 
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          background: 'rgba(15, 15, 22, 0.75)',
          backdropFilter: 'blur(45px) saturate(180%)',
          border: isNoor ? '1px solid rgba(0, 229, 255, 0.2)' : '1px solid rgba(236, 72, 153, 0.2)',
          borderRadius: '32px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '500px',
          boxShadow: `0 40px 100px rgba(0,0,0,0.8), 0 0 20px ${factionGlow}`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        
        {/* Aesthetic top glowing spot */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '180px',
          height: '180px',
          background: `radial-gradient(circle, ${factionGlow} 0%, transparent 70%)`,
          filter: 'blur(30px)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: isNoor 
                ? 'linear-gradient(135deg, rgba(0,229,255,0.12) 0%, rgba(99,102,241,0.2) 100%)' 
                : 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(168,85,247,0.2) 100%)',
              border: `1.5px solid ${factionAccent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: '900', color: '#fff',
              fontFamily: 'var(--font-display)',
              boxShadow: `0 0 15px ${factionGlow}`
            }}>
              {member.Member_Name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: '900', color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
                {member.Member_Name}
              </h2>
              <span style={{ 
                color: factionAccent, 
                fontSize: '0.82rem', 
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                🛡️ House {member.Team_ID}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white', 
              width: '38px', 
              height: '38px',
              borderRadius: '50%', 
              cursor: 'pointer', 
              fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            ×
          </button>
        </div>

        {/* Total Points Display */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.015), rgba(255, 255, 255, 0.005))',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.03)',
          borderRadius: '24px', 
          padding: '1.5rem',
          textAlign: 'center', 
          marginBottom: '2.2rem'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            fontWeight: '950', 
            color: '#fff',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.04em',
            lineHeight: '1',
            marginBottom: '0.3rem',
            textShadow: `0 0 20px ${factionGlow}`
          }}>
            <CountUp end={member.Individual_Points || member.points || 0} />
          </div>
          <div style={{ 
            color: 'var(--text-dim)', 
            fontSize: '0.78rem', 
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            CUMULATIVE CHAMPIONSHIP POINTS
          </div>
        </div>

        {/* Trophy Cabinet Grid */}
        <h3 style={{ 
          marginBottom: '1rem', 
          color: 'var(--text-dim)', 
          fontSize: '0.75rem', 
          fontWeight: '800', 
          letterSpacing: '0.12em',
          textTransform: 'uppercase'
        }}>
          TROPHY CABINET
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2.2rem' }}>
          {[
            { label: 'Gold', emoji: '🥇', count: golds.length, glow: 'rgba(255, 215, 0, 0.15)', border: 'rgba(255, 215, 0, 0.25)', text: '#ffd700' },
            { label: 'Silver', emoji: '🥈', count: silvers.length, glow: 'rgba(192, 192, 192, 0.12)', border: 'rgba(192, 192, 192, 0.2)', text: '#dfdfdf' },
            { label: 'Bronze', emoji: '🥉', count: bronzes.length, glow: 'rgba(205, 127, 50, 0.12)', border: 'rgba(205, 127, 50, 0.2)', text: '#cd7f32' },
          ].map(({ label, emoji, count, glow, border, text }) => (
            <div 
              key={label} 
              style={{
                background: 'rgba(255, 255, 255, 0.01)',
                borderRadius: '20px', 
                padding: '1.2rem 0.8rem',
                textAlign: 'center', 
                border: `1px solid ${count > 0 ? border : 'rgba(255,255,255,0.03)'}`,
                boxShadow: count > 0 ? `0 10px 20px -5px ${glow}` : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '2rem', filter: count === 0 ? 'grayscale(100%) opacity(30%)' : 'none', transition: 'all 0.3s' }}>
                {emoji}
              </div>
              <div style={{ 
                fontSize: '1.6rem', 
                fontWeight: '900', 
                color: count > 0 ? text : 'rgba(255,255,255,0.15)',
                fontFamily: 'var(--font-display)',
                margin: '0.4rem 0 0.1rem 0'
              }}>
                {count}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Win History */}
        <h3 style={{ 
          marginBottom: '1rem', 
          color: 'var(--text-dim)', 
          fontSize: '0.75rem', 
          fontWeight: '800', 
          letterSpacing: '0.12em',
          textTransform: 'uppercase'
        }}>
          VICTORY TIMELINE
        </h3>
        
        {memberWins.length > 0 ? (
          <div 
            style={{ 
              display: 'grid', 
              gap: '0.6rem', 
              maxHeight: '180px', 
              overflowY: 'auto',
              paddingRight: '0.4rem'
            }}
          >
            {memberWins.map((w, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.015)',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px', 
                  padding: '0.8rem 1.2rem',
                  fontSize: '0.88rem'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '700', color: '#fff' }}>
                  <span style={{ fontSize: '1rem' }}>
                    {w.Position === '1st' ? '🥇' : w.Position === '2nd' ? '🥈' : '🥉'}
                  </span> 
                  {w.Program_ID}
                </span>
                <span style={{ color: factionAccent, fontWeight: '800', fontSize: '0.94rem' }}>
                  +{w.Points_Awarded} <span style={{ fontSize: '0.72rem', fontWeight: '500', opacity: 0.8 }}>pts</span>
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            background: 'rgba(255, 255, 255, 0.01)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.03)',
            color: 'var(--text-dim)',
            fontSize: '0.88rem',
            lineHeight: '1.5'
          }}>
            <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>🔥</span>
            No wins recorded yet — but they're training hard and ready to claim their first trophy!
          </div>
        )}

      </motion.div>
    </motion.div>
  );
}
