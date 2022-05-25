import { Suspense, type FC } from 'react';

import { Outlet } from 'react-router-dom';

import classNames from 'classnames';

import { useScrollPosition } from '../../hooks/useScrollPosition';

import { RequireAuth } from '../RequireAuth';
import { Logo } from '../Logo';
import { UserButton } from '../UserButton';
import { Spinner } from '../Spinner';
import { LangSelect } from '../LangSelect';

export const HomeLayout: FC = () => {
  const scrollPosition = useScrollPosition();

  return (
    <RequireAuth>
      <>
        <header
          className={classNames(
            scrollPosition > 20 && 'bg-white shadow',
            'sticky top-0 pl-6 pr-3 py-3 flex items-center justify-between transition-all duration-300'
          )}
        >
          <Logo />

          <div className="flex gap-2">
            <UserButton />
            <LangSelect />
          </div>
        </header>

        <Suspense
          fallback={
            <div className="flex justify-center items-center h-full">
              <Spinner style={{ width: '5rem', height: '5rem' }} />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </>
    </RequireAuth>
  );
};
