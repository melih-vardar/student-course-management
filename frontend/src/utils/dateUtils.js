// UTC - Local Time Çevirme
// Backend'e veri gönderirken UTC formatında gönderilecek. (toUTCString())
// Backend cevaplarında Frontend tarafında local time formatında gösterilecek. (displayDate() ve displayDateOnly())

import { format, parseISO } from 'date-fns';


export const displayDate = (utcDateString, formatString = 'dd/MM/yyyy HH:mm') => {
  if (!utcDateString) return '';
  try {
    let date;
    if (utcDateString instanceof Date) {
      date = utcDateString;
    } else if (typeof utcDateString === 'string') {
      date = parseISO(utcDateString);
    } else {
      throw new Error('Invalid date input type');
    }
    
    return format(date, formatString);
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'Invalid Date';
  }
};

export const displayDateOnly = (utcDateString) => {
  return displayDate(utcDateString, 'dd/MM/yyyy');
};

export const toUTCString = (localDate) => {
  if (!localDate) return null;
  try {
    let date;
    if (typeof localDate === 'string') {
      date = new Date(localDate);
    } else if (localDate instanceof Date) {
      date = localDate;
    } else {
      throw new Error('Invalid date input');
    }
    
    return date.toISOString();
  } catch (error) {
    console.error('Error converting to UTC:', error);
    return null;
  }
};

export const getCurrentDateForInput = () => {
  return new Date().toISOString().split('T')[0];
};

export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 0;
  try {
    const birth = parseISO(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return 0;
  }
};


export const isValidAge = (dateOfBirth) => {
  const age = calculateAge(toUTCString(dateOfBirth));
  return age >= 18;
};

export const isDateInFuture = (date) => {
  if (!date) return false;
  try {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate > today;
  } catch (error) {
    console.error('Error checking future date:', error);
    return false;
  }
}; 