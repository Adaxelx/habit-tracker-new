import React, { ReactElement } from 'react';

//www.joshwcomeau.com/snippets/react-components/shift-by/

https: interface Props {
  x?: number;
  y?: number;
  children: ReactElement;
}

function ShiftBy({ x = 0, y = 0, children }: Props) {
  return (
    <div
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      {children}
    </div>
  );
}
export default ShiftBy;
