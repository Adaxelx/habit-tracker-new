import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekday from 'dayjs/plugin/weekday';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, ResetStyle } from 'styles/globalStyles';
import { theme } from 'styles/theme';
import messages, { flattenMessages, locale } from 'translations';
import { client, generateUrlFromQueryKey } from 'utils';

import DayCard from 'components/DayCard';

dayjs.extend(isoWeek);
dayjs.extend(updateLocale);
dayjs.extend(weekday);

dayjs.updateLocale('en', {
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
});

const mockedDay = {
  date: new Date(),
};

const MergedGlobalStyles = () => (
  <>
    <GlobalStyles />
    <ResetStyle />
  </>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ({ queryKey }) => {
        const url = generateUrlFromQueryKey(queryKey);
        return client(url);
      },
    },
  },
});

function App() {
  return (
    <IntlProvider locale={locale.EN} messages={flattenMessages(messages[locale.EN])}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <MergedGlobalStyles />
          <DayCard {...mockedDay} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </IntlProvider>
  );
}

export default App;
