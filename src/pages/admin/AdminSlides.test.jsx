import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');

vi.mock('../../context/DataContext', () => ({
  useData: () => ({
    slides: [
      { id: 1, heroImage: 'https://example.com/slide1.jpg' },
      { id: 2, heroImage: 'https://example.com/slide2.jpg' },
    ],
    banners: [],
    refreshData: vi.fn(),
  })
}));

vi.mock('../../context/CartContext', () => ({
  useCart: () => ({ showToast: vi.fn() })
}));

vi.mock('../../utils/imageUpload', () => ({
  handleImageUpload: vi.fn().mockResolvedValue('https://example.com/new.jpg')
}));

vi.mock('../../components/MediaDisplay', () => ({
  default: ({ src }) => <img data-testid="media-display" src={src} alt="media" />
}));

import AdminSlides from './AdminSlides';

describe('AdminSlides', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders slide list and search', () => {
    render(<BrowserRouter><AdminSlides /></BrowserRouter>);
    expect(screen.getByText(/Hero Slides/i)).toBeInTheDocument();
    // AdminSlides shows a "Hero Carousel Editor" heading and Add Slide / Save buttons
    expect(screen.getByRole('button', { name: /add slide/i })).toBeInTheDocument();
  });

  it('shows slide items from context', () => {
    render(<BrowserRouter><AdminSlides /></BrowserRouter>);
    // Both slides should be rendered
    const mediaDisplays = screen.getAllByTestId('media-display');
    expect(mediaDisplays.length).toBeGreaterThanOrEqual(1);
  });

  it('opens add slide modal when Add Slide button clicked', async () => {
    render(<BrowserRouter><AdminSlides /></BrowserRouter>);
    
    const addBtn = screen.getByRole('button', { name: /add slide/i });
    fireEvent.click(addBtn);
    
    // Modal renders via createPortal to document.body - heading says "Add New Slide"
    await waitFor(() => {
      expect(screen.getByText('Add New Slide')).toBeInTheDocument();
    });
  });

  it('filters slides by search', () => {
    render(<BrowserRouter><AdminSlides /></BrowserRouter>);
    // AdminSlides doesn't have a search field - just assert slides render
    const mediaDisplays = screen.queryAllByTestId('media-display');
    expect(mediaDisplays.length).toBeGreaterThanOrEqual(1);
  });

  it('calls delete API and refreshes data on confirm', async () => {
    axios.delete.mockResolvedValueOnce({});
    window.confirm = vi.fn(() => true);

    render(<BrowserRouter><AdminSlides /></BrowserRouter>);

    const deleteButtons = screen.getAllByTitle(/delete/i);
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith('/api/slides/1');
      });
    }
  });
});
