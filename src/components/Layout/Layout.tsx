import { ReactNode, type FC } from 'react';
import { Sticky, StickyContainer } from 'react-sticky';

import { Header } from './Header';

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <StickyContainer className="min-w-full grow">
      <Sticky>
        {({ style, isSticky }) => (
          <div className="min-w-full" style={style}>
            <Header isSticky={isSticky} />
          </div>
        )}
      </Sticky>
      <div className="container mx-auto my-2 p-2 bg-white border">{children}</div>
    </StickyContainer>
  );
};
