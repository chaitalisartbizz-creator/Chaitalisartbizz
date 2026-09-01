import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';

// ─── Firebase mocks ───────────────────────────────────────
vi.mock('../firebase', () => ({
  auth: {}
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  }
}));

// ─── Import mocked modules ────────────────────────────────
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import axios from 'axios';

// ─── Test Consumer Component ──────────────────────────────
function TestConsumer() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  return (
    <div>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="isAdmin">{String(isAdmin)}</span>
      <span data-testid="email">{user?.email || 'none'}</span>
      <span data-testid="role">{user?.role || 'none'}</span>
    </div>
  );
}

// ─── Tests ───────────────────────────────────────────────
describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: no user logged in
    onAuthStateChanged.mockImplementation((auth, cb) => {
      cb(null);
      return vi.fn(); // unsubscribe
    });
  });

  it('renders without crashing and shows unauthenticated state', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false');
    });
    expect(screen.getByTestId('isAdmin').textContent).toBe('false');
    expect(screen.getByTestId('email').textContent).toBe('none');
  });

  it('sets user and isAuthenticated to true when Firebase user is logged in', async () => {
    const mockFirebaseUser = {
      uid: 'uid_123',
      email: 'test@primepets.com',
      getIdToken: vi.fn().mockResolvedValue('mock_id_token'),
    };

    onAuthStateChanged.mockImplementation((auth, cb) => {
      cb(mockFirebaseUser);
      return vi.fn();
    });

    axios.post.mockResolvedValue({
      data: { user: { email: 'test@primepets.com', role: 'user', firebaseId: 'uid_123' } }
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });
    expect(screen.getByTestId('email').textContent).toBe('test@primepets.com');
  });

  it('sets isAdmin=true when user role is admin', async () => {
    const mockFirebaseUser = {
      uid: 'admin_uid',
      email: 'admin@primepets.com',
      getIdToken: vi.fn().mockResolvedValue('admin_token'),
    };

    onAuthStateChanged.mockImplementation((auth, cb) => {
      cb(mockFirebaseUser);
      return vi.fn();
    });

    axios.post.mockResolvedValue({
      data: { user: { email: 'admin@primepets.com', role: 'admin', firebaseId: 'admin_uid' } }
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('isAdmin').textContent).toBe('true');
    });
    expect(screen.getByTestId('role').textContent).toBe('admin');
  });

  it('falls back to firebase user when backend /me call fails', async () => {
    const mockFirebaseUser = {
      uid: 'uid_fallback',
      email: 'fallback@primepets.com',
      getIdToken: vi.fn().mockResolvedValue('token'),
    };

    onAuthStateChanged.mockImplementation((auth, cb) => {
      cb(mockFirebaseUser);
      return vi.fn();
    });

    axios.post.mockRejectedValue(new Error('Network Error'));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });
    // Fallback: role comes from firebase user (undefined → 'none')
    expect(screen.getByTestId('isAdmin').textContent).toBe('false');
  });

  it('throws when useAuth is used outside AuthProvider', () => {
    const originalError = console.error;
    console.error = vi.fn(); // suppress React error boundary logs

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useAuth must be used within AuthProvider');

    console.error = originalError;
  });

  it('logout calls Firebase signOut', async () => {
    signOut.mockResolvedValue();

    onAuthStateChanged.mockImplementation((auth, cb) => {
      cb(null);
      return vi.fn();
    });

    function LogoutTest() {
      const { logout } = useAuth();
      return <button onClick={logout}>Logout</button>;
    }

    const { getByText } = render(
      <AuthProvider>
        <LogoutTest />
      </AuthProvider>
    );

    await act(async () => {
      getByText('Logout').click();
    });

    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('checkUserExists returns true when backend says user exists', async () => {
    onAuthStateChanged.mockImplementation((auth, cb) => {
      cb(null);
      return vi.fn();
    });

    axios.post.mockResolvedValue({ data: { exists: true } });

    let existsResult;

    function CheckTest() {
      const { checkUserExists } = useAuth();
      return (
        <button onClick={async () => {
          existsResult = await checkUserExists('admin@primepets.com');
        }}>Check</button>
      );
    }

    const { getByText } = render(
      <AuthProvider>
        <CheckTest />
      </AuthProvider>
    );

    await act(async () => {
      getByText('Check').click();
    });

    expect(existsResult).toBe(true);
  });
});
