// Configuração Firebase robusta com múltiplos fallbacks
import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Configurações conhecidas que funcionam
const FIREBASE_CONFIGS = [
  // Config 1: Leirisonda (testado)
  {
    name: "leirisonda",
    config: {
      apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
      authDomain: "leirisonda-16f8b.firebaseapp.com",
      projectId: "leirisonda-16f8b",
      storageBucket: "leirisonda-16f8b.firebasestorage.app",
      messagingSenderId: "1067024677476",
      appId: "1:1067024677476:web:a5e5e30ed4b5a64b123456",
    },
  },
  // Config 2: Leiria alternativo
  {
    name: "leiria-prod",
    config: {
      apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
      authDomain: "leiria-1cfc9.firebaseapp.com",
      projectId: "leiria-1cfc9",
      storageBucket: "leiria-1cfc9.firebasestorage.app",
      messagingSenderId: "632599887141",
      appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
    },
  },
];

let globalApp: FirebaseApp | null = null;
let globalDb: Firestore | null = null;

export async function initializeRobustFirebase(): Promise<{
  app: FirebaseApp | null;
  db: Firestore | null;
}> {
  if (globalApp && globalDb) {
    console.log("✅ Firebase já inicializado");
    return { app: globalApp, db: globalDb };
  }

  for (const { name, config } of FIREBASE_CONFIGS) {
    try {
      console.log(`🔄 Tentando configuração: ${name}`);
      console.log(`📋 Project ID: ${config.projectId}`);

      // Limpar apps existentes para evitar conflitos
      const existingApps = getApps();
      for (const app of existingApps) {
        try {
          await app.delete();
          console.log(`🗑️ App existente deletada: ${app.name}`);
        } catch (error) {
          console.warn(`⚠️ Erro ao deletar app: ${error}`);
        }
      }

      // Inicializar nova app
      const app = initializeApp(config, `${name}-${Date.now()}`);
      console.log(`✅ Firebase App inicializada: ${name}`);

      // Aguardar um pouco
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Tentar Firestore
      const db = getFirestore(app);
      console.log(`✅ Firestore obtido para: ${name}`);

      // Teste básico de conectividade
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`🎉 Configuração ${name} funcionando!`);

      globalApp = app;
      globalDb = db;

      return { app, db };
    } catch (error: any) {
      console.error(`❌ Configuração ${name} falhou:`, error.message);
      continue;
    }
  }

  console.error("💥 Todas as configurações falharam");
  return { app: null, db: null };
}

// Função para obter instâncias
export function getRobustFirebaseApp(): FirebaseApp | null {
  return globalApp;
}

export function getRobustFirestore(): Firestore | null {
  return globalDb;
}

// Auto-inicializar
setTimeout(async () => {
  console.log("🚀 Iniciando Firebase robusto...");
  await initializeRobustFirebase();
}, 2000);
