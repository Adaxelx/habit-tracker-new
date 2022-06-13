import { TailSpin, ThreeDots } from 'react-loader-spinner';
import styled from 'styled-components';

const SIZE = 48;
export default function Loader() {
  return (
    <Wrapper>
      <ThreeDots color="gray" height={SIZE} width={SIZE} ariaLabel="loading" />
    </Wrapper>
  );
}

const LOADER_SIZE = 24;
export const SmallLoader = ({ className = '' }: { className?: string }) => {
  return (
    <SmallLoaderWrapper className={className}>
      <TailSpin color="#00BFFF" height={LOADER_SIZE} width={LOADER_SIZE} />
    </SmallLoaderWrapper>
  );
};

const SmallLoaderWrapper = styled.div``;

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  place-content: center;
`;
