'use client';
import { useState, useEffect } from 'react';
import { fetchData, postData } from '@/lib/api';
import Link from 'next/link';

export default function ManagePrograms() {
  const [programs, setPrograms] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Individual');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    const data = await fetchData('Programs');
    setPrograms(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    const result = await postData('Programs', [Date.now(), name, category]);
    if (result === 'Success') {
      setName('');
      await loadPrograms();
      alert('Program created successfully!');
    } else {
      alert('Failed to create program.');
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link href="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>← Back to Admin</Link>
        <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Manage <span className="gradient-text">Programs</span></h1>
      </header>

      <div className="admin-grid">
        <section className="glass-card">
          <h3>Add New Program</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label>Program Name</label>
              <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 100m Sprint" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Individual">Individual</option>
                <option value="Group">Group (Team Event)</option>
                <option value="Specials">Specials</option>
              </select>
            </div>
            <button className="btn-primary" style={{ width: '100%' }}>Create Program</button>
          </form>
        </section>

        <section className="glass-card">
          <h3>Current Programs</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {programs.map((p, i) => (
              <div key={i} className="leaderboard-item">
                <span>{p.Program_Name}</span>
                <span className="gradient-text" style={{ fontSize: '0.8rem' }}>{p.Category}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
