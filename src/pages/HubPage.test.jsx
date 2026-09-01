import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import HubPage from './HubPage';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';

vi.mock('../components/ScrollReveal', () => ({
  default: ({ children }) => <div>{children}</div>
}));

vi.mock('../components/LiveBackground', () => ({
  default: () => <div data-testid="live-background" />
}));

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            {ui}
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('HubPage', () => {
  it('renders Artbizz Training Academy hero section', () => {
    renderWithProviders(<HubPage />);
    expect(screen.getByText(/Master the Art of Creation/i)).toBeInTheDocument();
  });
});
