import { format, subDays, parseISO } from 'date-fns';

export const calculateHabitStreak = (completedDates: string[]) => {
  if (completedDates.length === 0) return 0;
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  
  // If neither today nor yesterday is completed, the streak is broken
  if (!completedDates.includes(todayStr) && !completedDates.includes(yesterdayStr)) {
    return 0;
  }
  
  // Get unique dates and sort them descending
  const sortedDates = Array.from(new Set(completedDates)).sort((a, b) => b.localeCompare(a));
  
  let currentChain: string[] = [];
  let tempCheckDate = parseISO(sortedDates[0]);
  
  while (completedDates.includes(format(tempCheckDate, 'yyyy-MM-dd'))) {
    currentChain.push(format(tempCheckDate, 'yyyy-MM-dd'));
    tempCheckDate = subDays(tempCheckDate, 1);
  }
  
  // Check if this chain includes today or yesterday
  if (currentChain.includes(todayStr) || currentChain.includes(yesterdayStr)) {
    return currentChain.length;
  }
  
  return 0;
};
