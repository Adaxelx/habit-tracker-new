import { useLayoutEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { dateFormat } from 'consts';
import dayjs from 'dayjs';
import styled from 'styled-components';

import DayCard from 'components/DayCard';
import { getEndDate, getStartDate } from 'helpers/calendar';

import { Event } from './useCalendar';

type EventsMap = Record<string, Event[]>;

interface DayCardWrapperProps {
  activeDate: Date;
}

function generateDefaultDateMap<ValueType>({ from, to }: { from: string; to: string }) {
  const dateMap: Record<string, ValueType[]> = {};
  let fromDate = dayjs(from);
  const toDate = dayjs(to);
  while (fromDate.isBefore(toDate.add(1, 'day'))) {
    dateMap[fromDate.format(dateFormat)] = [];
    fromDate = fromDate.add(1, 'day');
  }
  return dateMap;
}

export default function DayCardWrapper({ activeDate }: DayCardWrapperProps) {
  const from = getStartDate(activeDate);
  const to = getEndDate(activeDate);

  // Very similar to useCalendarContent hook
  const query = useQuery<Event[], unknown, EventsMap>(['events', { from, to }], {
    select: events => {
      const daysConnectedWithEvents = generateDefaultDateMap<Event>({ from, to });
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
  return <View data={query.data} activeDate={activeDate} />;
}

function View({ data, activeDate }: { data: EventsMap; activeDate: Date }) {
  const ref = useScrollHorizontalToCenter(data);
  useScrollActiveCardToCenter(activeDate, ref);
  return (
    <Wrapper ref={ref}>
      {Object.entries(data).map(([date, events]) => (
        <DayCardWithScroll date={date} events={events} />
      ))}
    </Wrapper>
  );
}

function useScrollActiveCardToCenter(
  activeDate: Date,
  wrapperRef: React.MutableRefObject<HTMLElement | null>
) {
  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    document
      ?.getElementById(`dayCard:${dayjs(activeDate).format(dateFormat)}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'center' });
  }, [activeDate, wrapperRef]);
}

function useScrollHorizontalToCenter(refreshKey: unknown) {
  const wrapper = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!wrapper.current) return;
    const offsetLeft = wrapper.current?.offsetLeft;
    const width = wrapper.current?.scrollWidth / 2;
    wrapper.current.scrollTo({ left: offsetLeft + width, top: 0 });
  }, [refreshKey]);

  return wrapper;
}

const Wrapper = styled.section`
  overflow-x: scroll;
  padding-bottom: ${({ theme }) => theme.spacing[16]};
  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing[16]};
  scroll-snap-type: x mandatory;
`;

const DayCardWithScroll = styled(DayCard)`
  scroll-snap-align: start;
  scroll-snap-align: center;
`;
