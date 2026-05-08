'use client';
import { useState } from 'react';
import { postData } from '@/lib/api';
import { useGlobalData } from '@/components/DataProvider';
import { Reveal, Tilt } from '@/components/Animate';
import Link from 'next/link';

export default function ResultEntry() {
  const { programs, members, teams, settings, refreshData, loading: globalLoading } = useGlobalData();
  const [selectedProgram, setSelectedProgram] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [winners, setWinners] = useState({
    pos1: '', pos2: '', pos3: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProgram || !winners.pos1 || submitting) return alert('Please select program and 1st place');
    
    setSubmitting(true);
    const program = programs.find(p => p.Program_Name === selectedProgram);
    const category = program?.Category;
    
    let prefix = 'Ind';
    if (category === 'Group') prefix = 'Grp';
    if (category === 'Specials') prefix = 'Special';
    
    const resultEntries = [
      { pos: '1st', name: winners.pos1, pts: settings[`${prefix}_1st`] },
      { pos: '2nd', name: winners.pos2, pts: settings[`${prefix}_2nd`] },
      { pos: '3rd', name: winners.pos3, pts: settings[`${prefix}_3rd`] },
    ];

    try {
      for (const res of resultEntries) {
        if (res.name) {
          await postData('Results', [
            new Date().toLocaleDateString(),
            selectedProgram,
            res.pos,
            res.name,
            res.pts
          ]);
        }
      }
      refreshData(); // Instant background update
      alert('Results published successfully!');
      setWinners({ pos1: '', pos2: '', pos3: '' });
      setSelectedProgram('');
    } catch (err) {
      alert('Error submitting results');
    } finally {
      setSubmitting(false);
    }
  };

  if (globalLoading && programs.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin Panel...</div>;

  const program = programs.find(p => p.Program_Name === selectedProgram);
  const cat = program?.Category?.toLowerCase();
  const isTeamEvent = cat === 'group' || cat === 'specials';
  const optionsList = isTeamEvent ? teams.map(t => t.Team_Name) : members.map(m => m.Member_Name);

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Reveal>
          <Link href="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>← Back to Admin</Link>
          <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Result <span className="vibrant-gradient-text">Entry</span></h1>
        </Reveal>
      </header>

      <Reveal delay={0.1}>
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Program</label>
              <select 
                className="form-control" 
                value={selectedProgram} 
                onChange={(e) => setSelectedProgram(e.target.value)}
                disabled={submitting}
              >
                <option value="">-- Choose Program --</option>
                {programs.map((p, i) => <option key={i} value={p.Program_Name}>{p.Program_Name} ({p.Category})</option>)}
              </select>
            </div>

            {selectedProgram && (
              <>
                <Reveal delay={0.1} y={10}>
                  <div className="form-group">
                    <label>🥇 1st Place ({isTeamEvent ? 'Team' : 'Member'})</label>
                    <select className="form-control" value={winners.pos1} onChange={(e) => setWinners({...winners, pos1: e.target.value})} disabled={submitting}>
                      <option value="">-- Select Winner --</option>
                      {optionsList.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </Reveal>

                <Reveal delay={0.2} y={10}>
                  <div className="form-group">
                    <label>🥈 2nd Place</label>
                    <select className="form-control" value={winners.pos2} onChange={(e) => setWinners({...winners, pos2: e.target.value})} disabled={submitting}>
                      <option value="">-- Select Winner --</option>
                      {optionsList.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </Reveal>

                <Reveal delay={0.3} y={10}>
                  <div className="form-group">
                    <label>🥉 3rd Place</label>
                    <select className="form-control" value={winners.pos3} onChange={(e) => setWinners({...winners, pos3: e.target.value})} disabled={submitting}>
                      <option value="">-- Select Winner --</option>
                      {optionsList.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </Reveal>

                <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Publish Results'}
                </button>
              </>
            )}
          </form>
        </div>
      </Reveal>
    </main>
  );
}
