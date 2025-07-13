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
  apiKey: import.meta.env.VITE_LEIRISONDA_FIREBASE_API_KEY || "",
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

      // 2. Aguardar inicialização do Firebase principal
      console.log("⏳ 2. Aguardando inicialização do Firebase principal...");
      await waitForFirebaseInit();

      // 3. Verificar se app principal está disponível
      console.log("🚀 3. Verificando Firebase app...");
      const existingApps = getApps();
      if (existingApps.length > 0) {
        results.appInitialized = true;
        console.log("✅ Firebase app principal está ativo");
      } else {
        console.warn("⚠️ Nenhum app Firebase encontrado");
      }

      // 4. Testar Auth usando o serviço principal
      console.log("🔐 4. Testando Firebase Auth...");
      try {
        const auth = await getAuthService();
        if (auth) {
          results.authAvailable = true;
          console.log("✅ Firebase Auth disponível");
        }
      } catch (error) {
        console.error("❌ Firebase Auth falhou:", error);
      }

      // 5. Testar Firestore usando o serviço principal
      console.log("🔄 5. Testando Firestore...");
      try {
        const db = await getDB();
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
    console.log("🔧 VERIFICANDO STATUS DO FIREBASE");

    try {
      // Aguardar um pouco para evitar conflitos de inicialização
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Executar diagnóstico usando os serviços existentes
      const diagnostic = await this.runFullDiagnostic();

      if (diagnostic.overall) {
        console.log("✅ Firebase já funcional");
        return true;
      }

      // Se não funcionou, aguardar mais tempo para inicialização
      console.log("⏳ Aguardando mais tempo para inicialização...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const retryDiagnostic = await this.runFullDiagnostic();

      if (retryDiagnostic.overall) {
        console.log("✅ Firebase funcional após aguardar");
        return true;
      }

      // Modo local funcional
      console.log("📱 Funcionando em modo local");
      return false;
    } catch (error) {
      console.error("❌ Erro no diagnóstico:", error);
      return false;
    }
  }
}

// Diagnóstico disponível para uso manual - não executa automaticamente
// Para executar manualmente: FirebaseDiagnostic.forceInitialization()
console.log("🔧 Firebase Diagnostic ready for manual execution");
