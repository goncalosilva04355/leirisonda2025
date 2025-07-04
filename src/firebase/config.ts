import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Get Firebase config from localStorage or use dummy config
const getFirebaseConfig = () => {
  try {
    const savedConfig = localStorage.getItem("firebase-config");
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (error) {
    console.warn("Error loading Firebase config from localStorage:", error);
  }

  // Return dummy config that won't initialize Firebase
  return {
    apiKey: "demo",
    authDomain: "demo.firebaseapp.com",
    projectId: "demo",
    storageBucket: "demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:demo",
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
