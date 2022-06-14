import { useLayoutEffect, useMemo, useRef } from 'react';
import { useQuery } from 'react-query';
import { dateFormat } from 'consts';
import dayjs from 'dayjs';
import styled from 'styled-components';

import DayCard from 'components/DayCard';
import { DayCardSkeleton } from 'components/DayCard/DayCard';
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
  const refreshKey = useMemo(() => ({ from, to }), [from, to]);

  if (!query.isPaused && query.isLoading) {
    return (
      <Wrapper>
        {new Array(15).fill(10).map(value => {
          return <DayCardSkeleton />;
        })}
      </Wrapper>
    );
  } else if (query.isError) {
    return null;
  }

  return <View data={query.data} refreshKey={refreshKey} activeDate={activeDate} />;
}

interface ViewProps {
  data?: EventsMap;
  activeDate: Date;
  refreshKey: { from: string; to: string };
}

function View({ data, activeDate, refreshKey }: ViewProps) {
  const ref = useScrollHorizontalToCenter(refreshKey);
  useScrollActiveCardToCenter(activeDate, ref);
  return (
    <Wrapper ref={ref}>
      {Object.entries(data ?? {}).map(([date, events]) => {
        return (
          <DayCardWithScroll
            date={date}
            isActive={dayjs(activeDate).isSame(dayjs(date))}
            events={events}
          />
        );
      })}
    </Wrapper>
  );
}

function useScrollActiveCardToCenter(
  activeDate: Date,
  wrapperRef: React.MutableRefObject<HTMLElement | null>
) {
  useLayoutEffect(() => {
    const cardElement = document?.getElementById(`dayCard:${dayjs(activeDate).format(dateFormat)}`);
    if (!wrapperRef.current || !cardElement) return;
    const centerOfCard = cardElement.offsetLeft - window.innerWidth / 2;
    wrapperRef.current?.scrollTo({
      top: 0,
      left: centerOfCard,
      behavior: 'smooth',
    });
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

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DayCardWithScroll = styled(DayCard)`
  scroll-snap-align: start;
  scroll-snap-align: center;
`;
