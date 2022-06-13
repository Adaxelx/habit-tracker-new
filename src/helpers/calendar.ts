import { QueryClient } from 'react-query';
import { dateFormat } from 'consts';
import dayjs, { Dayjs } from 'dayjs';

import { Event } from 'components/HabitTracker/useCalendar';

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

export const generateEventCacheKeys = (dateStart: Dayjs, dateEnd: Dayjs) => {
  let currentMonth = dateStart;
  const eventKeys = [];

  while (currentMonth.month() <= dateEnd.month()) {
    eventKeys.push([
      'events',
      { from: getStartDate(currentMonth.toDate()), to: getEndDate(currentMonth.toDate()) },
    ]);
    currentMonth = currentMonth.add(1, 'month');
  }

  return eventKeys;
};

type DBItemWithId = { _id: string };
export function getNewDBItemsAfterEdit<DBItem extends DBItemWithId>(
  dbItems: DBItem[] | undefined,
  dbItem: DBItem
) {
  const newDbItems = [...(dbItems ?? [])];
  const index = newDbItems.findIndex(({ _id }) => _id === dbItem._id);
  newDbItems.splice(index, 1, dbItem);
  return newDbItems;
}

export function removeDBItemFromArray<DBItem extends DBItemWithId>(
  dbItems: DBItem[] | undefined,
  deletedItem: DBItem | undefined
) {
  return (dbItems ?? []).filter(dbItem => dbItem._id !== deletedItem?._id);
}

export const invalidateAllHabitsForGivenLabel = ({
  queryClient,
  labelId,
}: {
  queryClient: QueryClient;
  labelId: string;
}) => {
  const eventsForInvalidation = (queryClient.getQueriesData<Event[]>(['events']) ?? []).filter(
    ([cacheKey, events]) => {
      return Boolean(events.find(event => event?.label?._id === labelId));
    }
  );
  const invalidationPromises = eventsForInvalidation.map(([cacheKey]) =>
    queryClient.invalidateQueries(cacheKey)
  );
  return Promise.all(invalidationPromises);
};
