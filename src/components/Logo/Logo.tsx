import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Path } from '../../types';

export const Logo: FC = () => {
  return (
    <Link to={Path.Welcome} className="self-center text-2xl font-semibold whitespace-nowrap">
      Trollo
    </Link>
  );
};
