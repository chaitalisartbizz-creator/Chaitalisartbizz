import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');

vi.mock('../../context/DataContext', () => ({
  useData: () => ({
    products: [{ id: 1 }, { id: 2 }],
    categories: [{ id: 1 }],
    slides: [{ id: 1 }],
    deals: [],
    loading: false,
    refreshData: vi.fn(),
  })
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    isAdmin: true,
    user: { email: 'admin@test.com' },
  })
}));

vi.mock('../../components/ScrollReveal', () => ({
  default: ({ children }) => <div>{children}</div>
}));

vi.mock('../../components/LiveBackground', () => ({
  default: () => <div data-testid="live-bg" />
}));

vi.mock('recharts', () => ({
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}));

import AdminDashboard from './AdminDashboard';

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: { totalOrders: 5, totalRevenue: 2500 } });
  });

  it('renders the dashboard page', async () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
    
    // "Artbizz Studio HQ" appears in the welcome banner
    await waitFor(() => {
      expect(screen.getByText(/Artbizz Studio HQ/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('fetches stats on mount', async () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/stats');
    });
  });

  it('fetches analytics data on mount', async () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/analytics/stats'));
    });
  });

  it('renders chart component', async () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
    
    await waitFor(() => {
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });
});
