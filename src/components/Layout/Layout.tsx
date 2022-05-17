import { type FC } from 'react';

import { Outlet } from 'react-router-dom';

import { Sticky, StickyContainer } from 'react-sticky';

import { RequireAuth } from '../RequireAuth';

import { Header } from './Header';

// import { RequireAuth } from './components/RequireAuth';

export const Layout: FC = () => {
  return (
    <RequireAuth>
      <>
        <Sticky>
          {({ style, isSticky }) => (
            <div className="min-w-full" style={style}>
              <Header isSticky={isSticky} />
            </div>
          )}
        </Sticky>
        <div className="container grow mx-auto my-2 p-2 h-full bg-white border">
          <Outlet />
        </div>
      </>
    </RequireAuth>
  );
};
