import axios, { AxiosError } from 'axios';
import { type FC, ReactNode, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { Path } from '../../types';

export const NoAuthRedirectWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { removeToken } = useContext(AuthContext);

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        const status = error.response?.status;
        if (status == 401) {
          removeToken();
          navigate(Path.Welcome);
        }

        return Promise.reject(error);
      }
    );
  }, [navigate, removeToken]);

  return <>{children}</>;
};
