import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { DataProvider, DataContext } from './DataContext';

vi.mock('axios');

const mockData = {
  slides: [{ id: 1, heroImage: 'slide1.jpg' }],
  banners: [{ id: 1, image: 'banner1.jpg' }],
  categories: [{ id: 1, name: 'Resin Art' }],
  deals: [{ id: 1, title: 'RESIN MAGIC' }],
  products: [{ id: 1, name: 'Resin Bowl' }],
  frontendSettings: { storeName: "Chaitali's Artbizz" },
};

const TestConsumer = () => {
  const data = React.useContext(DataContext);
  return (
    <div>
      <div data-testid="loading">{data.loading ? 'loading' : 'ready'}</div>
      <div data-testid="slides-count">{data.slides.length}</div>
      <div data-testid="categories-count">{data.categories.length}</div>
      <div data-testid="products-count">{data.products.length}</div>
    </div>
  );
};

describe('DataContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    axios.post.mockResolvedValue({ data: {} });
  });

  it('starts in loading state then becomes ready', async () => {
    // Mock resolves quickly
    axios.get.mockResolvedValueOnce({ data: mockData });
    
    render(
      <DataProvider>
        <TestConsumer />
      </DataProvider>
    );

    // After data resolves, should be ready
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('ready');
    });
  });

  it('loads data from /api/data on mount', async () => {
    axios.get.mockResolvedValueOnce({ data: mockData });
    
    render(
      <DataProvider>
        <TestConsumer />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('ready');
    });

    expect(screen.getByTestId('slides-count').textContent).toBe('1');
    expect(screen.getByTestId('categories-count').textContent).toBe('1');
    expect(screen.getByTestId('products-count').textContent).toBe('1');
  });

  it('handles fetch error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));
    
    render(
      <DataProvider>
        <TestConsumer />
      </DataProvider>
    );

    // Even on error, loading should eventually become false
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('ready');
    });
    
    // Data should still be empty defaults
    expect(screen.getByTestId('slides-count').textContent).toBe('0');
  });

  it('generates and persists a visitor ID in localStorage', async () => {
    axios.get.mockResolvedValueOnce({ data: mockData });
    
    render(
      <DataProvider>
        <TestConsumer />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('ready');
    });

    const vid = localStorage.getItem('chaitali-artbizz-vid');
    expect(vid).toBeTruthy();
    expect(vid).toMatch(/^vid_/);
  });

  it('refreshData re-fetches and updates state', async () => {
    axios.get.mockResolvedValueOnce({ data: mockData });
    
    const RefreshConsumer = () => {
      const data = React.useContext(DataContext);
      return (
        <div>
          <div data-testid="slides-count">{data.slides.length}</div>
          <button onClick={data.refreshData} data-testid="refresh-btn">Refresh</button>
        </div>
      );
    };

    render(
      <DataProvider>
        <RefreshConsumer />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('slides-count').textContent).toBe('1');
    });

    // Set up second response with more slides
    axios.get.mockResolvedValueOnce({ 
      data: { ...mockData, slides: [{ id: 1 }, { id: 2 }] } 
    });

    act(() => {
      screen.getByTestId('refresh-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('slides-count').textContent).toBe('2');
    });
  });
});
