export const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // 1. Extract headers dynamically or use provided order if needed
  // Ideally, data objects should already be formatted with correct keys
  const headers = Object.keys(data[0]);
  
  // 2. Convert to CSV string
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => headers.map(header => {
      // Handle commas/quotes in data
      const value = row[header] !== undefined && row[header] !== null 
        ? String(row[header]).replace(/"/g, '""') 
        : '';
      return `"${value}"`;
    }).join(','))
  ].join('\r\n'); // Use \r\n for better Windows Excel compatibility

  // 3. Trigger Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
