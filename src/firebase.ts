// Configuração Firebase ultra-simples para diagnóstico
console.log("🔥 Carregando Firebase...");

let app: any = null;
let firestore: any = null;
let auth: any = null;

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

export const getFirebaseApp = () => {
  if (!app) {
    try {
      console.log("🔥 Inicializando Firebase App...");
      const { initializeApp } = require("firebase/app");
      app = initializeApp(firebaseConfig);
      console.log("✅ Firebase App inicializada");
    } catch (error) {
      console.error("❌ Erro ao inicializar Firebase App:", error);
      app = {}; // Mock para evitar crashes
    }
  }
  return app;
};

export const getDB = () => {
  if (!firestore) {
    try {
      console.log("🔥 Inicializando Firestore...");
      const { getFirestore } = require("firebase/firestore");
      firestore = getFirestore(getFirebaseApp());
      console.log("✅ Firestore inicializado");
    } catch (error) {
      console.error("❌ Erro ao inicializar Firestore:", error);
      firestore = {}; // Mock para evitar crashes
    }
  }
  return firestore;
};

export const getFirebaseAuth = () => {
  if (!auth) {
    try {
      console.log("🔥 Inicializando Auth...");
      const { getAuth } = require("firebase/auth");
      auth = getAuth(getFirebaseApp());
      console.log("✅ Auth inicializado");
    } catch (error) {
      console.error("❌ Erro ao inicializar Auth:", error);
      auth = {}; // Mock para evitar crashes
    }
  }
  return auth;
};

// Compatibilidade com código existente
export const getFirebaseFirestore = getDB;
export const getAuthService = getFirebaseAuth;
export const isFirebaseReady = () => !!app;
export const isFirestoreReady = () => !!firestore;
export const isFirebaseAuthReady = () => !!auth;

// Exports diretos para compatibilidade
export { app, firestore as db, auth };

console.log("🔥 Firebase module carregado");
export default app;
