import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <NativeButton {...props} />;
}

const NativeButton = styled.button`
  position: relative;
  height: 48px;
  min-width: ${({ theme }) => theme.spacing[128]};
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[16]}`};
  font-size: ${({ theme }) => theme.fontSizes[16]};
  color: ${({ theme }) => theme.colors.grays[900]};
  background-color: ${({ theme }) => theme.colors.grays[500]};
  border: none;
  border-radius: ${({ theme }) => theme.cornerRadius.regular};

  &:disabled {
    background-color: ${({ theme }) => theme.colors.grays[700]};
  }
`;

// import { ButtonHTMLAttributes } from 'react';
// import styled from 'styled-components';

// export default function Button({ children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
//   return (
//     <NativeButton {...rest}>
//       <Shadow />
//       <Edge />
//       <Front>{children}</Front>
//     </NativeButton>
//   );
// }

// const NativeButton = styled.button`
//   /* position: relative;
//   height: 48px;
//   min-width: ${({ theme }) => theme.spacing[128]};
//   padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[16]}`};

//   font-size: ${({ theme }) => theme.fontSizes[16]};
//   color: ${({ theme }) => theme.colors.grays[900]};
//   background-color: ${({ theme }) => theme.colors.grays[500]};
//   border: none;
//   border-radius: ${({ theme }) => theme.cornerRadius.regular};
//   isolation: isolate; */

//   position: relative;
//   border: none;
//   background: transparent;
//   padding: 0;
//   cursor: pointer;
//   outline-offset: 4px;
//   transition: filter 250ms;

//   &:focus:not(:focus-visible) {
//     outline: none;
//   }

//   &:hover {
//     filter: brightness(110%);
//   }
// `;

// const Shadow = styled.span`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   border-radius: 12px;
//   background: hsl(0deg 0% 0% / 0.25);
//   will-change: transform;
//   transform: translateY(2px);
//   transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
//   ${NativeButton}:active & {
//     transform: translateY(1px);
//     transition: transform 34ms;
//   }
//   ${NativeButton}:hover & {
//     transform: translateY(4px);
//     transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
//   }
// `;
// const Edge = styled.span`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   border-radius: 12px;
//   background: linear-gradient(
//     to left,
//     hsl(340deg 100% 16%) 0%,
//     hsl(340deg 100% 32%) 8%,
//     hsl(340deg 100% 32%) 92%,
//     hsl(340deg 100% 16%) 100%
//   );
// `;
// const Front = styled.span`
//   display: block;
//   position: relative;
//   padding: 12px 42px;
//   border-radius: 12px;
//   font-size: 1.25rem;
//   color: white;
//   background: hsl(345deg 100% 47%);
//   will-change: transform;
//   transform: translateY(-4px);
//   transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
//   ${NativeButton}:active & {
//     transform: translateY(-2px);
//     transition: transform 34ms;
//   }
//   ${NativeButton}:hover & {
//     transform: translateY(-6px);
//     transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
//   }
// `;
