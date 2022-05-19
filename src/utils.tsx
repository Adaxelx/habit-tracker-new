import React, { ReactElement } from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider, QueryKey } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { tokenKey } from 'consts';
import IntlPolyfill from 'intl';
import { ThemeProvider } from 'styled-components';
import { theme } from 'styles/theme';
import messages, { flattenMessages, locale } from 'translations/index';

export const setupPolyfills = () => {
  if (global.Intl) {
    Intl.NumberFormat = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  } else {
    global.Intl = require('intl');
  }
};

export const getEnviromentalVariable = (ENV: 'API_URL') => process.env[`REACT_APP_${ENV}`];

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });

const customRender = (ui: React.ReactElement, options: Record<string, any> = { route: '/' }) => {
  window.history.pushState({}, 'Test page', options.route);
  const AllTheProviders = ({ children }: any) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale={locale.EN} messages={flattenMessages(messages[locale.EN])}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </IntlProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
  return { ...render(ui, { wrapper: AllTheProviders, ...options }), user: userEvent.setup() };
};
// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render, userEvent };

export const range = (start: number, end: number, step = 1) => {
  const output = [];
  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

export const generateUrlFromQueryKey = (queryKeys: QueryKey) => {
  return queryKeys.reduce(
    (previousUrl, queryKey) =>
      queryKey && typeof queryKey === 'object'
        ? `${previousUrl}${Object.entries(queryKey).reduce(
            (previousPartOfUrl, [key, value], index) =>
              `${previousPartOfUrl}${index === 0 ? '?' : '&'}${key}=${
                Array.isArray(value) ? value.join(',') : value
              }`,
            ''
          )}`
        : `${previousUrl}/${queryKey}`,
    ''
  ) as string;
};

export function client(endpoint: string, { body, ...customConfig }: any = {}) {
  const token = window.localStorage.getItem(tokenKey);
  const headers: any = { 'content-type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, config)
    .then(async response => {
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          return await response.json();
        }
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          const errorMessage = await response.json();
          throw new Error(errorMessage?.message);
        }
      }
    });
}
