import { InputHTMLAttributes } from 'react';
import VisuallyHidden from '@reach/visually-hidden';
import styled from 'styled-components';

export default function Input({
  htmlFor,
  name,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { htmlFor: string }) {
  return (
    <Wrapper>
      <VisuallyHidden>
        <label htmlFor={htmlFor}>{name}</label>
      </VisuallyHidden>
      <NativeInput id={htmlFor} name={name} {...rest} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;

const NativeInput = styled.input`
  height: 48px;
  width: 100%;
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
  color: ${({ theme }) => theme.colors.grays[200]};
  background-color: ${({ theme }) => theme.colors.grays[900]};
  border: none;
  padding: ${({ theme }) => `0 ${theme.spacing[16]}`};
`;
