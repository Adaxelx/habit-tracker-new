import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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
  const manageHabits = useFormattedMessage('habitTracker.manageHabits');
  const manageLabels = useFormattedMessage('habitTracker.manageLabels');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const { state, dispatch } = useUser();
  const navigate = useNavigate();

  if (!state.token) {
    return <Navigate to="/login" replace />;
  }
  const handleLogout = () => {
    dispatch({ type: 'logout' });
    navigate('/');
  };

  return (
    <Wrapper>
      <LogoutButton variant="tertiary" onClick={handleLogout}>
        Logout
      </LogoutButton>
      <CalendarAndButtonWrapper>
        <ButtonWrapper>
          <Button onClick={() => setIsEventModalOpen(true)}>{addHabitButton}</Button>
          <Button onClick={() => setIsLabelModalOpen(true)}>{addLabelButton}</Button>
          <Button variant="tertiary" onClick={() => setIsLabelModalOpen(true)}>
            {manageHabits}
          </Button>
          <Button variant="tertiary" onClick={() => setIsLabelModalOpen(true)}>
            {manageLabels}
          </Button>
        </ButtonWrapper>
        <Calendar activeDate={activeDate} setActiveDate={setActiveDate} />
        <Spacer />
      </CalendarAndButtonWrapper>
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
  padding: ${({ theme }) => `${theme.spacing[64]} 0 ${theme.spacing[32]} 0`};
`;

const CalendarAndButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 350px;

  @media (min-width: 768px) {
    width: 100%;
    max-width: none;
    flex-direction: row-reverse;
    gap: 16px;
  }
`;

const Spacer = styled.div`
  display: none;
  @media (min-width: 768px) {
    flex: 1;
    display: block;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[16]};
  flex-wrap: wrap;
  justify-content: space-between;

  @media (min-width: 768px) {
    justify-content: flex-start;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const LogoutButton = styled(Button)`
  --space: ${({ theme }) => theme.spacing[8]};
  position: fixed;
  top: var(--space);
  right: var(--space);
  min-width: 0;
`;
