import { InputHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import { SmallLoader } from 'components/Loader';

export default function Checkbox({
  disabled,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { htmlFor?: string }) {
  return (
    <Wrapper>
      {disabled ? <AbsoluteLoader /> : null}
      <NativeCheckbox type="checkbox" {...props} disabled={disabled} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  --size: ${({ theme }) => theme.spacing[32]};
  --backgroundColor: ${({ theme }) => theme.colors.grays[600]};
  --backgroundChecked: ${({ theme }) => theme.colors.grays[700]};
`;

const CheckboxShape = css`
  outline: none;
  cursor: pointer;
  width: var(--size);
  height: var(--size);
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
  background-color: var(--backgroundColor);
  vertical-align: middle;
  border: 1px solid ${({ theme }) => theme.colors.grays[600]};
  appearance: none;
  -webkit-appearance: none;
  box-shadow: inset 0px 2px 2px rgba(0, 0, 0, 0.25);
`;

const NativeCheckbox = styled.input`
  ${CheckboxShape}

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
    background-color: var(--backgroundChecked);
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

const AbsoluteLoader = styled(SmallLoader)`
  position: absolute;
  ${CheckboxShape}
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  place-content: center;
  background-color: var(--backgroundColor);
  z-index: 10;

  transition: 300ms;

  ${NativeCheckbox}:checked ~ & {
    background-color: var(--backgroundChecked);
  }
`;
