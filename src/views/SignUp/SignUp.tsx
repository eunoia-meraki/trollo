import type { FC } from 'react';

import { useForm } from 'react-hook-form';

import { useMutation } from 'react-query';

import axios from 'axios';

interface ISignUpForm {
  name: string;
  login: string;
  password: string;
}

export const SignUp: FC = () => {
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
        <h3 className="text-xl font-bold text-center">Sign Up</h3>
        <div className="mt-4">
          <label className="block">Login</label>
          <input
            type="text"
            {...register('login')}
            placeholder="Login"
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="mt-4">
          <label className="block">Name</label>
          <input
            type="text"
            {...register('name')}
            placeholder="Name"
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
          <button
            className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>
    </main>
  );
};
