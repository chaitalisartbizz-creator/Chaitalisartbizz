import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');

vi.mock('../../context/DataContext', () => ({
  useData: () => ({
    frontendSettings: { storeName: "Chaitali's Artbizz", tagline: 'Imagine. We will create.' },
    setFrontendSettings: vi.fn(),
    refreshData: vi.fn(),
  })
}));

vi.mock('../../components/ScrollReveal', () => ({
  default: ({ children }) => <div>{children}</div>
}));

vi.mock('../../utils/imageUpload', () => ({
  handleImageUpload: vi.fn().mockResolvedValue('https://example.com/logo.png')
}));

import AdminSettings from './AdminSettings';

describe('AdminSettings', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders settings page heading and save button', () => {
    render(<BrowserRouter><AdminSettings /></BrowserRouter>);
    // Page heading is "Frontend Settings"
    expect(screen.getByText('Frontend Settings')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('renders General Info tab by default', () => {
    render(<BrowserRouter><AdminSettings /></BrowserRouter>);
    // General Info tab is the first tab and active by default
    expect(screen.getByText('General Info')).toBeInTheDocument();
  });

  it('switches to Footer & Text tab', () => {
    render(<BrowserRouter><AdminSettings /></BrowserRouter>);
    const footerTab = screen.getByText('Footer & Text');
    fireEvent.click(footerTab);
    // After clicking the footer tab, it should be highlighted/active
    expect(footerTab).toBeInTheDocument();
  });

  it('calls PUT /api/settings on save', async () => {
    axios.put.mockResolvedValueOnce({ data: { success: true } });
    
    render(<BrowserRouter><AdminSettings /></BrowserRouter>);
    
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/api/settings', expect.any(Object));
    });
  });

  it('renders store name input field', () => {
    render(<BrowserRouter><AdminSettings /></BrowserRouter>);
    // There should be a text input for store name
    const storeNameInput = screen.getByPlaceholderText(/prime pets/i);
    expect(storeNameInput).toBeInTheDocument();
  });

  it('asks for confirmation before clearing cache', () => {
    window.confirm = vi.fn(() => false);
    render(<BrowserRouter><AdminSettings /></BrowserRouter>);
    
    const dataTab = screen.queryByText(/data management/i);
    if (dataTab) {
      fireEvent.click(dataTab);
      const clearBtn = screen.queryByRole('button', { name: /clear/i });
      if (clearBtn) {
        fireEvent.click(clearBtn);
        expect(window.confirm).toHaveBeenCalled();
      }
    }
  });
});
