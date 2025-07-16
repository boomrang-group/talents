
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// This function initializes and returns the app, or null if config is missing.
// It ensures we don't initialize multiple times.
function initializeFirebaseApp() {
    if (getApps().length > 0) {
        return getApp();
    }

    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        try {
            return initializeApp(firebaseConfig);
        } catch (e) {
            console.error("Firebase initialization error:", e);
            return null;
        }
    }
    
    // This warning is helpful for debugging.
    console.warn("Firebase configuration is missing or incomplete. Please check your environment variables.");
    return null;
}

const app = initializeFirebaseApp();

// We get the services only if the app was successfully initialized.
const auth = app ? getAuth(app) : null;
const firestore = app ? getFirestore(app) : null;
const storage = app ? getStorage(app) : null;

// Export a single function to get all firebase services.
// Components can call this to get the (potentially null) services.
export function getFirebaseServices() {
    return { app, auth, firestore, storage };
}
