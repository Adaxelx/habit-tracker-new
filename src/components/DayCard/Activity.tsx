import { check } from 'prettier';
import styled from 'styled-components';

import Checkbox from 'components/FormControls/Checkbox';

import { Event } from './useCardContent';

export default function Activity({ title, timeStart, timeEnd, description, checked }: Event) {
  return (
    <Wrapper>
      <MainContent>
        <h5>{title}</h5>
        <Subtext>{`${timeStart} - ${timeEnd}`}</Subtext>
        <Subtext>{description}</Subtext>
      </MainContent>
      <Aside>
        <Checkbox />
        <Badge />
      </Aside>
    </Wrapper>
  );
}

const Wrapper = styled.article`
  position: relative;

  width: 100%;
  background-color: ${({ theme }) => theme.colors.grays[900]};
  height: 140px;
  min-height: 140px;
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[16]}`};

  display: flex;
  gap: 16px;
`;

const MainContent = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-grow: 1;
`;

const Subtext = styled.p`
  color: ${({ theme }) => theme.colors.grays[200]};
  font-size: ${({ theme }) => theme.fontSizes[14]};
`;

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  width: 32px; // tmp
  gap: ${({ theme }) => theme.spacing[12]};
  align-items: center;
`;

// const Divider = styled.div`
//   width: 3px;
//   height: 100%;
//   background-color: ${({ theme }) => theme.colors.grays[800]};
// `;

const Badge = styled.div`
  --size: ${({ theme }) => theme.spacing[24]};
  width: var(--size);
  height: var(--size);
  background-color: ${({ theme }) => theme.colors.grays[800]};
  border-radius: ${({ theme }) => theme.cornerRadius.small};
`;
