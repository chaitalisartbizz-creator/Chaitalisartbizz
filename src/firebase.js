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
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key-for-dev",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock-domain.firebaseapp.com",
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock-project-id",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mock-bucket.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:mockappid",
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MOCKID",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Auth export - always available
import { GoogleAuthProvider } from 'firebase/auth';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export let messaging = null;
if (typeof window !== 'undefined' && firebaseConfig.messagingSenderId) {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    } else {
      console.warn('Firebase Messaging not supported (e.g. Capacitor WebView).');
    }
  }).catch((e) => console.warn('isSupported() failed:', e));
}

export const requestNotificationPermission = async () => {
  if (!messaging || typeof Notification === 'undefined') return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const swRegistration = await navigator.serviceWorker.register(
        `/firebase-messaging-sw.js?apiKey=${firebaseConfig.apiKey}&projectId=${firebaseConfig.projectId}&messagingSenderId=${firebaseConfig.messagingSenderId}&appId=${firebaseConfig.appId}`
      );
      
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: swRegistration
      });
      return token;
    }
  } catch (error) {
    console.error("Failed to get FCM token", error);
  }
  return null;
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default app;
console.log('FIREBASE.JS LOADED');
