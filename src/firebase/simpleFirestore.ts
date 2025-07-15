// Configuração Firestore SIMPLES que funciona
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Configuração Firebase FIXA
const firebaseConfig = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria25.firebaseapp.com",
  databaseURL:
    "https://leiria25-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leiria25",
  storageBucket: "leiria25.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
  measurementId: "G-Q2QWQVH60L",
};

// Inicializar Firebase App
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase App inicializada:", app.name);
} else {
  app = getApp();
  console.log("✅ Firebase App existente:", app.name);
}

// Inicializar Firestore DIRETO
let db;
try {
  db = getFirestore(app);
  console.log("✅ Firestore inicializado diretamente");
} catch (error: any) {
  console.error("❌ Erro ao inicializar Firestore:", error);
  db = null;
}

// Exportar instâncias prontas
export { app as firebaseApp, db as firestoreDB };

// Função simples para verificar se funciona
export function isFirestoreWorking(): boolean {
  return db !== null;
}

// Log do estado
console.log("🔥 Firebase configurado:");
console.log("  - App:", !!app);
console.log("  - Firestore:", !!db);
console.log("  - Projeto:", firebaseConfig.projectId);
