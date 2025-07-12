/**
 * SOLUÇÃO DEFINITIVA FIREBASE - Força inicialização imediata
 */

import { initializeApp, getApps, deleteApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getLegacyFirebaseConfig } from "../config/firebaseEnv";

// Configuração Firebase usando environment variables
const FIREBASE_CONFIG = getLegacyFirebaseConfig();

// Variables globais para Firebase
let globalApp: any = null;
let globalDb: any = null;
let globalAuth: any = null;

export class FirebaseForceInit {
  static isInitialized = false;

  static async forceInitializeNow(): Promise<boolean> {
    console.log("🔥 FOR��A INICIALIZAÇÃO FIREBASE - TENTATIVA DEFINITIVA");

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

// FirebaseForceInit disponível para uso manual quando necessário
// Para executar: FirebaseForceInit.forceInitializeNow()
console.log("🔧 FirebaseForceInit ready for manual execution if needed");
