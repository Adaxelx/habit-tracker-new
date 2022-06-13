import styled from 'styled-components';

import Checkbox from 'components/FormControls/Checkbox';

import { Event } from './useCardContent';
import useToggleChecked from './useToggleChecked';

export type DateTuple = [number, number, number];

type ActivityProps = Omit<Event, 'checked'> & { checked: boolean; date: DateTuple };

export default function Activity({
  title,
  timeStart,
  timeEnd,
  description,
  checked,
  date,
  label,
  _id,
}: ActivityProps) {
  const mutation = useToggleChecked({ id: _id, date, checked });

  return (
    <Wrapper
      onClick={() => {
        if (!mutation.isLoading) {
          mutation.mutate();
        }
      }}
    >
      <MainContent>
        <h5>{title}</h5>
        <Subtext>{`${timeStart} - ${timeEnd}`}</Subtext>
        <Subtext>{description}</Subtext>
      </MainContent>
      <Aside>
        <Checkbox disabled={mutation.isLoading} checked={checked} />
        {label ? <Label color={label.color} /> : null}
        {/* <Badge /> */}
      </Aside>
    </Wrapper>
  );
}

const Wrapper = styled.article`
  position: relative;
  cursor: pointer;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grays[900]};
  height: 140px;
  min-height: 140px;
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[16]}`};

  display: flex;
  gap: 16px;
`;

const MainContent = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-grow: 1;
`;

const Subtext = styled.p`
  color: ${({ theme }) => theme.colors.grays[200]};
  font-size: ${({ theme }) => theme.fontSizes[14]};
`;

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  width: 32px; // tmp
  gap: ${({ theme }) => theme.spacing[12]};
  align-items: center;

  --size: ${({ theme }) => theme.spacing[24]};
`;

// const Divider = styled.div`
//   width: 3px;
//   height: 100%;
//   background-color: ${({ theme }) => theme.colors.grays[800]};
// `;

const Badge = styled.div`
  width: var(--size);
  height: var(--size);
  background-color: ${({ theme }) => theme.colors.grays[800]};
  border-radius: ${({ theme }) => theme.cornerRadius.small};
`;

interface LabelProps {
  color: string;
}

export const Label = styled.div<LabelProps>`
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background-color: ${({ color }) => color};
  border: 1px solid ${({ theme }) => theme.colors.grays[50]};
`;
