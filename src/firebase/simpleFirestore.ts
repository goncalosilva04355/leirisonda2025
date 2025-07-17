// Secure Firestore Configuration using Environment Variables
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getSecureFirebaseConfig } from "../config/firebaseEnvSecure";

// Get configuration from environment variables
const firebaseConfig = getSecureFirebaseConfig();

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
