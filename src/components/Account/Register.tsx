import React from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { tokenKey } from 'consts';
import styled from 'styled-components';
import { client } from 'utils';

import Button from 'components/Button';
import { Input } from 'components/FormControls';
import { showToast } from 'components/ToastContainer';

interface FormElements extends HTMLFormControlsCollection {
  login: HTMLInputElement;
  password: HTMLInputElement;
  passwordRepeat: HTMLInputElement;
  email: HTMLInputElement;
}
interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

type LoginData = {
  token: string;
};

type MutationData = { login: string; password: string; email: string };

export default function Login() {
  const navigate = useNavigate();
  const { isLoading, mutate } = useMutation<LoginData, any, MutationData>(
    data => client('/users/register', { body: data }),
    {
      onSuccess: data => {
        navigate('/calendar');
        window.localStorage.setItem(tokenKey, data.token);
      },
    }
  );

  const handleSubmit = (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();
    const { login, password, passwordRepeat, email } = event.currentTarget.elements;
    if (password.value !== passwordRepeat.value) {
      showToast('Passwords must be the same', { type: 'error' });
      return;
    }
    mutate({ login: login.value, password: password.value, email: email.value });
  };

  return (
    <Wrapper>
      <h2>Create acount!</h2>
      <FormWrapper onSubmit={handleSubmit}>
        <Input htmlFor="email" type="email" name="email" placeholder="example@gmail.com" />
        <Input htmlFor="login" name="login" placeholder="user123" />
        <Input htmlFor="password" type="password" name="password" placeholder="password" />
        <Input
          htmlFor="passwordRepeat"
          type="password"
          name="passwordRepeat"
          placeholder="password (repeat)"
        />
        <Button disabled={isLoading} type="submit">
          Send
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
