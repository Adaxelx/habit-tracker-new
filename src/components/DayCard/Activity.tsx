import styled from 'styled-components';

interface Props {
  title: string;
  timeStart: string;
  timeEnd: string;
  description: string;
  checked: boolean;
}

export default function Activity({ title, timeStart, timeEnd, description, checked }: Props) {
  return (
    <Wrapper>
      <MainContent>
        <Subtext>{`${timeStart} - ${timeEnd}`}</Subtext>
        <h5>{title}</h5>
        <Subtext>{description}</Subtext>
      </MainContent>
      <Aside></Aside>
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
`;

const Subtext = styled.p`
  color: ${({ theme }) => theme.colors.grays[200]};
  font-size: ${({ theme }) => theme.fontSizes[14]};
`;

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  width: 32px; // tmp
`;

// const Divider = styled.div`
//   width: 3px;
//   height: 100%;
//   background-color: ${({ theme }) => theme.colors.grays[800]};
// `;
