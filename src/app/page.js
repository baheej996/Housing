'use client';
import { useState } from 'react';
import { useGlobalData } from '@/components/DataProvider';
import PlayerModal from '@/components/PlayerModal';
import LiveFeed from '@/components/LiveFeed';
import PhotoGallery from '@/components/PhotoGallery';
import CountUp from '@/components/CountUp';
import TeamChart from '@/components/TeamChart';
import { Reveal, Tilt, Floating } from '@/components/Animate';
import { motion } from 'framer-motion';

export default function Home() {
  const { teams, members, results, programs, photos, loading } = useGlobalData();
  const [selectedMember, setSelectedMember] = useState(null);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Grand Finale...</div>;

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

  // Live Feed: Build commentary from latest results (up to 15)
  const feedItems = [];
  recentResults.slice(0, 5).forEach(([programName, winners]) => {
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

  return (
    <main style={{ paddingBottom: '8rem' }}>
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
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(10,10,15,0.6)',
          padding: '0.5rem 0',
          gap: '0',
          position: 'relative'
        }}>
          {/* Label with gradient fade — "swallows" the scrolling text */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            padding: '0.5rem 1.5rem 0.5rem 5%',
            background: 'linear-gradient(90deg, rgba(10,10,15,1) 70%, transparent)',
            flexShrink: 0
          }}>
            <span style={{
              fontWeight: '700',
              fontSize: '0.78rem',
              letterSpacing: '0.12em',
              color: 'var(--accent-primary)',
              textTransform: 'uppercase'
            }}>Upcoming</span>
          </div>
          <div className="marquee" style={{ zIndex: 1 }}>
            {[...upcoming, ...upcoming].map((p, i) => (
              <span key={i} style={{ whiteSpace: 'nowrap', fontWeight: '500', fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)' }}>
                ⚡ {p.Program_Name} <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>({p.Category})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '2rem 5%' }}>
        <header style={{ textAlign: 'center', marginBottom: '5rem', marginTop: '2rem' }}>
          <Reveal>
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: '1rem', lineHeight: 1.1 }}
            >
              Housing <span className="vibrant-gradient-text">Grand Finale</span>
            </motion.h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', fontWeight: '500' }}>The Battle for Ultimate Glory</p>
          </Reveal>
        </header>

        <Reveal delay={0.4}>
          <PhotoGallery photos={photos} />
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
          {/* Team Standings - Infographic Redesign */}
          <section style={{ gridColumn: '1 / -1' }}>
            <Reveal>
              <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>🏆 Championship <span className="vibrant-gradient-text">Race</span></h2>
                  <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>Cumulative point progression over the tournament</p>
                </div>

                <TeamChart results={results} teams={teams} />
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginTop: '3rem' }}>
                  {teams.map((team, i) => {
                    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981'];
                    const teamColor = colors[i % colors.length];
                    
                    return (
                      <Reveal key={i} delay={0.1 * i}>
                        <Tilt>
                          <div className="leaderboard-item" style={{ 
                            background: 'rgba(255,255,255,0.01)', 
                            border: `1px solid rgba(255,255,255,0.05)`,
                            borderLeft: `4px solid ${teamColor}`,
                            padding: '1.2rem 1.5rem'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                                  RANK #{i+1}
                                </div>
                                <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>{team.Team_Name}</span>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: '900', color: teamColor }}>
                                  <CountUp end={team.Total_Points} />
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginLeft: '0.3rem', fontWeight: '700' }}>PTS</span>
                              </div>
                            </div>
                          </div>
                        </Tilt>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </section>

          {/* Latest Results - Vibrant Refresh */}
          <section>
            <Reveal>
              <div className="glass-card">
                <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>🎉 Latest <span className="vibrant-gradient-text">Results</span></h2>
                <div style={{ display: 'grid', gap: '1.2rem' }}>
                  {recentResults.slice(0, 5).map(([name, winners], i) => (
                    <Reveal key={i} delay={0.1 * i} y={20}>
                      <div style={{ 
                        background: 'rgba(255,255,255,0.02)', 
                        padding: '1.2rem', 
                        borderRadius: '18px',
                        border: '1px solid rgba(255,255,255,0.04)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <h3 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', fontWeight: '700' }}>{name}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontSize: '1.1rem' }}>🥇</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-secondary)' }}>
                              {winners.find(w => w.Position === '1st')?.Winner_ID || 'TBD'}
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', opacity: 0.5 }}>
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
                <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>🔥 Top <span className="vibrant-gradient-text">Performers</span></h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {members.sort((a, b) => (b.Individual_Points || 0) - (a.Individual_Points || 0)).slice(0, 5).map((m, i) => (
                    <Reveal key={i} delay={0.1 * i} y={20}>
                      <div 
                        onClick={() => setSelectedMember(m)}
                        style={{ 
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                          padding: '0.8rem 1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.02)', 
                          cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.3s'
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                        onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}
                      >
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{m.Member_Name}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>({m.Team_ID})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
                            <CountUp end={m.Individual_Points} /> pts
                          </span>
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>›</span>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
                <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center' }}>Tap a name to view Trophy Cabinet</p>
              </div>
            </Reveal>
          </section>
        </div>
      </div>
    </main>
  );
}
