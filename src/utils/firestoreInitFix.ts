import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFirebaseConfig } from "../config/firebaseEnv";

export async function fixFirestoreInitialization() {
  console.log("🔧 Corrigindo inicialização do Firestore...");

  try {
    // 1. Verificar/forçar variáveis de ambiente
    if (typeof window !== "undefined") {
      (window as any).VITE_FORCE_FIREBASE = "true";
      // Forçar através do import.meta.env também
      Object.defineProperty(import.meta.env, "VITE_FORCE_FIREBASE", {
        value: "true",
        writable: true,
      });
    }

    console.log("✅ VITE_FORCE_FIREBASE forçado para 'true'");

    // 2. Verificar se Firebase App existe
    let app;
    const existingApps = getApps();

    if (existingApps.length > 0) {
      app = getApp();
      console.log("✅ Firebase App existente encontrada:", app.name);
    } else {
      // Criar nova app
      const config = getFirebaseConfig();
      app = initializeApp(config, `app-${Date.now()}`);
      console.log("✅ Nova Firebase App criada:", app.name);
    }

    // 3. Verificar propriedades essenciais
    if (!app.options.projectId || !app.options.apiKey) {
      throw new Error("Firebase App não tem configuração válida");
    }

    console.log("✅ Firebase App válida:", {
      projectId: app.options.projectId,
      hasApiKey: !!app.options.apiKey,
    });

    // 4. Inicializar Firestore com timeout
    console.log("🔥 Inicializando Firestore...");

    const firestorePromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout na inicialização do Firestore (10s)"));
      }, 10000);

      try {
        const db = getFirestore(app);
        clearTimeout(timeout);
        resolve(db);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });

    const db = await firestorePromise;

    if (db) {
      console.log("✅ Firestore inicializado com sucesso!");

      // 5. Salvar instância globalmente
      (window as any).__FIRESTORE_INSTANCE__ = db;
      (window as any).__FIRESTORE_READY__ = true;

      // 6. Dispatch evento de sucesso
      window.dispatchEvent(
        new CustomEvent("firestoreInitialized", {
          detail: { db, timestamp: new Date().toISOString() },
        }),
      );

      return db;
    } else {
      throw new Error("Firestore retornou null/undefined");
    }
  } catch (error: any) {
    console.error("❌ Erro na correção de inicialização:", error);

    // Diagnóstico específico
    if (error.code === "firestore/unavailable") {
      console.error(
        "🚫 DIAGNÓSTICO: Firestore não está habilitado no projeto Firebase",
      );
      console.error("💡 SOLUÇÃO: Ir ao Firebase Console e habilitar Firestore");
      console.error(
        `🔗 Link: https://console.firebase.google.com/project/leiria-1cfc9/firestore`,
      );
    } else if (error.code === "auth/invalid-api-key") {
      console.error("🔑 DIAGNÓSTICO: API Key inválida");
      console.error("💡 SOLUÇÃO: Verificar configuração da API Key");
    } else if (error.message.includes("network")) {
      console.error("🌐 DIAGNÓSTICO: Problema de conectividade");
      console.error("💡 SOLUÇÃO: Verificar conexão à internet");
    } else if (error.message.includes("Timeout")) {
      console.error("⏰ DIAGNÓSTICO: Timeout na inicialização");
      console.error("💡 SOLUÇÃO: Rede lenta ou serviço Firebase indisponível");
    }

    // Marcar como falhou
    (window as any).__FIRESTORE_READY__ = false;
    (window as any).__FIRESTORE_ERROR__ = error.message;

    throw error;
  }
}

export function getFixedFirestore() {
  return (window as any).__FIRESTORE_INSTANCE__ || null;
}

export function isFirestoreFixed() {
  return (window as any).__FIRESTORE_READY__ === true;
}

export async function retryFirestoreInit(maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`🔄 Tentativa ${i + 1}/${maxRetries} de inicialização...`);
      const db = await fixFirestoreInitialization();
      return db;
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        const delay = (i + 1) * 2000; // 2s, 4s, 6s
        console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
