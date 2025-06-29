import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Configuração Firebase para desenvolvimento local
const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:demo",
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
