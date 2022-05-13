import classNames from 'classnames';
import { type FC, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { LangButton } from './LangButton';

interface IHeader {
  isSticky?: boolean;
}

export const Header: FC<IHeader> = ({ isSticky = false }) => {
  const authContext = useContext(AuthContext);
  return (
    <div
      className={classNames(
        isSticky ? 'p-1' : 'p-2',
        'shadow flex justify-center min-w-full bg-blue-50'
      )}
    >
      <div className="container flex items-center gap-2 justify-end">
        <LangButton />
        <button
          type="button"
          className="py-2.5 px-5 text-sm font-medium text-gray-900 
            focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 
          hover:text-blue-700 focus:ring-4 focus:ring-gray-200"
          onClick={() => {
            authContext.removeToken();
          }}
        >
          Log out
        </button>
        <button></button>
      </div>
    </div>
  );
};
