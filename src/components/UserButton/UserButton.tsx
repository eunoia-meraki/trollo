import { type FC, Fragment, useContext } from 'react';
import classNames from 'classnames';

import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Path } from '../../types';
import { AuthContext } from '../../context/AuthProvider';

export const UserButton: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  return (
    <Menu as="div" className={'relative'}>
      {({ open }) => {
        return (
          <>
            <Menu.Button
              className={classNames(
                'w-10 h-10 rounded-lg p-1 transition-colors',
                open && 'bg-gray-100'
              )}
            >
              <UserCircleIcon />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute bg-white z-10 mt-[0.3rem] rounded-lg shadow-lg right-0">
                <div className="p-1 w-60">
                  <Menu.Item as={Fragment} key={'editButton'}>
                    <button
                      type="button"
                      className="hover:bg-gray-100 p-2 group flex gap-2 rounded-lg items-center w-full text-sm"
                      onClick={() => navigate(Path.EditProfile)}
                    >
                      {t('auth.editProfile')}
                    </button>
                  </Menu.Item>
                  <Menu.Item as={Fragment} key={'logoutButton'}>
                    <button
                      type="button"
                      className="hover:bg-gray-100 p-2 group flex gap-2 rounded-lg items-center w-full text-sm"
                      onClick={() => {
                        authContext.removeToken();
                      }}
                    >
                      {t('auth.logout')}
                    </button>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        );
      }}
    </Menu>
  );
};
