import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  databaseURL:
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
  measurementId: "G-Q2QWQVH60L",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function initializeFirebase(): FirebaseApp {
  if (app) return app;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    app = initializeApp(firebaseConfig);
  }

  return app;
}

export function getDB(): Firestore | null {
  if (db) return db;

  try {
    const firebaseApp = initializeFirebase();
    if (!firebaseApp) {
      console.warn("⚠️ Firebase app não inicializada");
      return null;
    }

    // Aguardar um pouco para garantir que a app está pronta
    db = getFirestore(firebaseApp);
    console.log("✅ Firestore inicializado com sucesso");
    return db;
  } catch (error) {
    console.warn("⚠️ Erro ao inicializar Firestore:", error);
    // Tentar novamente depois de um delay
    setTimeout(() => {
      try {
        const firebaseApp = initializeFirebase();
        db = getFirestore(firebaseApp);
        console.log("✅ Firestore inicializado na segunda tentativa");
      } catch (retryError) {
        console.warn("⚠️ Falha na segunda tentativa Firestore:", retryError);
      }
    }, 1000);
    return null;
  }
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const firebaseApp = initializeFirebase();
    auth = getAuth(firebaseApp);
  }
  return auth;
}

// Compatibilidade com código existente
export const getFirebaseFirestore = getDB;
export const getAuthService = getFirebaseAuth;
export const getFirebaseApp = () => initializeFirebase();
export const isFirebaseReady = () => app !== null;
export const isFirestoreReady = () => db !== null;
export const isFirebaseAuthReady = () => auth !== null;

// Exports diretos para compatibilidade com imports antigos
export { auth };
export { db };
export { app };

// Inicializar automaticamente
initializeFirebase();

export default app;
