'use client';
import { useState, useEffect } from 'react';
import { fetchData } from '@/lib/api';

export default function Home() {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [results, setResults] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all data in parallel for speed
        const [teamData, memberData, resultData, programData] = await Promise.all([
          fetchData('Teams'),
          fetchData('Members'),
          fetchData('Results'),
          fetchData('Programs')
        ]);
        
        // --- REAL-TIME CALCULATION ---
        const teamTotals = {};
        const memberTotals = {};
        
        // 1. Initialize totals from the base lists
        teamData.forEach(t => teamTotals[t.Team_Name] = 0);
        memberData.forEach(m => memberTotals[m.Member_Name] = { pts: 0, team: m.Team_ID });

        // 2. Sum up every result ever recorded
        resultData.forEach(r => {
          const pts = parseInt(r.Points_Awarded) || 0;
          const winner = r.Winner_ID;
          
          // If it's a member winning, add to their total AND their team's total
          if (memberTotals[winner]) {
            memberTotals[winner].pts += pts;
            const teamOfMember = memberTotals[winner].team;
            if (teamTotals[teamOfMember] !== undefined) {
              teamTotals[teamOfMember] += pts;
            }
          } 
          // If a Team won directly (Group event), add to team total
          else if (teamTotals[winner] !== undefined) {
            teamTotals[winner] += pts;
          }
        });

        // 3. Update the display lists with calculated points
        const calculatedTeams = teamData.map(t => ({
          ...t,
          Total_Points: teamTotals[t.Team_Name] || 0
        })).sort((a, b) => b.Total_Points - a.Total_Points);

        const calculatedMembers = memberData.map(m => ({
          ...m,
          Individual_Points: memberTotals[m.Member_Name]?.pts || 0
        })).sort((a, b) => b.Individual_Points - a.Individual_Points).slice(0, 10);

        setTeams(calculatedTeams);
        setMembers(calculatedMembers);
        
        // Group results for the "Recent Results" section
        const groupedResults = {};
        const completedProgramIds = new Set();
        
        resultData.forEach(r => {
          const id = r.Program_ID || 'Unknown';
          completedProgramIds.add(id);
          if (!groupedResults[id]) groupedResults[id] = [];
          groupedResults[id].push(r);
        });
        setResults(Object.entries(groupedResults).reverse());

        // Find upcoming programs (those in Programs tab but NOT in Results tab)
        const upcomingList = programData.filter(p => !completedProgramIds.has(p.Program_Name));
        setUpcoming(upcomingList);

      } catch (err) {
        console.error("Error loading home data:", err);
      }
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

      <div style={{ padding: '0 5%' }}>
        {upcoming.length > 0 && (
          <div style={{ 
            background: 'rgba(255,255,255,0.03)',
            padding: '0',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            marginBottom: '3rem',
            position: 'relative'
          }}>
            <div style={{ 
              background: 'linear-gradient(90deg, #121215 80%, transparent)',
              padding: '1rem 2rem',
              zIndex: '10',
              position: 'relative',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}>
              <span className="gradient-text">UPCOMING</span>
            </div>
            <div className="marquee" style={{ zIndex: '1' }}>
              {[...upcoming, ...upcoming].map((p, i) => (
                <span key={i} style={{ whiteSpace: 'nowrap', fontWeight: '500' }}>
                  ⚡ {p.Program_Name} <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>({p.Category})</span>
                </span>
              ))}
            </div>
          </div>
        )}

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
                    {(winners || []).sort((a,b) => (a.Position || '').localeCompare(b.Position || '')).map((w, i) => {
                      const winnerName = w.Winner_ID;
                      const memberInfo = members.find(m => m.Member_Name === winnerName);
                      const teamName = memberInfo ? memberInfo.Team_ID : (teams.some(t => t.Team_Name === winnerName) ? winnerName : '');

                      return (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <span>
                            {w.Position === '1st' ? '🥇' : w.Position === '2nd' ? '🥈' : '🥉'} 
                            <span style={{ fontWeight: '500', marginLeft: '0.5rem' }}>{winnerName}</span>
                            {teamName && teamName !== winnerName && (
                              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>({teamName})</span>
                            )}
                          </span>
                          <span style={{ color: 'var(--text-dim)' }}>{w.Points_Awarded || 0} pts</span>
                        </div>
                      );
                    })}
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
