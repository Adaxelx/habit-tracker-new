import { hsl } from 'polished';
import { DefaultTheme } from 'styled-components';

export const defaultTheme: DefaultTheme = {
  colors: {
    grays: {
      50: hsl(210, 19, 10),
      100: hsl(210, 15, 20),
      200: hsl(210, 15, 25),
      300: hsl(210, 10, 40),
      400: hsl(210, 9, 45),
      500: hsl(210, 8, 50),
      600: hsl(210, 12, 50),
      700: hsl(210, 14, 66),
      800: hsl(210, 20, 77),
      900: hsl(210, 25, 88),
      1000: hsl(210, 25, 96),
    },
  },
};
