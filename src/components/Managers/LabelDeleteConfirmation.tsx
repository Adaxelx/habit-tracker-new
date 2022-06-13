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
  const deleteLabelMutation = useDeleteLabel({ label, onClose });
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h4>{`Are you sure you want to delete habit '${label?.title}'?`}</h4>
      <ButtonWrapper>
        <Button onClick={() => deleteLabelMutation.mutate()}>Yes</Button>
        <Button onClick={onClose}>No</Button>
      </ButtonWrapper>
    </Modal>
  );
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;