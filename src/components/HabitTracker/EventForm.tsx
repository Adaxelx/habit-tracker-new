import styled from 'styled-components';

import { Input } from 'components/FormControls';
import Modal from 'components/Modal';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EventForm({ isOpen, onClose }: EventFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={'Dupa'}>
      <FormWrapper>
        <Input name="Title" htmlFor="title" placeholder="Example title..." />
        <Input name="Estimated time start" htmlFor="timeStart" type="time" showLabel />
        <Input name="Estimated time end" htmlFor="timeEnd" type="time" showLabel />
      </FormWrapper>
    </Modal>
  );
}

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
