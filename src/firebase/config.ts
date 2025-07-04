import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Get Firebase config from localStorage or use production config
const getFirebaseConfig = () => {
  try {
    const savedConfig = localStorage.getItem("firebase-config");
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (error) {
    console.warn("Error loading Firebase config from localStorage:", error);
  }

  // Return production Firebase config
  return {
    apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
    authDomain: "leirisonda-16f8b.firebaseapp.com",
    projectId: "leirisonda-16f8b",
    storageBucket: "leirisonda-16f8b.firebasestorage.app",
    messagingSenderId: "540456875574",
    appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
    measurementId: "G-R9W43EHH2C",
  };
};

const firebaseConfig = getFirebaseConfig();

// Only initialize Firebase if we have real config
let app: any = null;
let db: any = null;
let auth: any = null;

try {
  if (firebaseConfig.apiKey !== "demo") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  }
} catch (error) {
  console.warn("Firebase initialization failed:", error);
}

export { app, db, auth };
export default app;
