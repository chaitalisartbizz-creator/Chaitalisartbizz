import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CategoryPage from './CategoryPage';

vi.mock('../components/Header', () => ({ default: () => <nav data-testid="header" /> }));
vi.mock('../components/ScrollReveal', () => ({ default: ({ children }) => <div>{children}</div> }));
vi.mock('../components/MediaDisplay', () => ({ default: ({ alt }) => <img alt={alt} /> }));
vi.mock('../components/LiveBackground', () => ({ default: () => null }));
vi.mock('../components/Skeleton', () => ({ ProductCardSkeleton: () => <div data-testid="skeleton" /> }));

const MOCK_PRODUCTS = [
  { id: 1, name: 'Resin Coaster Set', brand: 'Handcraft', category: 'Resin Art', price: 450,  mrp: 600,  rating: 4.8, reviews: 20, img: '', tag: 'HOT' },
  { id: 2, name: 'Custom Portrait',   brand: 'ArtStudio',  category: 'Portrait',  price: 1200, mrp: 1500, rating: 4.5, reviews: 15, img: '', tag: 'NEW' },
  { id: 3, name: 'MDF Name Plate',    brand: 'Handcraft',  category: 'MDF Board', price: 350,  mrp: 500,  rating: 4.2, reviews: 8,  img: '', tag: '' },
  { id: 4, name: 'Digital Logo',      brand: 'ArtStudio',  category: 'Digital',   price: 2500, mrp: 3000, rating: 4.9, reviews: 30, img: '', tag: 'PREMIUM' },
  { id: 5, name: 'Festive Hamper',    brand: 'Handcraft',  category: 'Gifts',     price: 800,  mrp: 1000, rating: 4.6, reviews: 12, img: '', tag: '' },
];
const MOCK_CATEGORIES = [
  { label: 'Resin Art', emoji: '🎨' },
  { label: 'Portrait',  emoji: '🖼️' },
  { label: 'MDF Board', emoji: '🏷️' },
  { label: 'Digital',   emoji: '💻' },
  { label: 'Gifts',     emoji: '🎁' },
];

vi.mock('../context/DataContext', () => ({
  useData: () => ({ categories: MOCK_CATEGORIES, products: MOCK_PRODUCTS, loading: false }),
}));
vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    addToCart: vi.fn(), toggleWishlist: vi.fn(),
    isInCart: vi.fn(() => false), isWishlisted: vi.fn(() => false), showToast: vi.fn(),
  }),
}));
vi.mock('fuse.js', () => ({
  default: class { constructor(list) { this._list = list; } search(q) { return this._list.filter(i => i.name.toLowerCase().includes(q.toLowerCase())).map(item => ({ item })); } },
}));

const renderPage = (state = {}) =>
  render(<MemoryRouter initialEntries={[{ pathname: '/category', state }]}><CategoryPage /></MemoryRouter>);

