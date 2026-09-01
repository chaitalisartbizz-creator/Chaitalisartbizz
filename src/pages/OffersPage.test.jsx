import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import OffersPage from './OffersPage';
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

describe('OffersPage', () => {
  it('renders Active Promo Codes and Flash Deals sections', () => {
    renderWithProviders(<OffersPage />);
    expect(screen.getByText(/Active Artbizz Promo Codes/i)).toBeInTheDocument();
    expect(screen.getByText(/LIMITED FLASH ART DEALS/i)).toBeInTheDocument();
  });
});
