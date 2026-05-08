'use client';
import { useState } from 'react';
import { postData } from '@/lib/api';
import { useGlobalData } from '@/components/DataProvider';
import { Reveal, Tilt } from '@/components/Animate';
import Link from 'next/link';

export default function ManageTeams() {
  const { teams, refreshData, loading: globalLoading } = useGlobalData();
  const [name, setName] = useState('');
  const [captain, setCaptain] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || submitting) return;
    setSubmitting(true);
    const result = await postData('Teams', [Date.now(), name, captain, 0]);
    
    if (result === 'Success') {
      setName(''); 
      setCaptain('');
      refreshData(); // Instant background update
      alert('Team added successfully!');
    } else {
      alert('Failed to add team.');
    }
    setSubmitting(false);
  };

  if (globalLoading && teams.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin Panel...</div>;

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Reveal>
          <Link href="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>← Back to Admin</Link>
          <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Manage <span className="vibrant-gradient-text">Teams</span></h1>
        </Reveal>
      </header>

      <div className="admin-grid">
        <Reveal delay={0.1}>
          <section className="glass-card">
            <h3>Add New Team</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Team Name</label>
                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Blue Warriors" disabled={submitting} />
              </div>
              <div className="form-group">
                <label>Captain Name</label>
                <input className="form-control" value={captain} onChange={(e) => setCaptain(e.target.value)} placeholder="e.g. John Doe" disabled={submitting} />
              </div>
              <button className="btn-primary" style={{ width: '100%', opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Team'}
              </button>
            </form>
          </section>
        </Reveal>

        <Reveal delay={0.2}>
          <section className="glass-card">
            <h3>Current Teams</h3>
            <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.8rem' }}>
              {teams.map((team, i) => (
                <Reveal key={i} delay={i * 0.05} y={10}>
                  <Tilt>
                    <div className="leaderboard-item" style={{ padding: '0.8rem 1.2rem' }}>
                      <span style={{ fontWeight: '600' }}>{team.Team_Name}</span>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>👑 {team.Captain_Name}</span>
                    </div>
                  </Tilt>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
