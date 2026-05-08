'use client';
import { useState, useMemo } from 'react';
import { useGlobalData } from '@/components/DataProvider';
import { Reveal, Tilt } from '@/components/Animate';
import Link from 'next/link';

export default function ManageSettings() {
  const { settings, refreshData, loading: globalLoading } = useGlobalData();
  const [updating, setUpdating] = useState(null);

  // Convert settings object back to array for display if needed
  const settingsArray = useMemo(() => {
    return Object.entries(settings).map(([key, val]) => ({
      Setting_Name: key,
      Value: val
    })).filter(s => !s.Setting_Name.startsWith('Special'));
  }, [settings]);

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
        refreshData(); // Instant background sync
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      alert('Error updating setting');
    }
    setUpdating(null);
  };

  if (globalLoading && Object.keys(settings).length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Settings...</div>;

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Reveal>
          <Link href="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>← Back to Admin</Link>
          <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Point <span className="vibrant-gradient-text">Settings</span></h1>
          <p style={{ color: 'var(--text-dim)' }}>Configure points for each event type</p>
        </Reveal>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '800px' }}>
        <Reveal delay={0.1}>
          <section className="glass-card">
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>Standard Points</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {settingsArray.map((s, i) => (
                <div key={i} className="leaderboard-item" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{s.Setting_Name.replace(/_/g, ' ')}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Base points for this rank</p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input 
                      type="number"
                      className="form-control"
                      style={{ width: '80px', textAlign: 'center', background: 'rgba(255,255,255,0.05)' }}
                      defaultValue={s.Value}
                      onBlur={(e) => {
                        if (e.target.value !== s.Value.toString()) {
                          handleUpdate(s.Setting_Name, e.target.value);
                        }
                      }}
                    />
                    {updating === s.Setting_Name && <span className="loader-mini"></span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.2}>
          <section className="glass-card">
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>Special & Group Points</h3>
            <div className="admin-grid">
              {['Special_1st', 'Special_2nd', 'Special_3rd'].map(key => (
                <div key={key} className="form-group">
                  <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>{key.replace('_', ' ')}</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input 
                      type="number" 
                      className="form-control" 
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                      defaultValue={settings[key] || ''}
                      onBlur={(e) => handleUpdate(key, e.target.value)}
                    />
                    {updating === key && <span className="loader-mini"></span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.3}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--accent-primary)', textAlign: 'center' }}>
            💡 Tip: Click anywhere outside the input box to automatically save your changes.
          </div>
        </Reveal>
      </div>
    </main>
  );
}
