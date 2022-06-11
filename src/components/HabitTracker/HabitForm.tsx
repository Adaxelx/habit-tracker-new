import { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { handleAddRemoveToggleInArray, mongoObjectId } from 'utils';

import Button from 'components/Button';
import { Input, TextArea } from 'components/FormControls';
import Select, { DefaultOption } from 'components/FormControls/Select';
import Modal from 'components/Modal';
import useFormattedMessage from 'hooks/useFormattedMessage';

import { EventInterface, Label } from './useCalendar';
import useCreateHabit from './useCreateHabit';

type FormElements = HTMLFormControlsCollection &
  Record<keyof Omit<EventInterface, 'daysOfWeek'>, HTMLInputElement>;
interface HabitFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const habitFormTranslations = 'habitTracker.habitForm';

export default function HabitForm({ isOpen, onClose }: HabitFormProps) {
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

  const habitMutation = useCreateHabit(onClose);

  const labels = useQuery<Label[]>(['labels']);

  const handleSubmit = (event: React.FormEvent<HabitFormElement>) => {
    event.preventDefault();
    const data = event.currentTarget.elements;
    const { timeStart, timeEnd, title, dateEnd, dateStart } = data;

    habitMutation.mutate({
      timeStart: timeStart.value,
      timeEnd: timeEnd.value,
      title: title.value,
      dateEnd: dateEnd.value,
      dateStart: dateStart.value,
      daysOfWeek,
      label,
      _id: mongoObjectId(),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={header}>
      <FormWrapper onSubmit={handleSubmit} id="habitForm">
        <Input
          name="Title"
          htmlFor="title"
          defaultValue={'test'}
          placeholder={titlePlaceholder}
          showLabel
        />
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
        {labels.data ? (
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

interface LabelOptionProps {
  color: string;
}

const LabelOption = styled(DefaultOption)<LabelOptionProps>`
  background-color: ${({ color }) => color};
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
