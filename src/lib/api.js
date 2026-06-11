const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';

export const fetchData = async (tab) => {
  try {
    const response = await fetch(`/api/sheet?tab=${tab}&t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return [];
    
    const headers = data[0].map(h => h.toString().trim().replace(/\s+/g, '_'));
    const rows = data.slice(1).map((row, index) => {
      let obj = { _rowIndex: index + 2 }; // +2 because 0 is header, 1 is row 2
      headers.forEach((header, colIndex) => {
        if (header) obj[header] = row[colIndex];
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
      body: JSON.stringify({ action: 'append', tab, values }),
    });
    const data = await response.json();
    return data.result === 'Success' ? 'Success' : 'Error';
  } catch (error) {
    console.error(`Error posting to ${tab}:`, error);
    return 'Error';
  }
};

export const updateData = async (tab, rowIndex, values) => {
  try {
    const response = await fetch('/api/sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', tab, rowIndex, values }),
    });
    const data = await response.json();
    return data.result === 'Success' ? 'Success' : 'Error';
  } catch (error) {
    console.error(`Error updating ${tab}:`, error);
    return 'Error';
  }
};

export const deleteData = async (tab, rowIndex) => {
  try {
    const response = await fetch('/api/sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', tab, rowIndex }),
    });
    const data = await response.json();
    return data.result === 'Success' ? 'Success' : 'Error';
  } catch (error) {
    console.error(`Error deleting from ${tab}:`, error);
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
