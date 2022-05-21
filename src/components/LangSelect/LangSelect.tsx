import type { FC, ChangeEvent } from 'react';

import { useLanguage } from '../../hooks/useLanguage';

export const LangSelect: FC = () => {
  const { languages, setLanguage } = useLanguage();

  const onChange = (e: ChangeEvent<HTMLSelectElement>): void => setLanguage(e.target.value);

  return (
    <select
      onChange={onChange}
      className="block w-36 px-1 py-1
            text-base font-normal text-gray-700
            bg-white bg-clip-padding bg-no-repeat
            border border-solid border-gray-300 rounded
            transition ease-in-out
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
    >
      {languages().map(({ key, text }) => (
        <option key={key} value={key}>
          {text}
        </option>
      ))}
    </select>
  );
};
