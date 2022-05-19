import classNames from 'classnames';

import { type FC } from 'react';

import { LangButton } from '../LangButton';
import { Logo } from '../Logo';

interface IHeader {
  isSticky?: boolean;
}

export const Header: FC<IHeader> = ({ isSticky = false }) => {
  return (
    <div
      className={classNames(
        isSticky ? 'p-1' : 'p-2',
        'shadow flex justify-center min-w-full bg-white'
      )}
    >
      <div className="container flex items-center gap-2 justify-between">
        <Logo />
        <LangButton />
      </div>
    </div>
  );
};
