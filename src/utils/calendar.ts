import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isLeapYear } from 'date-fns';

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const isLeapYearCheck = (year: number): boolean => {
  return isLeapYear(new Date(year, 0, 1));
};

export const getWeeksInMonth = (year: number, month: number): number => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeek = Math.ceil(firstDay.getDate() / 7);
  const endWeek = Math.ceil(lastDay.getDate() / 7);
  return endWeek - startWeek + 1;
};

export const getWeekNumber = (year: number, month: number, day: number): number => {
  return Math.ceil(day / 7);
};

export const getDaysInWeek = (year: number, month: number, weekNumber: number): number[] => {
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = (weekNumber - 1) * 7 + 1;
  const endDay = Math.min(weekNumber * 7, daysInMonth);
  
  const days = [];
  for (let day = startDay; day <= endDay; day++) {
    days.push(day);
  }
  return days;
};

export const formatDate = (year: number, month: number, day: number): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

export const getMonthDays = (year: number, month: number): Date[] => {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  return eachDayOfInterval({ start, end });
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return getDay(new Date(year, month, 1));
};

export const generateCalendarGrid = (year: number, month: number): (number | null)[][] => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const weeksInMonth = getWeeksInMonth(year, month);
  
  const grid: (number | null)[][] = [];
  let currentDay = 1;
  
  for (let week = 0; week < weeksInMonth; week++) {
    const weekRow: (number | null)[] = [];
    
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      if (week === 0 && dayOfWeek < firstDay) {
        weekRow.push(null);
      } else if (currentDay > daysInMonth) {
        weekRow.push(null);
      } else {
        weekRow.push(currentDay);
        currentDay++;
      }
    }
    
    grid.push(weekRow);
  }
  
  return grid;
};

export const getYearRange = (startYear: number, endYear: number): number[] => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};

export const isToday = (year: number, month: number, day: number): boolean => {
  const today = new Date();
  return (
    year === today.getFullYear() &&
    month === today.getMonth() &&
    day === today.getDate()
  );
};

export const isPastDate = (year: number, month: number, day: number): boolean => {
  const date = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

export const isFutureDate = (year: number, month: number, day: number): boolean => {
  const date = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date > today;
};
