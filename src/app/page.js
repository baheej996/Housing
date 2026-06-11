'use client';
import { useState, useEffect, useRef } from 'react';
import { useGlobalData } from '@/components/DataProvider';
import PlayerModal from '@/components/PlayerModal';
import LiveFeed from '@/components/LiveFeed';
import PhotoGallery from '@/components/PhotoGallery';
import CountUp from '@/components/CountUp';
import TeamChart from '@/components/TeamChart';
import { Reveal } from '@/components/Animate';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Home() {
  const { teams, members, results, programs, photos, loading } = useGlobalData();
  const [selectedMember, setSelectedMember] = useState(null);
  const cursorRef = useRef(null);

  // Mouse-follow glow effect tracking (Direct DOM manipulation to avoid state re-renders)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#050507',
        color: '#ffffff',
        gap: '1.5rem'
      }}>
        <div className="loader-mini" style={{ width: '40px', height: '40px', borderWidth: '3px' }} />
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>INITIALIZING GRAND FINALE...</p>
      </div>
    );
  }

  const groupedResults = {};
  const completedProgramIds = new Set();
  results.forEach(r => {
    const id = r.Program_ID || 'Unknown';
    completedProgramIds.add(id);
    if (!groupedResults[id]) groupedResults[id] = [];
    groupedResults[id].push(r);
  });
  const recentResults = Object.entries(groupedResults).reverse();
  const upcoming = programs.filter(p => !completedProgramIds.has(p.Program_Name));

  // Live Feed: Build commentary from latest results
  const feedItems = [];
  recentResults.slice(0, 5).forEach(([programName, winners]) => {
    if (programName === 'Adjustment') {
      winners.forEach(w => {
        const isPositive = parseInt(w.Points_Awarded) > 0;
        const badge = isPositive ? '✅' : '⚠️';
        const verb = isPositive ? 'awarded' : 'penalized';
        feedItems.push({
          text: `${badge} ${w.Winner_ID} was ${verb} ${w.Points_Awarded} pts [${w.Position || 'Adjustment'}]`,
          pts: w.Points_Awarded,
          pos: w.Position
        });
      });
      return;
    }

    winners.sort((a, b) => (a.Position || '').localeCompare(b.Position || '')).forEach(w => {
      const member = members.find(m => m.Member_Name === w.Winner_ID);
      const teamName = member ? member.Team_ID : w.Winner_ID;
      const medal = w.Position === '1st' ? '🥇' : w.Position === '2nd' ? '🥈' : '🥉';
      const verb = w.Position === '1st' ? 'dominated' : w.Position === '2nd' ? 'clinched' : 'earned';
      feedItems.push({
        text: `${medal} ${w.Winner_ID} ${verb} ${w.Position} place in ${programName} scoring +${w.Points_Awarded} pts for ${teamName}!`,
        pts: w.Points_Awarded,
        pos: w.Position
      });
    });
  });

  const scrollToId = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main style={{ paddingBottom: '10rem', position: 'relative' }}>
      {/* Interactive mouse follow ambient circle */}
      <div 
        ref={cursorRef}
        className="cursor-glow" 
        style={{ 
          left: '-1000px', 
          top: '-1000px' 
        }} 
      />

      {selectedMember && (
        <PlayerModal
          member={selectedMember}
          results={results}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* Top ticker bar */}
      {feedItems.length > 0 && <LiveFeed items={feedItems} />}

      {/* Upcoming strip - full width, no box */}
      {upcoming.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(5,5,7,0.8)',
          backdropFilter: 'blur(20px)',
          padding: '0.6rem 0',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            position: 'relative',
            zIndex: 2,
            padding: '0.4rem 1.5rem 0.4rem 5%',
            background: 'linear-gradient(90deg, #050507 80%, transparent)',
            flexShrink: 0
          }}>
            <span style={{
              fontWeight: '800',
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              color: 'var(--accent-primary)',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-display)'
            }}>Upcoming Events</span>
          </div>
          <div className="marquee" style={{ zIndex: 1 }}>
            {[...upcoming, ...upcoming].map((p, i) => (
              <span key={i} style={{ whiteSpace: 'nowrap', fontWeight: '600', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                ⚡ {p.Program_Name} <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: '500' }}>({p.Category})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Apple-style Cinematic Hero Section */}
      <section style={{
        minHeight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 5% 1.5rem 5%',
        position: 'relative',
        zIndex: 5,
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Dynamic floating light circles */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: -1
        }} />

        <Reveal>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '800',
            fontSize: '0.85rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--accent-primary)',
            marginBottom: '1.5rem',
            display: 'inline-block',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            padding: '0.4rem 1.2rem',
            borderRadius: '50px',
            background: 'rgba(0, 229, 255, 0.03)',
            backdropFilter: 'blur(10px)'
          }}>
            HOUSING GRAND FINAL 2026
          </span>
        </Reveal>

        <Reveal delay={0.2}>
          <h1 style={{
            fontSize: 'clamp(3rem, 9vw, 6.5rem)',
            fontWeight: '900',
            lineHeight: '0.95',
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(to bottom, #ffffff 40%, #a2b4c7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            THE BATTLE FOR<br />
            <span className="vibrant-gradient-text">ULTIMATE GLORY</span>
          </h1>
        </Reveal>


        {/* Minimal Hero Stats / SaaS Metrics Widget */}
        <Reveal delay={0.5}>
          <div className="hero-stats-widget">
            <div className="stat-item">
              <div className="stat-value">
                2 <span style={{ color: 'var(--accent-primary)' }}>ELITE</span>
              </div>
              <div className="stat-label">COMPETING TEAMS</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">
                {results.length} <span style={{ color: 'var(--accent-secondary)' }}>LIVE</span>
              </div>
              <div className="stat-label">COMPLETED EVENTS</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">
                {photos.length} <span style={{ color: 'var(--accent-sporty)' }}>HD</span>
              </div>
              <div className="stat-label">GALLERY ASSETS</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Speed Line Divider */}
      <div className="speed-divider" />

      <div style={{ padding: '0 5%' }}>
        {/* 1. Score Board File with Dynamic Overlays - Fully Released & Larger */}
        <span id="scoreboard" style={{ display: 'block', height: '1px', marginTop: '-2rem' }} />
        <Reveal delay={0.2}>
          <div style={{ 
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto 6rem auto'
          }}>
            {(() => {
              const fikrTeam = teams.find(t => t.Team_Name.toUpperCase() === 'FIKR') || teams[0] || { Team_Name: 'FIKR', Total_Points: 0 };
              const noorTeam = teams.find(t => t.Team_Name.toUpperCase() === 'NOOR') || teams[1] || { Team_Name: 'NOOR', Total_Points: 0 };

              return (
                <>
                  <img 
                    src="/score board.png" 
                    alt="Championship Scoreboard" 
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  {/* Dynamic Overlay for Left Score (NOOR) */}
                  <div style={{
                    position: 'absolute',
                    bottom: '7.5%',
                    left: '25.5%',
                    transform: 'translateX(-50%)',
                    color: '#ffffff',
                    fontSize: 'clamp(3.5rem, 8vw, 6rem)',
                    fontWeight: '950',
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    textAlign: 'center',
                    zIndex: 5,
                    textShadow: '0 4px 15px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)'
                  }}>
                    <CountUp end={noorTeam.Total_Points} />
                    {noorTeam.Plus_Minus !== 0 && (
                      <div style={{ fontSize: 'clamp(0.8rem, 2vw, 1.2rem)', fontWeight: '700', fontFamily: 'var(--font-sans)', color: noorTeam.Plus_Minus > 0 ? '#4ade80' : '#ef4444', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
                        {noorTeam.Plus_Minus > 0 ? '+' : ''}{noorTeam.Plus_Minus} pts adj.
                      </div>
                    )}
                  </div>
                  {/* Dynamic Overlay for Right Score (FIKR) */}
                  <div style={{
                    position: 'absolute',
                    bottom: '7.5%',
                    right: '25.5%',
                    transform: 'translateX(50%)',
                    color: '#ffffff',
                    fontSize: 'clamp(3.5rem, 8vw, 6rem)',
                    fontWeight: '950',
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    textAlign: 'center',
                    zIndex: 5,
                    textShadow: '0 4px 15px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)'
                  }}>
                    <CountUp end={fikrTeam.Total_Points} />
                    {fikrTeam.Plus_Minus !== 0 && (
                      <div style={{ fontSize: 'clamp(0.8rem, 2vw, 1.2rem)', fontWeight: '700', fontFamily: 'var(--font-sans)', color: fikrTeam.Plus_Minus > 0 ? '#4ade80' : '#ef4444', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
                        {fikrTeam.Plus_Minus > 0 ? '+' : ''}{fikrTeam.Plus_Minus} pts adj.
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </Reveal>

        {/* 2. Graph Chart of Teams - Fully Released & Larger */}
        <Reveal delay={0.3}>
          <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto 6rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '0.6rem', fontFamily: 'var(--font-display)' }}>🏆 Championship <span className="vibrant-gradient-text">Race</span></h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '1rem', fontWeight: '500' }}>Cumulative point progression over the tournament</p>
            </div>
            <TeamChart results={results} teams={teams} members={members} />
          </div>
        </Reveal>

        {/* Speed Line Divider */}
        <div className="speed-divider" />

        {/* 2-Column Responsive Section Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '3rem',
          maxWidth: '1200px',
          margin: '0 auto 6rem auto'
        }}>
          {/* Latest Results - Vibrant Refresh */}
          <section>
            <Reveal>
              <div className="glass-card">
                <h2 style={{ marginBottom: '2.2rem', fontSize: '1.6rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🎉 Latest <span className="vibrant-gradient-text">Results</span>
                </h2>
                <div style={{ display: 'grid', gap: '1.2rem' }}>
                  {recentResults.slice(0, 5).map(([name, winners], i) => (
                    <Reveal key={i} delay={0.1 * i} y={20}>
                      <div style={{ 
                        background: 'rgba(255,255,255,0.01)', 
                        padding: '1.3rem', 
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.02)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.2)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.02)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                      }}
                      >
                        <div>
                          <h3 style={{ fontSize: '0.98rem', marginBottom: '0.4rem', fontWeight: '700', color: '#ffffff' }}>{name}</h3>
                          {name === 'Adjustment' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontSize: '1.1rem' }}>⚖️</span>
                              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                                {winners.map(w => w.Winner_ID).join(', ')}
                              </span>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontSize: '1.1rem' }}>🥇</span>
                              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                                {winners.find(w => w.Position === '1st')?.Winner_ID || 'TBD'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'right', opacity: 0.4 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>

          {/* Top Performers */}
          <section>
            <Reveal delay={0.2}>
              <div className="glass-card">
                <h2 style={{ marginBottom: '2.2rem', fontSize: '1.6rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🔥 Top <span className="vibrant-gradient-text">Performers</span>
                </h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {members.sort((a, b) => (b.Individual_Points || 0) - (a.Individual_Points || 0)).slice(0, 5).map((m, i) => (
                    <Reveal key={i} delay={0.1 * i} y={20}>
                      <div 
                        onClick={() => setSelectedMember(m)}
                        style={{ 
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                          padding: '0.9rem 1.2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', 
                          cursor: 'pointer', border: '1px solid rgba(255,255,255,0.02)', transition: 'all 0.3s ease'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.2)';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.02)';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff' }}>{m.Member_Name}</div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: '600' }}>({m.Team_ID})</span>
                          {m.Plus_Minus !== 0 && (
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.1rem 0.3rem', borderRadius: '4px', background: m.Plus_Minus > 0 ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: m.Plus_Minus > 0 ? '#4ade80' : '#ef4444' }}>
                              {m.Plus_Minus > 0 ? '+' : ''}{m.Plus_Minus}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.95rem' }}>
                            <CountUp end={m.Individual_Points} /> <span style={{ fontSize: '0.75rem', fontWeight: '500', opacity: 0.8 }}>pts</span>
                          </span>
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>›</span>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
                <p style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', fontWeight: '600', letterSpacing: '0.05em' }}>TAP A NAME TO VIEW TROPHY CABINET</p>
              </div>
            </Reveal>
          </section>
        </div>

        {/* Speed Line Divider */}
        <div className="speed-divider" />

        {/* 3. Photo & Video Sliding Gallery - Released at the very bottom */}
        <span id="gallery" style={{ display: 'block', height: '1px', marginTop: '-2rem' }} />
        <Reveal delay={0.4}>
          <div style={{ marginTop: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '0.6rem', fontFamily: 'var(--font-display)' }}>📸 Media <span className="vibrant-gradient-text">Gallery</span></h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '1.05rem', fontWeight: '500' }}>Captured moments and highlights from the Grand Finale</p>
            </div>
            <PhotoGallery photos={photos} />
          </div>
        </Reveal>
      </div>
    </main>
  );
}

