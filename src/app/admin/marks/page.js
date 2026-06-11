'use client';
import { useState } from 'react';
import { postData, updateData, deleteData } from '@/lib/api';
import { useGlobalData } from '@/components/DataProvider';
import { Reveal } from '@/components/Animate';
import Link from 'next/link';

export default function ManageMarks() {
  const { teams, members, results, refreshData, loading: globalLoading } = useGlobalData();
  const [targetType, setTargetType] = useState('Individual');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [markType, setMarkType] = useState('Plus');
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [editMode, setEditMode] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [originalDate, setOriginalDate] = useState('');

  const adjustments = results.filter(r => r.Program_ID === 'Adjustment').reverse(); // Newest first

  const resetForm = () => {
    setPoints('');
    setReason('');
    setSelectedTarget('');
    setEditMode(false);
    setEditRowIndex(null);
    setOriginalDate('');
  };

  const handleEdit = (adj) => {
    setEditMode(true);
    setEditRowIndex(adj._rowIndex);
    setOriginalDate(adj.Date);
    
    const pts = parseInt(adj.Points_Awarded);
    setMarkType(pts >= 0 ? 'Plus' : 'Minus');
    setPoints(Math.abs(pts).toString());
    
    const isTeam = teams.some(t => t.Team_Name === adj.Winner_ID);
    setTargetType(isTeam ? 'Team' : 'Individual');
    setSelectedTarget(adj.Winner_ID);
    
    // Parse reason: "Bonus: Good behavior" -> "Good behavior"
    let rsn = adj.Position || '';
    if (rsn.startsWith('Bonus: ')) rsn = rsn.substring(7);
    else if (rsn.startsWith('Penalty: ')) rsn = rsn.substring(9);
    else if (rsn === 'Bonus' || rsn === 'Penalty') rsn = '';
    setReason(rsn);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (rowIndex) => {
    if (!confirm('Are you sure you want to delete this adjustment? This will permanently recalculate the scores.')) return;
    
    setSubmitting(true);
    try {
      await deleteData('Results', rowIndex);
      refreshData();
      alert('Adjustment deleted successfully.');
      if (editRowIndex === rowIndex) resetForm();
    } catch (e) {
      alert('Error deleting adjustment.');
    } finally {
      setSubmitting(false);
    }
  };

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
    const dateStr = editMode ? originalDate : new Date().toLocaleDateString();

    try {
      const values = [
        dateStr,
        'Adjustment',
        finalReason,
        selectedTarget,
        finalPoints
      ];

      if (editMode) {
        await updateData('Results', editRowIndex, values);
        alert(`Successfully updated adjustment for ${selectedTarget}`);
      } else {
        await postData('Results', values);
        alert(`Successfully added ${finalPoints} pts to ${selectedTarget}`);
      }
      
      refreshData();
      resetForm();
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

      <div className="admin-grid">
        <Reveal delay={0.1}>
          <div className="glass-card">
            <h3>{editMode ? 'Edit Adjustment' : 'New Adjustment'}</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              
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
                <label>Points Amount (Absolute Number)</label>
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
                <label>Reason (Optional)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)} 
                  placeholder="e.g. Disciplinary action" 
                  disabled={submitting} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
                  {submitting ? 'Saving...' : (editMode ? 'Update Adjustment' : `Apply ${markType === 'Minus' ? '-' : '+'}${points || 0} Points`)}
                </button>
                {editMode && (
                  <button type="button" onClick={resetForm} style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Adjustment History
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>{adjustments.length} Records</span>
            </h3>
            
            {adjustments.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem 0' }}>No adjustments have been made yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {adjustments.map((adj, i) => {
                  const pts = parseInt(adj.Points_Awarded);
                  const isPositive = pts > 0;
                  return (
                    <div key={i} style={{ 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.05)',
                      padding: '1rem', 
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.8rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: 'white', marginBottom: '0.2rem' }}>{adj.Winner_ID}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{adj.Position || 'No reason specified'}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.3rem', opacity: 0.6 }}>{adj.Date} (Row {adj._rowIndex})</div>
                        </div>
                        <div style={{ 
                          fontWeight: '800', 
                          fontSize: '1.1rem',
                          color: isPositive ? '#4ade80' : '#ef4444',
                          background: isPositive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          padding: '0.3rem 0.8rem',
                          borderRadius: '8px'
                        }}>
                          {isPositive ? '+' : ''}{pts}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.8rem' }}>
                        <button 
                          onClick={() => handleEdit(adj)}
                          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(adj._rowIndex)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
