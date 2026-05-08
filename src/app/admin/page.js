'use client';
import Link from 'next/link';
import { Reveal, Tilt } from '@/components/Animate';

export default function AdminDashboard() {
  const tools = [
    { name: 'Teams', desc: 'Add or manage housing teams', icon: '🚩', href: '/admin/teams' },
    { name: 'Members', desc: 'Manage member lists and points', icon: '👥', href: '/admin/members' },
    { name: 'Programs', desc: 'Define individual & group events', icon: '📅', href: '/admin/programs' },
    { name: 'Result Entry', desc: 'Post winners and update points', icon: '📝', href: '/admin/results' },
    { name: 'Settings', desc: 'Configure point distribution', icon: '⚙️', href: '/admin/settings' },
  ];

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Reveal>
            <Link href="/" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Public Site</Link>
            <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Admin <span className="vibrant-gradient-text">Control Center</span></h1>
            <p style={{ color: 'var(--text-dim)' }}>Manage every aspect of the Housing Program</p>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <button 
            onClick={handleLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            Sign Out
          </button>
        </Reveal>
      </header>

      <div className="admin-grid">
        {tools.map((tool, index) => (
          <Reveal key={index} delay={index * 0.1}>
            <Tilt>
              <Link href={tool.href} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{tool.icon}</span>
                  <div>
                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{tool.name}</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{tool.desc}</p>
                  </div>
                </div>
              </Link>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
