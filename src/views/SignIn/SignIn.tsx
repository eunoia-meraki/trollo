import { FC, useContext } from 'react';

import { useForm } from 'react-hook-form';

import { useMutation } from 'react-query';

import axios from 'axios';

import { AuthContext } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Path } from '../../types/enums';
import { useTranslation } from 'react-i18next';

interface ILogInForm {
  login: string;
  password: string;
}

export const SignIn: FC = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm<ILogInForm>({ mode: 'onSubmit' }); // TODO: validation

  const authContext = useContext(AuthContext);

  const navigate = useNavigate();

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
        navigate(Path.Home);
      },
      onError: (error) => console.log(error),
    }
  );

  const onSubmit = handleSubmit((formData) => {
    signInMutation.mutate(formData);
    reset();
  });

  return (
    <main className="my-auto">
      <form onSubmit={onSubmit} className="max-w-md p-6 mx-auto">
        <h3 className="text-xl font-bold text-center">{t('auth.signinToTrollo')}</h3>
        <div>
          <label className="block">{t('auth.login')}</label>
          <input
            type="text"
            {...register('login')}
            placeholder={t('auth.login')}
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
          <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
            {t('continue')}
          </button>
        </div>
      </form>
    </main>
  );
};
