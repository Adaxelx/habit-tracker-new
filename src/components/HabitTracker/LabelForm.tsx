import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { mongoObjectId } from 'utils';

import Button from 'components/Button';
import { Input, Select } from 'components/FormControls';
import { DefaultOption } from 'components/FormControls/Select';
import Modal from 'components/Modal';
import useFormattedMessage from 'hooks/useFormattedMessage';

import { Label } from './useCalendar';
import { useCreateLabel } from './useCreateLabel';

interface LabelFormProps {
  isOpen: boolean;
  onClose: () => void;
  previousLabel?: Label;
}

type ColorOption = {
  color: string;
  displayName: string;
};

export type LabelSend = Omit<Label, 'userId'>;

const labelFormTranslations = 'habitTracker.labelForm';

type FormElements = HTMLFormControlsCollection & Record<keyof LabelSend, HTMLInputElement>;

interface LabelFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function LabelForm({ isOpen, onClose, previousLabel }: LabelFormProps) {
  const header = useFormattedMessage(`${labelFormTranslations}.header`);
  const titlePlaceholder = useFormattedMessage(`${labelFormTranslations}.titlePlaceholder`);
  const colorLabel = useFormattedMessage(`${labelFormTranslations}.colorLabel`);
  const submit = useFormattedMessage(`${labelFormTranslations}.submit`);

  const [color, setColor] = useState<ColorOption | undefined>();

  useEffect(() => {
    setColor(colors.find(color => color.color === previousLabel?.color));
  }, [previousLabel]);

  const labelMutation = useCreateLabel({ onClose, labelId: previousLabel?._id });

  const handleSubmit = (event: React.FormEvent<LabelFormElement>) => {
    event.preventDefault();
    const data = event.currentTarget.elements;
    const { title } = data;

    if (!color) return;

    labelMutation.mutate({
      title: title.value,
      color: color?.color,
      _id: previousLabel?._id ?? mongoObjectId(),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={header}>
      <FormWrapper onSubmit={handleSubmit}>
        <Input
          name="Title"
          htmlFor="title"
          defaultValue={previousLabel?.title ?? ''}
          placeholder={titlePlaceholder}
          showLabel
        />
        <Select
          options={colors.map(value => (
            <LabelOption
              key={value.color}
              active={value.color === color?.color ?? ''}
              color={value.color}
              onClick={() => setColor(value)}
            />
          ))}
          selected={color?.displayName ?? ''}
          label={colorLabel}
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

interface LabelOptionProps {
  color: string;
}

const LabelOption = styled(DefaultOption)<LabelOptionProps>`
  background-color: ${({ color }) => color};
`;

const colors = [
  { color: 'hsl(63, 100%, 59%)', displayName: 'yellow' },
  { color: 'hsl(237, 100%, 56%)', displayName: 'blue' },
];
