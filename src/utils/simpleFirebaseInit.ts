/**
 * Inicialização simplificada do Firebase sem dependências problemáticas
 */

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

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
