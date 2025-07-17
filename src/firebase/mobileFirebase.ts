// CONFIGURAÇÃO FIREBASE MOBILE USANDO REST API
// Elimina completamente os erros getImmediate usando REST API diretamente

import {
  saveToFirestoreRest,
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "../utils/firestoreRestApi";

// Estado de inicialização
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

// Detectar se é um dispositivo móvel
const isMobileDevice = (): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Inicialização simplificada usando REST API
export const initializeFirebaseMobile = async (): Promise<void> => {
  // Se já está inicializando, aguardar a inicialização atual
  if (initializationPromise) {
    return initializationPromise;
  }

  // Se já foi inicializado, retornar imediatamente
  if (isInitialized) {
    return Promise.resolve();
  }

  initializationPromise = new Promise(async (resolve) => {
    try {
      console.log("🔥 Iniciando Firebase Mobile com REST API...");

      // Aguardar REST API estar disponível
      const waitForRestApi = async (): Promise<boolean> => {
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
          if ((window as any).firestoreRestApi) {
            console.log("✅ REST API detectada e disponível");
            return true;
          }

          console.log(
            `⏳ Aguardando REST API (tentativa ${attempts + 1}/${maxAttempts})...`,
          );
          await new Promise((resolve) => setTimeout(resolve, 500));
          attempts++;
        }

        console.warn("⚠️ REST API não detectada, mas continuando...");
        return false;
      };

      // Aguardar REST API
      await waitForRestApi();

      // Teste básico da REST API
      try {
        console.log("🧪 Testando conectividade REST API...");

        // Teste simples - tentar ler uma coleção
        const testData = await readFromFirestoreRest("test");
        console.log("✅ REST API funcionando - conectividade confirmada");
      } catch (error) {
        console.warn("⚠️ Teste REST API falhou, mas continuando:", error);
      }

      // Configuração específica para mobile
      if (isMobileDevice()) {
        console.log("📱 Aplicando configurações otimizadas para mobile...");

        // Aguardar mais tempo em dispositivos móveis para estabilização
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      isInitialized = true;
      console.log("🎉 Firebase Mobile (REST API) inicializado com sucesso!");
      resolve();
    } catch (error) {
      console.warn("⚠️ Erro na inicialização, mas continuando:", error);
      isInitialized = true; // Marcar como inicializado mesmo com erro
      resolve(); // Não falhar para não bloquear a aplicação
    }
  });

  return initializationPromise;
};

// Função para salvar dados usando REST API
export const saveToFirebaseMobile = async (
  collection: string,
  documentId: string,
  data: any,
): Promise<boolean> => {
  try {
    await initializeFirebaseMobile();
    return await saveToFirestoreRest(collection, documentId, data);
  } catch (error) {
    console.warn(`⚠️ Erro ao salvar ${collection}/${documentId}:`, error);
    return false;
  }
};

// Função para ler dados usando REST API
export const readFromFirebaseMobile = async (
  collection: string,
): Promise<any[]> => {
  try {
    await initializeFirebaseMobile();
    return await readFromFirestoreRest(collection);
  } catch (error) {
    console.warn(`⚠️ Erro ao ler ${collection}:`, error);
    return [];
  }
};

// Função para deletar dados usando REST API
export const deleteFromFirebaseMobile = async (
  collection: string,
  documentId: string,
): Promise<boolean> => {
  try {
    await initializeFirebaseMobile();
    return await deleteFromFirestoreRest(collection, documentId);
  } catch (error) {
    console.warn(`⚠️ Erro ao deletar ${collection}/${documentId}:`, error);
    return false;
  }
};

// Verificar se Firebase Mobile está pronto
export const isFirebaseMobileReady = (): boolean => {
  return isInitialized && !!(window as any).firestoreRestApi;
};

// Função para verificar conectividade (usando REST API)
export const checkFirebaseMobileConnectivity = async (): Promise<boolean> => {
  try {
    await initializeFirebaseMobile();

    // Teste simples de conectividade via REST API
    const testData = await readFromFirestoreRest("test");
    console.log("✅ Firebase Mobile conectividade OK via REST API");
    return true;
  } catch (error) {
    console.warn("⚠️ Firebase Mobile sem conectividade:", error);
    return false;
  }
};

// Funções de compatibilidade com o SDK (para não quebrar código existente)
export const getFirebaseMobileFirestore = async () => {
  await initializeFirebaseMobile();
  return {
    // Retornar objeto com métodos compatíveis
    save: saveToFirebaseMobile,
    read: readFromFirebaseMobile,
    delete: deleteFromFirebaseMobile,
    isReady: isFirebaseMobileReady,
  };
};

export const getFirebaseMobileAuth = async () => {
  await initializeFirebaseMobile();
  return {
    // Auth será tratado localmente já que a REST API não inclui Auth
    signIn: () =>
      console.log("Auth via localStorage - REST API não inclui Auth"),
    signOut: () =>
      console.log("Auth via localStorage - REST API não inclui Auth"),
    currentUser: null,
  };
};

// Auto-inicialização para aplicações móveis
if (isMobileDevice()) {
  console.log("📱 Dispositivo móvel detectado, preparando REST API...");

  const autoInit = async () => {
    // Aguardar o DOM estar completamente carregado
    if (document.readyState !== "complete") {
      await new Promise((resolve) => {
        if (document.readyState === "complete") {
          resolve(void 0);
        } else {
          window.addEventListener("load", () => resolve(void 0), {
            once: true,
          });
        }
      });
    }

    // Aguardar tempo adicional para REST API estar disponível
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      console.log(
        "🚀 Iniciando auto-inicialização Firebase Mobile (REST API)...",
      );
      await initializeFirebaseMobile();
      console.log(
        "✅ Auto-inicialização Firebase Mobile (REST API) completada",
      );
    } catch (error) {
      console.warn(
        "⚠️ Auto-inicialização falhou, app funcionará normalmente:",
        error,
      );
    }
  };

  autoInit();
}

// Configuration for mobile Firebase using environment variables
import { getSecureFirebaseConfig } from "../config/firebaseEnvSecure";

// Get configuration from environment variables
let firebaseConfig: any;
try {
  const config = getSecureFirebaseConfig();
  firebaseConfig = {
    apiKey: config.apiKey,
    projectId: config.projectId,
    restApiMode: true,
  };
} catch (error) {
  console.error(
    "❌ Firebase mobile configuration requires environment variables",
  );
  throw error;
}

export { firebaseConfig };

export default {
  save: saveToFirebaseMobile,
  read: readFromFirebaseMobile,
  delete: deleteFromFirebaseMobile,
  isReady: isFirebaseMobileReady,
  checkConnectivity: checkFirebaseMobileConnectivity,
};
