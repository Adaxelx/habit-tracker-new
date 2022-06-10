import '@reach/dialog/styles.css';

import { ReactNode } from 'react';
import { Dialog } from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onDismiss={onClose}>
      <CloseButton onClick={onClose}>
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden>×</span>
      </CloseButton>
      {title ? <h3>{title}</h3> : null}
      {children}
    </ModalWrapper>
  );
}

const ModalWrapper = styled(Dialog)`
  &[data-reach-dialog-content] {
    --space: ${({ theme }) => theme.spacing[16]};
    border-radius: ${({ theme }) => theme.cornerRadius.regular};
    width: calc(100% - var(--space) * 2);
    height: calc(100% - var(--space) * 2);
    margin: var(--space);
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[24]};
  }
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  align-self: flex-end;
`;