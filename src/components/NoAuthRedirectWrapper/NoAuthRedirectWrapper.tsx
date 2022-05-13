import axios, { AxiosError } from 'axios';
import { type FC, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Path } from '../../types';

export const NoAuthRedirectWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        const status = error.response?.status;
        if (status == 401) {
          navigate(Path.Welcome);
        }

        return Promise.reject(error);
      }
    );
  }, [navigate]);

  return <>{children}</>;
};
