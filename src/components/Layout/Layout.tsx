import { type FC } from 'react';

import { Outlet } from 'react-router-dom';

import { Sticky, StickyContainer } from 'react-sticky';

import { RequireAuth } from '../RequireAuth';

import { Header } from './Header';

// import { RequireAuth } from './components/RequireAuth';

export const Layout: FC = () => {
  return (
    <RequireAuth>
      <StickyContainer className="min-w-full grow">
        <Sticky>
          {({ style, isSticky }) => (
            <div className="min-w-full" style={style}>
              <Header isSticky={isSticky} />
            </div>
          )}
        </Sticky>
        <div className="container mx-auto my-2 p-2 bg-white border">
          <Outlet />
        </div>
      </StickyContainer>
    </RequireAuth>
  );
};
