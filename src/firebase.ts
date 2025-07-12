// Firebase Config - Backup 110725leirisonda1033
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
      console.log("🔥 Inicializando Firebase Auth...");
      const { getAuth } = require("firebase/auth");
      auth = getAuth(getFirebaseApp());
      console.log("✅ Firebase Auth inicializado");
    } catch (error) {
      console.error("❌ Erro ao inicializar Firebase Auth:", error);
      auth = {}; // Mock para evitar crashes
    }
  }
  return auth;
};

// Verificações de estado
export const isFirebaseReady = () => {
  try {
    return app !== null && typeof app === "object";
  } catch (error) {
    return false;
  }
};

export const isFirestoreReady = () => {
  try {
    return firestore !== null && typeof firestore === "object";
  } catch (error) {
    return false;
  }
};

export const isFirebaseAuthReady = () => {
  try {
    return auth !== null && typeof auth === "object";
  } catch (error) {
    return false;
  }
};

// Exports adicionais para compatibilidade
export { app, firestore as db, auth };
export default getFirebaseApp;
