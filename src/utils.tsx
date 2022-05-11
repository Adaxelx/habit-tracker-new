import React from 'react';
import { IntlProvider } from 'react-intl';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const customRender = (
  ui: React.ReactElement,
  { orderProposalInitialState, loaderInitialState, ...options }: any = {
    orderProposalInitialState: { orderProposalId: '123' },
  }
) => {
  const AllTheProviders = ({ children }: any) => (
    <IntlProvider locale={locale.EN} messages={flattenMessages(messages[locale.EN])}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </IntlProvider>
  );
  return render(ui, { wrapper: AllTheProviders, ...options });
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
