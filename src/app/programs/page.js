'use client';
import { useState } from 'react';
import { useGlobalData } from '@/components/DataProvider';

export default function ProgramsPage() {
  const { programs, results, settings, loading } = useGlobalData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | pending | done

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Programs...</div>;

  const completedIds = new Set(results.map(r => r.Program_ID));
  const query = search.toLowerCase();

  const filtered = programs.filter(p => {
    const matchesSearch = !query || p.Program_Name?.toLowerCase().includes(query) || p.Category?.toLowerCase().includes(query);
    const isDone = completedIds.has(p.Program_Name);
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'done' && isDone) || (filterStatus === 'pending' && !isDone);
    return matchesSearch && matchesStatus;
  });

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Event <span className="gradient-text">Schedule</span></h1>
        <p style={{ color: 'var(--text-dim)' }}>{programs.length} programs · {completedIds.size} completed · {programs.length - completedIds.size} pending</p>
      </header>

      {/* Search Bar */}
      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: '1.2rem', top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search programs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--glass-border)',
            borderRadius: '50px',
            padding: '0.9rem 1.2rem 0.9rem 3rem',
            color: 'white',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{
            position: 'absolute', right: '1rem', top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'white', width: '28px', height: '28px',
            borderRadius: '50%', cursor: 'pointer', fontSize: '1rem'
          }}>×</button>
        )}
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem' }}>
        {[['all', 'All'], ['pending', '⏳ Pending'], ['done', '✅ Completed']].map(([val, label]) => (
          <button key={val} onClick={() => setFilterStatus(val)} style={{
            padding: '0.4rem 1rem',
            borderRadius: '50px',
            border: '1px solid',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s',
            background: filterStatus === val ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'rgba(255,255,255,0.05)',
            color: filterStatus === val ? 'white' : 'var(--text-dim)',
            borderColor: filterStatus === val ? 'transparent' : 'var(--glass-border)',
          }}>{label}</button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '4rem' }}>
          No programs match your search.
        </div>
      )}

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {filtered.map((p, i) => {
          const isDone = completedIds.has(p.Program_Name);
          const prefix = p.Category === 'Group' ? 'Grp' : (p.Category?.toLowerCase() === 'specials' ? 'Special' : 'Ind');

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
                <div style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Points</div>
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
