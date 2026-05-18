'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchData } from '@/lib/api';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState({
    teams: [],
    members: [],
    results: [],
    programs: [],
    settings: {},
    photos: [],
    loading: true,
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadAllData = async () => {
    try {
      // 1. Instant Load from Cache
      if (typeof window !== 'undefined' && data.loading) {
        const cached = localStorage.getItem('sportsAppCache');
        if (cached) {
          try {
            setData({ ...JSON.parse(cached), loading: false });
          } catch(e) { console.error('Cache read error', e); }
        }
      }

      // 2. Background Fetch Fresh Data
      const [teamData, memberData, resultData, programData, settingsData, photoData] = await Promise.all([
        fetchData('Teams'),
        fetchData('Members'),
        fetchData('Results'),
        fetchData('Programs'),
        fetchData('Settings'),
        fetchData('Photos')
      ]);
      
      const teamTotals = {};
      const memberTotals = {};
      
      teamData.forEach(t => teamTotals[t.Team_Name] = 0);
      memberData.forEach(m => memberTotals[m.Member_Name] = { pts: 0, team: m.Team_ID });

      resultData.forEach(r => {
        const pts = parseInt(r.Points_Awarded) || 0;
        const winner = r.Winner_ID;
        
        if (memberTotals[winner]) {
          memberTotals[winner].pts += pts;
          const teamOfMember = memberTotals[winner].team;
          if (teamTotals[teamOfMember] !== undefined) teamTotals[teamOfMember] += pts;
        } else if (teamTotals[winner] !== undefined) {
          teamTotals[winner] += pts;
        }
      });

      const calculatedTeams = teamData.map(t => ({
        ...t,
        Total_Points: teamTotals[t.Team_Name] || 0
      })).sort((a, b) => b.Total_Points - a.Total_Points);

      const calculatedMembers = memberData.map(m => ({
        ...m,
        Individual_Points: memberTotals[m.Member_Name]?.pts || 0,
        points: memberTotals[m.Member_Name]?.pts || 0 
      })).sort((a, b) => b.Individual_Points - a.Individual_Points);

      const settingsObj = {};
      settingsData.forEach(item => settingsObj[item.Setting_Name] = item.Value);

      // Pre-group results by program for instant Results Tab rendering
      const resultsByProgram = {};
      resultData.forEach(r => {
        if (!resultsByProgram[r.Program_ID]) resultsByProgram[r.Program_ID] = [];
        resultsByProgram[r.Program_ID].push(r);
      });

      const newData = {
        teams: calculatedTeams,
        members: calculatedMembers,
        results: resultData,
        resultsByProgram, // New pre-calculated field
        programs: programData,
        settings: settingsObj,
        photos: photoData || [],
        loading: false,
      };

      // 3. Update State & Cache
      setData(newData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sportsAppCache', JSON.stringify(newData));
      }

    } catch (err) {
      console.error("Error loading global data:", err);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadAllData();
  }, [refreshTrigger]);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DataContext.Provider value={{ ...data, refreshData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useGlobalData() {
  return useContext(DataContext);
}
