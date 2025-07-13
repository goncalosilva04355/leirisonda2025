// Configuração Firebase única e limpa - projeto Leiria apenas
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Configuração única do projeto Leiria
const leiriaFirebaseConfig = {
  apiKey: "AIzaSyBdV_hGP4_xzY5kqJLm9NzF3rQ8wXeUvAw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  databaseURL:
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "947851234567",
  appId: "1:947851234567:web:abcd1234567890abcd1234",
  measurementId: "G-ABCD123456",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

// Inicialização simples e única
function initializeLeiria(): boolean {
  try {
    // Verificar se já existe uma app
    const existingApps = getApps();

    if (existingApps.length > 0) {
      // Usar app existente
      app = existingApps[0];
    } else {
      // Criar nova app
      app = initializeApp(leiriaFirebaseConfig, "leiria-app");
    }

    // Inicializar serviços
    db = getFirestore(app);
    auth = getAuth(app);

    console.log("✅ Firebase Leiria inicializado com sucesso");
    return true;
  } catch (error) {
    console.warn("⚠️ Firebase Leiria não disponível, usando modo local");
    return false;
  }
}

// Getters públicos
export function getFirebaseApp(): FirebaseApp | null {
  if (!app) initializeLeiria();
  return app;
}

export function getFirebaseFirestore(): Firestore | null {
  if (!db) initializeLeiria();
  return db;
}

export function getFirebaseAuth(): Auth | null {
  if (!auth) initializeLeiria();
  return auth;
}

export function isFirebaseReady(): boolean {
  return app !== null;
}

export function isFirestoreReady(): boolean {
  return db !== null;
}

// Inicializar automaticamente
initializeLeiria();

// Exportações
export { app, db, auth };
export default { app, db, auth };
