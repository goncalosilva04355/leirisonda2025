import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";

// Configuração Firebase - Leirisonda Production
const firebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Firebase Cloud Messaging (only in browser)
let messaging: any = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        messaging = getMessaging(app);
        console.log("📱 Firebase Cloud Messaging initialized");
      } else {
        console.warn(
          "⚠️ Firebase Cloud Messaging not supported in this environment",
        );
      }
    })
    .catch((error) => {
      console.warn(
        "⚠️ Error checking Firebase Cloud Messaging support:",
        error,
      );
    });
}

export { messaging };

console.log("🔥 Firebase Leirisonda initialized successfully");

export default app;
