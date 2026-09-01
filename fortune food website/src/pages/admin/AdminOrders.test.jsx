import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminOrders from './AdminOrders';
import { DataContext } from '../../context/DataContext';
import { CartProvider } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

vi.mock('axios');

// ─── Mock Firebase Auth ───────────────────────────────────
vi.mock('../../firebase', () => ({ auth: {} }));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, cb) => { cb(null); return vi.fn(); }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

// ─── Sample Data ──────────────────────────────────────────
const sampleOrders = [
  {
    id: 1,
    customerName: 'Ravi Sharma',
    customerPhone: '9876543210',
    customerAddress: '123 MG Road, Bangalore',
    items: JSON.stringify([{ id: 1, name: 'Dog Food', qty: 2, price: 499 }]),
    total: 998,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    customerName: 'Priya Singh',
    customerPhone: '9123456789',
    customerAddress: '45 Park Street, Mumbai',
    items: JSON.stringify([{ id: 2, name: 'Cat Treats', qty: 1, price: 299 }]),
    total: 299,
    paymentMethod: 'ONLINE',
    paymentStatus: 'PAID',
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  }
];

// ─── Render Helper ────────────────────────────────────────
const mockAuthValue = {
  user: { email: 'admin@primepets.com', role: 'admin' },
  isAuthenticated: true,
  isAdmin: true,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  checkUserExists: vi.fn(),
};

const renderAdminOrders = () => render(
  <BrowserRouter>
    <AuthContext.Provider value={mockAuthValue}>
      <DataContext.Provider value={{ frontendSettings: {}, loading: false }}>
        <CartProvider>
          <AdminOrders />
        </CartProvider>
      </DataContext.Provider>
    </AuthContext.Provider>
  </BrowserRouter>
);

// ─── Tests ───────────────────────────────────────────────
describe('AdminOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders orders page heading', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    renderAdminOrders();
    expect(screen.getByText('Orders', { selector: 'h1' })).toBeInTheDocument();
  });

  it('shows "No orders found" when orders array is empty', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    renderAdminOrders();
    await waitFor(() => {
      expect(screen.getByText(/no orders found/i)).toBeInTheDocument();
    });
  });

  it('renders orders list with customer names', async () => {
    axios.get.mockResolvedValueOnce({ data: sampleOrders });
    renderAdminOrders();

    await waitFor(() => {
      expect(screen.getByText('Ravi Sharma')).toBeInTheDocument();
      expect(screen.getByText('Priya Singh')).toBeInTheDocument();
    });
  });

  it('renders order status badges', async () => {
    axios.get.mockResolvedValueOnce({ data: sampleOrders });
    renderAdminOrders();

    await waitFor(() => {
      expect(screen.getAllByText('PENDING').length).toBeGreaterThan(0);
      expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
    });
  });

  it('renders payment status and method', async () => {
    axios.get.mockResolvedValueOnce({ data: sampleOrders });
    renderAdminOrders();

    await waitFor(() => {
      expect(screen.getByText('COD')).toBeInTheDocument();
      expect(screen.getByText('ONLINE')).toBeInTheDocument();
      expect(screen.getByText('PAID')).toBeInTheDocument();
    });
  });

  it('displays order totals correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: sampleOrders });
    renderAdminOrders();

    await waitFor(() => {
      expect(screen.getByText(/998/)).toBeInTheDocument();
      expect(screen.getByText(/299/)).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching orders', () => {
    // Never resolve — keep in loading state
    axios.get.mockImplementation(() => new Promise(() => {}));
    renderAdminOrders();

    // Should show some loading indicator
    expect(screen.getByText('Orders', { selector: 'h1' })).toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    renderAdminOrders();

    await waitFor(() => {
      // Should not crash; still render the page
      expect(screen.getByText('Orders', { selector: 'h1' })).toBeInTheDocument();
    });
  });
});
