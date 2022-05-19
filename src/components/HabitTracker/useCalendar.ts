import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { range } from 'utils';

export interface LabelSend {
  title: string;
  color: string;
}

export interface Label extends LabelSend {
  _id: string;
  userId: string;
}

export interface EventInterface {
  daysOfWeek: number[];
  title: string;
  timeStart: string;
  timeEnd: string;
  dateStart: string;
  dateEnd: string;
  description?: string;
}

export interface EventSend extends EventInterface {
  label?: string;
}

export interface Event extends EventInterface {
  _id: string;
  userId: string;
  label?: Label;
  checked?: [
    {
      day: number;
      month: number;
      year: number;
      _id: string;
    }
  ];
}

type EventsMap = Record<string, string[]>;

type UseCalendarProps = {
  from: string;
  to: string;
};

export default function useCalendar({ from, to }: UseCalendarProps) {
  return useQuery<Event[], unknown, { events: Event[]; daysConnectedWithEvents: EventsMap }>(
    ['events', { from, to }],
    {
      select: events => {
        const daysConnectedWithEvents: EventsMap = range(1, 32).reduce(
          (previousObject, key) => Object.assign(previousObject, { [key]: [] }),
          {}
        );

        events.forEach(event => {
          const dateStart = dayjs(event.dateStart);
          const dateEnd = dayjs(event.dateEnd);
          const fromDate = dayjs(from);
          const toDate = dayjs(to);

          let startBorderDate = fromDate.isAfter(dateStart) ? fromDate : dateStart;
          const endBorderDate = toDate.isBefore(dateEnd.add(1, 'day')) ? toDate : dateEnd;

          while (startBorderDate.isBefore(endBorderDate.add(1, 'day'))) {
            if (event.daysOfWeek.includes(startBorderDate.day())) {
              daysConnectedWithEvents[startBorderDate.date()].push(event._id);
            }
            startBorderDate = startBorderDate.add(1, 'day');
          }
        });
        return { daysConnectedWithEvents, events };
      },
    }
  );
}
