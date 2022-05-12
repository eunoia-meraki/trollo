import type { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { Path } from '../../types';

export const Welcome: FC = () => {
  const navigate = useNavigate();

  return (
    <header className="container p-3 flex justify-end items-center gap-2">
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 
              focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
              px-5 py-2.5 focus:outline-none"
        onClick={() => navigate(Path.SignUp)}
      >
        Sign Up
      </button>
      <button
        type="button"
        className="py-2.5 px-5 text-sm font-medium text-gray-900 
             focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 
            hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
        onClick={() => navigate(Path.SignIn)}
      >
        Sign In
      </button>
    </header>
  );
};
