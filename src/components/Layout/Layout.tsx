import { type FC } from 'react';

import { Outlet } from 'react-router-dom';

import { Sticky } from 'react-sticky';

import { RequireAuth } from '../RequireAuth';

import { Header } from './Header';

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
        <div className="container flex flex-col mx-auto my-2 p-2 h-full min-h-[300px] bg-white border overflow-hidden">
          <Outlet />
        </div>
      </>
    </RequireAuth>
  );
};
