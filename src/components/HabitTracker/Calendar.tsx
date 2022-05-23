import 'react-calendar/dist/Calendar.css';

import React, { useState } from 'react';
import RCalendar, { CalendarTileProperties } from 'react-calendar';
import { dateFormat } from 'consts';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { getEndDate, getStartDate } from 'helpers/calendar';

import useCalendar from './useCalendar';

export default function Calendar() {
  const [activeDate, setActiveDate] = useState(new Date());
  const [navigationDate, setNavigationDate] = useState(new Date());

  const calendarQuery = useCalendar({
    from: getStartDate(navigationDate),
    to: getEndDate(navigationDate),
  });

  return (
    <Wrapper>
      <RCalendar
        locale="en-EN"
        value={activeDate}
        onChange={(newDate: Date) => setActiveDate(newDate)}
        activeStartDate={navigationDate}
        onActiveStartDateChange={({ activeStartDate }) => {
          setNavigationDate(activeStartDate);
        }}
        tileContent={props => {
          return (
            <>
              {calendarQuery?.data?.[dayjs(props.date).format(dateFormat)]?.map((color, index) => (
                <Tile {...props} color={color} key={index} index={index} />
              ))}
            </>
          );
        }}
      />
    </Wrapper>
  );
}

const Tile = (props: CalendarTileProperties & { color?: string; index?: number }) => {
  if (props.view !== 'month') return null;
  return <Dot color={props.color} />;
};

const Dot = styled.div`
  --dotDimension: 8px;
  position: absolute;
  top: 0%;
  left: 3px;
  width: var(--dotDimension);
  height: var(--dotDimension);
  background-color: ${({ color }) => color};
  z-index: 22;
  border-radius: 9999px;
`;

const Wrapper = styled.div`
  .react-calendar {
    border-radius: 8px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    padding: ${({ theme }) => theme.spacing[32]};
    margin: 0;
    background-color: ${({ theme }) => theme.colors.grays[1000]};
  }
  .react-calendar__month-view {
    .react-calendar__month-view__weekdays__weekday {
      color: ${({ theme }) => theme.colors.grays[300]};
      text-transform: capitalize;
      font-size: ${({ theme }) => theme.fontSizes[12]};
      & > abbr {
        text-decoration: none;
        position: relative;
        z-index: 1;
      }
    }
    .react-calendar__navigation__label {
      font-size: ${({ theme }) => theme.fontSizes[20]};
      color: ${({ theme }) => theme.colors.grays[300]};
    }

    .react-calendar__tile {
      position: relative;
      max-width: ${({ theme }) => theme.spacing[48]};
      height: ${({ theme }) => theme.spacing[48]};
    }
  }
`;
