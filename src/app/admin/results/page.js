'use client';
import { useState, useEffect } from 'react';
import { fetchData, postData } from '@/lib/api';
import Link from 'next/link';

export default function ResultEntry() {
  const [programs, setPrograms] = useState([]);
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [settings, setSettings] = useState({});
  const [selectedProgram, setSelectedProgram] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [winners, setWinners] = useState({
    pos1: '', pos2: '', pos3: ''
  });

  useEffect(() => {
    const loadData = async () => {
      const p = await fetchData('Programs');
      const m = await fetchData('Members');
      const t = await fetchData('Teams');
      const s = await fetchData('Settings');
      
      setPrograms(p);
      setMembers(m);
      setTeams(t);
      
      // Convert settings array to object
      const sObj = {};
      s.forEach(item => sObj[item.Setting_Name] = item.Value);
      setSettings(sObj);
      
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProgram || !winners.pos1) return alert('Please select program and 1st place');
    
    setSubmitting(true);
    const program = programs.find(p => p.Program_Name === selectedProgram);
    const isGroup = program.Category === 'Group';
    
    const prefix = isGroup ? 'Grp' : 'Ind';
    
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
      alert('Results published successfully!');
      setWinners({ pos1: '', pos2: '', pos3: '' });
      setSelectedProgram('');
    } catch (err) {
      alert('Error submitting results');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading data...</div>;

  const program = programs.find(p => p.Program_Name === selectedProgram);
  const optionsList = program?.Category === 'Group' ? teams.map(t => t.Team_Name) : members.map(m => m.Member_Name);

  return (
    <main style={{ padding: '2rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link href="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>← Back to Admin</Link>
        <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Result <span className="gradient-text">Entry</span></h1>
      </header>

      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Program</label>
            <select 
              className="form-control" 
              value={selectedProgram} 
              onChange={(e) => setSelectedProgram(e.target.value)}
            >
              <option value="">-- Choose Program --</option>
              {programs.map((p, i) => <option key={i} value={p.Program_Name}>{p.Program_Name} ({p.Category})</option>)}
            </select>
          </div>

          {selectedProgram && (
            <>
              <div className="form-group">
                <label>🥇 1st Place ({program.Category === 'Group' ? 'Team' : 'Member'})</label>
                <select className="form-control" value={winners.pos1} onChange={(e) => setWinners({...winners, pos1: e.target.value})}>
                  <option value="">-- Select Winner --</option>
                  {optionsList.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>🥈 2nd Place</label>
                <select className="form-control" value={winners.pos2} onChange={(e) => setWinners({...winners, pos2: e.target.value})}>
                  <option value="">-- Select Winner --</option>
                  {optionsList.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>🥉 3rd Place</label>
                <select className="form-control" value={winners.pos3} onChange={(e) => setWinners({...winners, pos3: e.target.value})}>
                  <option value="">-- Select Winner --</option>
                  {optionsList.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
              </div>

              <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
                {submitting ? 'Publishing...' : 'Publish Results'}
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
