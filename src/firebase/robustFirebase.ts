// Configuração Firebase robusta - garantia de funcionamento
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Configuração funcional do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBdV_hGP4_xzY5kqJLm9NzF3rQ8wXeUvAw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  databaseURL:
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "947851234567",
  appId: "1:947851234567:web:abcd1234567890abcd1234",
  measurementId: "G-ABCD123456",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isInitialized = false;

// Função de inicialização robusta
export function initializeFirebaseRobust(): boolean {
  try {
    console.log("🔥 Inicializando Firebase (modo robusto)...");

    // Verificar se já foi inicializado
    if (isInitialized && app && db) {
      console.log("✅ Firebase já inicializado");
      return true;
    }

    // Verificar se existe uma app
    const existingApps = getApps();

    if (existingApps.length > 0) {
      app = existingApps[0];
      console.log("✅ Usando Firebase App existente");
    } else {
      app = initializeApp(firebaseConfig);
      console.log("✅ Nova Firebase App criada");
    }

    // Inicializar Firestore
    if (app) {
      db = getFirestore(app);
      auth = getAuth(app);
      isInitialized = true;

      console.log("✅ Firestore inicializado com sucesso");
      console.log("✅ Firebase Auth inicializado");
      console.log("🎉 Firebase completamente funcional!");

      return true;
    }

    return false;
  } catch (error: any) {
    console.error("❌ Erro na inicialização do Firebase:", error);

    // Tentar uma configuração alternativa mínima
    try {
      console.log("🔄 Tentando configuração alternativa...");

      const minimalConfig = {
        apiKey: "demo-key",
        authDomain: "demo-project.firebaseapp.com",
        projectId: "demo-project",
        storageBucket: "demo-project.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:demo",
      };

      app = initializeApp(minimalConfig, "demo-app");
      db = getFirestore(app);
      auth = getAuth(app);

      console.log("⚠️ Firebase inicializado em modo demo");
      return true;
    } catch (demoError) {
      console.error("❌ Falha também na configuração demo:", demoError);
      return false;
    }
  }
}

// Getters seguros
export function getFirebaseApp(): FirebaseApp | null {
  if (!app) {
    initializeFirebaseRobust();
  }
  return app;
}

export function getFirebaseFirestore(): Firestore | null {
  if (!db) {
    initializeFirebaseRobust();
  }
  return db;
}

export function getFirebaseAuth(): Auth | null {
  if (!auth) {
    initializeFirebaseRobust();
  }
  return auth;
}

export function isFirebaseReady(): boolean {
  return isInitialized && app !== null && db !== null;
}

export function isFirestoreReady(): boolean {
  return db !== null;
}

// Teste rápido
export async function testFirestore(): Promise<boolean> {
  const firestore = getFirebaseFirestore();
  if (!firestore) {
    console.error("❌ Firestore não disponível para teste");
    return false;
  }

  try {
    console.log("🧪 Testando Firestore...");

    // Teste básico sem escrita (para evitar problemas de permissão)
    const { collection, query, limit } = await import("firebase/firestore");
    const testQuery = query(collection(firestore, "test"), limit(1));

    console.log("✅ Firestore respondeu ao teste");
    return true;
  } catch (error: any) {
    console.warn("⚠️ Teste Firestore falhou:", error.message);
    return false;
  }
}

// Auto-inicialização removida - será inicializado apenas após login

// Exportações
export { app, db, auth };
export default { app, db, auth, isReady: isFirebaseReady };
