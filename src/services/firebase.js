import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updatePassword
} from 'firebase/auth';

/**
 * Firebase Configuration from Vite Environment Variables (.env)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

/**
 * Check if real Firebase credentials are provided in .env
 */
export function isFirebaseConfigured() {
  const key = firebaseConfig.apiKey;
  return Boolean(
    key &&
    key !== 'AIzaSyYourFirebaseApiKeyHere12345' &&
    key !== 'your_firebase_api_key' &&
    key.length > 10
  );
}

// Initialize Firebase App instance safely
let app = null;
let auth = null;
let googleProvider = null;

try {
  if (isFirebaseConfigured()) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  }
} catch (error) {
  console.warn('[Firebase] Initialization notice:', error.message);
}

export { auth, googleProvider };

/**
 * Sign In with Email & Password via Firebase Auth
 */
export async function loginWithEmail(email, password) {
  if (!isFirebaseConfigured() || !auth) {
    return {
      success: false,
      isSimulated: true,
      message: 'Firebase keys not configured in .env; utilizing local authentication.'
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      isSimulated: false
    };
  } catch (error) {
    let message = 'Failed to sign in. Please check your email and password.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      message = 'Invalid email address or password.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Access temporarily disabled due to many failed attempts. Try again later.';
    }
    return {
      success: false,
      error: error.code,
      message,
      isSimulated: false
    };
  }
}

/**
 * Sign In with Google Popup via Firebase Auth
 */
export async function loginWithGoogle() {
  if (!isFirebaseConfigured() || !auth || !googleProvider) {
    return {
      success: false,
      isSimulated: true,
      message: 'Firebase Google OAuth not configured in .env.'
    };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: result.user,
      isSimulated: false
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: error.message || 'Google sign-in was cancelled or failed.',
      isSimulated: false
    };
  }
}

/**
 * Trigger Firebase Password Reset Link
 */
export async function sendFirebasePasswordReset(email) {
  if (!isFirebaseConfigured() || !auth) {
    return {
      success: false,
      isSimulated: true,
      message: 'Firebase Auth not active in .env.'
    };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      isSimulated: false
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: error.message,
      isSimulated: false
    };
  }
}
