import { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { dateFormat } from 'consts';
import dayjs from 'dayjs';
import styled from 'styled-components';

import DayCard from 'components/DayCard';

import { Event } from './useCalendar';

type EventsMap = Record<string, Event[]>;

export default function DayCardWrapper() {
  const from = '2022-04-25';
  const to = '2022-06-05';

  // Very similar to useCalendarContent hook
  const query = useQuery<Event[], unknown, EventsMap>(['events', { from, to }], {
    select: events => {
      const daysConnectedWithEvents: EventsMap = {};
      const fromDate = dayjs(from);
      const toDate = dayjs(to);

      events.forEach(event => {
        const dateStart = dayjs(event.dateStart);
        const dateEnd = dayjs(event.dateEnd);

        let startBorderDate = fromDate.isAfter(dateStart) ? fromDate : dateStart;
        const endBorderDate = toDate.isBefore(dateEnd.add(1, 'day')) ? toDate : dateEnd;

        while (startBorderDate.isBefore(endBorderDate.add(1, 'day'))) {
          if (event.daysOfWeek.includes(startBorderDate.day())) {
            const index = startBorderDate.format(dateFormat);
            if (Array.isArray(daysConnectedWithEvents[index])) {
              daysConnectedWithEvents[index].push(event);
            } else {
              daysConnectedWithEvents[index] = [event];
            }
          }
          startBorderDate = startBorderDate.add(1, 'day');
        }
      });

      return daysConnectedWithEvents;
    },
  });

  if (!query.data) return null;
  return <View data={query.data} />;
}

function View({ data }: { data: EventsMap }) {
  const ref = useScrollHorizontalToCenter();
  return (
    <Wrapper ref={ref}>
      {Object.entries(data).map(([date, events]) => (
        <DayCardWithScroll date={date} events={events} />
      ))}
    </Wrapper>
  );
}

function useScrollHorizontalToCenter() {
  const wrapper = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!wrapper.current) return;
    const offsetLeft = wrapper.current?.offsetLeft;
    const width = wrapper.current?.scrollWidth / 2;
    wrapper.current.scrollTo({ left: offsetLeft + width, top: 0 });
  }, []);

  return wrapper;
}

const Wrapper = styled.section`
  overflow-x: scroll;

  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing[16]};
  scroll-snap-type: x mandatory;
`;

const DayCardWithScroll = styled(DayCard)`
  scroll-snap-align: start;
  scroll-snap-align: center;
`;
