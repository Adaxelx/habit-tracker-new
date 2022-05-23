import { dateFormat } from 'consts';
import dayjs from 'dayjs';

export const getStartDate = (date: Date) => {
  let newDate = dayjs(date).startOf('M');
  const day = newDate.day();
  if (day !== 1) {
    const daysFromSundayToMondayBack = 6;
    const diff = day === 0 ? daysFromSundayToMondayBack : day - 1;
    newDate = newDate.subtract(diff, 'day');
  }
  return newDate.format(dateFormat);
};
export const getEndDate = (date: Date) => {
  let newDate = dayjs(date).endOf('M');
  const day = newDate.day();
  if (day !== 0) {
    const diff = 7 - day;
    newDate = newDate.add(diff, 'day');
  }
  return newDate.format(dateFormat);
};
