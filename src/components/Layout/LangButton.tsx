import classNames from 'classnames';

import { Fragment, type FC } from 'react';

import { Menu, Transition } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/solid';

export const LangButton: FC = () => {
  const items = [
    {
      key: 'ru',
      text: 'Русский',
      onClick: () => {},
    },
    {
      key: 'en',
      text: 'English',
      onClick: () => {},
    },
  ];

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
              <GlobeAltIcon />
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
                <div className="p-1 w-40">
                  {items.map(({ key, text, onClick }) => (
                    <Menu.Item as={Fragment} key={key}>
                      <button
                        type="button"
                        className="hover:bg-gray-100 p-2 group flex gap-2 rounded-lg items-center w-full text-sm"
                        onClick={onClick}
                      >
                        {text}
                      </button>
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </>
        );
      }}
    </Menu>
  );
};
