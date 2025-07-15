// Teste simplificado para identificar exatamente onde falha
import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFirebaseConfig } from "../config/firebaseEnv";

export async function simpleFirebaseTest() {
  console.log("🔍 === TESTE FIREBASE SIMPLIFICADO ===");

  try {
    // Passo 1: Verificar se Firebase App existe
    console.log("📱 Passo 1: Verificar Firebase App...");
    const apps = getApps();
    console.log("Apps disponíveis:", apps.length);

    let app;
    if (apps.length === 0) {
      console.log("🆕 Nenhuma app encontrada, criando nova...");
      const config = getFirebaseConfig();
      console.log("Config:", {
        projectId: config.projectId,
        authDomain: config.authDomain,
        hasApiKey: !!config.apiKey,
      });
      app = initializeApp(config);
      console.log("✅ Firebase App criada:", app.name);
    } else {
      app = getApp();
      console.log("✅ Firebase App encontrada:", app.name);
    }

    // Passo 2: Tentar inicializar Firestore
    console.log("💾 Passo 2: Inicializar Firestore...");
    const db = getFirestore(app);
    console.log("✅ Firestore inicializado:", typeof db);
    console.log("✅ Firestore app:", db.app.name);

    return {
      success: true,
      message: "Firebase e Firestore inicializados com sucesso",
      app: app.name,
      projectId: app.options.projectId,
      firestoreType: typeof db,
    };
  } catch (error: any) {
    console.error("❌ Erro no teste simplificado:", error);
    return {
      success: false,
      message: error.message,
      code: error.code,
      stack: error.stack,
    };
  }
}
