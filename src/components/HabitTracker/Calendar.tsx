import 'react-calendar/dist/Calendar.css';

import React from 'react';
import RCalendar, { CalendarTileProperties } from 'react-calendar';
import dayjs from 'dayjs';
import styled from 'styled-components';

import useCalendar from './useCalendar';

export default function Calendar() {
  const from = '2022-05-01';
  const to = '2022-05-31';
  const calendarQuery = useCalendar({ from, to });

  return (
    <Wrapper>
      <RCalendar
        locale="en-EN"
        onChange={() => console.log('xd')}
        value={new Date()}
        tileContent={props => (
          <Tile
            {...props}
            color={
              calendarQuery.data?.events.find(event =>
                calendarQuery.data?.daysConnectedWithEvents[dayjs(props.date).date()].includes(
                  event._id
                )
              )?.label?.color
            }
          />
        )}
      />
    </Wrapper>
  );
}

const Tile = (props: CalendarTileProperties & { color?: string }) => {
  if (props.view !== 'month') return null;
  return <Dot color={props.color || '#ffffff'} />;
};

const Dot = styled.div`
  --dotDimension: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--dotDimension);
  height: var(--dotDimension);
  background-color: ${({ color }) => color};
  z-index: -1;
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
