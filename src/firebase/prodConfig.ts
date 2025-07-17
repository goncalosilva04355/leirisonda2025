// Secure Firebase Production Configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getSecureFirebaseConfig } from "../config/firebaseEnvSecure";

// Get configuration from environment variables
const firebaseConfig = getSecureFirebaseConfig();

// Inicializar Firebase
const app = initializeApp(firebaseConfig, "leiria-prod");
const db = getFirestore(app);
const auth = getAuth(app);

console.log("🔥 Firebase configuração de produção carregada");
console.log("📱 Projeto:", firebaseConfig.projectId);

export { app, db, auth };
export default { app, db, auth };
