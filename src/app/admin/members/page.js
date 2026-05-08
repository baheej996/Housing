'use client';
import { useState } from 'react';
import { postData } from '@/lib/api';
import { useGlobalData } from '@/components/DataProvider';
import { Reveal, Tilt } from '@/components/Animate';
import Link from 'next/link';

export default function ManageMembers() {
  const { members, teams, refreshData, loading: globalLoading } = useGlobalData();
  const [name, setName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !selectedTeam || submitting) return alert('Please enter name and select team');
    
    setSubmitting(true);
    const result = await postData('Members', [Date.now(), name, selectedTeam, 0]);
    
    if (result === 'Success') {
      setName('');
      setSelectedTeam('');
      refreshData(); // Instant background update
      alert('Member added successfully!');
    } else {
      alert('Failed to add member.');
    }
    setSubmitting(false);
  };

  if (globalLoading && members.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin Panel...</div>;

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Reveal>
          <Link href="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>← Back to Admin</Link>
          <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Manage <span className="vibrant-gradient-text">Members</span></h1>
        </Reveal>
      </header>

      <div className="admin-grid">
        <Reveal delay={0.1}>
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
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label>Assign to Team</label>
                <select 
                  className="form-control" 
                  value={selectedTeam} 
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  disabled={submitting}
                >
                  <option value="">-- Select Team --</option>
                  {teams.map((t, i) => <option key={i} value={t.Team_Name}>{t.Team_Name}</option>)}
                </select>
              </div>
              <button className="btn-primary" style={{ width: '100%', opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Member'}
              </button>
            </form>
          </section>
        </Reveal>

        <Reveal delay={0.2}>
          <section className="glass-card">
            <h3>Member List</h3>
            <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.8rem' }}>
              {members.map((m, i) => (
                <Reveal key={i} delay={i * 0.03} y={10}>
                  <Tilt>
                    <div className="leaderboard-item" style={{ padding: '0.8rem 1.2rem' }}>
                      <div>
                        <span style={{ display: 'block', fontWeight: '600' }}>{m.Member_Name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{m.Team_ID}</span>
                      </div>
                      <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>{m.Individual_Points} pts</span>
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
