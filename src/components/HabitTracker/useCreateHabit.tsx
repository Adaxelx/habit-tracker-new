import { useMutation, useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { client } from 'utils';

import { useUser } from 'components/Account/UserContext';
import { showToast } from 'components/ToastContainer';
import { generateEventCacheKeys } from 'helpers/calendar';

import { Event, EventInterface, Label } from './useCalendar';

export const getNewHabitsAfterEdit = (habits: Event[] | undefined, newEvent: Event) => {
  const events = [...(habits ?? [])];
  const index = events.findIndex(({ _id }) => _id === newEvent._id);
  events.splice(index, 1, newEvent);
  return events;
};

export default function useCreateHabit(onClose: () => void, eventId?: string) {
  const queryClient = useQueryClient();
  const { state } = useUser();

  return useMutation<unknown, unknown, EventInterface & { _id: string; label?: string }>(
    body =>
      client(`/events${eventId ? `/${eventId}` : ''}`, { body, method: eventId ? 'PUT' : 'POST' }),
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
        queryClient.invalidateQueries(['events'], { exact: true });
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

        const dateHabitsSaved = eventCacheKeys.map(eventCacheKey =>
          queryClient.getQueryData<Event[]>(eventCacheKey)
        );
        const allHabitsSaved = queryClient.getQueryData<Event[]>(['events']);

        eventCacheKeys.forEach(eventCacheKey => {
          const savedCache = queryClient.getQueryData<Event[]>(eventCacheKey);
          if (!savedCache) return;
          queryClient.setQueryData<Event[]>(eventCacheKey, currentEvents => {
            return eventId
              ? getNewHabitsAfterEdit(currentEvents, newEvent)
              : [...(currentEvents ?? []), newEvent];
          });
        });

        queryClient.setQueryData<Event[]>(['events'], currentEvents =>
          eventId
            ? getNewHabitsAfterEdit(currentEvents, newEvent)
            : [...(currentEvents ?? []), newEvent]
        );

        if (!navigator.onLine) {
          showToast('(Without internet) Succesfuly added habit', { type: 'success' });
          onClose();
        }

        return () => {
          eventCacheKeys.forEach((eventCacheKey, index) => {
            queryClient.setQueryData<Event[]>(eventCacheKey, dateHabitsSaved[index]);
          });
          queryClient.setQueryData<Event[]>(['events'], allHabitsSaved);
        };
      },
      onError: (data, variables, restoreCache) => {
        // showToast(data?.error ?? 'Unknown error', { type: 'error' });
        (restoreCache as () => void)?.();
      },
    }
  );
}
