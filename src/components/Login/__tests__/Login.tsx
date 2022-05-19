import { faker } from '@faker-js/faker';
import { render, screen, userEvent } from 'utils';

import Login from '../Login';

test('should login in if data is correct', async () => {
  render(<Login />);

  const login = faker.random.word();
  const password = faker.random.word();
  userEvent.type(screen.getByLabelText('login'), login);
  userEvent.type(screen.getByLabelText('password'), password);
  userEvent.click(
    screen.getByRole('button', {
      name: /sign in/i,
    })
  );
});
