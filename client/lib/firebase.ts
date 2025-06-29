import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDemo-FakeKey-ForLeirisondaApp",
  authDomain: "leirisonda-obras.firebaseapp.com",
  projectId: "leirisonda-obras",
  storageBucket: "leirisonda-obras.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// For development - use emulators if available
if (import.meta.env.DEV && typeof window !== "undefined") {
  try {
    // Only connect to emulators in development
    if (!auth.config.emulator) {
      connectAuthEmulator(auth, "http://localhost:9099", {
        disableWarnings: true,
      });
    }
    if (!db._delegate._databaseId.projectId.includes("emulator")) {
      connectFirestoreEmulator(db, "localhost", 8080);
    }
  } catch (error) {
    // Emulators not available, use production Firebase
    console.log("Firebase emulators not available, using production Firebase");
  }
}

export default app;
