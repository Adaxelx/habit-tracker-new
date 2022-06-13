import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { handleAddRemoveToggleInArray, mongoObjectId } from 'utils';

import Button from 'components/Button';
import { Input, TextArea } from 'components/FormControls';
import Select, { DefaultOption } from 'components/FormControls/Select';
import Modal from 'components/Modal';
import useFormattedMessage from 'hooks/useFormattedMessage';

import { Event, EventInterface, Label } from './useCalendar';
import useCreateHabit from './useCreateHabit';

type FormElements = HTMLFormControlsCollection &
  Record<keyof Omit<EventInterface, 'daysOfWeek'>, HTMLInputElement>;
interface HabitFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  previousEvent?: Event;
}

const DATEPICKER_DATE_FORMAT = 'YYYY-MM-DD';

const habitFormTranslations = 'habitTracker.habitForm';

export default function HabitForm({ isOpen, onClose, previousEvent }: HabitFormProps) {
  const header = useFormattedMessage(`${habitFormTranslations}.header`);
  const titlePlaceholder = useFormattedMessage(`${habitFormTranslations}.titlePlaceholder`);
  const dateStart = useFormattedMessage(`${habitFormTranslations}.dateStart`);
  const dateEnd = useFormattedMessage(`${habitFormTranslations}.dateEnd`);
  const timeStart = useFormattedMessage(`${habitFormTranslations}.timeStart`);
  const timeEnd = useFormattedMessage(`${habitFormTranslations}.timeEnd`);
  const daysOfWeekTitle = useFormattedMessage(`${habitFormTranslations}.daysOfWeek`);
  const labelTitle = useFormattedMessage(`${habitFormTranslations}.label`);
  const submit = useFormattedMessage(`${habitFormTranslations}.submit`);

  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [label, setLabel] = useState('');

  const habitMutation = useCreateHabit(onClose, previousEvent?._id);

  const labels = useQuery<Label[]>(['labels']);

  const handleSubmit = (event: React.FormEvent<HabitFormElement>) => {
    event.preventDefault();
    const data = event.currentTarget.elements;
    const { timeStart, timeEnd, title, dateEnd, dateStart, description } = data;

    habitMutation.mutate({
      timeStart: timeStart.value,
      timeEnd: timeEnd.value,
      title: title.value,
      dateEnd: dateEnd.value,
      dateStart: dateStart.value,
      description: description.value,
      daysOfWeek,
      label,
      _id: previousEvent?._id ?? mongoObjectId(),
    });
  };

  useEffect(() => {
    if (previousEvent) {
      setDaysOfWeek(previousEvent?.daysOfWeek);
      setLabel(previousEvent?.label?._id ?? '');
    }
  }, [previousEvent]);

  return (
    <HabitModal isOpen={isOpen} onClose={onClose} title={header}>
      <FormWrapper onSubmit={handleSubmit} id="habitForm">
        <Input
          name="Title"
          htmlFor="title"
          defaultValue={previousEvent?.title ?? ''}
          placeholder={titlePlaceholder}
          showLabel
        />
        <TextArea
          name="Description"
          htmlFor="description"
          defaultValue={previousEvent?.description ?? ''}
          showLabel
          placeholder="10 pushups every hour for better physical strength"
        />
        <Input
          name={dateStart}
          htmlFor="dateStart"
          type="date"
          defaultValue={
            previousEvent?.dateStart
              ? dayjs(previousEvent.dateStart).format(DATEPICKER_DATE_FORMAT)
              : ''
          }
          showLabel
        />
        <Input
          name={dateEnd}
          htmlFor="dateEnd"
          defaultValue={
            previousEvent?.dateEnd
              ? dayjs(previousEvent.dateEnd).format(DATEPICKER_DATE_FORMAT)
              : ''
          }
          type="date"
          showLabel
        />
        <Input
          name={timeStart}
          htmlFor="timeStart"
          defaultValue={previousEvent?.timeStart ?? ''}
          type="time"
          showLabel
        />
        <Input
          name={timeEnd}
          htmlFor="timeEnd"
          defaultValue={previousEvent?.timeEnd ?? ''}
          type="time"
          showLabel
        />
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
        {labels.data?.length ? (
          <Select
            options={labels.data.map(({ color, _id }) => (
              <LabelOption
                key={_id}
                active={_id === label}
                color={color}
                onClick={() => setLabel(_id)}
              />
            ))}
            selected={labels.data.find(({ _id }) => _id === label)?.title}
            label={labelTitle}
          />
        ) : null}
        <Button disabled={habitMutation.isLoading} type="submit">
          {submit}
        </Button>
      </FormWrapper>
    </HabitModal>
  );
}

const HabitModal = styled(Modal)``;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface LabelOptionProps {
  color: string;
}

const LabelOption = styled(DefaultOption)<LabelOptionProps>`
  background-color: ${({ color }) => color};
`;

export const weekDays = [
  { name: 'Mo', value: 1 },
  { name: 'Tu', value: 2 },
  { name: 'We', value: 3 },
  { name: 'Th', value: 4 },
  { name: 'Fr', value: 5 },
  { name: 'Sa', value: 6 },
  { name: 'Su', value: 0 },
];
