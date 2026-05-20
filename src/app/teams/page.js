'use client';
import { useState } from 'react';
import { useGlobalData } from '@/components/DataProvider';
import PlayerModal from '@/components/PlayerModal';
import CountUp from '@/components/CountUp';
import { Reveal, Tilt } from '@/components/Animate';
import { motion } from 'framer-motion';

export default function TeamsPage() {
  const { teams, members, results, loading } = useGlobalData();
  const [selectedMember, setSelectedMember] = useState(null);

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
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '0.9rem', letterSpacing: '0.05em' }}>PREPARING ROSTERS...</p>
      </div>
    );
  }

  return (
    <main style={{ padding: '4rem 5% 10rem 5%', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '380px',
        height: '380px',
        background: 'radial-gradient(circle, rgba(0, 229, 255, 0.05) 0%, transparent 70%)',
        filter: 'blur(90px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '380px',
        height: '380px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)',
        filter: 'blur(90px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {selectedMember && (
        <PlayerModal
          member={selectedMember}
          results={results}
          onClose={() => setSelectedMember(null)}
        />
      )}

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
            THE ELITE FACTIONS
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', 
            fontWeight: '900',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.04em',
            lineHeight: '1',
            marginBottom: '1.2rem'
          }}>
            TEAM <span className="vibrant-gradient-text">SQUADS</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', fontWeight: '500', maxWidth: '600px', lineHeight: '1.6' }}>
            Browse through competing house squads, view captain stats, and tap any participant to unlock their official Trophy Cabinet.
          </p>
        </Reveal>
      </header>

      <div style={{ display: 'grid', gap: '4rem' }}>
        {teams.map((team, index) => {
          const teamMembers = members.filter(m => m.Team_ID === team.Team_Name)
                                    .sort((a, b) => (b.points || b.Individual_Points || 0) - (a.points || a.Individual_Points || 0));
          
          const isNoor = team.Team_Name.toUpperCase() === 'NOOR';
          
          // Custom faction colors and glows
          const factionAccent = isNoor ? 'var(--accent-primary)' : '#ec4899';
          const factionGlow = isNoor ? 'rgba(0, 229, 255, 0.15)' : 'rgba(236, 72, 153, 0.15)';
          const factionBorder = isNoor ? 'rgba(0, 229, 255, 0.18)' : 'rgba(236, 72, 153, 0.18)';
          const factionBg = isNoor ? 'rgba(5, 15, 25, 0.45)' : 'rgba(20, 5, 15, 0.45)';

          return (
            <Reveal key={team.Team_Name} delay={index * 0.1}>
              <Tilt>
                <section 
                  className="glass-card" 
                  style={{
                    background: factionBg,
                    borderColor: factionBorder,
                    boxShadow: `0 30px 60px -15px rgba(0,0,0,0.8), 0 0 4px ${factionGlow}`,
                    padding: '2.5rem',
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  
                  {/* Subtle inner faction glow backdrop blob */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '200px',
                    height: '200px',
                    background: `radial-gradient(circle, ${factionGlow} 0%, transparent 70%)`,
                    filter: 'blur(20px)',
                    zIndex: -1,
                    pointerEvents: 'none'
                  }} />

                  {/* Faction Header Banner */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '2.5rem', 
                    borderBottom: '1px solid var(--glass-border)', 
                    paddingBottom: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1.5rem'
                  }}>
                    <div>
                      <h2 
                        style={{ 
                          fontSize: '2.2rem', 
                          fontWeight: '900',
                          fontFamily: 'var(--font-display)',
                          letterSpacing: '-0.03em',
                          background: isNoor ? 'linear-gradient(135deg, #00e5ff 0%, #6366f1 100%)' : 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          marginBottom: '0.4rem',
                          textTransform: 'uppercase'
                        }}
                      >
                        {team.Team_Name}
                      </h2>
                      <span style={{ 
                        fontSize: '0.88rem', 
                        color: 'var(--text-dim)', 
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                        Captain: <strong style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>👑 {team.Captain_Name}</strong>
                      </span>
                    </div>

                    <div style={{ 
                      textAlign: 'right',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '0.8rem 1.6rem',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.04)',
                      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
                    }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>TOTAL POINTS</div>
                      <div style={{ 
                        fontSize: '2rem', 
                        fontWeight: '900', 
                        color: factionAccent,
                        fontFamily: 'var(--font-display)',
                        textShadow: `0 0 15px ${factionGlow}`
                      }}>
                        <CountUp end={team.Total_Points} />
                      </div>
                    </div>
                  </div>

                  {/* Roster Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                    gap: '1.2rem' 
                  }}>
                    {teamMembers.map((m, i) => {
                      const isCaptain = m.Member_Name === team.Captain_Name;
                      const memberPts = m.points || m.Individual_Points || 0;
                      
                      return (
                        <motion.div
                          key={m.Member_Name}
                          onClick={() => setSelectedMember(m)}
                          whileHover={{ scale: 1.04, y: -4 }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                          style={{ 
                            padding: '1.3rem', 
                            background: 'rgba(255,255,255,0.015)', 
                            borderRadius: '20px',
                            border: isCaptain ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.05)',
                            boxShadow: isCaptain ? '0 10px 25px rgba(255, 215, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.05)' : '0 6px 20px rgba(0,0,0,0.3)',
                            cursor: 'pointer',
                            transition: 'border-color 0.3s, background-color 0.3s',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            position: 'relative'
                          }}
                          onMouseOver={(e) => { 
                            e.currentTarget.style.background = isNoor ? 'rgba(0,229,255,0.04)' : 'rgba(236,72,153,0.04)'; 
                            if (!isCaptain) e.currentTarget.style.borderColor = factionAccent; 
                          }}
                          onMouseOut={(e) => { 
                            e.currentTarget.style.background = 'rgba(255,255,255,0.015)'; 
                            if (!isCaptain) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; 
                          }}
                        >
                          
                          {/* Captain crown banner badge inside card */}
                          {isCaptain && (
                            <span style={{
                              position: 'absolute',
                              top: '-10px',
                              right: '15px',
                              background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
                              color: '#000',
                              fontSize: '0.62rem',
                              fontWeight: '900',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '50px',
                              letterSpacing: '0.05em',
                              boxShadow: '0 4px 10px rgba(255, 215, 0, 0.4)'
                            }}>
                              CAPTAIN
                            </span>
                          )}

                          {/* Member Initial Avatar */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: isNoor 
                                ? 'linear-gradient(135deg, rgba(0,229,255,0.1) 0%, rgba(99,102,241,0.15) 100%)' 
                                : 'linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(168,85,247,0.15) 100%)',
                              border: `1px solid ${isCaptain ? '#ffd700' : factionAccent}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '800',
                              fontSize: '1rem',
                              color: isCaptain ? '#ffd700' : '#ffffff',
                              fontFamily: 'var(--font-display)',
                              boxShadow: isCaptain ? '0 0 10px rgba(255, 215, 0, 0.2)' : 'none'
                            }}>
                              {m.Member_Name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: '800', fontSize: '0.94rem', color: '#ffffff' }}>
                                {m.Member_Name}
                              </div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                                HOUSE {team.Team_Name}
                              </span>
                            </div>
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            borderTop: '1px solid rgba(255,255,255,0.03)',
                            paddingTop: '0.8rem',
                            marginTop: '0.2rem'
                          }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>SCORED</span>
                            <span style={{ 
                              fontSize: '0.95rem', 
                              fontWeight: '900', 
                              color: factionAccent,
                              fontFamily: 'var(--font-display)'
                            }}>
                              <CountUp end={memberPts} /> <span style={{ fontSize: '0.75rem', fontWeight: '500', opacity: 0.8, color: 'var(--text-dim)' }}>pts</span>
                            </span>
                          </div>

                          <div style={{ 
                            fontSize: '0.68rem', 
                            color: 'var(--text-dim)', 
                            fontWeight: '600',
                            textAlign: 'center',
                            opacity: 0.5,
                            marginTop: '0.2rem'
                          }}>
                            Tap to view trophy cabinet →
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              </Tilt>
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
