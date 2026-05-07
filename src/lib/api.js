const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';

export const fetchData = async (tab) => {
  try {
    const response = await fetch(`/api/sheet?tab=${tab}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return [];
    
    // Assuming first row is headers
    const headers = data[0].map(h => h.toString().trim().replace(/\s+/g, '_'));
    const rows = data.slice(1).map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        if (header) obj[header] = row[index];
      });
      return obj;
    });
    return rows;
  } catch (error) {
    console.error(`Error fetching ${tab}:`, error);
    return [];
  }
};

export const postData = async (tab, values) => {
  try {
    const response = await fetch('/api/sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tab, values }),
    });
    const data = await response.json();
    return data.result === 'Success' ? 'Success' : 'Error';
  } catch (error) {
    console.error(`Error posting to ${tab}:`, error);
    return 'Error';
  }
};

// Helper for complex results logic
export const addResult = async (programId, winners, pointSettings) => {
  // 1. Post to Results tab
  // winners: [{memberId, position, points}]
  for (const winner of winners) {
    await postData('Results', [
      new Date().toLocaleDateString(),
      programId,
      winner.position,
      winner.name,
      winner.points
    ]);
  }
  return 'Success';
};
