'use client';
import { useState } from 'react';
import { useGlobalData } from '@/components/DataProvider';
import { Reveal, Tilt } from '@/components/Animate';

export default function ProgramsPage() {
  const { programs, results, settings, loading } = useGlobalData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expanded, setExpanded] = useState(null);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Programs...</div>;

  const completedIds = new Set(results.map(r => r.Program_ID));
  const query = search.toLowerCase();

  const filtered = programs.filter(p => {
    const matchesSearch = !query || p.Program_Name?.toLowerCase().includes(query) || p.Category?.toLowerCase().includes(query);
    const isDone = completedIds.has(p.Program_Name);
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'done' && isDone) || (filterStatus === 'pending' && !isDone);
    return matchesSearch && matchesStatus;
  });

  // Group results by program
  const resultsByProgram = {};
  results.forEach(r => {
    if (!resultsByProgram[r.Program_ID]) resultsByProgram[r.Program_ID] = [];
    resultsByProgram[r.Program_ID].push(r);
  });

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Reveal>
          <h1 style={{ fontSize: '2.5rem' }}>Event <span className="vibrant-gradient-text">Schedule</span></h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ color: 'var(--text-dim)' }}>{programs.length} programs · {completedIds.size} completed · {programs.length - completedIds.size} pending</p>
        </Reveal>
      </header>

      {/* Search Bar */}
      <Reveal delay={0.2}>
        <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </div>
        <input type="text" placeholder="Search programs..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '50px', padding: '0.9rem 1.2rem 0.9rem 3rem', color: 'white', fontSize: '1rem', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
        />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>×</button>}
      </div>

      {/* Filter Chips */}
      <Reveal delay={0.3}>
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem' }}>
          {[['all', 'All'], ['pending', '⏳ Pending'], ['done', '✅ Completed']].map(([val, label]) => (
            <button key={val} onClick={() => setFilterStatus(val)} style={{
              padding: '0.4rem 1rem', borderRadius: '50px', border: '1px solid', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s',
              background: filterStatus === val ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'rgba(255,255,255,0.05)',
              color: filterStatus === val ? 'white' : 'var(--text-dim)',
              borderColor: filterStatus === val ? 'transparent' : 'var(--glass-border)',
            }}>{label}</button>
          ))}
        </div>
      </Reveal>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filtered.map((p, i) => {
          const isDone = completedIds.has(p.Program_Name);
          const prefix = p.Category === 'Group' ? 'Grp' : (p.Category?.toLowerCase() === 'specials' ? 'Special' : 'Ind');
          const isOpen = expanded === p.Program_Name;
          const winners = (resultsByProgram[p.Program_Name] || []).sort((a,b) => (a.Position||'').localeCompare(b.Position||''));

          return (
            <Reveal key={i} delay={Math.min(i * 0.05, 0.5)}>
              <Tilt>
                <div onClick={() => setExpanded(isOpen ? null : p.Program_Name)}
                  className="glass-card"
                  style={{
                    borderLeft: `4px solid ${isDone ? 'var(--success)' : 'var(--accent-primary)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: '1.5rem'
                  }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.3rem' }}>{p.Program_Name}</h3>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>🏷️ {p.Category}</span>
                        <span style={{ color: isDone ? 'var(--success)' : 'var(--gold)' }}>
                          {isDone ? '✅ Published' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.85rem' }}>
                        <span>🥇 {settings[`${prefix}_1st`] || 0}</span>
                        <span>🥈 {settings[`${prefix}_2nd`] || 0}</span>
                        <span>🥉 {settings[`${prefix}_3rd`] || 0}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{isOpen ? '▲ Hide' : '▼ Details'}</span>
                    </div>
                  </div>

                  {/* Expandable section */}
                  {isOpen && (
                    <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--glass-border)', animation: 'slideUp 0.3s ease' }}
                      onClick={e => e.stopPropagation()}>
                      {isDone ? (
                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>WINNERS</p>
                          {winners.map((w, wi) => (
                            <div key={wi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>{w.Position === '1st' ? '🥇' : w.Position === '2nd' ? '🥈' : '🥉'}</span>
                                <span style={{ fontWeight: '600' }}>{w.Winner_ID}</span>
                              </span>
                              <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>+{w.Points_Awarded} pts</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-dim)' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                          <p style={{ fontSize: '0.95rem' }}>Results not published yet.</p>
                          <p style={{ fontSize: '0.82rem', marginTop: '0.3rem', opacity: 0.6 }}>Check back after the event!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Tilt>
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
