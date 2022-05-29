import React, { useState } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import useFormattedMessage from 'hooks/useFormattedMessage';

import Calendar from './Calendar';
import DayCardWrapper from './DayCardWrapper';
import EventForm from './EventForm';

export default function HabitTracker() {
  const [activeDate, setActiveDate] = useState(new Date());
  const addHabitButton = useFormattedMessage('habitTracker.addHabitButton');

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  return (
    <Wrapper>
      <Button onClick={() => setIsEventModalOpen(true)}>{addHabitButton}</Button>
      <Calendar activeDate={activeDate} setActiveDate={setActiveDate} />
      <DayCardWrapper activeDate={activeDate} />
      <EventForm isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} />
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
