import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';

import { useUser } from 'components/Account/UserContext';
import Button from 'components/Button';
import useFormattedMessage from 'hooks/useFormattedMessage';

import Calendar from './Calendar';
import DayCardWrapper from './DayCardWrapper';
import HabitForm from './HabitForm';
import LabelForm from './LabelForm';

export default function HabitTracker() {
  const [activeDate, setActiveDate] = useState(new Date());
  const addHabitButton = useFormattedMessage('habitTracker.addHabitButton');
  const addLabelButton = useFormattedMessage('habitTracker.addLabelButton');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const { state } = useUser();

  if (!state.token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Wrapper>
      <Button onClick={() => setIsEventModalOpen(true)}>{addHabitButton}</Button>
      <Button onClick={() => setIsLabelModalOpen(true)}>{addLabelButton}</Button>
      <Calendar activeDate={activeDate} setActiveDate={setActiveDate} />
      <DayCardWrapper activeDate={activeDate} />
      <HabitForm isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} />
      <LabelForm isOpen={isLabelModalOpen} onClose={() => setIsLabelModalOpen(false)} />
    </Wrapper>
  );
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[32]};
  padding: ${({ theme }) => theme.spacing[32]} 0;
`;
