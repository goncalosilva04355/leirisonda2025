import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFirebaseConfig } from "../config/firebaseEnv";

// Flag para debug detalhado
const DEBUG = true;

function debugLog(
  message: string,
  type: "info" | "success" | "error" | "warning" = "info",
) {
  if (!DEBUG) return;

  const emoji = {
    info: "🔍",
    success: "✅",
    error: "❌",
    warning: "⚠️",
  };

  console.log(`${emoji[type]} [FirestoreInit] ${message}`);
}

export async function diagnosticFirestoreInit() {
  debugLog(
    "Iniciando diagnóstico completo da inicialização do Firestore",
    "info",
  );

  const results = {
    environment: {},
    firebaseApp: {},
    firestoreInit: {},
    issues: [] as string[],
    success: false,
  };

  try {
    // 1. Verificar ambiente
    debugLog("Passo 1: Verificando ambiente...", "info");

    const isDev = import.meta.env.DEV;
    const isNetlify =
      import.meta.env.NETLIFY === "true" ||
      import.meta.env.VITE_IS_NETLIFY === "true";
    const forceFirebase = import.meta.env.VITE_FORCE_FIREBASE === "true";

    results.environment = { isDev, isNetlify, forceFirebase };

    debugLog(`Desenvolvimento: ${isDev}`, "info");
    debugLog(`Netlify: ${isNetlify}`, "info");
    debugLog(`Firebase Forçado: ${forceFirebase}`, "info");

    if (!isNetlify && !forceFirebase) {
      results.issues.push(
        "Firestore não será inicializado - nem no Netlify nem forçado",
      );
      debugLog("PROBLEMA: Condições de inicialização não atendidas", "error");
      return results;
    }

    // 2. Verificar Firebase App
    debugLog("Passo 2: Verificando Firebase App...", "info");

    let app;
    const existingApps = getApps();
    debugLog(`Apps existentes: ${existingApps.length}`, "info");

    if (existingApps.length > 0) {
      app = getApp();
      debugLog(`App existente encontrada: ${app.name}`, "success");
    } else {
      debugLog("Criando nova Firebase App...", "info");
      const config = getFirebaseConfig();
      app = initializeApp(config);
      debugLog(`Nova app criada: ${app.name}`, "success");
    }

    // Verificar propriedades essenciais
    const requiredProps = ["projectId", "apiKey", "authDomain"];
    for (const prop of requiredProps) {
      const value = app.options[prop];
      if (!value) {
        results.issues.push(`Firebase App missing ${prop}`);
        debugLog(`PROBLEMA: ${prop} não encontrado`, "error");
      } else {
        debugLog(`${prop}: ✓`, "success");
      }
    }

    results.firebaseApp = {
      name: app.name,
      projectId: app.options.projectId,
      hasApiKey: !!app.options.apiKey,
      hasAuthDomain: !!app.options.authDomain,
    };

    if (results.issues.length > 0) {
      debugLog("Parando devido a problemas na Firebase App", "error");
      return results;
    }

    // 3. Tentar inicializar Firestore
    debugLog("Passo 3: Inicializando Firestore...", "info");

    try {
      const db = getFirestore(app);

      if (db) {
        debugLog("Firestore inicializado com sucesso!", "success");
        results.firestoreInit = {
          success: true,
          appName: db.app.name,
          projectId: db.app.options.projectId,
          type: typeof db,
        };
        results.success = true;
      } else {
        results.issues.push("getFirestore() retornou null/undefined");
        debugLog("PROBLEMA: getFirestore() retornou null", "error");
      }
    } catch (error: any) {
      results.issues.push(`Erro na inicialização: ${error.message}`);
      results.firestoreInit = {
        success: false,
        error: error.message,
        code: error.code,
      };

      debugLog(`ERRO: ${error.message}`, "error");
      if (error.code) debugLog(`Código: ${error.code}`, "error");

      // Diagnóstico específico
      if (error.code === "firestore/unavailable") {
        debugLog(
          "DIAGNÓSTICO: Firestore não está habilitado no projeto",
          "error",
        );
        debugLog("SOLUÇÃO: Habilitar Firestore no Firebase Console", "warning");
      } else if (error.code === "auth/invalid-api-key") {
        debugLog("DIAGNÓSTICO: API Key inválida", "error");
        debugLog("SOLUÇÃO: Verificar configuração da API Key", "warning");
      } else if (error.message.includes("network")) {
        debugLog("DIAGNÓSTICO: Problema de conectividade", "error");
        debugLog("SOLUÇÃO: Verificar conexão à internet", "warning");
      }
    }
  } catch (error: any) {
    results.issues.push(`Erro crítico: ${error.message}`);
    debugLog(`ERRO CRÍTICO: ${error.message}`, "error");
  }

  // Resumo final
  debugLog("", "info");
  debugLog("=== RESUMO DO DIAGNÓSTICO ===", "info");
  if (results.success) {
    debugLog("RESULTADO: Firestore inicialização SUCESSO", "success");
  } else {
    debugLog("RESULTADO: Firestore inicialização FALHOU", "error");
    debugLog("Problemas encontrados:", "error");
    results.issues.forEach((issue, i) => {
      debugLog(`  ${i + 1}. ${issue}`, "error");
    });
  }

  return results;
}

export async function forceFixFirestoreInit() {
  debugLog(
    "Tentando corrigir forcadamente a inicialização do Firestore",
    "warning",
  );

  try {
    // Limpar cache de disponibilidade se existir
    if ("firestoreAvailabilityChecked" in window) {
      (window as any).firestoreAvailabilityChecked = false;
      (window as any).firestoreIsAvailable = false;
      debugLog("Cache de disponibilidade limpo", "info");
    }

    // Forçar criação de nova instância
    const config = getFirebaseConfig();

    // Se existe app, destruir primeiro
    const existingApps = getApps();
    if (existingApps.length > 0) {
      debugLog("Encontrada app existente, continuando com ela", "info");
    }

    let app;
    if (existingApps.length > 0) {
      app = getApp();
    } else {
      app = initializeApp(config);
    }

    debugLog(`Firebase App ready: ${app.name}`, "success");

    // Tentar Firestore com timeout
    const firestorePromise = new Promise((resolve, reject) => {
      setTimeout(
        () => reject(new Error("Timeout na inicialização do Firestore")),
        10000,
      );

      try {
        const db = getFirestore(app);
        resolve(db);
      } catch (error) {
        reject(error);
      }
    });

    const db = await firestorePromise;

    if (db) {
      debugLog("🎉 CORREÇÃO SUCESSO! Firestore funcional", "success");
      return { success: true, db };
    } else {
      debugLog("❌ CORREÇÃO FALHOU: Firestore retornou null", "error");
      return { success: false, error: "Firestore retornou null" };
    }
  } catch (error: any) {
    debugLog(`❌ CORREÇÃO FALHOU: ${error.message}`, "error");
    return { success: false, error: error.message };
  }
}

export async function quickFirestoreCheck() {
  console.log("🚀 VERIFICAÇÃO RÁPIDA FIRESTORE");

  try {
    const result = await diagnosticFirestoreInit();

    if (result.success) {
      console.log("✅ FIRESTORE OK!");
      return true;
    } else {
      console.log("❌ FIRESTORE FALHOU:");
      result.issues.forEach((issue) => console.log(`  - ${issue}`));
      return false;
    }
  } catch (error: any) {
    console.log(`❌ ERRO: ${error.message}`);
    return false;
  }
}
