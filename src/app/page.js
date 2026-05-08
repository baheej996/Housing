'use client';
import { useGlobalData } from '@/components/DataProvider';

export default function Home() {
  const { teams, members, results, programs, loading } = useGlobalData();

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

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      {upcoming.length > 0 && (
        <div style={{ 
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          marginBottom: '3rem',
          position: 'relative'
        }}>
          <div style={{ background: 'linear-gradient(90deg, #121215 80%, transparent)', padding: '1rem 2rem', zIndex: '10', position: 'relative', fontWeight: 'bold' }}>
            <span className="gradient-text">UPCOMING</span>
          </div>
          <div className="marquee" style={{ zIndex: '1' }}>
            {[...upcoming, ...upcoming].map((p, i) => (
              <span key={i} style={{ whiteSpace: 'nowrap', fontWeight: '500' }}>⚡ {p.Program_Name}</span>
            ))}
          </div>
        </div>
      )}

      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Housing <span className="gradient-text">Grand Finale</span></h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Event Overview & Standings</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <section className="glass-card">
          <h2 style={{ marginBottom: '2rem' }}>🛡️ Team <span className="gradient-text">Standings</span></h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {teams.map((team, i) => (
              <div key={i} className="leaderboard-item">
                <span>{i + 1}. {team.Team_Name}</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>{team.Total_Points} pts</span>
              </div>
            ))}
          </div>
        </section>

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

        <section className="glass-card">
          <h2 style={{ marginBottom: '2rem' }}>⭐ Top <span className="gradient-text">Performers</span></h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {members.slice(0, 5).map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{i + 1}. {m.Member_Name}</span>
                <span style={{ color: 'var(--accent-primary)' }}>{m.Individual_Points} pts</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
