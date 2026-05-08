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
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Housing <span className="gradient-text">Grand Finale</span></h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Event Overview & Standings</p>
        </header>

        <PhotoGallery photos={photos} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Team Standings */}
        <section className="glass-card">
          <h2 style={{ marginBottom: '2rem' }}>🛡️ Team <span className="gradient-text">Standings</span></h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {teams.map((team, i) => (
              <div key={i} className="leaderboard-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className={`rank-badge ${i < 3 ? `rank-${i+1}` : ''}`} style={i >= 3 ? { background: 'rgba(255,255,255,0.08)', color: 'var(--text-dim)' } : {}}>
                    {i + 1}
                  </div>
                  <span style={{ fontWeight: '600' }}>{team.Team_Name}</span>
                </div>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>{team.Total_Points} pts</span>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Results */}
        <section className="glass-card">
          <h2 style={{ marginBottom: '2rem' }}>🎉 Latest <span className="gradient-text">Results</span></h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {recentResults.slice(0, 5).map(([name, winners], i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>{name}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>
                  🥇 {winners.find(w => w.Position === '1st')?.Winner_ID || 'TBD'}
                </span>
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
