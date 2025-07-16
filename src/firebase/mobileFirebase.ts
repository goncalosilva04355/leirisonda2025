// CONFIGURAÇÃO FIREBASE MOBILE ROBUSTA ANTI-GETIMMEDIATE ERRORS
// Resolve problemas de tela branca e erros getImmediate em dispositivos móveis

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
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

// Função robusta de inicialização com tratamento específico para getImmediate errors
export const initializeFirebaseMobile = async (): Promise<void> => {
  // Se já está inicializando, aguardar a inicialização atual
  if (initializationPromise) {
    return initializationPromise;
  }

  // Se já foi inicializado, retornar imediatamente
  if (firebaseApp && firestore && auth) {
    return Promise.resolve();
  }

  initializationPromise = new Promise(async (resolve) => {
    let retries = 3;
    let lastError: any = null;

    while (retries > 0) {
      try {
        console.log(
          `🔥 Iniciando Firebase Mobile (tentativa ${4 - retries}/3)...`,
        );

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

        // Aguardar tempo progressivo baseado na tentativa para dispositivos móveis
        const waitTime = isMobileDevice() ? (4 - retries) * 2000 + 3000 : 1000;
        console.log(`⏳ Aguardando ${waitTime}ms para estabilização...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        // Tentar inicializar Firestore com proteção contra getImmediate
        if (!firestore) {
          try {
            console.log("🔥 Inicializando Firestore...");
            firestore = getFirestore(firebaseApp);

            // Teste básico para verificar se Firestore está realmente funcionando
            console.log("🔍 Testando conectividade Firestore...");
            const { enableNetwork } = await import("firebase/firestore");
            await enableNetwork(firestore);

            console.log("✅ Firestore inicializado e conectado com sucesso");
          } catch (firestoreError: any) {
            console.warn(
              `⚠️ Erro no Firestore (tentativa ${4 - retries}):`,
              firestoreError.message,
            );

            if (
              firestoreError.message?.includes("getImmediate") ||
              firestoreError.message?.includes("not initialized") ||
              firestoreError.code === "app/no-app"
            ) {
              console.log(
                "🔄 Erro getImmediate detectado, resetando e tentando novamente...",
              );
              firestore = null;
              firebaseApp = null;

              // Força retry na próxima iteração
              throw new Error("getImmediate error - retry needed");
            } else {
              console.warn(
                "⚠️ Erro diferente no Firestore, continuando:",
                firestoreError,
              );
              firestore = null;
            }
          }
        }

        // Tentar inicializar Auth
        if (!auth) {
          try {
            console.log("🔐 Inicializando Auth...");
            auth = getAuth(firebaseApp);
            console.log("✅ Auth inicializado com sucesso");
          } catch (authError: any) {
            console.warn("⚠️ Erro no Auth:", authError.message);
            auth = null;
          }
        }

        console.log("🎉 Firebase Mobile Configuration completa!");
        resolve();
        return; // Sucesso, sair do loop
      } catch (error: any) {
        lastError = error;
        retries--;
        console.warn(`❌ Tentativa ${4 - retries - 1} falhou:`, error.message);

        if (retries > 0) {
          // Limpar estado para nova tentativa
          firestore = null;
          auth = null;
          if (error.message?.includes("getImmediate")) {
            firebaseApp = null; // Reset completo para erros getImmediate
          }

          // Aguardar antes da próxima tentativa com backoff exponencial
          const retryDelay = (4 - retries) * 2000;
          console.log(
            `⏳ Aguardando ${retryDelay}ms antes da próxima tentativa...`,
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    console.warn(
      "⚠️ Todas as tentativas falharam, aplicação funcionará em modo local",
    );
    console.warn("⚠️ Último erro:", lastError?.message);

    // Limpar estado completamente
    firebaseApp = null;
    firestore = null;
    auth = null;
    initializationPromise = null;

    // Resolver mesmo assim para não bloquear a aplicação
    resolve();
  });

  return initializationPromise;
};

// Função para obter Firestore com verificação de estado
export const getFirebaseMobileFirestore =
  async (): Promise<Firestore | null> => {
    try {
      // Garantir inicialização primeiro
      await initializeFirebaseMobile();

      if (!firestore) {
        console.warn(
          "⚠️ Firestore não disponível - aplicação funcionará em modo local",
        );
        return null;
      }

      return firestore;
    } catch (error) {
      console.warn(
        "⚠️ Erro ao obter Firestore Mobile, usando modo local:",
        error,
      );
      return null;
    }
  };

// Função para obter Auth com verificação de estado
export const getFirebaseMobileAuth = async (): Promise<Auth | null> => {
  try {
    await initializeFirebaseMobile();

    if (!auth) {
      console.warn("⚠️ Auth não disponível - autenticação local será usada");
      return null;
    }

    return auth;
  } catch (error) {
    console.warn(
      "⚠️ Erro ao obter Auth Mobile, usando autenticação local:",
      error,
    );
    return null;
  }
};

// Função para verificar se Firebase está pronto (mais flexível)
export const isFirebaseMobileReady = (): boolean => {
  return !!firebaseApp; // Só verificar se app está inicializada
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

// Auto-inicialização para aplicações móveis com melhor timing
if (isMobileDevice()) {
  console.log(
    "📱 Dispositivo móvel detectado, preparando inicialização Firebase...",
  );

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

    // Aguardar um tempo adicional para estabilização em mobile
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      console.log("🚀 Iniciando auto-inicialização Firebase Mobile...");
      await initializeFirebaseMobile();
      console.log("✅ Auto-inicialização Firebase Mobile completada");
    } catch (error) {
      console.warn(
        "⚠️ Auto-inicialização falhou, app funcionará em modo local:",
        error,
      );
    }
  };

  autoInit();
}

// Exportar configuração para compatibilidade
export { firebaseConfig };
export default firebaseApp;
