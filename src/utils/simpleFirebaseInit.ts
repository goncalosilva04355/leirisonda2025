/**
 * Inicialização simplificada do Firebase sem dependências problemáticas
 */

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  databaseURL:
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
  measurementId: "G-Q2QWQVH60L",
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
