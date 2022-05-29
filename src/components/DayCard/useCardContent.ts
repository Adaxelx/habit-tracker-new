import { useQuery } from 'react-query';
import { dateFormat } from 'consts';
import dayjs from 'dayjs';

export interface LabelProperties {
  title: string;
  color: string;
}

export interface Label extends LabelProperties {
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
  checked?: Checked[];
}

export type Checked = {
  day: number;
  month: number;
  year: number;
  _id: string;
};

type EventsMap = Record<string, string[]>;

type UseCalendarProps = {
  from: string;
  to: string;
};

export default function useCardContent({ from, to }: UseCalendarProps) {
  return useQuery<Event[], unknown, EventsMap>(['events', { from, to }], {
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
            const labelColor = event.label ? event.label.color : '#000000';
            if (Array.isArray(daysConnectedWithEvents[index])) {
              daysConnectedWithEvents[index].push(labelColor);
            } else {
              daysConnectedWithEvents[index] = [labelColor];
            }
          }
          startBorderDate = startBorderDate.add(1, 'day');
        }
      });

      return daysConnectedWithEvents;
    },
  });
}
