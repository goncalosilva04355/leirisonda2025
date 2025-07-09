/**
 * SOLUÇÃO DEFINITIVA FIREBASE - Força inicialização imediata
 */

import { initializeApp, getApps, deleteApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuração Firebase VERIFICADA E FUNCIONAL
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
};

// Variables globais para Firebase
let globalApp: any = null;
let globalDb: any = null;
let globalAuth: any = null;

export class FirebaseForceInit {
  static isInitialized = false;

  static async forceInitializeNow(): Promise<boolean> {
    console.log("🔥 FORÇA INICIALIZAÇÃO FIREBASE - TENTATIVA DEFINITIVA");

    try {
      // 1. LIMPAR TUDO
      const existingApps = getApps();
      for (const app of existingApps) {
        try {
          await deleteApp(app);
          console.log("🗑️ App Firebase existente removido");
        } catch (error) {
          console.warn("⚠️ Erro ao limpar app:", error);
        }
      }

      // 2. INICIALIZAR APP FIREBASE
      console.log("�� Inicializando Firebase com config verificada...");
      globalApp = initializeApp(FIREBASE_CONFIG);

      if (!globalApp) {
        throw new Error("Firebase app falhou na inicialização");
      }

      console.log("✅ Firebase app inicializado:", globalApp.name);

      // 3. INICIALIZAR AUTH
      try {
        globalAuth = getAuth(globalApp);
        console.log("✅ Firebase Auth inicializado");
      } catch (authError) {
        console.warn("⚠️ Auth error:", authError);
        globalAuth = null;
      }

      // 4. INICIALIZAR FIRESTORE
      try {
        globalDb = getFirestore(globalApp);
        console.log("✅ Firestore inicializado");
      } catch (dbError) {
        console.warn("⚠️ Firestore error:", dbError);
        globalDb = null;
      }

      // 5. VERIFICAR SE PELO MENOS AUTH OU DB FUNCIONAM
      const success = !!(globalApp && (globalAuth || globalDb));

      if (success) {
        this.isInitialized = true;
        console.log("🎉 FIREBASE INICIALIZADO COM SUCESSO!");

        // Notificar componentes
        window.dispatchEvent(
          new CustomEvent("firebaseForceReady", {
            detail: { app: globalApp, auth: globalAuth, db: globalDb },
          }),
        );

        return true;
      } else {
        throw new Error("Nenhum serviço Firebase disponível");
      }
    } catch (error) {
      console.error("❌ Falha definitiva na inicialização Firebase:", error);
      console.log("📱 Continuando em modo local permanente");

      // Notificar modo local
      window.dispatchEvent(new CustomEvent("firebaseForcedLocal"));

      return false;
    }
  }

  static getApp() {
    return globalApp;
  }

  static getAuth() {
    return globalAuth;
  }

  static getDb() {
    return globalDb;
  }

  static getStatus() {
    return {
      initialized: this.isInitialized,
      hasApp: !!globalApp,
      hasAuth: !!globalAuth,
      hasDb: !!globalDb,
      ready: !!(globalApp && (globalAuth || globalDb)),
    };
  }
}

// EXECUTAR IMEDIATAMENTE QUANDO IMPORTADO
if (typeof window !== "undefined") {
  console.log("🔥 Executando inicialização Firebase IMEDIATA...");
  FirebaseForceInit.forceInitializeNow().then((success) => {
    if (success) {
      console.log("🔥 Firebase Status: FORÇADO E ATIVO");
      // Definir flag global
      (window as any).FIREBASE_FORCED_READY = true;
    } else {
      console.log("📱 Firebase Status: MODO LOCAL FORÇADO");
      (window as any).FIREBASE_FORCED_LOCAL = true;
    }
  });
}