describe('CategoryPage', () => {
  it('renders title and all products by default', () => {
    renderPage();
    expect(screen.getByText("Chaitali's Artbizz Catalogue")).toBeInTheDocument();
    expect(screen.getByText('5 Creations Available')).toBeInTheDocument();
  });

  it('filters by category pill', () => {
    renderPage();
    // There are multiple Resin Art buttons (sidebar + pill row). Click the last one (pill row).
    const resinBtns = screen.getAllByText(/Resin Art/);
    fireEvent.click(resinBtns[resinBtns.length - 1]);
    // After filtering, only Resin Coaster Set should show
    expect(screen.getByText('Resin Coaster Set')).toBeInTheDocument();
    expect(screen.queryByText('Custom Portrait')).not.toBeInTheDocument();
    expect(screen.queryByText('Digital Logo')).not.toBeInTheDocument();
  });

  it('resets to all on All Items click', () => {
    renderPage();
    const resinBtns = screen.getAllByText(/Resin Art/);
    fireEvent.click(resinBtns[resinBtns.length - 1]);
    fireEvent.click(screen.getByText(/All Items/));
    expect(screen.getByText('5 Creations Available')).toBeInTheDocument();
  });

  it('pre-selects category from location state', () => {
    renderPage({ category: 'Digital' });
    expect(screen.getByText('Digital Logo')).toBeInTheDocument();
    expect(screen.queryByText('Resin Coaster Set')).not.toBeInTheDocument();
  });

  it('filters by Under 500', () => {
    renderPage();
    fireEvent.click(screen.getByRole('radio', { name: 'Under ₹500' }));
    expect(screen.getByText('2 Creations Available')).toBeInTheDocument();
    expect(screen.getByText('Resin Coaster Set')).toBeInTheDocument();
    expect(screen.getByText('MDF Name Plate')).toBeInTheDocument();
  });

  it('filters by 500-1000', () => {
    renderPage();
    fireEvent.click(screen.getByRole('radio', { name: '₹500 – ₹1000' }));
    expect(screen.getByText('1 Creations Available')).toBeInTheDocument();
    expect(screen.getByText('Festive Hamper')).toBeInTheDocument();
  });

  it('filters by 1000-2000', () => {
    renderPage();
    fireEvent.click(screen.getByRole('radio', { name: '₹1000 – ₹2000' }));
    expect(screen.getByText('Custom Portrait')).toBeInTheDocument();
    expect(screen.getByText('1 Creations Available')).toBeInTheDocument();
  });

  it('filters by above 2000', () => {
    renderPage();
    fireEvent.click(screen.getByRole('radio', { name: 'Above ₹2000' }));
    expect(screen.getByText('Digital Logo')).toBeInTheDocument();
    expect(screen.getByText('1 Creations Available')).toBeInTheDocument();
  });

  it('sorts Price Low to High correctly', () => {
    renderPage();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Price: Low to High' } });
    // Verify the cheapest product is first in the grid
    const names = screen.getAllByText(/Resin Coaster Set|Custom Portrait|MDF Name Plate|Digital Logo|Festive Hamper/).map(e => e.textContent);
    // MDF Name Plate (350) should come before Resin Coaster Set (450)
    expect(names.indexOf('MDF Name Plate')).toBeLessThan(names.indexOf('Resin Coaster Set'));
    expect(names.indexOf('Resin Coaster Set')).toBeLessThan(names.indexOf('Custom Portrait'));
  });

  it('sorts Price High to Low correctly', () => {
    renderPage();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Price: High to Low' } });
    const names = screen.getAllByText(/Resin Coaster Set|Custom Portrait|MDF Name Plate|Digital Logo|Festive Hamper/).map(e => e.textContent);
    // Digital Logo (2500) should be first, MDF Name Plate (350) last
    expect(names[0]).toBe('Digital Logo');
    expect(names[names.length - 1]).toBe('MDF Name Plate');
  });

  it('sorts by Rating highest first', () => {
    renderPage();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Rating' } });
    const names = screen.getAllByText(/Resin Coaster Set|Custom Portrait|MDF Name Plate|Digital Logo|Festive Hamper/).map(e => e.textContent);
    expect(names[0]).toBe('Digital Logo');
  });

  it('sorts by Newest (highest id) first', () => {
    renderPage();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Newest' } });
    const names = screen.getAllByText(/Resin Coaster Set|Custom Portrait|MDF Name Plate|Digital Logo|Festive Hamper/).map(e => e.textContent);
    expect(names[0]).toBe('Festive Hamper');
  });

  it('does not corrupt original order after sort then Popular', () => {
    renderPage();
    const sel = screen.getByRole('combobox');
    fireEvent.change(sel, { target: { value: 'Price: Low to High' } });
    fireEvent.change(sel, { target: { value: 'Popular' } });
    expect(screen.getByText('5 Creations Available')).toBeInTheDocument();
  });

  it('filters by search query', () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText(/Search Portraits, Resin/i), { target: { value: 'MDF Name Plate' } });
    expect(screen.getByText('MDF Name Plate')).toBeInTheDocument();
    expect(screen.queryByText('Digital Logo')).not.toBeInTheDocument();
  });

  it('clears search on Clear button click', () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText(/Search Portraits, Resin/i), { target: { value: 'MDF' } });
    fireEvent.click(screen.getByText('Clear'));
    expect(screen.getByText('5 Creations Available')).toBeInTheDocument();
  });

  it('shows empty state when nothing matches (category + price combo)', () => {
    renderPage({ category: 'Digital' });
    // Digital Logo costs 2500 — filtering Under 500 yields 0 results
    fireEvent.click(screen.getByRole('radio', { name: 'Under ₹500' }));
    expect(screen.getByText('No matching creations found')).toBeInTheDocument();
  });

  it('renders product prices on cards', () => {
    renderPage();
    expect(screen.getByText('₹450')).toBeInTheDocument();
    expect(screen.getByText('₹2500')).toBeInTheDocument();
  });

  it('renders product tags', () => {
    renderPage();
    expect(screen.getByText('HOT')).toBeInTheDocument();
    expect(screen.getAllByText('PREMIUM').length).toBeGreaterThan(0);
  });

  it('pre-populates search from location state', () => {
    renderPage({ searchQuery: 'portrait' });
    expect(screen.getByPlaceholderText(/Search Portraits, Resin/i).value).toBe('portrait');
  });
});

