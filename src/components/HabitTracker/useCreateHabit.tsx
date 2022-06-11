import { useMutation, useQueryClient } from 'react-query';
import dayjs, { Dayjs } from 'dayjs';
import { client } from 'utils';

import { useUser } from 'components/Account/UserContext';
import { showToast } from 'components/ToastContainer';
import { getEndDate, getStartDate } from 'helpers/calendar';

import { Event, EventInterface, Label } from './useCalendar';

const generateEventCacheKeys = (dateStart: Dayjs, dateEnd: Dayjs) => {
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

export default function useCreateHabit(onClose: () => void) {
  const queryClient = useQueryClient();
  const { state } = useUser();

  return useMutation<unknown, unknown, EventInterface & { _id: string; label?: string }>(
    body => client('/events', { body }),
    {
      onSuccess: (_, variables, restoreCache) => {
        (restoreCache as () => void)?.();
        const eventCacheKeys = generateEventCacheKeys(
          dayjs(variables.dateStart),
          dayjs(variables.dateEnd)
        );
        const refetchOfEvents = eventCacheKeys.map(eventCacheKey =>
          queryClient.invalidateQueries(eventCacheKey)
        );
        showToast('Successfuly added habit', { type: 'success' });
        onClose();
        return Promise.all(refetchOfEvents);
      },
      onMutate: ({ label, ...variables }) => {
        const userId = state?.token?.split?.(':')?.[1] ?? '';
        const labelData = queryClient
          .getQueryData<Label[]>(['labels'])
          ?.find(({ _id }) => _id === label);
        const newEvent: Event = {
          ...variables,
          userId,
          label: labelData,
          checked: [],
        };
        const eventCacheKeys = generateEventCacheKeys(
          dayjs(variables.dateStart),
          dayjs(variables.dateEnd)
        );

        const savedCache = eventCacheKeys.map(eventCacheKey =>
          queryClient.getQueryData<Event[]>(eventCacheKey)
        );

        eventCacheKeys.forEach(eventCacheKey => {
          const savedCache = queryClient.getQueryData<Event[]>(eventCacheKey);
          if (!savedCache) return;
          queryClient.setQueryData<Event[]>(eventCacheKey, currentEvents => {
            return [...(currentEvents ?? []), newEvent];
          });
        });

        if (!navigator.onLine) {
          showToast('(Without internet) Succesfuly added habit', { type: 'success' });
          onClose();
        }

        return () => {
          eventCacheKeys.forEach((eventCacheKey, index) => {
            queryClient.setQueryData<Event[]>(eventCacheKey, savedCache[index]);
          });
        };
      },
      onError: (data, variables, restoreCache) => {
        // showToast(data?.error ?? 'Unknown error', { type: 'error' });
        (restoreCache as () => void)?.();
      },
    }
  );
}
