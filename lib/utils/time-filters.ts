export function getTimeRangeDates(timeRange: string): { start: string; end: string } {
  const now = new Date();
  const end = now.toISOString();
  
  let start: Date;
  
  switch (timeRange) {
    case 'today':
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      break;
      
    case '7days':
      start = new Date(now);
      start.setDate(start.getDate() - 7);
      break;
      
    case '1month':
      start = new Date(now);
      start.setMonth(start.getMonth() - 1);
      break;
      
    case '3months':
      start = new Date(now);
      start.setMonth(start.getMonth() - 3);
      break;
      
    case '6months':
      start = new Date(now);
      start.setMonth(start.getMonth() - 6);
      break;
      
    case 'all':
    default:
      // For 'all', we'll use a very old date to get everything
      start = new Date('2020-01-01');
      break;
  }
  
  return {
    start: start.toISOString(),
    end,
  };
} 