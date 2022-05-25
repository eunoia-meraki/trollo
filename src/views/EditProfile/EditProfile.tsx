import axios from 'axios';

import { type FC, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

import { ConfirmationModalContext } from '../../components/ConfirmationModalProvider';
import { AuthContext } from '../../context/AuthProvider';
import { APIError } from '../../interfaces';
import { Path } from '../../types';
import { ButtonSpinner } from '../../components/ButtonSpinner';

interface IEditProfileForm {
  name: string;
  login: string;
  password: string;
}

export const EditProfile: FC = () => {
  const { t } = useTranslation();

  const { authInfo, removeToken } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authInfo?.token) {
      navigate(Path.SignIn);
    }
  });

  const [passwordIsHidden, setPasswordIsHidden] = useState(true);
  const { data } = useQuery<IEditProfileForm, APIError>(
    `users/${authInfo?.userId}`,
    () => axios.get(`users/${authInfo?.userId}`).then((response) => response.data),
    {
      onError: (e) => {
        toast.error(e.message);
        removeToken();
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<IEditProfileForm>({
    mode: 'onSubmit',
    defaultValues: {
      login: data?.login || '',
      name: data?.name || '',
    },
  });

  const { mutate: mutateEditProfile, isLoading: isEditProfileLoading } = useMutation<
    unknown,
    APIError,
    IEditProfileForm
  >(({ login, name, password }) =>
    axios.put(`users/${authInfo?.userId}`, {
      login: login,
      name: name,
      password: password,
    })
  );

  const { mutate: mutateRemoveProfile } = useMutation<unknown, APIError>(
    () => axios.delete(`users/${authInfo?.userId}`),
    {
      onSuccess: () => {
        removeToken();
      },
      onError: (e) => {
        toast.error(e.message);
        removeToken();
      },
    }
  );

  const { openModal } = useContext(ConfirmationModalContext);

  const removeProfile = (): void => {
    openModal(t('confirmationModal.deleteProfile'), () => mutateRemoveProfile());
  };

  const isLoading = isEditProfileLoading;

  const onSubmit = handleSubmit((formData) => {
    mutateEditProfile(formData, {
      onSuccess: () => {
        removeToken();
        navigate(Path.Welcome);
        toast.success(t('toasterMessages.editProfileSuccess'));
      },
      onError: (e) => {
        toast.error(e.message);
      },
    });
  });

  return (
    <main className="h-full box-border overflow-auto min-h-[450px]">
      <form onSubmit={onSubmit} className="max-w-md p-6 mx-auto">
        <h3 className="text-xl font-bold text-center">{t('auth.profile')}</h3>

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
        <div className="flex justify-end">
          <button type="button" className="mt-4 text-blue-900" onClick={removeProfile}>
            {t('deleteProfile')}
          </button>
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
