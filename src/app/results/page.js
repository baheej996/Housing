'use client';
import { useState } from 'react';
import { useGlobalData } from '@/components/DataProvider';
import { Reveal, Tilt } from '@/components/Animate';
import { motion } from 'framer-motion';

export default function ResultsPage() {
  const { resultsByProgram = {}, members, teams, results, loading } = useGlobalData();
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  if (loading && Object.keys(resultsByProgram).length === 0) {
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
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '0.9rem', letterSpacing: '0.05em' }}>COMPILING HALL OF FAME...</p>
      </div>
    );
  }

  // Filter: match program name OR winner name
  const query = search.toLowerCase();
  const filteredGroups = Object.entries(resultsByProgram).reverse().filter(([programName, winners]) => {
    if (!query) return true;
    if (programName.toLowerCase().includes(query)) return true;
    return winners.some(w => w.Winner_ID?.toLowerCase().includes(query));
  });

  return (
    <main style={{ padding: '4rem 5% 10rem 5%', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
        filter: 'blur(80px)',
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
            VICTORIES & MILESTONES
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', 
            fontWeight: '900',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.04em',
            lineHeight: '1',
            marginBottom: '1.2rem'
          }}>
            HALL OF <span className="vibrant-gradient-text">CHAMPIONS</span>
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
              🏆 <strong style={{ color: '#fff' }}>{filteredGroups.length}</strong> Completed Tournaments
            </span>
            <span style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.08)', alignSelf: 'center' }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              🎖️ <strong style={{ color: 'var(--accent-primary)' }}>{results.length}</strong> Podiums Awarded
            </span>
          </div>
        </Reveal>
      </header>

      {/* Search Input */}
      <Reveal delay={0.2}>
        <div style={{ position: 'relative', width: '100%', marginBottom: '3.5rem' }}>
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
            placeholder="Search by event title or champion name..."
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

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <Reveal delay={0.25}>
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
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.6rem', fontFamily: 'var(--font-display)', fontWeight: '800' }}>NO RESULTS MATCHING "{search}"</h3>
            <p style={{ fontSize: '0.92rem', maxWidth: '350px', margin: '0 auto', lineHeight: '1.5' }}>Try looking up a different tournament name or check back for newly published results.</p>
          </div>
        </Reveal>
      )}

      {/* Results grid list */}
      <div style={{ display: 'grid', gap: '2.5rem' }}>
        {filteredGroups.map(([programName, winners], index) => (
          <Reveal key={programName} delay={Math.min(index * 0.05, 0.4)}>
            <section className="glass-card" style={{ padding: '2.2rem', position: 'relative', overflow: 'visible' }}>
              
              {/* Subtle inner corner glowing lighting */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(0, 229, 255, 0.04) 0%, transparent 70%)',
                filter: 'blur(15px)',
                zIndex: -1,
                pointerEvents: 'none'
              }} />

              <h2 style={{ 
                color: 'var(--accent-primary)', 
                marginBottom: '2rem', 
                borderBottom: '1px solid var(--glass-border)', 
                paddingBottom: '1.2rem',
                fontSize: '1.45rem',
                fontFamily: 'var(--font-display)',
                fontWeight: '900',
                letterSpacing: '-0.02em',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>🏅 {programName}</span>
                <span style={{ 
                  fontSize: '0.72rem', 
                  color: 'var(--text-dim)', 
                  fontWeight: '600', 
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '50px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  CONCLUDED
                </span>
              </h2>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {winners.sort((a,b) => (a.Position || '').localeCompare(b.Position || '')).map((w, i) => {
                  const member = members.find(m => m.Member_Name === w.Winner_ID);
                  const teamName = member ? member.Team_ID : (teams.some(t => t.Team_Name === w.Winner_ID) ? w.Winner_ID : '');
                  
                  // Faction Colors for border and subtle backgrounds
                  const isNoor = teamName?.toUpperCase() === 'NOOR';
                  const teamColor = isNoor ? 'rgba(0, 229, 255, 0.25)' : 'rgba(99, 102, 241, 0.25)';
                  
                  return (
                    <Tilt key={i}>
                      <div 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          padding: '1rem 1.5rem',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid rgba(255,255,255,0.03)',
                          borderRadius: '16px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.borderColor = teamColor;
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                          <span style={{ 
                            fontSize: '1.1rem',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: w.Position === '1st' ? 'rgba(255, 215, 0, 0.12)' : (w.Position === '2nd' ? 'rgba(192, 192, 192, 0.12)' : 'rgba(205, 127, 50, 0.12)'),
                            border: w.Position === '1st' ? '1px solid #ffd700' : (w.Position === '2nd' ? '1px solid #c0c0c0' : '1px solid #cd7f32'),
                            boxShadow: w.Position === '1st' ? '0 0 15px rgba(255, 215, 0, 0.15)' : 'none'
                          }}>
                            {w.Position === '1st' ? '🥇' : w.Position === '2nd' ? '🥈' : '🥉'}
                          </span>
                          <div>
                            <div style={{ fontWeight: '800', color: '#fff', fontSize: '1rem' }}>{w.Winner_ID}</div>
                            {teamName && teamName !== w.Winner_ID && (
                              <div style={{ 
                                fontSize: '0.78rem', 
                                color: isNoor ? 'var(--accent-primary)' : 'var(--accent-secondary)', 
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginTop: '0.1rem'
                              }}>
                                🛡️ {teamName}
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{ 
                          fontWeight: '800', 
                          color: 'var(--accent-primary)',
                          fontSize: '1.05rem',
                          textShadow: '0 0 10px rgba(0, 229, 255, 0.15)'
                        }}>
                          +{w.Points_Awarded} <span style={{ fontSize: '0.78rem', fontWeight: '500', opacity: 0.8 }}>pts</span>
                        </div>
                      </div>
                    </Tilt>
                  );
                })}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
