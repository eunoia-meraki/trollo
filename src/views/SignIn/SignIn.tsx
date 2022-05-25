import { type FC, useContext, useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';

import toast from 'react-hot-toast';

import { useMutation } from 'react-query';

import axios, { AxiosResponse } from 'axios';

import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

import { AuthContext } from '../../context/AuthProvider';

import { Path } from '../../types';

import { ButtonSpinner } from '../../components/ButtonSpinner';

interface ISignInFrom {
  login: string;
  password: string;
}

export const SignIn: FC = () => {
  const { t } = useTranslation();

  const { authInfo, setToken } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (authInfo?.token) {
      navigate(Path.Home);
    }
  });

  const [passwordIsHidden, setPasswordIsHidden] = useState(true);

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<ISignInFrom>();

  const { mutate, isLoading } = useMutation<AxiosResponse<{ token: string }>, unknown, ISignInFrom>(
    ({ login, password }) =>
      axios.post('signin', {
        login: login,
        password: password,
      })
  );

  const onSubmit = handleSubmit((formData) => {
    mutate(formData, {
      onSuccess: ({ data: { token } }) => {
        setToken(token);

        navigate(Path.Home);
      },
      onError: () => {
        toast.error(t('toasterMessages.userIsNotFound'));
      },
    });
  });

  return (
    <main className="mt-10">
      <form onSubmit={onSubmit} className="max-w-md p-6 mx-auto">
        <h3 className="text-xl font-bold text-center">{t('auth.signIn')}</h3>

        <div>
          <label className="block">{t('auth.login')}</label>

          <input
            type="text"
            placeholder={t('auth.login')}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            {...register('login', {
              required: {
                value: true,
                message: t('validationErrors.fieldCanNotBeEmpty'),
              },
              onChange: () => clearErrors('login'),
            })}
          />

          {errors.login && <span className="text-red-500 text-sm">{errors.login.message}</span>}
        </div>

        <div className="mt-4">
          <label className="block">{t('auth.password')}</label>

          <div className="relative">
            <input
              type={passwordIsHidden ? 'password' : 'text'}
              placeholder={t('auth.password')}
              className="w-full pl-4 pr-9 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              {...register('password', {
                required: {
                  value: true,
                  message: t('validationErrors.fieldCanNotBeEmpty'),
                },
                onChange: () => clearErrors('password'),
              })}
            />

            <div
              className="absolute right-2 top-4 cursor-pointer"
              onClick={() => setPasswordIsHidden((prev) => !prev)}
            >
              {!passwordIsHidden ? (
                <EyeIcon className="w-6 h-6" />
              ) : (
                <EyeOffIcon className="w-6 h-6" />
              )}
            </div>
          </div>

          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="flex items-center justify-center w-40 h-10 mt-4 rounded-lg text-white bg-blue-600 hover:bg-blue-900 "
        >
          {isLoading ? <ButtonSpinner /> : t('continue')}
        </button>
      </form>
    </main>
  );
};
