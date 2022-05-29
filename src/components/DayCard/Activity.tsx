import { useEffect } from 'react';
import { QueryClient, useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { client } from 'utils';

import Checkbox from 'components/FormControls/Checkbox';
import { getEndDate, getStartDate } from 'helpers/calendar';

import { Event } from './useCardContent';

type DateTuple = [number, number, number];

type ActivityProps = Omit<Event, 'checked'> & { checked: boolean; date: DateTuple };

export default function Activity({
  title,
  timeStart,
  timeEnd,
  description,
  checked,
  date,
  _id,
}: ActivityProps) {
  const mutation = useToggleChecked({ id: _id, date, checked });

  return (
    <Wrapper
      onClick={() => {
        mutation.mutate();
      }}
    >
      <MainContent>
        <h5>{title}</h5>
        <Subtext>{`${timeStart} - ${timeEnd}`}</Subtext>
        <Subtext>{description}</Subtext>
      </MainContent>
      <Aside>
        <Checkbox checked={checked} />
        <Badge />
      </Aside>
    </Wrapper>
  );
}

interface UseToggleCheckedProps {
  id: string;
  checked: boolean;
  date: DateTuple;
}

function useToggleChecked({ id, date, checked }: UseToggleCheckedProps) {
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

const Wrapper = styled.article`
  position: relative;
  cursor: pointer;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grays[900]};
  height: 140px;
  min-height: 140px;
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[16]}`};

  display: flex;
  gap: 16px;
`;

const MainContent = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-grow: 1;
`;

const Subtext = styled.p`
  color: ${({ theme }) => theme.colors.grays[200]};
  font-size: ${({ theme }) => theme.fontSizes[14]};
`;

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  width: 32px; // tmp
  gap: ${({ theme }) => theme.spacing[12]};
  align-items: center;
`;

// const Divider = styled.div`
//   width: 3px;
//   height: 100%;
//   background-color: ${({ theme }) => theme.colors.grays[800]};
// `;

const Badge = styled.div`
  --size: ${({ theme }) => theme.spacing[24]};
  width: var(--size);
  height: var(--size);
  background-color: ${({ theme }) => theme.colors.grays[800]};
  border-radius: ${({ theme }) => theme.cornerRadius.small};
`;
