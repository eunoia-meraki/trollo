import type { FC } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { QueryClient, QueryClientProvider } from 'react-query';

import axios from 'axios';

import { Path } from './types';

import { Welcome } from './views/Welcome';
import { SignUp } from './views/SignUp';
import { SignIn } from './views/SignIn';
import { Error404 } from './views/Error404';
import { Home } from './views/Home';
import { Board } from './views/Board';
import { EditProfile } from './views/EditProfile';

import { AuthProvider } from './context/AuthProvider';
import { NoAuthRedirectWrapper } from './components/NoAuthRedirectWrapper';
import { HomeLayout } from './components/HomeLayout';
import { Footer } from './components/Footer';
import { Toaster } from './components/Toaster';
import { ConfirmationModalProvider } from './components/ConfirmationModalProvider';
import { AddItemModalProvider } from './components/AddItemModalProvider';
import { WelcomeLayout } from './components/WelcomeLayout';

import './App.css';

axios.defaults.baseURL = 'https://evening-bastion-08665.herokuapp.com/';

export const App: FC = () => {
  return (
    <div className="flex flex-col bg-gray-100 h-full">
      <DndProvider backend={HTML5Backend}>
        <AuthProvider>
          <ConfirmationModalProvider>
            <AddItemModalProvider>
              <QueryClientProvider client={new QueryClient()}>
                <BrowserRouter>
                  <NoAuthRedirectWrapper>
                    <Routes>
                      <Route path={Path.Welcome} element={<WelcomeLayout />}>
                        <Route index element={<Welcome />} />
                        <Route path={Path.SignIn} element={<SignIn />} />
                        <Route path={Path.SignUp} element={<SignUp />} />
                      </Route>
                      <Route path={Path.Home} element={<HomeLayout />}>
                        <Route index element={<Home />} />
                        <Route path={Path.Board} element={<Board />} />
                        <Route path={Path.EditProfile} element={<EditProfile />} />
                      </Route>
                      <Route path={Path.Error404} element={<Error404 />} />
                      <Route path={Path.Any} element={<Navigate to={Path.Error404} replace />} />
                    </Routes>
                  </NoAuthRedirectWrapper>
                </BrowserRouter>
              </QueryClientProvider>
            </AddItemModalProvider>
          </ConfirmationModalProvider>
        </AuthProvider>
      </DndProvider>

      <Footer />

      <Toaster />
    </div>
  );
};

export default App;
