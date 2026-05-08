'use client';
import { useState } from 'react';
import { useGlobalData } from '@/components/DataProvider';

export default function ResultsPage() {
  const { results, members, teams, loading } = useGlobalData();
  const [search, setSearch] = useState('');

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Results...</div>;

  // Group by program
  const grouped = {};
  results.forEach(r => {
    if (!grouped[r.Program_ID]) grouped[r.Program_ID] = [];
    grouped[r.Program_ID].push(r);
  });

  // Filter: match program name OR winner name
  const query = search.toLowerCase();
  const filteredGroups = Object.entries(grouped).reverse().filter(([programName, winners]) => {
    if (!query) return true;
    if (programName.toLowerCase().includes(query)) return true;
    return winners.some(w => w.Winner_ID?.toLowerCase().includes(query));
  });

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Hall of <span className="gradient-text">Fame</span></h1>
        <p style={{ color: 'var(--text-dim)' }}>Complete history of program winners</p>
      </header>

      {/* Search Bar */}
      <div style={{ marginBottom: '2rem', position: 'relative' }}>
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
          placeholder="Search by program or player name..."
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

      {filteredGroups.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '4rem' }}>
          No results found for "{search}"
        </div>
      )}

      <div style={{ display: 'grid', gap: '2rem' }}>
        {filteredGroups.map(([programName, winners], index) => (
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
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>+{w.Points_Awarded} pts</div>
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
