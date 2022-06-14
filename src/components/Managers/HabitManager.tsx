import { useState } from 'react';
import { useQuery } from 'react-query';
import { visibleDateFormat } from 'consts';
import dayjs from 'dayjs';
import styled from 'styled-components';

import Button from 'components/Button';
import { Label } from 'components/DayCard/Activity';
import { DefaultOption } from 'components/FormControls/Select';
import HabitForm, { weekDays } from 'components/HabitTracker/HabitForm';
import { Event } from 'components/HabitTracker/useCalendar';
import Loader from 'components/Loader';

import HabitDeleteConfirmation from './HabitDeleteConfirmation';

export default function HabitManager() {
  const events = useQuery<Event[]>(['events']);

  const [openEditEventId, setOpenEditEventId] = useState('');
  const [openDeleteEventId, setOpenDeleteEventId] = useState('');

  if (events.isError) {
    return null;
  }

  return (
    <Wrapper>
      <h2>Your habits</h2>
      {events.isFetching ? (
        <Loader />
      ) : (
        <>
          <ElementsWrapper>
            {events?.data?.map(
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
                    <Time>
                      <Hours>{`${timeStart} - ${timeEnd}`}</Hours>
                      <Dates>{`${dayjs(dateStart).format(visibleDateFormat)} - ${dayjs(
                        dateEnd
                      ).format(visibleDateFormat)}`}</Dates>
                    </Time>
                    {description ? <Description>{description}</Description> : null}
                  </Content>
                  <ButtonsWrapper>
                    <Action onClick={() => setOpenEditEventId(_id)}>Edit</Action>
                    <Action onClick={() => setOpenDeleteEventId(_id)}>X</Action>
                  </ButtonsWrapper>
                </Habit>
              )
            )}
          </ElementsWrapper>

          <HabitForm
            isOpen={Boolean(openEditEventId)}
            onClose={() => setOpenEditEventId('')}
            previousEvent={events?.data?.find(({ _id }) => _id === openEditEventId)}
          />
          <HabitDeleteConfirmation
            isOpen={Boolean(openDeleteEventId)}
            onClose={() => setOpenDeleteEventId('')}
            habit={events?.data?.find(({ _id }) => _id === openDeleteEventId)}
          />
        </>
      )}
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

export const ElementsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1;
  grid-template-rows: auto;
  gap: ${({ theme }) => theme.spacing[16]};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }
  @media (min-width: 1240px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
  }
`;

export const ElementWrapper = styled.section`
  display: flex;
  gap: ${({ theme }) => theme.spacing[16]};
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
  padding: ${({ theme }) => `${theme.spacing[16]}`};
`;

const Habit = styled(ElementWrapper)`
  background-color: ${({ theme }) => theme.colors.grays[900]};
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

const Time = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: baseline;
  font-size: ${({ theme }) => theme.fontSizes[14]};
`;

const Hours = styled.span`
  color: ${({ theme }) => theme.colors.grays[100]};
`;

const Dates = styled.span`
  color: ${({ theme }) => theme.colors.grays[600]};
`;

export const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => `${theme.spacing[64]} ${theme.spacing[16]} ${theme.spacing[32]} `};
  gap: ${({ theme }) => theme.spacing[24]};
`;
