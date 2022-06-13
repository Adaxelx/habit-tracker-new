import { useMutation, useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { client } from 'utils';

import { Event } from 'components/HabitTracker/useCalendar';
import { showToast } from 'components/ToastContainer';
import { generateEventCacheKeys, removeDBItemFromArray } from 'helpers/calendar';

interface UseDeleteHabitProps {
  habit?: Event;
  onClose: () => void;
}

export function useDeleteHabit({ habit, onClose }: UseDeleteHabitProps) {
  const queryClient = useQueryClient();

  const habitId = habit?._id;

  return useMutation(
    body => client(`/events${habitId ? `/${habitId}` : ''}`, { body, method: 'DELETE' }),
    {
      onSuccess: (_, _1, restoreCache) => {
        const eventCacheKeys = generateEventCacheKeys(
          dayjs(habit?.dateStart),
          dayjs(habit?.dateEnd)
        );
        const refetchOfEvents = eventCacheKeys.map(eventCacheKey =>
          queryClient.invalidateQueries(eventCacheKey)
        );
        queryClient.invalidateQueries(['events'], { exact: true });
        showToast('Successfuly deleted habit', { type: 'success' });
        onClose();
        return Promise.all(refetchOfEvents);
      },
      onMutate: () => {
        const eventCacheKeys = generateEventCacheKeys(
          dayjs(habit?.dateStart),
          dayjs(habit?.dateEnd)
        );

        const dateHabitsSaved = eventCacheKeys.map(eventCacheKey =>
          queryClient.getQueryData<Event[]>(eventCacheKey)
        );
        const allHabitsSaved = queryClient.getQueryData<Event[]>(['events']);

        eventCacheKeys.forEach(eventCacheKey => {
          const savedCache = queryClient.getQueryData<Event[]>(eventCacheKey);
          if (!savedCache) return;
          queryClient.setQueryData<Event[]>(eventCacheKey, currentHabits =>
            removeDBItemFromArray(currentHabits, habit)
          );
        });

        queryClient.setQueryData<Event[]>(['events'], currentHabits =>
          removeDBItemFromArray(currentHabits, habit)
        );

        if (!navigator.onLine) {
          showToast('(Without internet) Succesfuly added habit', { type: 'success' });
          onClose();
        }

        return () => {
          // FIX it https://ui.dev/c/react-query/optimistic-updates
          eventCacheKeys.forEach((eventCacheKey, index) => {
            queryClient.setQueryData<Event[]>(eventCacheKey, dateHabitsSaved[index]);
          });
          queryClient.setQueryData<Event[]>(['events'], allHabitsSaved);
        };
      },
      onError: (data, habit, restoreCache) => {
        // showToast(data?.error ?? 'Unknown error', { type: 'error' });
        (restoreCache as () => void)?.();
      },
    }
  );
}
