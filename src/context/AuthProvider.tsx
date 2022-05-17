import axios from 'axios';
import { type FC, type ReactElement, useState, createContext } from 'react';
import { Buffer } from 'buffer';

interface IAuthInfo {
  userId: string;
  token: string;
}

interface IAuthContext {
  authInfo: IAuthInfo | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}

const defaultContext: IAuthContext = {
  authInfo: null,
  setToken: () => {},
  removeToken: () => {},
};

export const AuthContext = createContext<IAuthContext>(defaultContext);

const getUserId: (token: string | null) => string = (token) => {
  if (token == undefined) {
    return;
  }

  return JSON.parse(
    Buffer.from(token.split('.')[1] || '', 'base64')
      .toString('utf8')
      .split('\nd')
      .pop() || ''
  )?.userId;
};

export const AuthProvider: FC<{
  children: ReactElement;
}> = ({ children }) => {
  const localStorageToken = localStorage.getItem('token');

  const [authInfo, setAuthInfo] = useState<IAuthInfo | null>(() => {
    const decodedUserId = getUserId(localStorageToken);
    const initAuthInfo = { token: localStorageToken, userId: decodedUserId };

    if (initAuthInfo.token == null) {
      return null;
    }

    return { token: initAuthInfo.token, userId: initAuthInfo.userId };
  });

  axios.defaults.headers.common = {
    Authorization: `Bearer ${localStorageToken}`,
  };

  const onTokenChange = (token: string) => {
    axios.defaults.headers.common = {
      Authorization: `Bearer ${token}`,
    };
    const decodedUserId = getUserId(localStorageToken);

    setAuthInfo({ token, userId: decodedUserId });
    localStorage.setItem('token', token);
  };

  const onTokenRemove = () => {
    axios.defaults.headers.common = {};
    setAuthInfo(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ authInfo, setToken: onTokenChange, removeToken: onTokenRemove }}>
      {children}
    </AuthContext.Provider>
  );
};
