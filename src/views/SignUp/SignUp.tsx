import type { FC } from 'react';

import { useForm } from 'react-hook-form';

import { useMutation } from 'react-query';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface ISignUpForm {
  name: string;
  login: string;
  password: string;
}

export const SignUp: FC = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<ISignUpForm>({ mode: 'onSubmit' }); // TODO: validation

  const sinUpMutation = useMutation<unknown, unknown, ISignUpForm>(
    (formData) =>
      axios.post(
        'signup',
        {
          login: formData.login,
          name: formData.name,
          password: formData.password,
        }
        // { headers: { 'Access-Control-Allow-Origin': '*' } }
      ),
    {
      onSuccess: (data) => console.log(data),
      onError: (error) => console.log(error),
    }
  );

  const onSubmit = handleSubmit((formData) => {
    sinUpMutation.mutate(formData);
  });

  return (
    <main className="my-auto">
      <form onSubmit={onSubmit} className="max-w-md p-6 mx-auto">
        <h3 className="text-xl font-bold text-center">{t('auth.signupToTrollo')}</h3>
        <div className="mt-4">
          <label className="block">{t('auth.login')}</label>
          <input
            type="text"
            {...register('login')}
            placeholder={t('auth.login')}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="mt-4">
          <label className="block">{t('auth.name')}</label>
          <input
            type="text"
            {...register('name')}
            placeholder={t('auth.name')}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="mt-4">
          <label className="block">{t('auth.password')}</label>
          <input
            type="text"
            {...register('password')}
            placeholder={t('auth.password')}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="flex items-baseline justify-between">
          <button
            className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
            type="submit"
          >
            {t('continue')}
          </button>
        </div>
      </form>
    </main>
  );
};
