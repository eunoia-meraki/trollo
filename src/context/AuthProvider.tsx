import axios from 'axios';
import { type FC, type ReactElement, useState, createContext } from 'react';

interface IAuthContext {
  token: string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}

const defaultContext: IAuthContext = {
  token: null,
  setToken: () => {},
  removeToken: () => {},
};

export const AuthContext = createContext<IAuthContext>(defaultContext);

export const AuthProvider: FC<{
  children: ReactElement;
}> = ({ children }) => {
  const localStorageToken = localStorage.getItem('token');
  const [token, setToken] = useState<string | null>(localStorageToken);

  axios.defaults.headers.common = {
    Authorization: `Bearer ${localStorageToken}`,
  };

  const onTokenChange = (token: string) => {
    axios.defaults.headers.common = {
      Authorization: `Bearer ${token}`,
    };
    setToken(token);
    localStorage.setItem('token', token);
  };

  const onTokenRemove = () => {
    axios.defaults.headers.common = {};
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, setToken: onTokenChange, removeToken: onTokenRemove }}>
      {children}
    </AuthContext.Provider>
  );
};
