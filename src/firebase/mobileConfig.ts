/**
 * Configuração Firebase simplificada para dispositivos móveis
 * Resolve problemas de inicialização no mobile
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuração Firebase limpa
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  databaseURL:
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
  measurementId: "G-Q2QWQVH60L",
};

let app: any = null;
let db: any = null;
let auth: any = null;

/**
 * Inicialização simples e direta do Firebase
 */
export async function initializeMobileFirebase(): Promise<{
  success: boolean;
  app: any;
  db: any;
  auth: any;
  error?: string;
}> {
  try {
    console.log("📱 Inicializando Firebase para mobile...");

    // 1. Inicializar Firebase App
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
      console.log("✅ Firebase App já existe");
    } else {
      app = initializeApp(firebaseConfig);
      console.log("✅ Firebase App inicializado");
    }

    // 2. Inicializar Firestore com timeout
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Firestore timeout após 10 segundos"));
      }, 10000);

      try {
        db = getFirestore(app);
        clearTimeout(timeout);
        console.log("✅ Firestore inicializado");
        resolve(db);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });

    // 3. Inicializar Auth
    auth = getAuth(app);
    console.log("✅ Firebase Auth inicializado");

    // 4. Teste básico de conectividade
    const { doc, getDoc } = await import("firebase/firestore");
    const testDoc = doc(db, "__test__", "mobile-connectivity");
    await getDoc(testDoc);
    console.log("✅ Teste de leitura OK");

    return {
      success: true,
      app,
      db,
      auth,
    };
  } catch (error: any) {
    console.error("❌ Erro na inicialização mobile:", error);
    return {
      success: false,
      app: null,
      db: null,
      auth: null,
      error: error.message,
    };
  }
}

/**
 * Obter instâncias Firebase (com inicialização automática)
 */
export async function getMobileFirebase(): Promise<{
  app: any;
  db: any;
  auth: any;
}> {
  if (!app || !db || !auth) {
    const result = await initializeMobileFirebase();
    if (result.success) {
      app = result.app;
      db = result.db;
      auth = result.auth;
    }
  }

  return { app, db, auth };
}

/**
 * Reset completo para tentar novamente
 */
export async function resetMobileFirebase(): Promise<void> {
  try {
    // Limpar instâncias atuais
    app = null;
    db = null;
    auth = null;

    // Remover todas as apps Firebase
    const existingApps = getApps();
    for (const existingApp of existingApps) {
      try {
        const { deleteApp } = await import("firebase/app");
        await deleteApp(existingApp);
      } catch (deleteError) {
        console.warn("Erro ao deletar app:", deleteError);
      }
    }

    console.log("🔄 Firebase reset para mobile completo");
  } catch (error) {
    console.error("Erro no reset:", error);
  }
}
