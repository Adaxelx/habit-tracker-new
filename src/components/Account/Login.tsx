import React from 'react';
import { useMutation } from 'react-query';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { client } from 'utils';

import Button from 'components/Button';
import { Input } from 'components/FormControls';

import { useUser } from './UserContext';

interface FormElements extends HTMLFormControlsCollection {
  login: HTMLInputElement;
  password: HTMLInputElement;
}
interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

type LoginData = {
  token: string;
};

type MutationData = { login: string; password: string };

export default function Login() {
  const navigate = useNavigate();
  const { dispatch, state } = useUser();
  const { mutate, isLoading } = useMutation<LoginData, any, MutationData>(
    credentials => client('/users/login', { body: credentials }),
    {
      onSuccess: data => {
        navigate('/habit-tracker');
        dispatch({ type: 'login', payload: { token: data.token } });
      },
    }
  );

  if (state.token) {
    return <Navigate to="/habit-tracker" replace />;
  }

  const handleSubmit = (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();
    const { login, password } = event.currentTarget.elements;
    mutate({ login: login.value, password: password.value });
  };

  return (
    <Wrapper>
      <ContentWrapper>
        <h2>Welcome again!</h2>
        <FormWrapper noValidate onSubmit={handleSubmit}>
          <Input htmlFor="login" name="login" placeholder="user123" minLength={6} />
          <Input
            htmlFor="password"
            type="password"
            name="password"
            placeholder="password"
            minLength={6}
          />
          <Button disabled={!navigator.onLine || isLoading} type="submit">
            Sign in
          </Button>
        </FormWrapper>
      </ContentWrapper>
    </Wrapper>
  );
}

export const ContentWrapper = styled.div`
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  padding: ${({ theme }) => theme.spacing[48]};
  background-color: ${({ theme }) => theme.colors.grays[1000]};
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
`;

export const Wrapper = styled.main`
  --gap: ${({ theme }) => theme.spacing[16]};
  padding: ${({ theme }) => theme.spacing[16]};
  height: 100%;
  width: 100%;

  display: grid;
  place-content: center;
`;

const FormWrapper = styled.form`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--gap);
`;
