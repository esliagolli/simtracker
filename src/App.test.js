import {render, screen} from '@testing-library/react';
import App from './App';

test('renders sim tracker header', () => {
  render(<App />);
  const headerElement = screen.getByText(/SIM Tracker/);
  expect(headerElement).toBeInTheDocument();
});