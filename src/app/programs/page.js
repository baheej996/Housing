'use client';
import { useGlobalData } from '@/components/DataProvider';

export default function ProgramsPage() {
  const { programs, results, settings, loading } = useGlobalData();

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Programs...</div>;

  const completedIds = new Set(results.map(r => r.Program_ID));

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Event <span className="gradient-text">Schedule</span></h1>
        <p style={{ color: 'var(--text-dim)' }}>Full list of programs and point criteria</p>
      </header>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {programs.map((p, i) => {
          const isDone = completedIds.has(p.Program_Name);
          const prefix = p.Category === 'Group' ? 'Grp' : (p.Category === 'Specials' ? 'Special' : 'Ind');
          
          return (
            <div key={i} className="glass-card" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderLeft: `4px solid ${isDone ? 'var(--success)' : 'var(--accent-primary)'}`
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{p.Program_Name}</h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--accent-secondary)' }}>🏷️ {p.Category}</span>
                  <span style={{ color: isDone ? 'var(--success)' : 'var(--gold)' }}>
                    {isDone ? '✅ Results Published' : '⏳ Pending'}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                <div style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Points Criteria</div>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <span>🥇 {settings[`${prefix}_1st`] || 0}</span>
                  <span>🥈 {settings[`${prefix}_2nd`] || 0}</span>
                  <span>🥉 {settings[`${prefix}_3rd`] || 0}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
