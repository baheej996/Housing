'use client';
import { useState, useEffect } from 'react';
import { fetchData, postData } from '@/lib/api';
import Link from 'next/link';

export default function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const mData = await fetchData('Members');
    const tData = await fetchData('Teams');
    setMembers(mData);
    setTeams(tData);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !selectedTeam) return alert('Please enter name and select team');
    
    setSubmitting(true);
    const result = await postData('Members', [Date.now(), name, selectedTeam, 0]);
    
    if (result === 'Success') {
      setName('');
      setSelectedTeam('');
      await loadData();
      alert('Member added successfully!');
    } else {
      alert('Failed to add member.');
    }
    setSubmitting(false);
  };

  return (
    <main style={{ padding: '2rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link href="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>← Back to Admin</Link>
        <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Manage <span className="gradient-text">Members</span></h1>
      </header>

      <div className="admin-grid">
        <section className="glass-card">
          <h3>Add New Member</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label>Member Name</label>
              <input 
                className="form-control" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Adhil" 
              />
            </div>
            <div className="form-group">
              <label>Assign to Team</label>
              <select 
                className="form-control" 
                value={selectedTeam} 
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="">-- Select Team --</option>
                {teams.map((t, i) => <option key={i} value={t.Team_Name}>{t.Team_Name}</option>)}
              </select>
            </div>
            <button className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Member'}
            </button>
          </form>
        </section>

        <section className="glass-card">
          <h3>Member List</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {loading ? <p>Loading...</p> : (
              members.map((m, i) => (
                <div key={i} className="leaderboard-item">
                  <div>
                    <span style={{ display: 'block' }}>{m.Member_Name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{m.Team_ID}</span>
                  </div>
                  <span style={{ fontWeight: '600' }}>{m.Individual_Points} pts</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
