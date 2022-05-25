import { type FC, Fragment, useEffect, useState } from 'react';

import { Listbox, Transition } from '@headlessui/react';

import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';

import i18n from 'i18next';

const languages = [
  { key: 'ru', text: 'РУС' },
  { key: 'en', text: 'ENG' },
];

export const LangSelect: FC = () => {
  const [selected, setSelected] = useState(languages[0]);

  useEffect(() => {
    const language = languages.find((item) => item.key === i18n.language) || languages[0];
    setSelected(language);
  }, []);

  useEffect(() => {
    i18n.changeLanguage(selected.key);
  }, [selected]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative">
        <Listbox.Button className="relative h-full w-[55px] cursor-pointer rounded-lg py-2 pr-6 text-left focus:outline-none sm:text-sm">
          <span className="block truncate font-bold">{selected.text}</span>
          <span className="pointer-events-none absolute inset-y-0 right-1 flex items-center">
            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Listbox.Options className="absolute right-1 mt-1 max-h-60 overflow-auto rounded-md bg-white p-1 text-base shadow-lg focus:outline-none sm:text-sm">
            {languages.map((item, idx) => (
              <Listbox.Option
                key={idx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 rounded-md text-gray-900 ${
                    active && 'bg-gray-100'
                  }`
                }
                value={item}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {item.text}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
