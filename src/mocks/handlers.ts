import { rest } from 'msw';
import { getEnviromentalVariable } from 'utils';

const url = getEnviromentalVariable('API_URL');

export const handlers = [
  rest.post(`${url}/users/login`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ token: 'abc' }));
  }),
];
