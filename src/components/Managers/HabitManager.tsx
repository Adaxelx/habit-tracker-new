import { useState } from 'react';
import { useQuery } from 'react-query';
import { dateFormat } from 'consts';
import dayjs from 'dayjs';
import styled from 'styled-components';

import Button from 'components/Button';
import { Label } from 'components/DayCard/Activity';
import { DefaultOption } from 'components/FormControls/Select';
import HabitForm, { weekDays } from 'components/HabitTracker/HabitForm';
import { Event } from 'components/HabitTracker/useCalendar';

export default function HabitManager() {
  const events = useQuery<Event[]>(['events']);

  const [openEventId, setOpenEventId] = useState('');

  if (events.isLoading || events.isError) {
    return null;
  }

  return (
    <Wrapper>
      <h2>Your habits</h2>
      <HabitsWrapper>
        {events.data.map(
          ({
            _id,
            title,
            description,
            timeEnd,
            timeStart,
            dateStart,
            dateEnd,
            daysOfWeek,
            label,
          }) => (
            <Habit key={_id}>
              <Content>
                <TitleWrapper>
                  <Title>{title}</Title>
                  {label ? <Label color={label?.color} /> : null}
                </TitleWrapper>
                <DaysOfWeek>
                  {daysOfWeek.map(day => (
                    <DayOfWeek active={false} key={day}>
                      {weekDays.find(weekDay => weekDay.value === day)?.name}
                    </DayOfWeek>
                  ))}
                </DaysOfWeek>
                <Time>{`${timeStart} - ${timeEnd}, ${dayjs(dateStart).format(dateFormat)} - ${dayjs(
                  dateEnd
                ).format(dateFormat)}`}</Time>
                {description ? <Description>{description}</Description> : null}
              </Content>
              <ButtonsWrapper>
                <Action onClick={() => setOpenEventId(_id)}>Edit</Action>
                <Action>X</Action>
              </ButtonsWrapper>
            </Habit>
          )
        )}
      </HabitsWrapper>
      <HabitForm
        isOpen={Boolean(openEventId)}
        onClose={() => setOpenEventId('')}
        previousEvent={events.data.find(({ _id }) => _id === openEventId)}
      />
    </Wrapper>
  );
}

const Action = styled(Button)`
  min-width: ${({ theme }) => theme.spacing[48]};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const DaysOfWeek = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const DayOfWeek = styled(DefaultOption)`
  --diameter: ${({ theme }) => theme.spacing[24]};
  font-size: ${({ theme }) => theme.fontSizes[12]};
`;

const HabitsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[16]};
`;

const Habit = styled.section`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
  --size: ${({ theme }) => theme.spacing[24]};
  flex: 1;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  align-items: center;
`;

const Title = styled.span`
  font-size: ${({ theme }) => theme.fontSizes[20]};
  font-weight: bold;
`;

const Description = styled.p``;

const Time = styled.span``;

export const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => `${theme.spacing[64]} ${theme.spacing[16]} ${theme.spacing[32]} `};
  gap: ${({ theme }) => theme.spacing[24]};
`;
