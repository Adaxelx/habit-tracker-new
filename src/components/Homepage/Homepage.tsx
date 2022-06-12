import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useUser } from 'components/Account/UserContext';
import Button from 'components/Button';

export default function Homepage() {
  const navigate = useNavigate();
  const { state } = useUser();

  if (state.token) {
    return <Navigate to="/habit-tracker" replace />;
  }

  return (
    <Wrapper>
      <LoginButton variant="tertiary" onClick={() => navigate('/login')}>
        Log in
      </LoginButton>
      <OuterCircle>
        {/* <Rectangle /> */}
        <InnerCircle />
      </OuterCircle>
      <ContentWrapper>
        <h1>Habit tracker</h1>
        <h5>Achive everything you want!</h5>
        <RegisterButton onClick={() => navigate('/register')}>Create account</RegisterButton>
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  display: grid;
  place-content: center;
  width: 100%;
  height: 100%;
`;

const ContentWrapper = styled.header`
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

const Rectangle = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(10%, -50%);
  background-color: ${({ theme }) => theme.colors.grays[800]};
  /* padding: ${({ theme }) => `${theme.spacing[12]} ${theme.spacing[24]}`}; */
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
  width: 333px;
  height: 174px;
`;

const RegisterButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing[24]};
`;

const LoginButton = styled(Button)`
  --space: ${({ theme }) => theme.spacing[8]};
  position: fixed;
  top: var(--space);
  right: var(--space);
  min-width: 0;
`;

const Circle = styled.div`
  position: absolute;

  top: 50%;
  transform: translateY(-50%);
  height: var(--size);
  width: var(--size);
  border-radius: 50%;
`;

const OuterCircle = styled(Circle)`
  --size: 100vh;
  @media (min-width: 460px) {
    --size: 140vh;
    right: 40%;
  }

  @media (orientation: landscape) {
    --size: 100vw;

    @media (min-width: 460px) {
      --size: 140vw;
    }
  }
  right: ${({ theme }) => theme.spacing[48]};
  background-color: ${({ theme }) => theme.colors.grays[800]};
`;

const InnerCircle = styled(Circle)`
  --size: 80vh;

  @media (min-width: 460px) {
    --size: 120vh;
  }

  @media (orientation: landscape) {
    --size: 80vw;

    @media (min-width: 460px) {
      --size: 120vw;
    }
  }
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.colors.grays[900]};
`;
