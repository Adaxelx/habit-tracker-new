import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import dayjs, { Dayjs } from 'dayjs';
import styled from 'styled-components';
import { client, handleAddRemoveToggleInArray, mongoObjectId } from 'utils';

import { useUser } from 'components/Account/UserContext';
import Button from 'components/Button';
import { Input, TextArea } from 'components/FormControls';
import Select, { DefaultOption } from 'components/FormControls/Select';
import Modal from 'components/Modal';
import { showToast } from 'components/ToastContainer';
import useFormattedMessage from 'hooks/useFormattedMessage';
import { getEndDate, getStartDate } from 'helpers/calendar';

import { Event, EventInterface } from './useCalendar';

type FormElements = HTMLFormControlsCollection &
  Record<keyof Omit<EventInterface, 'daysOfWeek'>, HTMLInputElement>;
interface HabitFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const habitFormTranslations = 'habitTracker.habitForm';

export default function HabitForm({ isOpen, onClose }: HabitFormProps) {
  const header = useFormattedMessage(`${habitFormTranslations}.header`);
  const titlePlaceholder = useFormattedMessage(`${habitFormTranslations}.titlePlaceholder`);
  const dateStart = useFormattedMessage(`${habitFormTranslations}.dateStart`);
  const dateEnd = useFormattedMessage(`${habitFormTranslations}.dateEnd`);
  const timeStart = useFormattedMessage(`${habitFormTranslations}.timeStart`);
  const timeEnd = useFormattedMessage(`${habitFormTranslations}.timeEnd`);
  const daysOfWeekTitle = useFormattedMessage(`${habitFormTranslations}.daysOfWeek`);
  const submit = useFormattedMessage(`${habitFormTranslations}.submit`);
  const queryClient = useQueryClient();
  const { state } = useUser();
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);

  const habitMutation = useMutation<unknown, unknown, EventInterface & { _id: string }>(
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
      onMutate: variables => {
        const userId = state?.token?.split?.(':')?.[1] ?? '';
        const newEvent: Event = {
          ...variables,
          userId,
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

  const handleSubmit = (event: React.FormEvent<HabitFormElement>) => {
    event.preventDefault();
    const data = event.currentTarget.elements;
    const { timeStart, timeEnd, title, dateEnd, dateStart } = data;
    console.log(generateEventCacheKeys(dayjs(dateStart.value), dayjs(dateEnd.value)));
    habitMutation.mutate({
      timeStart: timeStart.value,
      timeEnd: timeEnd.value,
      title: title.value,
      dateEnd: dateEnd.value,
      dateStart: dateStart.value,
      daysOfWeek,
      _id: mongoObjectId(),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={header}>
      <FormWrapper onSubmit={handleSubmit} id="habitForm">
        <Input name="Title" htmlFor="title" defaultValue={'test'} placeholder={titlePlaceholder} />
        <TextArea
          name="Description"
          htmlFor="description"
          defaultValue={'test'}
          showLabel
          placeholder="10 pushups every hour for better physical strength"
        />
        <Input
          name={dateStart}
          htmlFor="dateStart"
          type="date"
          defaultValue={'2022-06-01'}
          showLabel
        />
        <Input name={dateEnd} htmlFor="dateEnd" defaultValue={'2022-06-30'} type="date" showLabel />
        <Input name={timeStart} htmlFor="timeStart" defaultValue={'10:22'} type="time" showLabel />
        <Input name={timeEnd} htmlFor="timeEnd" defaultValue={'20:30'} type="time" showLabel />
        <Select
          options={weekDays.map(({ name, value }) => (
            <DefaultOption
              key={value}
              active={daysOfWeek.includes(value)}
              onClick={() =>
                setDaysOfWeek(prev => handleAddRemoveToggleInArray(prev, Number(value)))
              }
            >
              {name}
            </DefaultOption>
          ))}
          label={daysOfWeekTitle}
        />
        <Button type="submit">{submit}</Button>
      </FormWrapper>
    </Modal>
  );
}

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const weekDays = [
  { name: 'M', value: 1 },
  { name: 'T', value: 2 },
  { name: 'W', value: 3 },
  { name: 'T', value: 4 },
  { name: 'F', value: 5 },
  { name: 'S', value: 6 },
  { name: 'S', value: 0 },
];
