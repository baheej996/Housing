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
    loading: true,
  });

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [teamData, memberData, resultData, programData, settingsData] = await Promise.all([
          fetchData('Teams'),
          fetchData('Members'),
          fetchData('Results'),
          fetchData('Programs'),
          fetchData('Settings')
        ]);
        
        // --- Calculate totals ---
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
          points: memberTotals[m.Member_Name]?.pts || 0 // duplicate for teams tab compatibility
        })).sort((a, b) => b.Individual_Points - a.Individual_Points);

        const settingsObj = {};
        settingsData.forEach(item => settingsObj[item.Setting_Name] = item.Value);

        setData({
          teams: calculatedTeams,
          members: calculatedMembers,
          results: resultData,
          programs: programData,
          settings: settingsObj,
          loading: false,
        });
      } catch (err) {
        console.error("Error loading global data:", err);
        setData(prev => ({ ...prev, loading: false }));
      }
    };
    
    loadAllData();
  }, []);

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
}

export function useGlobalData() {
  return useContext(DataContext);
}
