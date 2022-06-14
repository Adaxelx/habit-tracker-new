import styled from 'styled-components';

import Button from 'components/Button';
import { Label } from 'components/HabitTracker/useCalendar';
import Modal from 'components/Modal';

import useDeleteLabel from './useDeleteLabel';

interface LabelDeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  label?: Label;
}

export default function LabelDeleteConfirmation({
  isOpen,
  onClose,
  label,
}: LabelDeleteConfirmationProps) {
  const { mutate, isPaused, isLoading } = useDeleteLabel({ label, onClose });
  const disabled = isLoading && !isPaused;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h4>{`Are you sure you want to delete this label?`}</h4>
      <ButtonWrapper>
        <Button disabled={disabled} onClick={() => mutate()}>
          Yes
        </Button>
        <Button disabled={disabled} onClick={onClose}>
          No
        </Button>
      </ButtonWrapper>
    </Modal>
  );
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
