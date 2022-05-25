import { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

export default function Checkbox(
  props: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { htmlFor?: string }
) {
  return <NativeCheckbox type="checkbox" {...props} />;
}

const NativeCheckbox = styled.input`
  --size: ${({ theme }) => theme.spacing[32]};
  width: var(--size);
  height: var(--size);
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
  background-color: ${({ theme }) => theme.colors.grays[600]};
  vertical-align: middle;
  border: 1px solid ${({ theme }) => theme.colors.grays[600]};
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;
  box-shadow: inset 0px 2px 2px rgba(0, 0, 0, 0.25);
  display: grid;
  place-content: center;

  &::before {
    content: '';
    width: 0.75em;
    height: 0.75em;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em var(--form-control-color);

    background-color: CanvasText;
    transform-origin: center;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  &:checked {
    background-color: ${({ theme }) => theme.colors.grays[700]};
    box-shadow: inset 0px 6px 6px rgba(0, 0, 0, 0.25);
  }

  &:checked::before {
    transform: scale(1);
  }

  &:focus {
    outline: max(2px, 0.15em) solid ${({ theme }) => theme.colors.grays[600]};
    outline-offset: max(2px, 0.15em);
  }
`;
