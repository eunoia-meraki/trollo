import type { FC } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from 'react-query';

import axios from 'axios';

import { Path } from './types';

import { Welcome } from './views/Welcome';
import { SignUp } from './views/SignUp';
import { SignIn } from './views/SignIn';
import { Error404 } from './views/Error404';

import { Footer } from './components/Footer';

import './App.css';

axios.defaults.baseURL = 'https://evening-bastion-08665.herokuapp.com/';

export const App: FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <Routes>
            <Route path={Path.Welcome} element={<Welcome />} />
            <Route path={Path.SignUp} element={<SignUp />} />
            <Route path={Path.SignIn} element={<SignIn />} />
            <Route path={Path.Error404} element={<Error404 />} />
            <Route path={Path.Any} element={<Navigate to={Path.Error404} replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>

      <Footer />
    </div>
  );
};

export default App;
