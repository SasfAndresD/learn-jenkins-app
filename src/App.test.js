import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn Jenkins link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn Jenkins/i);
  expect(linkElement).toBeInTheDocument();
});

test('see 8 number in the screen', () => {
  render(<App />);
  const numberElement = screen.getByText(/8/i);
  expect(numberElement).toBeInTheDocument();
})
