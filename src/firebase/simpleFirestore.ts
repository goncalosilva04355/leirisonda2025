// Configuração Firestore SIMPLES que funciona
import { getFirebaseApp, getFirestoreInstance } from "./config";

// Obter app Firebase centralizada
const app = getFirebaseApp();
console.log("✅ Firebase App obtida:", app.name);

// Variável para armazenar instância do Firestore
let db: any = null;

// Função assíncrona para inicializar Firestore
async function initializeFirestore() {
  if (db) return db; // Já inicializado

  try {
    // Aguardar um pouco para garantir que o Firebase está pronto
    await new Promise((resolve) => setTimeout(resolve, 100));

    db = getFirestoreInstance();
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
console.log("  - Projeto:", app.options.projectId);
console.log("  - Firestore:", "será inicializado assincronamente");
