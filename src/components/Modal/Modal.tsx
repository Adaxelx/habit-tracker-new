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
  className?: string;
}

export default function Modal({ isOpen, onClose, children, title, className }: ModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onDismiss={onClose} className={className}>
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
    overflow: auto;
    --space: ${({ theme }) => theme.spacing[16]};
    border-radius: ${({ theme }) => theme.cornerRadius.regular};
    width: calc(100% - var(--space) * 2);
    max-height: calc(100% - var(--space) * 2);
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[24]};
    max-width: 400px;

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  align-self: flex-end;
`;
