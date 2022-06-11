import { useMutation, useQueryClient } from 'react-query';
import { client } from 'utils';

import { useUser } from 'components/Account/UserContext';
import { showToast } from 'components/ToastContainer';

import { LabelSend } from './LabelForm';
import { Label } from './useCalendar';

export function useCreateLabel(onClose: () => void) {
  const queryClient = useQueryClient();
  const { state } = useUser();

  return useMutation<unknown, unknown, LabelSend>(body => client('/labels', { body }), {
    onSuccess: (_, variables, restoreCache) => {
      (restoreCache as () => void)?.();
      showToast('Successfuly added label', { type: 'success' });
      onClose();
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
      queryClient.setQueryData<Label[]>(labelsCacheKey, prevLabels => [
        ...(prevLabels ?? []),
        newLabel,
      ]);
      if (!navigator.onLine) {
        showToast('(Without internet) Succesfuly added label', { type: 'success' });
        onClose();
      }
      return () => {
        queryClient.setQueryData<Label[]>(labelsCacheKey, savedCache);
      };
    },
    onError: (data, variables, restoreCache) => {
      // showToast(data?.error ?? 'Unknown error', { type: 'error' });
      (restoreCache as () => void)?.();
    },
  });
}
