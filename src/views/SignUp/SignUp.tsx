import { type FC, useState, useEffect, useContext } from 'react';

import { useForm } from 'react-hook-form';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useMutation } from 'react-query';

import toast from 'react-hot-toast';

import axios from 'axios';

import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

import { Path } from '../../types';

import { AuthContext } from '../../context/AuthProvider';

import { ButtonSpinner } from '../../components/ButtonSpinner';

interface ISignUpForm {
  name: string;
  login: string;
  password: string;
}

export const SignUp: FC = () => {
  const { t } = useTranslation();

  const { authInfo } = useContext(AuthContext);

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
    formState: { errors },
    clearErrors,
  } = useForm<ISignUpForm>();

  const { mutate, isLoading } = useMutation<unknown, unknown, ISignUpForm>(
    ({ login, name, password }) =>
      axios.post('signup', {
        login: login,
        name: name,
        password: password,
      })
  );

  const onSubmit = handleSubmit((formData) => {
    mutate(formData, {
      onSuccess: () => {
        toast.success(t('toasterMessages.signInSuccess'));

        navigate(`/${Path.SignIn}`);
      },
      onError: () => {
        toast.error(t('toasterMessages.suchLoginAlreadyExists'));
      },
    });
  });

  return (
    <main className="mt-10">
      <form onSubmit={onSubmit} className="max-w-md p-6 mx-auto">
        <h3 className="text-xl font-bold text-center">{t('auth.signUp')}</h3>

        <div className="mt-4">
          <label className="block">{t('auth.login')}</label>

          <input
            type="text"
            placeholder={t('auth.login')}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            {...register('login', {
              validate: (value) => {
                if (value === '') {
                  return t('validationErrors.fieldCanNotBeEmpty');
                }
                if (!/^[A-Za-z0-9_]*$/.test(value)) {
                  return t('validationErrors.fieldMustContainOnlyLatinLetters');
                }
                if (!/[A-Z]/.test(value.charAt(0))) {
                  return t('validationErrors.fieldMustStartWithCapitalLetter');
                }
                if (value.length < 4) {
                  return t('validationErrors.fieldСanNotBeShorterThan4Characters');
                }
                if (value.length > 20) {
                  return t('validationErrors.fieldСanNotBeLongerThan20Characters');
                }
              },
            })}
            onChange={() => clearErrors('login')}
          />

          {errors.login && <span className="text-red-500 text-sm">{errors.login.message}</span>}
        </div>

        <div className="mt-4">
          <label className="block">{t('auth.name')}</label>

          <input
            type="text"
            placeholder={t('auth.name')}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            {...register('name', {
              validate: (value) => {
                if (value === '') {
                  return t('validationErrors.fieldCanNotBeEmpty');
                }
                if (!/[A-ZА-Я]/.test(value.charAt(0))) {
                  return t('validationErrors.fieldMustStartWithCapitalLetter');
                }
                if (!/^[A-Za-zА-Яа-я]*$/.test(value)) {
                  return t('validationErrors.fieldMustContainOnlyLetters');
                }
                if (value.length < 4) {
                  return t('validationErrors.fieldСanNotBeShorterThan4Characters');
                }
                if (value.length > 20) {
                  return t('validationErrors.fieldСanNotBeLongerThan20Characters');
                }
              },
            })}
            onChange={() => clearErrors('name')}
          />

          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>

        <div className="mt-4">
          <label className="block">{t('auth.password')}</label>

          <div className="relative">
            <input
              type={passwordIsHidden ? 'password' : 'text'}
              autoComplete="new-password"
              placeholder={t('auth.password')}
              className="w-full pl-4 pr-10 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              {...register('password', {
                validate: (value) => {
                  if (value === '') {
                    return t('validationErrors.fieldCanNotBeEmpty');
                  }
                  if (!/[A-Za-zА-Яа-я]/.test(value)) {
                    return t('validationErrors.fieldMustContainAtLeast1Letter');
                  }
                  if (!/[0-9]/.test(value)) {
                    return t('validationErrors.fieldMustContainAtLeast1Digit');
                  }
                  if (!/[_]/.test(value)) {
                    return t('validationErrors.fieldMustContainAtLeast1Undescore');
                  }
                  if (value.length < 6) {
                    return t('validationErrors.fieldСanNotBeShorterThan6Characters');
                  }
                  if (value.length > 20) {
                    return t('validationErrors.fieldСanNotBeLongerThan20Characters');
                  }
                },
              })}
              onChange={() => clearErrors('password')}
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
