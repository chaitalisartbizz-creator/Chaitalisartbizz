import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { vi, describe, it, expect } from 'vitest';

// Mock contexts
vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    cartCount: 2,
    wishlistItems: ['item1'],
    setCartOpen: vi.fn(),
  }),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User' },
    isAuthenticated: true,
  }),
}));

vi.mock('../context/DataContext', () => ({
  useData: () => ({
    products: [],
    frontendSettings: {},
  }),
}));

// Provide router wrapper
const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  it('renders brand logo and basic navigation', () => {
    renderHeader();
    expect(screen.getByAltText("Chaitali's Artbizz Logo")).toBeInTheDocument();
    
    // There are two of each link now (desktop and mobile)
    const artCatalogues = screen.getAllByText('Art Catalogue');
    expect(artCatalogues.length).toBeGreaterThan(0);
  });

  it('renders cart and wishlist badges correctly', () => {
    renderHeader();
    // We mocked cartCount to 2 and wishlist to 1 ('item1')
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('opens mobile menu drawer when mobile toggle is clicked', () => {
    renderHeader();
    
    // The mobile menu drawer has the text 'Menu' inside it which is unique to the drawer title
    const menuTitle = screen.getByText('Menu');
    
    // Find the drawer container. In our code, it translates via transform classes.
    const menuToggleBtn = screen.getByLabelText('Open Menu');
    
    // Initially, the drawer is hidden via classes (opacity-0 pointer-events-none)
    const drawerWrapper = menuTitle.closest('div.fixed');
    expect(drawerWrapper.className).toContain('opacity-0');
    
    // Click the toggle
    fireEvent.click(menuToggleBtn);
    
    // Now it should be visible
    expect(drawerWrapper.className).toContain('opacity-100');
  });
});
