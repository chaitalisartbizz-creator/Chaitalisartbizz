import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import LoginPage from './LoginPage';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';

// Mock matchMedia
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

const mockLogin = vi.fn().mockResolvedValue(true);
const mockRegister = vi.fn().mockResolvedValue(true);
const mockUpdateAdminCredentials = vi.fn();

const renderLoginPage = (isAuthenticated = false) => {
  return render(
    <AuthContext.Provider value={{ login: mockLogin, register: mockRegister, updateAdminCredentials: mockUpdateAdminCredentials, isAuthenticated }}>
      <DataContext.Provider value={{ frontendSettings: { logoBase64: null } }}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </DataContext.Provider>
    </AuthContext.Provider>
  );
};

test('renders login page correctly', () => {
  renderLoginPage();
  expect(screen.getByText('Welcome to Fortune Food')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
});

test('toggles to register mode', () => {
  renderLoginPage();
  const toggleBtn = screen.getByText('Create Account');
  fireEvent.click(toggleBtn);
  
  expect(screen.getByText('Join Purity Rewards')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Register Account/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText('e.g. Ananya Sharma')).toBeInTheDocument();
});

test('handles login submission', () => {
  renderLoginPage();
  
  const identifierInput = screen.getByPlaceholderText('customer@fortunefood.com');
  const passwordInput = screen.getByPlaceholderText('••••••••');
  
  fireEvent.change(identifierInput, { target: { value: 'admin@fortunefood.com' } });
  fireEvent.change(passwordInput, { target: { value: 'admin123' } });
  
  const submitBtn = screen.getByRole('button', { name: /Sign In/i });
  fireEvent.click(submitBtn);
  
  expect(mockLogin).toHaveBeenCalledWith('admin@fortunefood.com', 'admin123');
});

test('handles registration submission', () => {
  renderLoginPage();
  const toggleBtn = screen.getByText('Create Account');
  fireEvent.click(toggleBtn);
  
  const nameInput = screen.getByPlaceholderText('e.g. Ananya Sharma');
  const identifierInput = screen.getByPlaceholderText('customer@fortunefood.com');
  const passwordInput = screen.getByPlaceholderText('••••••••');

  fireEvent.change(nameInput, { target: { value: 'Test User' } });
  fireEvent.change(identifierInput, { target: { value: 'test@test.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  
  const submitBtn = screen.getByRole('button', { name: /Register Account/i });
  fireEvent.click(submitBtn);
  
  expect(mockRegister).toHaveBeenCalledWith('Test User', 'test@test.com', 'password123');
});
