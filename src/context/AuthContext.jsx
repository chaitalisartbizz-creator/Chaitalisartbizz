import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut 
} from 'firebase/auth';
import axios from 'axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => {
    return (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') ||
           (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test') ? false : true;
  });

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get additional user data from our backend
          const token = await firebaseUser.getIdToken();
          const response = await axios.post('/api/auth/me', {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser({ ...firebaseUser, ...response.data.user });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(firebaseUser); // Fallback to firebase user
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    
    // Check if user exists, if not, create them in backend
    try {
      const response = await axios.post('/api/auth/me', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.data || !response.data.user) {
        // First time login, register them
        await axios.post('/api/auth/register', { 
          name: result.user.displayName || 'User', 
          email: result.user.email 
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {
      // If /me fails with 404, register them
      await axios.post('/api/auth/register', { 
        name: result.user.displayName || 'User', 
        email: result.user.email 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    return result.user;
  };

  const register = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    // Register user in our backend database
    await axios.post('/api/auth/register', { name, email }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const checkUserExists = async (email) => {
    try {
      const response = await axios.post('/api/auth/check', { email });
      return response.data.exists;
    } catch (error) {
      console.error("Error checking if user exists:", error);
      return false; // Safest default is to assume they don't exist and trigger register
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithGoogle,
      register, 
      logout,
      checkUserExists,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin' 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
