// Configuração Firestore SIMPLES que funciona
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Configuração Firebase FIXA
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

// Inicializar Firebase App
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase App inicializada:", app.name);
} else {
  app = getApp();
  console.log("✅ Firebase App existente:", app.name);
}

// Variável para armazenar instância do Firestore
let db: any = null;

// Função assíncrona para inicializar Firestore
async function initializeFirestore() {
  if (db) return db; // Já inicializado

  try {
    // Aguardar um pouco para garantir que o Firebase está pronto
    await new Promise((resolve) => setTimeout(resolve, 100));

    db = getFirestore(app);
    console.log("✅ Firestore inicializado assincronamente");
    return db;
  } catch (error: any) {
    console.error("❌ Erro ao inicializar Firestore:", error);

    // Verificar se é erro específico de Firestore não habilitado
    if (
      error.message?.includes("getImmediate") ||
      error.code === "firestore/unavailable"
    ) {
      console.error("❌ Firestore não está habilitado no projeto Firebase");
      console.error(
        "🔗 Vá para: https://console.firebase.google.com/project/leiria-1cfc9/firestore",
      );
    }

    return null;
  }
}

// Exportar app e função para obter Firestore
export { app as firebaseApp };

// Função para obter Firestore (inicializa se necessário)
export async function getFirestoreDB() {
  if (!db) {
    db = await initializeFirestore();
  }
  return db;
}

// Função simples para verificar se funciona
export function isFirestoreWorking(): boolean {
  return db !== null;
}

// Log do estado
console.log("🔥 Firebase configurado:");
console.log("  - App:", !!app);
console.log("  - Projeto:", firebaseConfig.projectId);
console.log("  - Firestore:", "será inicializado assincronamente");
