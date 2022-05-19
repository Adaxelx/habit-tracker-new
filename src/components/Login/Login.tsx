import React from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
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

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useMutation(
    (credentials: { login: string; password: string }) =>
      client('/users/login', { body: credentials }),
    {
      onSuccess: () => {
        navigate('/calendar');
      },
    }
  );

  const handleSubmit = (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();
    const { login, password } = event.currentTarget.elements;
    loginMutation.mutate({ login: login.value, password: password.value });
  };

  return (
    <Wrapper>
      <h2>Welcome again!</h2>
      <FormWrapper onSubmit={handleSubmit}>
        <Input htmlFor="login" name="login" />
        <Input htmlFor="password" type="password" name="password" />
        <Button type="submit">Sign in</Button>
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
