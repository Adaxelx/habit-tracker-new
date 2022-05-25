import 'styled-components';

import { FontSizes, Grays, Spacing } from './utils';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      grays: Record<Grays, string>;
    };
    cornerRadius: {
      regular: string;
      small: string;
    };
    fontSizes: Record<FontSizes, string>;
    spacing: Record<Spacing, string>;
  }

  export type PolymorphicComponent = keyof JSX.IntrinsicElements | React.ComponentType<any>;
}
