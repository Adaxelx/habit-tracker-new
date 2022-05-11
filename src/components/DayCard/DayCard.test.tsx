import { range, render, screen } from 'utils';

import DayCard from './DayCard';

const mondayDate = 16;

const props = {
  date: new Date(`05/${mondayDate}/2022`),
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

test('should show correct day of week name', () => {
  const { rerender } = render(<DayCard {...props} />);

  range(mondayDate, mondayDate + 7).forEach((day, index) => {
    rerender(<DayCard {...props} date={new Date(`05/${day}/2022`)} />);
    expect(screen.getByText(daysOfWeek[index])).toBeInTheDocument();
  });
});
