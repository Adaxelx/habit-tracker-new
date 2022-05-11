import dayjs from 'dayjs';
import styled from 'styled-components';

import useFormattedMessage from 'hooks/useFormattedMessage';

import Activity from './Activity';

const activities = [
  {
    title: 'Reading a book',
    timeStart: '16:00',
    timeEnd: '16:30',
    description: '',
    checked: false,
  },
  {
    title: 'Reading a book2',
    timeStart: '16:00',
    timeEnd: '16:30',
    description: '',
    checked: false,
  },
  {
    title: 'Reading a book3',
    timeStart: '16:00',
    timeEnd: '16:30',
    description: '',
    checked: false,
  },
  {
    title: 'Reading a book4',
    timeStart: '16:00',
    timeEnd: '16:30',
    description: '',
    checked: false,
  },
];

const DayCard = ({ date }: { date: Date }) => {
  const dayjsDate = dayjs(date);
  const day = dayjsDate.date();
  const dayOfWeek = dayjsDate.day();
  const month = dayjsDate.month();
  const year = dayjsDate.year();

  const formatDayOfWeek = useFormattedMessage(`calendar.dayOfWeek.${dayOfWeek}`);

  return (
    <Wrapper>
      <Date>{`${day} ${month} ${year}`}</Date>
      <h5>{formatDayOfWeek}</h5>
      <ActivityWrapper>
        <Line />
        {activities.map(event => (
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
  padding: ${({ theme }) => `${theme.spacing[24]} ${theme.spacing[32]} 0`};
  width: 100%;
  height: 600px;
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
  background-color: ${({ theme }) => theme.colors.grays[1000]};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const Date = styled.p`
  ${({ theme }) => theme.fontSizes[14]}
  ${({ theme }) => theme.colors.grays[400]}
`;

const ActivityWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  margin-right: ${({ theme }) => `-${theme.spacing[32]}`};

  padding: ${({ theme }) => `${theme.spacing[48]} 0 ${theme.spacing[24]} 0`};
  gap: ${({ theme }) => theme.spacing[16]};
  overflow-y: auto;
`;

const Line = styled.div`
  position: absolute;
  height: 100%;
  width: 5px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.grays[700]};
`;
