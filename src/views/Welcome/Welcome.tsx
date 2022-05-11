import { FC, useState } from 'react';
import { LogInDialog } from '../../components/LogInDialog';
import { SignUpDialog } from '../../components/SignUpDialog';

export const Welcome: FC = () => {
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [isLogInDialogOpen, setIsLogInDialogOpen] = useState(false);

  return (
    <>
      <div className="w-full container flex justify-end items-center gap-2">
        <div className="flex gap-2 my-2">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 
              focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
              px-5 py-2.5 mr-2 mb-2 focus:outline-none"
            onClick={() => setIsSignUpDialogOpen(true)}
          >
            Sign Up
          </button>
          <button
            type="button"
            className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 
             focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 
            hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
            onClick={() => setIsLogInDialogOpen(true)}
          >
            Log in
          </button>
        </div>
      </div>

      <SignUpDialog isOpen={isSignUpDialogOpen} onClose={() => setIsSignUpDialogOpen(false)} />
      <LogInDialog isOpen={isLogInDialogOpen} onClose={() => setIsLogInDialogOpen(false)} />
    </>
  );
};
