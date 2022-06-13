import { ReactNode } from 'react';
import { ErrorBoundary as RCErrorBoundary } from 'react-error-boundary';
import { BiErrorAlt } from 'react-icons/bi';
import { QueryErrorResetBoundary } from 'react-query';
import styled from 'styled-components';

import Button from 'components/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <RCErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary, error }) => (
            <Wrapper>
              <IconWrapper>
                <BiErrorAlt />
              </IconWrapper>
              <h1>Something went wrong!</h1>
              <Message>{`Error message: ${error.message ?? 'Missing message.'} `}</Message>
              <Button onClick={() => resetErrorBoundary()}>Try again</Button>
            </Wrapper>
          )}
        >
          {children}
        </RCErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

const IconWrapper = styled.div`
  font-size: ${({ theme }) => theme.fontSizes[48]};
  color: red;
`;

const Wrapper = styled.article`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[16]};
  align-items: center;
  justify-content: center;
`;

const Message = styled.span`
  font-size: ${({ theme }) => theme.fontSizes[24]};
  font-weight: medium;
`;
