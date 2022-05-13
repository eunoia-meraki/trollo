import { type FC, useContext, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { Path } from '../../types';

export const RequireAuth: FC<{ children: ReactElement }> = ({ children }) => {
  const auth = useContext(AuthContext);

  if (auth.token == null) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={Path.Welcome} replace />;
  }

  return children;
};
