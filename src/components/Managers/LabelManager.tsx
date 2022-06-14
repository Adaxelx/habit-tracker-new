import { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import Button from 'components/Button';
import { Label as LabelDot } from 'components/DayCard/Activity';
import LabelForm from 'components/HabitTracker/LabelForm';
import { Label } from 'components/HabitTracker/useCalendar';
import Loader from 'components/Loader';

import { ElementsWrapper, ElementWrapper } from './HabitManager';
import LabelDeleteConfirmation from './LabelDeleteConfirmation';

export default function HabitManager() {
  const labels = useQuery<Label[]>(['labels']);

  const [openEditLabelId, setOpenEditLabelId] = useState('');
  const [openDeleteLabelId, setOpenDeleteLabelId] = useState('');

  if (labels.isError) {
    return null;
  }

  return (
    <Wrapper>
      <h2>Your labels</h2>
      {labels.isFetching ? (
        <Loader />
      ) : (
        <>
          <ElementsWrapper>
            {labels?.data?.map(({ _id, title, color }) => (
              <LabelWrapper key={_id}>
                <TitleWrapper>
                  <Title>{title}</Title>
                  <LabelDot color={color} />
                </TitleWrapper>
                <ButtonsWrapper>
                  <Action onClick={() => setOpenEditLabelId(_id)}>Edit</Action>
                  <Action onClick={() => setOpenDeleteLabelId(_id)}>X</Action>
                </ButtonsWrapper>
              </LabelWrapper>
            ))}
          </ElementsWrapper>
          <LabelForm
            isOpen={Boolean(openEditLabelId)}
            onClose={() => setOpenEditLabelId('')}
            previousLabel={labels?.data?.find(({ _id }) => _id === openEditLabelId)}
          />
          <LabelDeleteConfirmation
            isOpen={Boolean(openDeleteLabelId)}
            onClose={() => {
              setOpenDeleteLabelId('');
            }}
            label={labels?.data?.find(({ _id }) => _id === openDeleteLabelId)}
          />
        </>
      )}
    </Wrapper>
  );
}

const Action = styled(Button)`
  min-width: ${({ theme }) => theme.spacing[48]};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const LabelWrapper = styled(ElementWrapper)`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing[8]};

  border-radius: ${({ theme }) => theme.cornerRadius.regular};
  background-color: ${({ theme }) => theme.colors.grays[800]};
  padding: ${({ theme }) => `${theme.spacing[16]}`};
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  align-items: center;
  --size: ${({ theme }) => theme.spacing[24]};
  flex: 1;
`;

const Title = styled.span`
  font-size: ${({ theme }) => theme.fontSizes[20]};
  font-weight: bold;
`;

export const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => `${theme.spacing[64]} ${theme.spacing[16]} ${theme.spacing[32]} `};
  gap: ${({ theme }) => theme.spacing[24]};
`;
