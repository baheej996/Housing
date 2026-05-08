'use client';
import { useState } from 'react';
import { useGlobalData } from '@/components/DataProvider';
import PlayerModal from '@/components/PlayerModal';
import LiveFeed from '@/components/LiveFeed';
import PhotoGallery from '@/components/PhotoGallery';

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
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: '1rem', lineHeight: 1.1 }}>Housing <span className="vibrant-gradient-text">Grand Finale</span></h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', fontWeight: '500' }}>The Battle for Ultimate Glory</p>
      </header>

      <PhotoGallery photos={photos} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
        {/* Team Standings - Redesigned */}
        <section className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem' }}>🛡️ Team <span className="vibrant-gradient-text">Standings</span></h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '50px' }}>
              Live Rankings
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {teams.map((team, i) => {
              const maxPoints = teams[0]?.Total_Points || 1;
              const percentage = Math.max(10, (team.Total_Points / maxPoints) * 100);
              
              return (
                <div key={i} className="leaderboard-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1.2rem', padding: '1.5rem 2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                      <div className={`rank-badge ${i < 3 ? `rank-${i+1}` : ''}`} style={i >= 3 ? { background: 'rgba(255,255,255,0.08)', color: 'var(--text-dim)' } : {}}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{team.Team_Name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: '900', color: i === 0 ? 'var(--gold)' : 'white' }}>{team.Total_Points}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginLeft: '0.4rem', fontWeight: '600' }}>PTS</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${percentage}%`, 
                      height: '100%', 
                      background: i === 0 ? 'linear-gradient(90deg, var(--accent-primary), var(--accent-vibrant))' : 'rgba(255,255,255,0.2)',
                      borderRadius: '10px',
                      transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Latest Results - Vibrant Refresh */}
        <section className="glass-card">
          <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>🎉 Latest <span className="vibrant-gradient-text">Results</span></h2>
          <div style={{ display: 'grid', gap: '1.2rem' }}>
            {recentResults.slice(0, 5).map(([name, winners], i) => (
              <div key={i} style={{ 
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
            ))}
          </div>
        </section>

        {/* Top Performers — clickable */}
        <section className="glass-card">
          <h2 style={{ marginBottom: '2rem' }}>⭐ Top <span className="gradient-text">Performers</span></h2>
          <div style={{ display: 'grid', gap: '0.8rem' }}>
            {members.slice(0, 5).map((m, i) => (
              <div
                key={i}
                onClick={() => setSelectedMember(m)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.7rem 1rem',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid transparent',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ color: 'var(--text-dim)', width: '20px', textAlign: 'center' }}>{i + 1}.</span>
                  <span style={{ fontWeight: '500' }}>{m.Member_Name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>({m.Team_ID})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{m.Individual_Points} pts</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>›</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center' }}>Tap a name to view Trophy Cabinet</p>
        </section>
      </div>
      </div>
    </main>
  );
}
