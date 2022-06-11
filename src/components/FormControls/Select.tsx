import { ReactNode } from 'react';
import styled from 'styled-components';

interface SelectProps {
  options: ReactNode[];
  label: string;
}

export default function Select({ options, label }: SelectProps) {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <OptionsWrapper>{options}</OptionsWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes[16]};
`;

const OptionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[16]}`};
`;

interface DefaultOptionProps {
  active: boolean;
}

export const DefaultOption = styled.div<DefaultOptionProps>`
  --diameter: ${({ theme }) => theme.spacing[48]};
  --backgroundColor: ${({ theme, active }) =>
    active ? theme.colors.grays[300] : theme.colors.grays[1000]};
  --color: ${({ theme, active }) => (active ? theme.colors.grays[1000] : theme.colors.grays[300])};
  display: grid;
  place-content: center;
  width: var(--diameter);
  height: var(--diameter);
  border-radius: 50%;
  background-color: var(--backgroundColor);
  color: var(--color);
  border: 1px solid var(--color);

  transition: 300ms;
`;
