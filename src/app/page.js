'use client';
import { useState, useEffect } from 'react';
import { fetchData } from '@/lib/api';

export default function Home() {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const teamData = await fetchData('Teams');
      const memberData = await fetchData('Members');
      const resultData = await fetchData('Results');
      
      setTeams(teamData.sort((a, b) => b.Total_Points - a.Total_Points));
      setMembers(memberData.sort((a, b) => b.Individual_Points - a.Individual_Points).slice(0, 10));
      
      // Group results by program
      const groupedResults = {};
      resultData.forEach(r => {
        if (!groupedResults[r.Program_ID]) groupedResults[r.Program_ID] = [];
        groupedResults[r.Program_ID].push(r);
      });
      setResults(Object.entries(groupedResults).reverse()); // Newest first
      
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="loading">Loading Housing Program...</div>;

  return (
    <main>
      <nav>
        <div className="logo"><h2 className="gradient-text">HOUSING PROGRAM</h2></div>
        <div className="nav-links">
          <a href="/admin">Admin Panel</a>
        </div>
      </nav>

      <div style={{ padding: '2rem 5%' }}>
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Housing <span className="gradient-text">Grand Finale</span></h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Real-time standings and program achievements</p>
        </header>

        <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
          {/* Team Leaderboard */}
          <section className="glass-card">
            <h2 style={{ marginBottom: '2rem' }}>🏆 Team Leaderboard</h2>
            {teams.map((team, index) => (
              <div key={index} className="leaderboard-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div className={`rank-badge rank-${index + 1}`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{team.Team_Name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{team.Captain_Name}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '700' }} className="gradient-text">{team.Total_Points}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Program Results */}
          <section className="glass-card">
            <h2 style={{ marginBottom: '2rem' }}>🏁 Program Results</h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {results.length === 0 && <p style={{ color: 'var(--text-dim)' }}>No results published yet.</p>}
              {results.map(([programName, winners], index) => (
                <div key={index} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                  <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>{programName}</h3>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {winners.sort((a,b) => a.Position.localeCompare(b.Position)).map((w, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span>{w.Position === '1st' ? '🥇' : w.Position === '2nd' ? '🥈' : '🥉'} {w.Winner_ID}</span>
                        <span style={{ color: 'var(--text-dim)' }}>{w.Points_Awarded} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Member Standings Footer */}
        <section className="glass-card" style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>🌟 Top 10 Individual Performers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {members.map((member, index) => (
              <div key={index} style={{ padding: '1rem', borderLeft: '3px solid var(--accent-secondary)', background: 'rgba(255,255,255,0.02)' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{member.Member_Name}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{member.Team_ID} • {member.Individual_Points} pts</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
