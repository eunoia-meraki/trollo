import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Error404 } from './Error404';

test('home have goHome link', () => {
  render(
    <BrowserRouter>
      <Error404 />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/go home/i);

  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute('href');
});
