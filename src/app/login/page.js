'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (data.success) {
      router.push('/admin');
    } else {
      setError(data.message);
    }
    setLoading(false);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Admin Access</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Please enter the administrator password</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ textAlign: 'center', fontSize: '1.2rem' }}
            />
          </div>
          {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
          <button className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </main>
  );
}
