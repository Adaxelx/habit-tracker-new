import { dateFormat } from 'consts';
import dayjs from 'dayjs';
import styled from 'styled-components';

import useFormattedMessage from 'hooks/useFormattedMessage';

import Activity from './Activity';
import { Event } from './useCardContent';

interface DayCardProps {
  date: string;
  events: Event[];
  className?: string;
}

const DayCard = ({ date, events, className = '' }: DayCardProps) => {
  const dayjsDate = dayjs(date);
  const day = dayjsDate.date();
  const dayOfWeek = dayjsDate.day();
  const month = dayjsDate.month();
  const year = dayjsDate.year();

  const formatDayOfWeek = useFormattedMessage(`calendar.dayOfWeek.${dayOfWeek}`);

  return (
    <Wrapper className={className} id={`dayCard:${dayjsDate.format(dateFormat)}`}>
      <Date>{`${day} ${month} ${year}`}</Date>
      <h5>{formatDayOfWeek}</h5>
      <ActivityWrapper>
        <Line />
        {events.map(event => (
          <Activity {...event} key={event.title} />
        ))}
      </ActivityWrapper>
    </Wrapper>
  );
};

export default DayCard;

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[24]} ${theme.spacing[16]} 0`};
  width: 100%;
  min-width: 300px;
  height: 600px;
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
  background-color: ${({ theme }) => theme.colors.grays[1000]};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  transition: 300ms;
  &:focus-within {
    box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.25);
  }
`;

const Date = styled.p`
  ${({ theme }) => theme.fontSizes[14]}
  ${({ theme }) => theme.colors.grays[400]}
`;

const ActivityWrapper = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing[48]} 0 ${theme.spacing[24]} 0`};
  gap: ${({ theme }) => theme.spacing[16]};
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

const Line = styled.div`
  position: absolute;
  height: 100%;
  width: 5px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.grays[900]};
`;
