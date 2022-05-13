import axios from 'axios';

import { type FC, Fragment, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

import { Transition, Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';

import { AuthContext } from '../../context/AuthProvider';

interface ILogInDialog {
  isOpen: boolean;
  onClose: () => void;
}

interface ILogInForm {
  login: string;
  password: string;
}

export const LogInDialog: FC<ILogInDialog> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset } = useForm<ILogInForm>({ mode: 'onSubmit' }); // TODO: validation
  const authContext = useContext(AuthContext);

  const signInMutation = useMutation<{ token: string }, unknown, ILogInForm>(
    (formData) =>
      axios
        .post('signin', {
          login: formData.login,
          password: formData.password,
        })
        .then((response) => response.data),
    {
      onSuccess: (data) => {
        authContext.setToken(data.token);
      },
      onError: (error) => console.log(error),
    }
  );

  const onSubmit = handleSubmit((formData) => {
    signInMutation.mutate(formData);
    onClose();
    reset();
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-end">
                  <button className="w-5 h-5 hover:opacity-75 transition-opacity" onClick={onClose}>
                    <XIcon />
                  </button>
                </div>
                <Dialog.Title as="h3" className="text-xl font-bold text-center">
                  Log in
                </Dialog.Title>

                <form onSubmit={onSubmit}>
                  <div className="mt-4">
                    <div>
                      <label className="block">Login</label>
                      <input
                        type="text"
                        {...register('login')}
                        placeholder="Login"
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block">Password</label>
                      <input
                        type="text"
                        {...register('password')}
                        placeholder="Password"
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                        Log in
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
