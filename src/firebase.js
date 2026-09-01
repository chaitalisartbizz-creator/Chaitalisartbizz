import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
];

// Warn in dev if any key is missing
const missing = requiredKeys.filter(k => !import.meta.env[k]);
if (missing.length > 0) {
  console.warn(
    `[Firebase] Missing environment variables: ${missing.join(', ')}.\n` +
    `Ensure these are set in .env.local`
  );
}

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Auth export - always available
import { GoogleAuthProvider } from 'firebase/auth';

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
