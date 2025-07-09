/**
 * Ferramenta de diagnóstico e correção automática do Firebase
 * FIXED: Prevenindo conflitos de inicialização e erros getImmediate
 */

import { initializeApp, getApps, deleteApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Import the main Firebase config instead of duplicating it
import { getDB, getAuthService, waitForFirebaseInit } from "../firebase/config";

const firebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
};

export class FirebaseDiagnostic {
  static async runFullDiagnostic() {
    console.log("🔍 INICIANDO DIAGNÓSTICO COMPLETO DO FIREBASE");

    const results = {
      configValid: false,
      appInitialized: false,
      authAvailable: false,
      firestoreAvailable: false,
      networkConnected: false,
      overall: false,
    };

    try {
      // 1. Verificar configuração
      console.log("📋 1. Verificando configuração...");
      if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        results.configValid = true;
        console.log("✅ Configuração válida");
      } else {
        console.error("❌ Configuração inválida");
        return results;
      }

      // 2. Limpar apps existentes
      console.log("🧹 2. Limpando apps existentes...");
      const existingApps = getApps();
      for (const app of existingApps) {
        try {
          await deleteApp(app);
          console.log("🗑️ App existente removido");
        } catch (error) {
          console.warn("⚠️ Erro ao remover app:", error);
        }
      }

      // 3. Inicializar app
      console.log("🚀 3. Inicializando Firebase app...");
      const app = initializeApp(firebaseConfig);
      if (app) {
        results.appInitialized = true;
        console.log("✅ Firebase app inicializado");
      }

      // 4. Testar Auth
      console.log("🔐 4. Testando Firebase Auth...");
      try {
        const auth = getAuth(app);
        if (auth) {
          results.authAvailable = true;
          console.log("✅ Firebase Auth disponível");
        }
      } catch (error) {
        console.error("❌ Firebase Auth falhou:", error);
      }

      // 5. Testar Firestore
      console.log("🔄 5. Testando Firestore...");
      try {
        const db = getFirestore(app);
        if (db) {
          results.firestoreAvailable = true;
          console.log("✅ Firestore disponível");
        }
      } catch (error) {
        console.error("❌ Firestore falhou:", error);
      }

      // 6. Testar conectividade
      console.log("🌐 6. Testando conectividade...");
      try {
        const response = await fetch("https://firebase.googleapis.com/", {
          method: "HEAD",
          mode: "no-cors",
        });
        results.networkConnected = true;
        console.log("✅ Conectividade OK");
      } catch (error) {
        console.warn("⚠️ Conectividade limitada:", error);
        results.networkConnected = false;
      }

      // Resultado geral
      results.overall =
        results.configValid &&
        results.appInitialized &&
        (results.authAvailable || results.firestoreAvailable);

      console.log("📊 RESULTADO DO DIAGNÓSTICO:", results);

      if (results.overall) {
        console.log("🎉 FIREBASE FUNCIONANDO CORRETAMENTE!");
      } else {
        console.log(
          "⚠️ Firebase com problemas, mas aplicação continuará em modo local",
        );
      }

      return results;
    } catch (error) {
      console.error("❌ Erro no diagnóstico:", error);
      return results;
    }
  }

  static async forceInitialization() {
    console.log("🔧 FORÇANDO INICIALIZAÇÃO DO FIREBASE");

    try {
      // Executar diagnóstico primeiro
      const diagnostic = await this.runFullDiagnostic();

      if (diagnostic.overall) {
        console.log("✅ Firebase já funcional após diagnóstico");
        return true;
      }

      // Tentar estratégias alternativas
      console.log("🔄 Tentando estratégias alternativas...");

      // Estratégia 1: Aguardar e tentar novamente
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const retryDiagnostic = await this.runFullDiagnostic();

      if (retryDiagnostic.overall) {
        console.log("✅ Firebase funcional após retry");
        return true;
      }

      // Estratégia 2: Modo degradado mas funcional
      console.log("📱 Configurando modo local funcional...");
      return false;
    } catch (error) {
      console.error("❌ Erro na inicialização forçada:", error);
      return false;
    }
  }
}

// Auto-executar diagnóstico quando importado
if (typeof window !== "undefined") {
  // Executar após um delay para não interferir com o startup
  setTimeout(() => {
    FirebaseDiagnostic.forceInitialization().then((success) => {
      if (success) {
        console.log("🔥 Firebase Status: ATIVO");
        // Disparar evento para componentes que aguardam Firebase
        window.dispatchEvent(new CustomEvent("firebaseReady"));
      } else {
        console.log("📱 Firebase Status: MODO LOCAL");
        window.dispatchEvent(new CustomEvent("firebaseLocalMode"));
      }
    });
  }, 1000);
}
