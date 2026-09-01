import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import HubPage from './HubPage';
import { CartProvider } from '../context/CartContext';
import { DataContext } from '../context/DataContext';
import { AuthProvider } from '../context/AuthContext';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const renderWithContext = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <DataContext.Provider value={{ frontendSettings: { storeName: 'Fortune Food' } }}>
          <CartProvider>
            {ui}
          </CartProvider>
        </DataContext.Provider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('HubPage', () => {
  it('renders hub page header', () => {
    renderWithContext(<HubPage />);
    expect(screen.getByText(/Fortune Wellness Hub/i)).toBeInTheDocument();
  });

  it('renders featured article', () => {
    renderWithContext(<HubPage />);
    expect(screen.getByText('How to Test 100% Pure Kashmiri Mongra Saffron at Home')).toBeInTheDocument();
  });

  it('renders latest articles', () => {
    renderWithContext(<HubPage />);
    expect(screen.getByText('Top 7 Health Benefits of Eating Soaked California Almonds Daily')).toBeInTheDocument();
  });

  it('renders purity certification sidebar', () => {
    renderWithContext(<HubPage />);
    expect(screen.getByText('Purity Certification')).toBeInTheDocument();
  });
  
  it('can switch topic tabs', () => {
    renderWithContext(<HubPage />);
    const saffronTab = screen.getAllByText('Saffron Purity')[0];
    fireEvent.click(saffronTab);
    
    expect(screen.getByText('How to Test 100% Pure Kashmiri Mongra Saffron at Home')).toBeInTheDocument();
  });
});
