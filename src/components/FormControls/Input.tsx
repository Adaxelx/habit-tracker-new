import { Fragment, InputHTMLAttributes } from 'react';
import VisuallyHidden from '@reach/visually-hidden';
import styled from 'styled-components';

export default function Input({
  htmlFor,
  name,
  showLabel = false,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { htmlFor: string; showLabel?: boolean }) {
  const LabelWrapper = showLabel ? Fragment : VisuallyHidden;
  return (
    <Wrapper>
      <LabelWrapper>
        <label htmlFor={htmlFor}>{name}</label>
      </LabelWrapper>
      <NativeInput id={htmlFor} name={name} {...rest} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NativeInput = styled.input`
  height: 48px;
  width: 100%;
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
  color: ${({ theme }) => theme.colors.grays[200]};
  background-color: ${({ theme }) => theme.colors.grays[900]};
  border: none;
  padding: ${({ theme }) => `0 ${theme.spacing[16]}`};

  &:invalid {
    border: 1px solid red;
  }
`;
