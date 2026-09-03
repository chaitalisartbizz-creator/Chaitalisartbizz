import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BottomNav from './BottomNav';

describe('BottomNav Component Rebranding', () => {
  it('renders correct navigation items including Creative Hub', () => {
    render(
      <BrowserRouter>
        <BottomNav />
      </BrowserRouter>
    );
    
    // Check old text is gone
    expect(screen.queryByText('Wellness Hub')).not.toBeInTheDocument();
    
    // Check new text is present
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Catalogue')).toBeInTheDocument();
    expect(screen.getByText('Deals')).toBeInTheDocument();
    expect(screen.getByText('Training')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});
