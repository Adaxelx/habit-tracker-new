import { createGlobalStyle, css } from 'styled-components';

//https://www.joshwcomeau.com/css/custom-css-reset/
// css for autoformatting https://github.com/styled-components/vscode-styled-components/issues/175
export const ResetStyle = createGlobalStyle`${css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  /*
    2. Remove default margin
  */
  * {
    margin: 0;
  }
  /*
    3. Allow percentage-based heights in the application
  */
  html,
  body {
    height: 100%;
  }
  /*
    Typographic tweaks!
    4. Add accessible line-height
    5. Improve text rendering
  */
  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  /*
    6. Improve media defaults
  */
  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }
  /*
    7. Remove built-in form typography styles
  */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }
  /*
    8. Avoid text overflows
  */
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }
  /*
    9. Create a root stacking context
  */
  #root,
  #__next {
    isolation: isolate;
  }
`}
`;

export const GlobalStyles = createGlobalStyle`${css`
  color: ${({ theme }) => theme.colors.grays[50]};
  h1 {
    font-size: ${({ theme }) => theme.fontSizes[48]};
    line-height: 1;
  }
  h2 {
    font-size: ${({ theme }) => theme.fontSizes[40]};
    line-height: 1.2;
  }
  h3 {
    font-size: ${({ theme }) => theme.fontSizes[32]};
    line-height: 1.3;
  }
  h4 {
    font-size: ${({ theme }) => theme.fontSizes[24]};
  }
  h5 {
    font-size: ${({ theme }) => theme.fontSizes[20]};
  }
`}`;
