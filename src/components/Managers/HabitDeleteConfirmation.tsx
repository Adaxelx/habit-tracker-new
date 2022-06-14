import styled from 'styled-components';

import Button from 'components/Button';
import { Event } from 'components/HabitTracker/useCalendar';
import Modal from 'components/Modal';

import { useDeleteHabit } from './useDeleteHabit';

interface HabitDeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  habit?: Event;
}

export default function HabitDeleteConfirmation({
  isOpen,
  onClose,
  habit,
}: HabitDeleteConfirmationProps) {
  const { mutate, isPaused, isLoading } = useDeleteHabit({ habit, onClose });
  const disabled = isLoading && !isPaused;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h4>{`Are you sure you want to delete habit?`}</h4>
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
