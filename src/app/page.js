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
        <header style={{ textAlign: 'center', marginBottom: '5rem', marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Reveal>
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: '1rem', lineHeight: 1.1, textAlign: 'center' }}
            >
              Housing <span className="vibrant-gradient-text">Grand Finale</span>
            </motion.h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', fontWeight: '500', textAlign: 'center' }}>The Battle for Ultimate Glory</p>
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

                <TeamChart results={results} teams={teams} members={members} />
                
                <div style={{ 
                  position: 'relative',
                  width: '100%',
                  height: '500px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                  background: '#0a0a0c',
                  marginTop: '3rem'
                }}>
                  {(() => {
                    const fikrTeam = teams.find(t => t.Team_Name.toUpperCase() === 'FIKR') || teams[0] || { Team_Name: 'FIKR', Total_Points: 0 };
                    const noorTeam = teams.find(t => t.Team_Name.toUpperCase() === 'NOOR') || teams[1] || { Team_Name: 'NOOR', Total_Points: 0 };

                    return (
                      <>
                        {/* Left Side - FIKR (Blue) */}
                        <div style={{
                          position: 'absolute',
                          left: 0, top: 0, bottom: 0,
                          width: '53%',
                          background: 'linear-gradient(135deg, #0b132b, #1c2541)',
                          clipPath: 'polygon(0 0, 100% 0, 87% 100%, 0 100%)',
                          zIndex: 1,
                          overflow: 'hidden'
                        }}>
                          {/* Leader Image */}
                          <img 
                            src="/images/team_leader_b.png" 
                            alt="FIKR Leader" 
                            style={{
                              position: 'absolute',
                              bottom: '-10px',
                              left: '42%',
                              transform: 'translateX(-50%)',
                              height: '82%',
                              objectFit: 'contain',
                              zIndex: 1,
                              filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.6))'
                            }}
                          />
                          {/* Dark vignette to blend bottom */}
                          <div style={{
                            position: 'absolute', inset: 0, zIndex: 2,
                            background: 'linear-gradient(0deg, rgba(10,10,15,0.8) 0%, rgba(10,10,15,0) 40%)'
                          }} />
                          
                          {/* Text elements */}
                          <div style={{
                            position: 'absolute',
                            top: '12%',
                            left: '38%',
                            transform: 'translateX(-50%)',
                            zIndex: 3,
                            textAlign: 'center'
                          }}>
                            <div style={{
                              background: 'white',
                              color: 'black',
                              padding: '0.4rem 2.2rem',
                              borderRadius: '12px',
                              fontWeight: '900',
                              fontSize: '1.2rem',
                              letterSpacing: '0.05em',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                              textTransform: 'uppercase'
                            }}>
                              {fikrTeam.Team_Name}
                            </div>
                          </div>

                          <div style={{
                            position: 'absolute',
                            bottom: '8%',
                            left: '38%',
                            transform: 'translateX(-50%)',
                            zIndex: 3,
                            color: 'white',
                            fontSize: 'clamp(4.5rem, 10vw, 7.5rem)',
                            fontWeight: '950',
                            fontFamily: 'Impact, sans-serif',
                            letterSpacing: '-0.02em',
                            textShadow: '0 4px 20px rgba(0,0,0,0.8)'
                          }}>
                            <CountUp end={fikrTeam.Total_Points} />
                          </div>
                        </div>

                        {/* Right Side - NOOR (Purple) */}
                        <div style={{
                          position: 'absolute',
                          right: 0, top: 0, bottom: 0,
                          width: '53%',
                          background: 'linear-gradient(135deg, #4c0519, #881337)',
                          clipPath: 'polygon(13% 0, 100% 0, 100% 100%, 0 100%)',
                          zIndex: 1,
                          overflow: 'hidden'
                        }}>
                          {/* Leader Image */}
                          <img 
                            src="/images/team_leader_a.png" 
                            alt="NOOR Leader" 
                            style={{
                              position: 'absolute',
                              bottom: '-10px',
                              right: '42%',
                              transform: 'translateX(50%)',
                              height: '82%',
                              objectFit: 'contain',
                              zIndex: 1,
                              filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.6))'
                            }}
                          />
                          {/* Dark vignette to blend bottom */}
                          <div style={{
                            position: 'absolute', inset: 0, zIndex: 2,
                            background: 'linear-gradient(0deg, rgba(10,10,15,0.8) 0%, rgba(10,10,15,0) 40%)'
                          }} />

                          {/* Text elements */}
                          <div style={{
                            position: 'absolute',
                            top: '12%',
                            right: '38%',
                            transform: 'translateX(50%)',
                            zIndex: 3,
                            textAlign: 'center'
                          }}>
                            <div style={{
                              background: 'white',
                              color: 'black',
                              padding: '0.4rem 2.2rem',
                              borderRadius: '12px',
                              fontWeight: '900',
                              fontSize: '1.2rem',
                              letterSpacing: '0.05em',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                              textTransform: 'uppercase'
                            }}>
                              {noorTeam.Team_Name}
                            </div>
                          </div>

                          <div style={{
                            position: 'absolute',
                            bottom: '8%',
                            right: '38%',
                            transform: 'translateX(50%)',
                            zIndex: 3,
                            color: 'white',
                            fontSize: 'clamp(4.5rem, 10vw, 7.5rem)',
                            fontWeight: '950',
                            fontFamily: 'Impact, sans-serif',
                            letterSpacing: '-0.02em',
                            textShadow: '0 4px 20px rgba(0,0,0,0.8)'
                          }}>
                            <CountUp end={noorTeam.Total_Points} />
                          </div>
                        </div>

                        {/* Lightning Bolt Divider */}
                        <div style={{
                          position: 'absolute',
                          top: '-15%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          height: '130%',
                          width: '120px',
                          zIndex: 10,
                          pointerEvents: 'none'
                        }}>
                          <svg viewBox="0 0 100 200" fill="#facc15" style={{
                            width: '100%',
                            height: '100%',
                            filter: 'drop-shadow(0 0 25px rgba(250,204,21,0.8)) drop-shadow(0 0 10px rgba(250,204,21,0.5))'
                          }}>
                            <polygon points="65,0 20,110 52,110 35,200 80,90 48,90" />
                          </svg>
                        </div>
                      </>
                    );
                  })()}
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
