'use client';
import { useGlobalData } from '@/components/DataProvider';

export default function ResultsPage() {
  const { results, members, teams, loading } = useGlobalData();

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Results...</div>;

  // Group by program
  const grouped = {};
  results.forEach(r => {
    if (!grouped[r.Program_ID]) grouped[r.Program_ID] = [];
    grouped[r.Program_ID].push(r);
  });

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Hall of <span className="gradient-text">Fame</span></h1>
        <p style={{ color: 'var(--text-dim)' }}>Complete history of program winners</p>
      </header>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {Object.entries(grouped).reverse().map(([programName, winners], index) => (
          <section key={index} className="glass-card">
            <h2 style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
              {programName}
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {winners.sort((a,b) => (a.Position || '').localeCompare(b.Position || '')).map((w, i) => {
                const member = members.find(m => m.Member_Name === w.Winner_ID);
                const teamName = member ? member.Team_ID : (teams.some(t => t.Team_Name === w.Winner_ID) ? w.Winner_ID : '');
                
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>
                        {w.Position === '1st' ? '🥇' : w.Position === '2nd' ? '🥈' : '🥉'}
                      </span>
                      <div>
                        <div style={{ fontWeight: '600' }}>{w.Winner_ID}</div>
                        {teamName && teamName !== w.Winner_ID && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{teamName}</div>
                        )}
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
                      +{w.Points_Awarded} pts
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
