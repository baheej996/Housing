'use client';
import { useState } from 'react';
import { useGlobalData } from '@/components/DataProvider';
import { Reveal, Tilt } from '@/components/Animate';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProgramsPage() {
  const { programs, results, settings, loading } = useGlobalData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  if (loading) {
    return (
      <div style={{ 
        height: '60vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '1rem',
        color: 'var(--text-dim)'
      }}>
        <div className="loader-mini" style={{ width: '32px', height: '32px', borderWidth: '2px' }} />
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '0.9rem', letterSpacing: '0.05em' }}>LOADING PROGRAMS...</p>
      </div>
    );
  }

  const completedIds = new Set(results.map(r => r.Program_ID));
  const query = search.toLowerCase();

  const filtered = programs.filter(p => {
    const matchesSearch = !query || p.Program_Name?.toLowerCase().includes(query) || p.Category?.toLowerCase().includes(query);
    const isDone = completedIds.has(p.Program_Name);
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'done' && isDone) || (filterStatus === 'pending' && !isDone);
    return matchesSearch && matchesStatus;
  });

  // Group results by program
  const resultsByProgram = {};
  results.forEach(r => {
    if (!resultsByProgram[r.Program_ID]) resultsByProgram[r.Program_ID] = [];
    resultsByProgram[r.Program_ID].push(r);
  });

  return (
    <main style={{ padding: '4rem 5% 10rem 5%', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '20%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
        filter: 'blur(70px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      <header style={{ marginBottom: '4rem', textAlign: 'left' }}>
        <Reveal>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '800',
            fontSize: '0.78rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--accent-primary)',
            marginBottom: '0.8rem',
            display: 'inline-block'
          }}>
            TOURNAMENT SCHEDULE
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', 
            fontWeight: '900',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.04em',
            lineHeight: '1',
            marginBottom: '1.2rem'
          }}>
            EVENT <span className="vibrant-gradient-text">SCHEDULE</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.8rem',
            marginTop: '1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '0.6rem 1.2rem',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.03)',
            width: 'fit-content',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              📅 <strong style={{ color: '#fff' }}>{programs.length}</strong> Programs
            </span>
            <span style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.08)', alignSelf: 'center' }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              🥇 <strong style={{ color: 'var(--accent-primary)' }}>{completedIds.size}</strong> Completed
            </span>
            <span style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.08)', alignSelf: 'center' }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              ⏳ <strong style={{ color: 'var(--accent-sporty)' }}>{programs.length - completedIds.size}</strong> Pending
            </span>
          </div>
        </Reveal>
      </header>

      {/* Search & Filter bar combined */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem', 
        marginBottom: '3rem' 
      }}>
        {/* Search Input */}
        <Reveal delay={0.2}>
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ 
              position: 'absolute', 
              left: '1.4rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: isFocused ? 'var(--accent-primary)' : 'var(--text-dim)', 
              pointerEvents: 'none',
              transition: 'color 0.3s ease'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search by event name or category..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{ 
                width: '100%', 
                background: 'rgba(10, 10, 14, 0.6)', 
                backdropFilter: 'blur(20px)',
                border: isFocused ? '1px solid rgba(0, 229, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)', 
                borderRadius: '16px', 
                padding: '1.1rem 1.5rem 1.1rem 3.5rem', 
                color: 'white', 
                fontSize: '1rem', 
                outline: 'none',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isFocused ? '0 0 30px rgba(0, 229, 255, 0.12), inset 0 1px 1px rgba(255,255,255,0.05)' : '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255,255,255,0.02)'
              }}
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                style={{ 
                  position: 'absolute', 
                  right: '1.2rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'rgba(255, 255, 255, 0.08)', 
                  border: 'none', 
                  color: 'white', 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  cursor: 'pointer', 
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
              >
                ×
              </button>
            )}
          </div>
        </Reveal>

        {/* Filter Chips - Liquid Morphing tabs */}
        <Reveal delay={0.25}>
          <div style={{ 
            display: 'flex', 
            gap: '0.4rem', 
            background: 'rgba(10,10,14,0.6)', 
            backdropFilter: 'blur(20px)',
            padding: '0.4rem', 
            borderRadius: '50px', 
            border: '1px solid rgba(255,255,255,0.04)', 
            width: 'fit-content',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}>
            {[
              ['all', 'All Events'], 
              ['pending', '⏳ Pending'], 
              ['done', '🏆 Completed']
            ].map(([val, label]) => {
              const isSel = filterStatus === val;
              return (
                <button 
                  key={val} 
                  onClick={() => setFilterStatus(val)} 
                  style={{
                    position: 'relative',
                    padding: '0.6rem 1.4rem',
                    borderRadius: '50px',
                    border: 'none',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontWeight: '700',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: 'transparent',
                    color: isSel ? '#050507' : 'var(--text-dim)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.02em'
                  }}
                >
                  {isSel && (
                    <motion.span
                      layoutId="activeTab"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, var(--accent-primary), #00d2ff)',
                        borderRadius: '50px',
                        zIndex: 0,
                        boxShadow: '0 4px 15px rgba(0, 229, 255, 0.25)'
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* Program list */}
      {filtered.length === 0 ? (
        <Reveal delay={0.3}>
          <div style={{ 
            textAlign: 'center', 
            color: 'var(--text-dim)', 
            padding: '5rem 2rem', 
            background: 'var(--bg-card)', 
            borderRadius: '24px', 
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(25px)'
          }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1.2rem' }}>🔎</span>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.6rem', fontFamily: 'var(--font-display)', fontWeight: '800' }}>NO EVENTS FOUND</h3>
            <p style={{ fontSize: '0.92rem', maxWidth: '350px', margin: '0 auto', lineHeight: '1.5' }}>No events match your criteria. Try searching for other categories or check back later!</p>
          </div>
        </Reveal>
      ) : (
        <div style={{ display: 'grid', gap: '1.2rem' }}>
          {filtered.map((p, i) => {
            const isDone = completedIds.has(p.Program_Name);
            const prefix = p.Category === 'Group' ? 'Grp' : (p.Category?.toLowerCase() === 'specials' ? 'Special' : 'Ind');
            const isOpen = expanded === p.Program_Name;
            const winners = (resultsByProgram[p.Program_Name] || []).sort((a,b) => (a.Position||'').localeCompare(b.Position||''));

            return (
              <Reveal key={p.Program_Name} delay={Math.min(i * 0.04, 0.4)}>
                <Tilt>
                  <div 
                    onClick={() => setExpanded(isOpen ? null : p.Program_Name)}
                    className="glass-card"
                    style={{
                      borderLeft: `4px solid ${isDone ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      padding: '1.8rem',
                      background: isOpen ? 'rgba(255, 255, 255, 0.03)' : 'var(--bg-card)',
                      borderColor: isOpen ? 'rgba(0, 229, 255, 0.25)' : 'var(--glass-border)',
                      boxShadow: isOpen ? '0 20px 40px rgba(0, 229, 255, 0.08)' : '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                  >
                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.22rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>{p.Program_Name}</h3>
                          <span style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: '800', 
                            letterSpacing: '0.05em', 
                            textTransform: 'uppercase',
                            background: p.Category === 'Group' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(168, 85, 247, 0.12)',
                            color: p.Category === 'Group' ? '#a5b4fc' : '#f472b6',
                            border: p.Category === 'Group' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(168, 85, 247, 0.2)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '50px'
                          }}>
                            {p.Category}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.85rem' }}>
                          <span style={{ 
                            color: isDone ? 'var(--accent-primary)' : 'var(--accent-sporty)', 
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}>
                            {isDone ? '🏆 Concluded' : '⚡ Upcoming'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dim)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>🥇 <strong style={{ color: '#fff' }}>{settings[`${prefix}_1st`] || 0}</strong></span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>🥈 <strong style={{ color: '#fff' }}>{settings[`${prefix}_2nd`] || 0}</strong></span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>🥉 <strong style={{ color: '#fff' }}>{settings[`${prefix}_3rd`] || 0}</strong></span>
                        </div>
                        <span style={{ 
                          fontSize: '0.78rem', 
                          color: 'var(--text-dim)', 
                          fontWeight: '700', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          {isOpen ? '▲ Hide' : '▼ Details'}
                        </span>
                      </div>
                    </div>

                    {/* Expandable section with Framer Motion AnimatePresence height */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: 'hidden' }}
                          onClick={e => e.stopPropagation()}
                        >
                          <div style={{ marginTop: '1.6rem', paddingTop: '1.6rem', borderTop: '1px solid var(--glass-border)' }}>
                            {isDone ? (
                              <div style={{ display: 'grid', gap: '0.8rem' }}>
                                <p style={{ 
                                  fontSize: '0.75rem', 
                                  color: 'var(--text-dim)', 
                                  fontWeight: '800', 
                                  letterSpacing: '0.12em', 
                                  textTransform: 'uppercase',
                                  marginBottom: '0.2rem' 
                                }}>
                                  OFFICIAL STANDINGS
                                </p>
                                {winners.map((w, wi) => (
                                  <motion.div 
                                    key={wi}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: wi * 0.08 }}
                                    style={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      alignItems: 'center', 
                                      padding: '0.9rem 1.4rem', 
                                      background: 'rgba(255,255,255,0.02)', 
                                      borderRadius: '14px', 
                                      border: '1px solid rgba(255,255,255,0.04)',
                                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)'
                                    }}
                                    onMouseOver={e => {
                                      e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.2)';
                                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    }}
                                    onMouseOut={e => {
                                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                    }}
                                  >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                      <span style={{ 
                                        fontSize: '1.1rem',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: w.Position === '1st' ? 'rgba(255, 215, 0, 0.1)' : (w.Position === '2nd' ? 'rgba(192, 192, 192, 0.1)' : 'rgba(205, 127, 50, 0.1)'),
                                        border: w.Position === '1st' ? '1px solid #ffd700' : (w.Position === '2nd' ? '1px solid #c0c0c0' : '1px solid #cd7f32')
                                      }}>{w.Position === '1st' ? '🥇' : w.Position === '2nd' ? '🥈' : '🥉'}</span>
                                      <span style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.96rem' }}>{w.Winner_ID}</span>
                                    </span>
                                    <span style={{ 
                                      color: 'var(--accent-primary)', 
                                      fontWeight: '800', 
                                      fontSize: '0.98rem',
                                      textShadow: '0 0 10px rgba(0, 229, 255, 0.2)' 
                                    }}>
                                      +{w.Points_Awarded} <span style={{ fontSize: '0.75rem', fontWeight: '500', opacity: 0.8 }}>pts</span>
                                    </span>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>⏳</div>
                                <h4 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.3rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>RESULTS PENDING</h4>
                                <p style={{ fontSize: '0.85rem', maxWidth: '300px', margin: '0 auto', lineHeight: '1.5' }}>This program has not concluded. Standings and points will show up here once published by referees.</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      )}
    </main>
  );
}
