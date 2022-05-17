import { type FC, useContext } from 'react';

import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Path } from '../../types';

import { AuthContext } from '../../context/AuthProvider';

export const Welcome: FC = () => {
  const { t } = useTranslation();

  const { authInfo } = useContext(AuthContext);

  return (
    <header className="container p-3 flex justify-end items-center gap-2">
      {!authInfo && (
        <>
          <Link
            to={Path.SignUp}
            className="text-white bg-blue-700 hover:bg-blue-800 
              focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
              px-5 py-2.5 focus:outline-none"
          >
            {t('auth.signUp')}
          </Link>
          <Link
            to={Path.SignIn}
            className="py-2.5 px-5 text-sm font-medium text-gray-900 
             focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 
            hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
          >
            {t('auth.signIn')}
          </Link>
        </>
      )}

      {authInfo && <Link to={Path.Home}>{t('goToMainPage')}</Link>}
    </header>
  );
};
