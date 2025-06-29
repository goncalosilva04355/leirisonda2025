import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

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

let app: any = null;
let db: any = null;
let auth: any = null;

// Inicializar Firebase apenas se em ambiente de produção com credenciais válidas
const isValidConfig = firebaseConfig.apiKey !== "demo-key";

if (isValidConfig) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);

    // Initialize Firebase services
    db = getFirestore(app);
    auth = getAuth(app);

    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.warn("⚠️ Firebase initialization failed:", error);
  }
} else {
  console.log("🔧 Firebase disabled - using local storage only");
}

// Export placeholder functions when Firebase is not available
export { db, auth };

export default app;
