// Configuração Firebase ultra-simples para diagnóstico
console.log("🔥 Carregando Firebase...");

let app: any = null;
let firestore: any = null;
let auth: any = null;

const firebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
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
