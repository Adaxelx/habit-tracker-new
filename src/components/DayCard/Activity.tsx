import styled from 'styled-components';

interface Props {
  title: string;
  timeStart: string;
  timeEnd: string;
  description: string;
  checked: boolean;
}

export default function Activity({ title, timeStart, timeEnd, description, checked }: Props) {
  return <Wrapper></Wrapper>;
}

export const Wrapper = styled.article`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grays[900]};
  height: 140px;
  min-height: 140px;
  border-radius: ${({ theme }) => theme.cornerRadius.regular};
`;
