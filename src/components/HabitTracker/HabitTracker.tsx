import React, { useState } from 'react';
import styled from 'styled-components';

import Calendar from './Calendar';
import DayCardWrapper from './DayCardWrapper';

export default function HabitTracker() {
  const [activeDate, setActiveDate] = useState(new Date());
  return (
    <Wrapper>
      <Calendar activeDate={activeDate} setActiveDate={setActiveDate} />
      <DayCardWrapper activeDate={activeDate} />
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
