import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MutationCache } from 'react-query';
import { createWebStoragePersister } from 'react-query/createWebStoragePersister';
import { ReactQueryDevtools } from 'react-query/devtools';
import { persistQueryClient } from 'react-query/persistQueryClient';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekday from 'dayjs/plugin/weekday';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, ResetStyle } from 'styles/globalStyles';
import { theme } from 'styles/theme';
import messages, { flattenMessages, locale } from 'translations';
import { client, generateUrlFromQueryKey } from 'utils';

// import DayCard from 'components/DayCard';
import { Login, Register } from 'components/Account';
import HabitTracker from 'components/HabitTracker';
import ToastContainer, { showToast } from 'components/ToastContainer';

dayjs.extend(isoWeek);
dayjs.extend(updateLocale);
dayjs.extend(weekday);

dayjs.updateLocale('en', {
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
});

const MergedGlobalStyles = () => (
  <>
    <GlobalStyles />
    <ResetStyle />
  </>
);

type ErrorType = {
  message: string;
};

const onError = (err: unknown) => {
  const error = err as ErrorType;
  showToast(error.message, { type: 'error' });
};

const mutationCache = new MutationCache({
  onError: error => {
    console.log(error);
  },
  onSuccess: data => {
    console.log(data);
  },
});

mutationCache.subscribe(mutation => {
  const filtered = mutationCache.getAll().filter(prevMutation => {
    if (
      Array.isArray(
        (prevMutation?.state?.variables as unknown as { date: [string, string, string] })?.date
      ) &&
      Array.isArray(mutation?.mutation?.state?.variables?.date)
    ) {
      const [mYear, mMonth, mDay] = (
        prevMutation?.state?.variables as unknown as { date: [string, string, string] }
      )?.date;
      const [year, month, day] = mutation?.mutation?.state?.variables?.date;
      return (
        year === mYear &&
        mMonth === month &&
        mDay === day &&
        mutation.mutation.mutationId !== prevMutation.mutationId
      );
    }
    return false;
  });

  filtered.forEach(mutation => {
    mutationCache.remove(mutation);
  });
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ({ queryKey }) => {
        const url = generateUrlFromQueryKey(queryKey);
        return client(url);
      },
      onError,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 60 * 24,
    },
    mutations: {
      onError,
    },
  },
  mutationCache,
});

const localStoragePersistor = createWebStoragePersister({ storage: window.localStorage });

persistQueryClient({
  queryClient,
  persister: localStoragePersistor,
});

function App() {
  return (
    <IntlProvider locale={locale.EN} messages={flattenMessages(messages[locale.EN])}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <MergedGlobalStyles />
          {/* <DayCard {...mockedDay} /> */}
          <ToastContainer />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/habit-tracker" element={<HabitTracker />} />
            </Routes>
          </BrowserRouter>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </IntlProvider>
  );
}

export default App;
