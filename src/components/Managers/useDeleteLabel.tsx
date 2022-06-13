import { useMutation, useQueryClient } from 'react-query';
import { client } from 'utils';

import { Event, Label } from 'components/HabitTracker/useCalendar';
import { showToast } from 'components/ToastContainer';
import { invalidateAllHabitsForGivenLabel } from 'helpers/calendar';

interface UseDeleteHabitProps {
  label?: Label;
  onClose: () => void;
}

export default function useDeleteLabel({ label, onClose }: UseDeleteHabitProps) {
  const queryClient = useQueryClient();

  const labelId = label?._id ?? '';

  return useMutation(
    body => client(`/labels${labelId ? `/${labelId}` : ''}`, { body, method: 'DELETE' }),
    {
      onSuccess: async (_, _1, restoreCache) => {
        (restoreCache as () => void)?.();
        const eventCacheKey = ['labels'];

        queryClient.invalidateQueries(eventCacheKey);

        showToast('Successfuly deleted label', { type: 'success' });
        onClose();
        return invalidateAllHabitsForGivenLabel({ queryClient, labelId });
      },
      onMutate: () => {
        const labelsCacheKey = ['labels'];
        const savedCache = queryClient.getQueryData<Label[]>(labelsCacheKey);
        queryClient.setQueryData<Label[]>(labelsCacheKey, prevLabels =>
          (prevLabels ?? []).filter(prevLabel => prevLabel._id !== labelId)
        );

        const eventCache = queryClient.getQueriesData<Event[]>(['events']);
        if (labelId) {
          queryClient.setQueriesData<Event[]>(['events'], prevEvents => {
            return (prevEvents ?? []).map(event => ({
              ...event,
              label: event?.label && event.label._id === labelId ? undefined : event.label,
            }));
          });
        }

        if (!navigator.onLine) {
          showToast('(Without internet) Succesfuly deleted label', { type: 'success' });
          onClose();
        }
        return () => {
          queryClient.setQueryData<Label[]>(labelsCacheKey, savedCache);
          if (labelId) {
            eventCache.forEach(([cacheKey, cache]) =>
              queryClient.setQueryData<Event[]>(cacheKey, cache)
            );
          }
        };
      },
      onError: (data, label, restoreCache) => {
        // showToast(data?.error ?? 'Unknown error', { type: 'error' });
        (restoreCache as () => void)?.();
      },
    }
  );
}
