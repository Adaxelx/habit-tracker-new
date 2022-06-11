import { Fragment, InputHTMLAttributes } from 'react';
import VisuallyHidden from '@reach/visually-hidden';
import styled from 'styled-components';

export default function TextArea({
  htmlFor,
  name,
  showLabel = false,
  ...rest
}: InputHTMLAttributes<HTMLTextAreaElement> & { htmlFor: string; showLabel?: boolean }) {
  const LabelWrapper = showLabel ? Fragment : VisuallyHidden;
  return (
    <Wrapper>
      <LabelWrapper>
        <label htmlFor={htmlFor}>{name}</label>
      </LabelWrapper>
      <NativeTextArea id={htmlFor} name={name} {...rest} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NativeTextArea = styled.textarea`
  height: 64px;
  width: 100%;
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
  color: ${({ theme }) => theme.colors.grays[200]};
  background-color: ${({ theme }) => theme.colors.grays[900]};
  border: none;
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[16]}`};

  &:invalid {
    border: 1px solid red;
  }
`;
