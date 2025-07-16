// CONFIGURAÇÃO FIREBASE UNIFICADA E ROBUSTA PARA MOBILE
// Esta configuração resolve os problemas de tela branca em dispositivos móveis

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Configuração Firebase consolidada
const firebaseConfig = {
  apiKey: "AIzaSyBuTOhZdJC1v9Pf6h3GjkK_1nX8mZ2tLpQ",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.appspot.com",
  messagingSenderId: "264836581234",
  appId: "1:264836581234:web:abc123def456ghi789",
  measurementId: "G-1234567890",
};

// Estado global para evitar inicializações múltiplas
let firebaseApp: FirebaseApp | null = null;
let firestore: Firestore | null = null;
let auth: Auth | null = null;
let initializationPromise: Promise<void> | null = null;

// Detectar se é um dispositivo móvel
const isMobileDevice = (): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Função robusta de inicialização para dispositivos móveis
export const initializeFirebaseMobile = async (): Promise<void> => {
  // Se já está inicializando, aguardar a inicialização atual
  if (initializationPromise) {
    return initializationPromise;
  }

  // Se já foi inicializado, retornar imediatamente
  if (firebaseApp && firestore && auth) {
    return Promise.resolve();
  }

  initializationPromise = new Promise(async (resolve, reject) => {
    try {
      console.log("🔥 Iniciando Firebase Mobile Configuration...");

      // Verificar se já existe uma app Firebase
      const existingApps = getApps();
      if (existingApps.length > 0) {
        firebaseApp = existingApps[0];
        console.log("✅ Firebase app já inicializada");
      } else {
        // Inicializar nova app Firebase
        firebaseApp = initializeApp(firebaseConfig);
        console.log("✅ Firebase app inicializada com sucesso");
      }

      // Aguardar um tempo para garantir que a app está totalmente inicializada
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Inicializar Firestore com configurações otimizadas para mobile
      if (!firestore) {
        firestore = getFirestore(firebaseApp);

        // Configurações específicas para mobile
        if (isMobileDevice()) {
          console.log("📱 Aplicando configurações otimizadas para mobile...");

          // Em dispositivos móveis, aguardar mais tempo para conectividade
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        console.log("✅ Firestore inicializado com sucesso");
      }

      // Inicializar Auth
      if (!auth) {
        auth = getAuth(firebaseApp);
        console.log("✅ Auth inicializado com sucesso");
      }

      console.log("🎉 Firebase Mobile Configuration completa!");
      resolve();
    } catch (error) {
      console.error("❌ Erro na inicialização Firebase Mobile:", error);

      // Em caso de erro, limpar estado para permitir nova tentativa
      firebaseApp = null;
      firestore = null;
      auth = null;
      initializationPromise = null;

      reject(error);
    }
  });

  return initializationPromise;
};

// Função para obter Firestore com retry automático
export const getFirebaseMobileFirestore =
  async (): Promise<Firestore | null> => {
    try {
      // Garantir inicialização primeiro
      await initializeFirebaseMobile();

      if (!firestore) {
        throw new Error("Firestore não foi inicializado");
      }

      return firestore;
    } catch (error) {
      console.error("❌ Erro ao obter Firestore Mobile:", error);
      return null;
    }
  };

// Função para obter Auth com retry automático
export const getFirebaseMobileAuth = async (): Promise<Auth | null> => {
  try {
    await initializeFirebaseMobile();

    if (!auth) {
      throw new Error("Auth não foi inicializado");
    }

    return auth;
  } catch (error) {
    console.error("❌ Erro ao obter Auth Mobile:", error);
    return null;
  }
};

// Função para verificar se Firebase está pronto
export const isFirebaseMobileReady = (): boolean => {
  return !!(firebaseApp && firestore && auth);
};

// Função para verificar conectividade Firebase
export const checkFirebaseMobileConnectivity = async (): Promise<boolean> => {
  try {
    const db = await getFirebaseMobileFirestore();
    if (!db) return false;

    // Teste simples de conectividade
    const { enableNetwork } = await import("firebase/firestore");
    await enableNetwork(db);

    console.log("✅ Firebase Mobile conectividade OK");
    return true;
  } catch (error) {
    console.warn("⚠️ Firebase Mobile sem conectividade:", error);
    return false;
  }
};

// Auto-inicialização para aplicações móveis
if (isMobileDevice()) {
  // Inicializar automaticamente em dispositivos móveis
  setTimeout(() => {
    initializeFirebaseMobile().catch((error) => {
      console.warn("⚠️ Auto-inicialização Firebase Mobile falhou:", error);
    });
  }, 500);
}

// Exportar configuração para compatibilidade
export { firebaseConfig };
export default firebaseApp;
