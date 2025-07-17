/**
 * Simplified Firebase initialization with secure configuration
 */

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getUtilFirebaseConfig } from "./firebaseConfigHelper";

const firebaseConfig = getUtilFirebaseConfig();

export async function simpleFirebaseInit() {
  try {
    console.log("🔄 Inicialização Firebase simples...");

    // Verificar se Firebase já foi inicializado
    let app;
    const existingApps = getApps();

    if (existingApps.length > 0) {
      app = existingApps[0];
      console.log("✅ Usando app Firebase existente");
    } else {
      app = initializeApp(firebaseConfig);
      console.log("✅ Nova app Firebase inicializada");
    }

    // Inicializar Firestore
    const db = getFirestore(app);
    console.log("✅ Firestore inicializado:", db);

    // Expor globalmente para debug
    (window as any).simpleFirebaseDb = db;
    (window as any).simpleFirebaseApp = app;

    console.log("🎉 Firebase inicializado com sucesso! Disponível em:");
    console.log("  - window.simpleFirebaseDb (Firestore)");
    console.log("  - window.simpleFirebaseApp (App)");

    return { app, db };
  } catch (error) {
    console.error("❌ Erro na inicialização simples do Firebase:", error);
    return null;
  }
}

// Executar imediatamente
simpleFirebaseInit();

console.log("🔧 Inicialização Firebase simples carregada");
