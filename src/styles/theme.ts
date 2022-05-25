import { hsl, rem } from 'polished';
import { DefaultTheme } from 'styled-components';

import { Spacing, spacing } from './utils';

export const theme: DefaultTheme = {
  colors: {
    grays: {
      50: hsl(210, 0.19, 0.1),
      100: hsl(210, 0.15, 0.2),
      200: hsl(210, 0.15, 0.25),
      300: hsl(210, 0.1, 0.4),
      400: hsl(210, 0.09, 0.45),
      500: hsl(210, 0.08, 0.5),
      600: hsl(210, 0.12, 0.5),
      700: hsl(210, 0.14, 0.66),
      800: hsl(210, 0.2, 0.77),
      900: hsl(210, 0.25, 0.88),
      1000: hsl(210, 0.25, 0.96),
    },
  },
  cornerRadius: {
    regular: '8px',
    small: '4px',
  },
  fontSizes: {
    48: rem(48),
    40: rem(40),
    32: rem(32),
    24: rem(24),
    20: rem(20),
    18: rem(18),
    16: rem(16),
    14: rem(14),
    12: rem(12),
  },
  spacing: spacing.reduce(
    (previousSpacing, space) => ({ ...previousSpacing, [space]: `${space}px` }),
    {}
  ) as Record<Spacing, string>,
};
