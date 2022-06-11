import { ReactNode } from 'react';
import styled from 'styled-components';

interface SelectProps {
  options: ReactNode[];
  label: string;
  selected?: string;
}

export default function Select({ options, label, selected }: SelectProps) {
  return (
    <Wrapper>
      <HeaderWrapper>
        <Label>{label}</Label>
        {selected ? <Selected>{selected}</Selected> : null}
      </HeaderWrapper>
      <OptionsWrapper>{options}</OptionsWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes[16]};
`;

const Selected = styled.span`
  font-size: ${({ theme }) => theme.fontSizes[20]};
  font-weight: bold;
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
