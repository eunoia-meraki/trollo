import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Welcome } from './views/Welcome';
import { Error404 } from './views/Error404';
import './App.css';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Footer } from './components/Footer';

axios.defaults.baseURL = 'https://evening-bastion-08665.herokuapp.com/';

export const App: FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="error-404" element={<Error404 />} />
            <Route path="*" element={<Navigate to="error-404" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>

      <Footer />
    </div>
  );
};

export default App;
