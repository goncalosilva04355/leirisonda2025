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
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "demo") {
    // Validate required config fields
    const requiredFields = ["apiKey", "authDomain", "projectId"];
    const missingFields = requiredFields.filter(
      (field) => !firebaseConfig[field],
    );

    if (missingFields.length > 0) {
      console.error("Missing Firebase config fields:", missingFields);
      throw new Error(
        `Missing Firebase configuration: ${missingFields.join(", ")}`,
      );
    }

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase not initialized - demo mode");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
  app = null;
  db = null;
  auth = null;
}

export { app, db, auth };
export default app;
