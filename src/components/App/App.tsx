import React from 'react';
import { IntlProvider } from 'react-intl';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekday from 'dayjs/plugin/weekday';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, ResetStyle } from 'styles/globalStyles';
import { theme } from 'styles/theme';
import messages, { flattenMessages, locale } from 'translations';

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

function App() {
  return (
    <IntlProvider locale={locale.EN} messages={flattenMessages(messages[locale.EN])}>
      <ThemeProvider theme={theme}>
        <MergedGlobalStyles />
        <DayCard {...mockedDay} />
      </ThemeProvider>
    </IntlProvider>
  );
}

export default App;
