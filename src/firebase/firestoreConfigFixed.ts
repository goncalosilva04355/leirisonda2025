import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getFirebaseConfig } from "../config/firebaseEnv";

// Estado global da instância Firestore
let firestoreInstance: Firestore | null = null;
let isInitialized = false;
let initializationPromise: Promise<Firestore | null> | null = null;

export async function getFirebaseFirestoreAsync(): Promise<Firestore | null> {
  // Se já está inicializado, retornar instância
  if (isInitialized && firestoreInstance) {
    return firestoreInstance;
  }

  // Se já há uma inicialização em progresso, aguardar
  if (initializationPromise) {
    return await initializationPromise;
  }

  // Iniciar nova inicialização
  initializationPromise = initializeFirestoreFixed();

  try {
    firestoreInstance = await initializationPromise;
    isInitialized = true;
    return firestoreInstance;
  } catch (error) {
    console.error("❌ Falha na inicialização do Firestore:", error);
    initializationPromise = null;
    return null;
  }
}

async function initializeFirestoreFixed(): Promise<Firestore | null> {
  console.log("🔥 Iniciando correção de inicialização do Firestore...");

  try {
    // 1. Forçar variáveis de ambiente
    if (typeof window !== "undefined") {
      (window as any).VITE_FORCE_FIREBASE = "true";
    }

    console.log("✅ Ambiente forçado para Firestore");

    // 2. Obter ou criar Firebase App
    let app;
    const existingApps = getApps();

    if (existingApps.length > 0) {
      app = getApp();
      console.log("✅ Firebase App existente:", app.name);
    } else {
      const config = getFirebaseConfig();
      app = initializeApp(config, `firestore-app-${Date.now()}`);
      console.log("✅ Nova Firebase App criada:", app.name);
    }

    // 3. Verificar configuração
    if (!app.options.projectId || !app.options.apiKey) {
      throw new Error("Firebase App não tem configuração válida");
    }

    console.log(`✅ Projeto Firebase: ${app.options.projectId}`);

    // 4. Inicializar Firestore com retry
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        console.log(
          `🔥 Tentativa ${attempts + 1}/${maxAttempts} - Inicializando Firestore...`,
        );

        const db = getFirestore(app);

        if (db) {
          console.log("✅ Firestore inicializado com sucesso!");

          // Salvar globalmente
          (window as any).__FIRESTORE_DB__ = db;

          // Dispatch evento
          window.dispatchEvent(
            new CustomEvent("firestoreReady", {
              detail: { db, timestamp: new Date().toISOString() },
            }),
          );

          return db;
        } else {
          throw new Error("getFirestore retornou null");
        }
      } catch (error: any) {
        attempts++;
        console.error(`❌ Tentativa ${attempts} falhou:`, error.message);

        if (attempts >= maxAttempts) {
          throw error;
        }

        // Aguardar antes da próxima tentativa
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      }
    }

    throw new Error("Todas as tentativas de inicialização falharam");
  } catch (error: any) {
    console.error("❌ ERRO CRÍTICO na inicialização do Firestore:", error);

    // Diagnóstico detalhado
    if (error.code === "firestore/unavailable") {
      console.error("🚫 CAUSA: Firestore não está habilitado no projeto");
      console.error("💡 SOLUÇÃO: Habilitar Firestore no Firebase Console");
      console.error(
        `🔗 https://console.firebase.google.com/project/leiria-1cfc9/firestore`,
      );
    } else if (error.code === "permission-denied") {
      console.error("🔒 CAUSA: Regras de segurança muito restritivas");
      console.error("💡 SOLUÇÃO: Verificar firestore.rules");
    } else if (error.message.includes("network")) {
      console.error("🌐 CAUSA: Problema de conectividade");
      console.error("💡 SOLUÇÃO: Verificar conexão à internet");
    } else {
      console.error("❓ CAUSA: Erro desconhecido");
      console.error("💡 SOLUÇÃO: Verificar configuração Firebase");
    }

    throw error;
  }
}

// Função para verificar se está pronto
export function isFirestoreReady(): boolean {
  return isInitialized && firestoreInstance !== null;
}

// Função para obter instância (síncrona)
export function getFirebaseFirestore(): Firestore | null {
  return firestoreInstance;
}

// Função para for��ar reinicialização
export async function forceFirestoreReinit(): Promise<Firestore | null> {
  console.log("🔄 Forçando reinicialização do Firestore...");

  // Limpar estado
  firestoreInstance = null;
  isInitialized = false;
  initializationPromise = null;

  // Reinicializar
  return await getFirebaseFirestoreAsync();
}

// Export da instância atual (pode ser null)
export { firestoreInstance };
