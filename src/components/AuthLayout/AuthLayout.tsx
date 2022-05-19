import { ReactElement, type FC } from 'react';

import { Sticky } from 'react-sticky';

import { Header } from './Header';

export const AuthWrapper: FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <>
      <Sticky>
        {({ style, isSticky }) => (
          <div className="min-w-full" style={style}>
            <Header isSticky={isSticky} />
          </div>
        )}
      </Sticky>
      <div className="container grow mx-auto my-2 p-2 h-full ">{children}</div>
    </>
  );
};
