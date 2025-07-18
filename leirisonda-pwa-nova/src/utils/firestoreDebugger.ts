import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração que DEVE funcionar - projeto leiria-1cfc9
const config = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
};

export const debugFirestore = async () => {
  console.log("🔍 FIRESTORE DEBUGGER: Iniciando diagnóstico...");

  try {
    // Passo 1: Verificar configuração
    console.log("📋 Passo 1: Verificando configuração...");
    console.log("✅ Config:", {
      projectId: config.projectId,
      hasApiKey: !!config.apiKey,
      authDomain: config.authDomain,
    });

    // Passo 2: Verificar apps existentes
    console.log("📱 Passo 2: Verificando apps Firebase...");
    const existingApps = getApps();
    console.log(`📊 Apps existentes: ${existingApps.length}`);

    if (existingApps.length > 0) {
      existingApps.forEach((app, index) => {
        console.log(`  App ${index}: ${app.name} (${app.options.projectId})`);
      });
    }

    // Passo 3: Inicializar Firebase App
    console.log("🚀 Passo 3: Inicializando Firebase App...");
    let app;

    if (existingApps.length === 0) {
      app = initializeApp(config);
      console.log("✅ Nova app criada:", app.name);
    } else {
      // Verificar se existe uma app com o projeto correto
      const correctApp = existingApps.find(
        (a) => a.options.projectId === config.projectId,
      );
      if (correctApp) {
        app = correctApp;
        console.log("✅ Usando app existente:", app.name);
      } else {
        app = initializeApp(config, `app-${Date.now()}`);
        console.log("✅ Nova app com nome único:", app.name);
      }
    }

    // Passo 4: Tentar inicializar Firestore
    console.log("💾 Passo 4: Inicializando Firestore...");

    try {
      const db = getFirestore(app);
      console.log("✅ Firestore inicializado com sucesso!");
      console.log("📊 Tipo do DB:", typeof db);
      console.log("🏗️ Constructor:", db.constructor.name);

      // Passo 5: Verificar propriedades do Firestore
      console.log("🔍 Passo 5: Verificando propriedades...");
      console.log("  - app:", !!db.app);
      console.log("  - type:", db.type || "undefined");

      // Tentar criar uma referência simples
      try {
        const { doc } = await import("firebase/firestore");
        const testRef = doc(db, "test", "debug");
        console.log("✅ Referência de documento criada:", !!testRef);

        console.log("🎉 SUCESSO: Firestore está funcionando corretamente!");
        return {
          success: true,
          app,
          db,
          message: "Firestore inicializado e funcional",
        };
      } catch (refError: any) {
        console.error(
          "❌ Erro ao criar referência:",
          refError?.message || String(refError),
        );
        return {
          success: false,
          error: "Erro ao criar referência de documento",
          details: refError,
        };
      }
    } catch (firestoreError: any) {
      console.error(
        "❌ Erro ao inicializar Firestore:",
        firestoreError?.message || String(firestoreError),
      );

      // Diagnósticos específicos
      const errorMessage = firestoreError?.message || String(firestoreError);

      if (errorMessage.includes("Service firestore is not available")) {
        console.error(
          "🚨 DIAGNÓSTICO: Firestore não está habilitado no projeto Firebase",
        );
        console.error(
          "📋 SOLUÇÃO: Acesse o console Firebase e habilite o Firestore:",
        );
        console.error("   1. Vá para https://console.firebase.google.com/");
        console.error("   2. Selecione o projeto 'leiria-1cfc9'");
        console.error("   3. Clique em 'Firestore Database'");
        console.error("   4. Clique em 'Create database'");

        return {
          success: false,
          error: "Firestore não está habilitado no projeto",
          solution: "Habilite o Firestore no console Firebase",
        };
      }

      if (errorMessage.includes("getImmediate")) {
        console.error("🚨 DIAGNÓSTICO: Problema de inicialização do Firestore");
        return {
          success: false,
          error: "Problema de inicialização",
          solution: "Verifique as configurações do projeto",
        };
      }

      return {
        success: false,
        error: errorMessage,
        details: firestoreError,
      };
    }
  } catch (error: any) {
    console.error("❌ ERRO GERAL:", error?.message || String(error));
    console.error("🔍 Detalhes:", error);

    return {
      success: false,
      error: error?.message || String(error),
      details: error,
    };
  }
};

// Auto-executar após um delay
setTimeout(async () => {
  console.log("🔍 AUTO-DIAGNÓSTICO: Iniciando...");
  const result = await debugFirestore();

  if (result.success) {
    console.log("🎉 AUTO-DIAGNÓSTICO: SUCESSO!");
    // Disponibilizar globalmente
    (window as any).firestoreDebug = {
      result,
      debug: debugFirestore,
    };
  } else {
    console.error("❌ AUTO-DIAGNÓSTICO: FALHOU");
    console.error("🔍 Resultado:", result);
  }
}, 1000);

export default debugFirestore;
