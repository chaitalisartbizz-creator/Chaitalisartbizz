import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { DataContext } from '../../context/DataContext';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';

// Mock recharts to prevent ResizeObserver errors in JSDOM
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: () => <div data-testid="area-chart" />,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}));

describe('AdminDashboard', () => {
  it('renders the dashboard statistics', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DataContext.Provider value={{ frontendSettings: {}, products: [], categories: [], deals: [], banners: [] }}>
            <CartProvider>
              <AdminDashboard />
            </CartProvider>
          </DataContext.Provider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Fortune Food Admin Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/Premium Dry Fruit Harvests/i)).toBeInTheDocument();
    expect(screen.getByText(/Purity Club Customers/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Festive Offers/i)).toBeInTheDocument();
  });
});
