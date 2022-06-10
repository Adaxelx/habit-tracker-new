import { useMutation, useQueryClient } from 'react-query';
import { client } from 'utils';

import { getEndDate, getStartDate } from 'helpers/calendar';

import { DateTuple } from './Activity';
import { Event } from './useCardContent';

interface UseToggleCheckedProps {
  id: string;
  checked: boolean;
  date: DateTuple;
}

export default function useToggleChecked({ id, date, checked }: UseToggleCheckedProps) {
  const [year, month, day] = date;
  const dateValue = `${year} ${month + 1} ${day}`;
  const queryClient = useQueryClient();

  const eventCacheKey = [
    'events',
    { from: getStartDate(new Date(dateValue)), to: getEndDate(new Date(dateValue)) },
  ];
  const mutation = useMutation<unknown, unknown, { id: string; date: DateTuple; check: boolean }>(
    ({ id, date, check }) =>
      client(`/events/check/${id}`, { body: { date, check }, method: 'PATCH' }),
    {
      onSuccess: (data, variables, restoreCache) => {
        (restoreCache as () => void)?.();
        return queryClient.invalidateQueries(eventCacheKey);
      },
      onMutate: () => {
        const savedCache = queryClient.getQueriesData(eventCacheKey);
        if (!savedCache) return;
        const idCheck = (Math.random() * 999).toString();
        queryClient.setQueryData<Event[]>(eventCacheKey, currentEvents => {
          const wasChecked = currentEvents
            ?.find(event => event._id === id)
            ?.checked?.find(
              check => check.day === day && check.month === month && check.year === year
            );
          return (currentEvents ?? []).map(event =>
            event._id === id
              ? {
                  ...event,
                  checked: wasChecked
                    ? event?.checked?.filter(check => check._id !== wasChecked._id)
                    : [
                        ...(event?.checked ?? []),
                        { _id: (Math.random() * 999).toString(), day, month, year },
                      ],
                }
              : event
          );
        });
        return () => {
          queryClient.setQueryData<Event[]>(eventCacheKey, currentEvents => {
            const wasChecked = currentEvents
              ?.find(event => event._id === id)
              ?.checked?.find(
                check => check.day === day && check.month === month && check.year === year
              );

            return (currentEvents ?? []).map(event =>
              event._id === id
                ? {
                    ...event,
                    checked: !wasChecked
                      ? event?.checked?.filter(check => check._id !== idCheck)
                      : [...(event?.checked ?? []), wasChecked],
                  }
                : event
            );
          });
        };
      },
      onError: (data, variables, restoreCache) => {
        (restoreCache as () => void)?.();
      },
    }
  );

  return { ...mutation, mutate: () => mutation.mutate({ id, date, check: !checked }) };
}
