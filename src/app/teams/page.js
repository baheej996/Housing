'use client';
import { useGlobalData } from '@/components/DataProvider';

export default function TeamsPage() {
  const { teams, members, loading } = useGlobalData();

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Squads...</div>;

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Team <span className="gradient-text">Squads</span></h1>
        <p style={{ color: 'var(--text-dim)' }}>Team rosters and individual contributions</p>
      </header>

      <div style={{ display: 'grid', gap: '3rem' }}>
        {teams.map((team, index) => {
          const teamMembers = members.filter(m => m.Team_ID === team.Team_Name)
                                    .sort((a, b) => b.points - a.points);
          
          return (
            <section key={index} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <div>
                  <h2 className="gradient-text" style={{ fontSize: '1.8rem' }}>{team.Team_Name}</h2>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Captain: 👑 {team.Captain_Name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total Squad Points</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{team.Total_Points}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {teamMembers.map((m, i) => (
                  <div key={i} style={{ 
                    padding: '1rem', 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '12px',
                    border: m.Member_Name === team.Captain_Name ? '1px solid var(--gold)' : '1px solid transparent'
                  }}>
                    <div style={{ fontWeight: '500', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {m.Member_Name} {m.Member_Name === team.Captain_Name && '👑'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>{m.points} pts scored</div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
