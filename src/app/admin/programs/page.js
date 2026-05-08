'use client';
import { useState } from 'react';
import { postData } from '@/lib/api';
import { useGlobalData } from '@/components/DataProvider';
import { Reveal, Tilt } from '@/components/Animate';
import Link from 'next/link';

export default function ManagePrograms() {
  const { programs, refreshData, loading: globalLoading } = useGlobalData();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Individual');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || submitting) return;
    setSubmitting(true);
    const result = await postData('Programs', [Date.now(), name, category]);
    if (result === 'Success') {
      setName('');
      refreshData(); // Instant background update
      alert('Program created successfully!');
    } else {
      alert('Failed to create program.');
    }
    setSubmitting(false);
  };

  if (globalLoading && programs.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin Panel...</div>;

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Reveal>
          <Link href="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>← Back to Admin</Link>
          <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Manage <span className="vibrant-gradient-text">Programs</span></h1>
        </Reveal>
      </header>

      <div className="admin-grid">
        <Reveal delay={0.1}>
          <section className="glass-card">
            <h3>Add New Program</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Program Name</label>
                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 100m Sprint" disabled={submitting} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} disabled={submitting}>
                  <option value="Individual">Individual</option>
                  <option value="Group">Group (Team Event)</option>
                  <option value="Specials">Specials</option>
                </select>
              </div>
              <button className="btn-primary" style={{ width: '100%', opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Program'}
              </button>
            </form>
          </section>
        </Reveal>

        <Reveal delay={0.2}>
          <section className="glass-card">
            <h3>Current Programs</h3>
            <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.8rem' }}>
              {programs.map((p, i) => (
                <Reveal key={i} delay={i * 0.03} y={10}>
                  <Tilt>
                    <div className="leaderboard-item" style={{ padding: '0.8rem 1.2rem' }}>
                      <span style={{ fontWeight: '600' }}>{p.Program_Name}</span>
                      <span className="vibrant-gradient-text" style={{ fontSize: '0.8rem', fontWeight: '700' }}>{p.Category}</span>
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
