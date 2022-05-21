import type { FC } from 'react';

import { Link } from 'react-router-dom';

import { Path } from '../../types';

export const Logo: FC = () => (
  <Link to={Path.Welcome} className="text-2xl font-semibold">
    Trollo
  </Link>
);
