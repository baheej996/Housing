'use client';
import { useState, useEffect } from 'react';
import { fetchData, postData } from '@/lib/api';
import Link from 'next/link';

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [captain, setCaptain] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    const data = await fetchData('Teams');
    setTeams(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    const result = await postData('Teams', [Date.now(), name, captain, 0]);
    
    if (result === 'Success') {
      setName(''); 
      setCaptain('');
      await loadTeams();
      alert('Team added successfully!');
    } else {
      alert('Failed to add team.');
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link href="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>← Back to Admin</Link>
        <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Manage <span className="gradient-text">Teams</span></h1>
      </header>

      <div className="admin-grid">
        <section className="glass-card">
          <h3>Add New Team</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label>Team Name</label>
              <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Blue Warriors" />
            </div>
            <div className="form-group">
              <label>Captain Name</label>
              <input className="form-control" value={captain} onChange={(e) => setCaptain(e.target.value)} placeholder="e.g. John Doe" />
            </div>
            <button className="btn-primary" style={{ width: '100%' }}>Add Team</button>
          </form>
        </section>

        <section className="glass-card">
          <h3>Current Teams</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {teams.map((team, i) => (
              <div key={i} className="leaderboard-item">
                <span>{team.Team_Name}</span>
                <span style={{ color: 'var(--text-dim)' }}>{team.Captain_Name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
