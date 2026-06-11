'use client';
import { useState } from 'react';
import { postData } from '@/lib/api';
import { useGlobalData } from '@/components/DataProvider';
import { Reveal } from '@/components/Animate';
import Link from 'next/link';

export default function ManageMarks() {
  const { teams, members, refreshData, loading: globalLoading } = useGlobalData();
  const [targetType, setTargetType] = useState('Individual'); // 'Individual' or 'Team'
  const [selectedTarget, setSelectedTarget] = useState('');
  const [markType, setMarkType] = useState('Plus'); // 'Plus' or 'Minus'
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTarget || !points || submitting) {
      return alert('Please fill all required fields');
    }

    const pts = parseInt(points);
    if (isNaN(pts) || pts <= 0) {
      return alert('Please enter a valid positive number for points.');
    }

    setSubmitting(true);
    const finalPoints = markType === 'Minus' ? -pts : pts;
    const finalReason = `${markType === 'Plus' ? 'Bonus' : 'Penalty'}${reason ? ': ' + reason : ''}`;

    try {
      await postData('Results', [
        new Date().toLocaleDateString(),
        'Adjustment', // Special Program ID to distinguish marks
        finalReason,  // Using Position to store the reason
        selectedTarget,
        finalPoints
      ]);
      
      refreshData();
      alert(`Successfully added ${finalPoints} pts to ${selectedTarget}`);
      
      // Reset fields
      setPoints('');
      setReason('');
      setSelectedTarget('');
    } catch (err) {
      alert('Error submitting mark');
    } finally {
      setSubmitting(false);
    }
  };

  if (globalLoading && teams.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin Panel...</div>;

  const optionsList = targetType === 'Team' 
    ? teams.map(t => t.Team_Name) 
    : members.map(m => m.Member_Name);

  return (
    <main style={{ padding: '2rem 5% 8rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Reveal>
          <Link href="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>← Back to Admin</Link>
          <h1 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Manage <span className="vibrant-gradient-text">Marks</span></h1>
        </Reveal>
      </header>

      <Reveal delay={0.1}>
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label>Target Type</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="targetType" 
                    value="Individual" 
                    checked={targetType === 'Individual'} 
                    onChange={() => { setTargetType('Individual'); setSelectedTarget(''); }}
                  />
                  Individual
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="targetType" 
                    value="Team" 
                    checked={targetType === 'Team'} 
                    onChange={() => { setTargetType('Team'); setSelectedTarget(''); }}
                  />
                  Team
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Select {targetType}</label>
              <select 
                className="form-control" 
                value={selectedTarget} 
                onChange={(e) => setSelectedTarget(e.target.value)}
                disabled={submitting}
              >
                <option value="">-- Choose {targetType} --</option>
                {optionsList.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Mark Type</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--accent-primary)' }}>
                  <input 
                    type="radio" 
                    name="markType" 
                    value="Plus" 
                    checked={markType === 'Plus'} 
                    onChange={() => setMarkType('Plus')}
                  />
                  Plus (+)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#ef4444' }}>
                  <input 
                    type="radio" 
                    name="markType" 
                    value="Minus" 
                    checked={markType === 'Minus'} 
                    onChange={() => setMarkType('Minus')}
                  />
                  Minus (-)
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Points Amount (Positive Number)</label>
              <input 
                type="number" 
                className="form-control" 
                value={points} 
                onChange={(e) => setPoints(e.target.value)} 
                placeholder="e.g. 10" 
                disabled={submitting} 
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Reason (Optional but recommended)</label>
              <input 
                type="text" 
                className="form-control" 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                placeholder="e.g. Disciplinary action, Outstanding help" 
                disabled={submitting} 
              />
            </div>

            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
              {submitting ? 'Submitting...' : `Apply ${markType === 'Minus' ? '-' : '+'}${points || 0} Points`}
            </button>
          </form>
        </div>
      </Reveal>
    </main>
  );
}
