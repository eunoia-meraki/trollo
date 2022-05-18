import type { FC } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from 'react-query';

import { StickyContainer } from 'react-sticky';

import axios from 'axios';

import { Path } from './types';

import { Welcome } from './views/Welcome';
import { SignUp } from './views/SignUp';
import { SignIn } from './views/SignIn';
import { Error404 } from './views/Error404';
import { Home } from './views/Home';
import { Board } from './views/Board';

import { AuthProvider } from './context/AuthProvider';
import { NoAuthRedirectWrapper } from './components/NoAuthRedirectWrapper';
import { Layout } from './components/Layout';
import { Footer } from './components/Footer';
import { Toaster } from './components/Toaster';
import { ConfirmationModalProvider } from './components/ConfirmationModalProvider';

import './App.css';

axios.defaults.baseURL = 'https://evening-bastion-08665.herokuapp.com/';

export const App: FC = () => {
  return (
    <StickyContainer className="min-h-screen flex flex-col bg-gray-100 min-w-full">
      <AuthProvider>
        <ConfirmationModalProvider>
          <QueryClientProvider client={new QueryClient()}>
            <BrowserRouter>
              <NoAuthRedirectWrapper>
                <Routes>
                  <Route path={Path.Home} element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path={Path.Board} element={<Board />} />
                  </Route>
                  <Route path={Path.Welcome} element={<Welcome />} />
                  <Route path={Path.SignUp} element={<SignUp />} />
                  <Route path={Path.SignIn} element={<SignIn />} />
                  <Route path={Path.Error404} element={<Error404 />} />
                  <Route path={Path.Any} element={<Navigate to={Path.Error404} replace />} />
                </Routes>
              </NoAuthRedirectWrapper>
            </BrowserRouter>
          </QueryClientProvider>
        </ConfirmationModalProvider>
      </AuthProvider>

      <Footer />

      <Toaster />
    </StickyContainer>
  );
};

export default App;
