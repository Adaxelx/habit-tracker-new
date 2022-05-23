import { range, render, screen } from 'utils';

import DayCard from './DayCard';

const mondayDate = 16;

const events = [
  {
    _id: '123',
    userId: '123',
    daysOfWeek: [1],
    title: 'Event',
    timeStart: '12:00',
    timeEnd: '13:00',
    dateStart: '2022-05-21',
    dateEnd: '2022-06-21',
    description: 'opis',
  },
];

const props = {
  date: `05/${mondayDate}/2022`,
  events,
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

test('should show correct day of week name', () => {
  const { rerender } = render(<DayCard {...props} />);

  range(mondayDate, mondayDate + 7).forEach((day, index) => {
    rerender(<DayCard {...props} date={`05/${day}/2022`} />);
    expect(screen.getByText(daysOfWeek[index])).toBeInTheDocument();
  });
});
