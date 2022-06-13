import { useMutation, useQueryClient } from 'react-query';
import { client } from 'utils';

import { useUser } from 'components/Account/UserContext';
import { showToast } from 'components/ToastContainer';
import { getNewDBItemsAfterEdit, invalidateAllHabitsForGivenLabel } from 'helpers/calendar';

import { LabelSend } from './LabelForm';
import { Event, Label } from './useCalendar';

interface UseCreateLabelProps {
  onClose: () => void;
  labelId?: string;
}

// TODO: when label is edited change color in events as well

export function useCreateLabel({ onClose, labelId }: UseCreateLabelProps) {
  const queryClient = useQueryClient();
  const { state } = useUser();

  return useMutation<unknown, unknown, LabelSend>(
    body =>
      client(`/labels${labelId ? `/${labelId}` : ''}`, { body, method: labelId ? 'PUT' : 'POST' }),
    {
      onSuccess: async (_, variables) => {
        showToast(`Successfuly ${labelId ? 'edited' : 'added'} label`, { type: 'success' });
        onClose();
        if (labelId) {
          await invalidateAllHabitsForGivenLabel({ queryClient, labelId });
        }
        return queryClient.invalidateQueries(['labels']);
      },
      onMutate: variables => {
        const userId = state?.token?.split?.(':')?.[1] ?? '';
        const newLabel: Label = {
          ...variables,
          userId,
        };
        const labelsCacheKey = ['labels'];
        const savedCache = queryClient.getQueryData<Label[]>(labelsCacheKey);
        queryClient.setQueryData<Label[]>(labelsCacheKey, prevLabels =>
          labelId ? getNewDBItemsAfterEdit(prevLabels, newLabel) : [...(prevLabels ?? []), newLabel]
        );
        const eventCache = queryClient.getQueriesData<Event[]>(['events']);
        if (labelId) {
          queryClient.setQueriesData<Event[]>(['events'], prevEvents => {
            return (prevEvents ?? []).map(event => ({
              ...event,
              label: event?.label && event.label._id === labelId ? newLabel : event.label,
            }));
          });
        }

        if (!navigator.onLine) {
          showToast('(Without internet) Succesfuly added label', { type: 'success' });
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
      onError: (data, variables, restoreCache) => {
        // showToast(data?.error ?? 'Unknown error', { type: 'error' });
        (restoreCache as () => void)?.();
      },
    }
  );
}
