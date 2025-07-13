import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Use environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "leiria-1cfc9.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "leiria-1cfc9",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  try {
    if (!app && getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else if (!app) {
      app = getApps()[0];
    }
    return app;
  } catch (error) {
    console.warn("Firebase initialization failed, using local mode:", error);
    return null;
  }
}

export function getFirebaseStatus() {
  const app = getFirebaseApp();
  return {
    ready: !!app,
    app: app,
    config: firebaseConfig,
  };
}

export default getFirebaseApp();
