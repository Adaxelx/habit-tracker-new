import React from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { tokenKey } from 'consts';
import styled from 'styled-components';
import { client } from 'utils';

import Button from 'components/Button';
import { Input } from 'components/FormControls';

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
  const { isLoading, mutate } = useMutation<LoginData, any, MutationData>(
    credentials => client('/users/login', { body: credentials }),
    {
      onSuccess: data => {
        navigate('/calendar');
        window.localStorage.setItem(tokenKey, data.token);
      },
    }
  );

  const handleSubmit = (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();
    const { login, password } = event.currentTarget.elements;
    mutate({ login: login.value, password: password.value });
  };

  return (
    <Wrapper>
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
        <Button disabled={isLoading} type="submit">
          Sign in
        </Button>
      </FormWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  --gap: ${({ theme }) => theme.spacing[16]};
  padding: ${({ theme }) => theme.spacing[16]};
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--gap);
`;

const FormWrapper = styled.form`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--gap);
`;
