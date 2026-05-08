'use client';
import { useState, useEffect } from 'react';
import { fetchData, SCRIPT_URL } from '@/lib/api';
import Link from 'next/link';

export default function ManageSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await fetchData('Settings');
    setSettings(data);
    setLoading(false);
  };

  const handleUpdate = async (key, newValue) => {
    setUpdating(key);
    try {
      const response = await fetch('/api/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tab: 'Settings',
          action: 'update',
          key: key,
          value: newValue
        })
      });
      const data = await response.json();
      if (data.result === 'Success') {
        alert('Setting updated successfully!');
        await loadSettings();
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      alert('Error updating setting');
    }
    setUpdating(null);
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Settings...</div>;

  return (
    <main style={{ padding: '2rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link href="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>← Back to Admin</Link>
        <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Point <span className="gradient-text">Settings</span></h1>
        <p style={{ color: 'var(--text-dim)' }}>Configure how many points are awarded for each position</p>
      </header>

      <div className="glass-card" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {settings.map((s, i) => (
            <div key={i} className="leaderboard-item" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{s.Setting_Name.replace(/_/g, ' ')}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Points awarded for this rank</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input 
                  type="number"
                  className="form-control"
                  style={{ width: '100px', textAlign: 'center' }}
                  defaultValue={s.Value}
                  onBlur={(e) => {
                    if (e.target.value !== s.Value.toString()) {
                      handleUpdate(s.Setting_Name, e.target.value);
                    }
                  }}
                />
                {updating === s.Setting_Name && <span style={{ fontSize: '0.8rem' }}>Updating...</span>}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--accent-primary)' }}>
          💡 Tip: Click outside the box after changing a number to save it automatically.
        </div>
        <section className="glass-card" style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Special Points</h2>
          <div className="admin-grid">
            {['Special_1st', 'Special_2nd', 'Special_3rd'].map(key => (
              <div key={key} className="form-group">
                <label>{key.replace('_', ' ')}</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="number" 
                    className="form-control" 
                    defaultValue={settings.find(s => s.Setting_Name === key)?.Value || ''}
                    onBlur={(e) => handleUpdate(key, e.target.value)}
                  />
                  {updating === key && <span style={{ fontSize: '0.8rem' }}>Updating...</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
