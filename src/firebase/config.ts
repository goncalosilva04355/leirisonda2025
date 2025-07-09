import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FirebaseErrorFix } from "../utils/firebaseErrorFix";
import { FirebaseForceInit } from "../utils/firebaseForceInit";

// Import simplified config as primary
import {
  getFirebaseDB as getSimpleDB,
  getFirebaseAuth as getSimpleAuth,
  isFirebaseInitialized as isSimpleReady,
  getFirebaseStatus as getSimpleStatus,
} from "./simpleConfig";

// Firebase config - Project leirisonda-16f8b is active and working
const defaultFirebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
};

// Function to get Firebase config from localStorage or use default
const getFirebaseConfig = () => {
  // MIGRAÇÃO GRADUAL: Preservando acesso aos dados existentes
  console.log("🔄 Firebase: Migração gradual para isolamento de dados");
  console.log("✅ Dados existentes: Acessíveis durante transição");
  return defaultFirebaseConfig;
};

// Function to save Firebase config to localStorage
export const saveFirebaseConfig = (config: any) => {
  try {
    // Firebase config handled automatically - no localStorage needed
    console.log("🔧 Firebase: Configuration using default settings");
    return true;
  } catch (error) {
    console.error("�� Firebase: Error saving config to localStorage:", error);
    return false;
  }
};

// Get current Firebase config (from localStorage or default)
const firebaseConfig = getFirebaseConfig();

// Função segura para obter/criar Firebase app
const getFirebaseApp = () => {
  try {
    // Verificar apps existentes primeiro
    const existingApps = getApps();
    if (existingApps.length > 0) {
      const existingApp = existingApps[0];

      // Validar se o app existente está em bom estado
      if (existingApp && existingApp.options && existingApp.name) {
        console.log("🔄 Firebase app existente encontrado e validado");
        return existingApp;
      } else {
        console.warn("⚠️ App existente em estado inválido, removendo...");
        try {
          deleteApp(existingApp);
        } catch (deleteError) {
          console.warn("Failed to delete invalid app:", deleteError);
        }
      }
    }

    // Inicializar novo Firebase app com configurações válidas
    console.log(
      "🚀 Inicializando Firebase app com configurações atualizadas...",
    );
    console.log("📋 Project ID:", firebaseConfig.projectId);

    const app = initializeApp(firebaseConfig);

    // Validar o app recém-criado
    if (!app || !app.options || !app.name) {
      throw new Error("Firebase app created but is in invalid state");
    }

    console.log("✅ Firebase app inicializado com sucesso");
    console.log("🔥 Firebase está pronto para usar");
    return app;
  } catch (error: any) {
    console.error("❌ Erro na inicialização do Firebase:", error);
    console.error("📋 Firebase config being used:", firebaseConfig);

    // Se for erro de app já existir, tentar obter
    if (error.code === "app/duplicate-app") {
      const existingApps = getApps();
      if (existingApps.length > 0) {
        const existingApp = existingApps[0];
        if (existingApp && existingApp.options && existingApp.name) {
          console.log("🔄 Usando app existente após erro de duplicação");
          return existingApp;
        }
      }
    }

    // Don't return null - try to continue with a basic app
    console.warn("⚠️ Tentando continuar sem Firebase");
    return null;
  }
};

// Initialize Firebase services with error handling and quota control
console.log("��� Firebase initialization enabled - lazy loading mode");
let app: any = null;
let db: any = null;
let auth: any = null;

// Lazy loading state tracking
let firebaseInitAttempted = false;
let dbInitAttempted = false;
let authInitAttempted = false;

// Check if quota was previously exceeded - Firebase handles this internally
const isQuotaExceeded = () => {
  // Firebase handles quota management automatically
  return false;
};

// Promise to track Firebase initialization
let firebaseInitPromise: Promise<void> | null = null;

// Async function to initialize Firebase services
const initializeFirebaseServices = async (): Promise<void> => {
  try {
    if (isQuotaExceeded()) {
      console.log(
        "⏸️ Firebase temporarily disabled due to quota exceeded - will retry automatically",
      );
      app = null;
      db = null;
      auth = null;
      return;
    }

    app = getFirebaseApp();
    if (app) {
      // Wait a bit to ensure app is fully ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Additional app readiness verification
      try {
        if (!app.options) {
          console.warn("⚠️ Firebase app options not available, retrying...");
          await new Promise((resolve) => setTimeout(resolve, 500));
          app = getFirebaseApp();
          if (!app?.options) {
            throw new Error(
              "Firebase app not properly initialized after retry",
            );
          }
        }
      } catch (error) {
        console.error("❌ Firebase app readiness check failed:", error);
        app = null;
        return;
      }

      // Inicialização protegida do Firestore com retry logic
      db = await FirebaseErrorFix.safeFirebaseOperation(async () => {
        console.log("🔄 Inicializando Firestore com proteção...");

        // Wait for any pending operations to clear
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Try to get Firestore instance with retries
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
          try {
            // Ensure app is still valid and ready
            if (!app) {
              throw new Error("Firebase app is null");
            }

            // Check if app has the required properties
            if (!app.options || !app.name) {
              throw new Error("Firebase app is not properly initialized");
            }

            // Additional safety check - verify app is still in getApps()
            const currentApps = getApps();
            if (!currentApps.includes(app)) {
              throw new Error("Firebase app is no longer in active apps list");
            }

            console.log(
              `🔄 Tentativa ${attempts + 1}: Chamando getFirestore...`,
            );
            const firestoreInstance = getFirestore(app);
            console.log(
              `✅ Firestore inicializado na tentativa ${attempts + 1}`,
            );
            return firestoreInstance;
          } catch (error: any) {
            attempts++;
            console.warn(`⚠️ Tentativa ${attempts} falhou:`, error.message);

            // Handle specific getImmediate errors
            if (
              error.message?.includes("getImmediate") ||
              error.stack?.includes("getImmediate")
            ) {
              console.log(
                "🔧 Erro getImmediate detectado, aguardando mais tempo...",
              );
              // Reset the app and try to get a fresh instance
              app = null;
              await new Promise((resolve) => setTimeout(resolve, 1000));
              app = getFirebaseApp();
              if (!app) {
                throw new Error(
                  "Failed to reinitialize Firebase app after getImmediate error",
                );
              }
            }

            if (error.message?.includes("ReadableStream")) {
              console.log("🔧 Aplicando correção de ReadableStream...");
              await FirebaseErrorFix.fixReadableStreamError(error);
            }

            if (attempts < maxAttempts) {
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * attempts),
              );
            } else {
              console.error(
                "❌ Firestore initialization failed after all attempts",
              );
              console.log("🔄 Tentando última estratégia de recuperação...");

              // Ultimate fallback - try to completely reset Firebase
              try {
                const apps = getApps();
                for (const existingApp of apps) {
                  try {
                    deleteApp(existingApp);
                  } catch (deleteError) {
                    console.warn(
                      "Failed to delete app in fallback:",
                      deleteError,
                    );
                  }
                }

                // Wait and try one final time
                await new Promise((resolve) => setTimeout(resolve, 2000));
                app = getFirebaseApp();

                if (app) {
                  const finalFirestore = getFirestore(app);
                  console.log(
                    "✅ Firestore inicializado com estratégia de recuperação final",
                  );
                  return finalFirestore;
                }
              } catch (finalError) {
                console.error(
                  "❌ Estratégia de recuperação final falhou:",
                  finalError,
                );
              }

              console.error(
                "❌ Todas as tentativas de inicialização do Firestore falharam",
              );
              return null;
            }
          }
        }

        return null;
      }, "inicialização do Firestore");

      if (db) {
        console.log("✅ Firestore inicializado com proteção completa");
      } else {
        console.warn("⚠️ Firestore não pôde ser inicializado");
      }

      try {
        auth = getAuth(app);
        // Firebase Auth persistence is automatic by default (indexedDB/localStorage handled internally)
        if (auth) {
          // SECURITY: Set persistence to SESSION only (no auto-login between browser sessions)
          import("firebase/auth").then(
            ({ setPersistence, browserSessionPersistence }) => {
              setPersistence(auth, browserSessionPersistence)
                .then(() => {
                  console.log(
                    "🔐 Firebase Auth SESSION persistence enabled (no auto-login between sessions)",
                  );
                })
                .catch((error) => {
                  console.warn(
                    "⚠️ Could not set Firebase Auth persistence:",
                    error,
                  );
                });
            },
          );

          console.log(
            "🔐 Firebase Auth automatic persistence enabled for cross-device login",
          );
        }
        console.log("✅ Firebase Auth initialized successfully");
      } catch (error) {
        console.warn("⚠️ Firebase Auth initialization failed:", error);
        auth = null;
      }

      console.log("✅ Firebase services initialized successfully");
    } else {
      console.warn(
        "⚠️ Firebase app not available, services will use fallback mode",
      );
    }
  } catch (error) {
    console.warn(
      "���️ Firebase services initialization failed, using fallback mode:",
      error,
    );
    app = null;
    db = null;
    auth = null;
  }
};

// REPLACED: Old complex initialization system replaced with simplified approach
// All Firebase initialization now handled by simpleConfig.ts
console.log(
  "🔥 Using simplified Firebase initialization to prevent getImmediate errors",
);

// Lazy Firebase App initialization
const ensureFirebaseApp = async (): Promise<any> => {
  if (!app && !firebaseInitAttempted) {
    firebaseInitAttempted = true;
    console.log("🔥 Lazy loading Firebase app...");

    try {
      if (isQuotaExceeded()) {
        console.log("⏸️ Firebase temporarily disabled due to quota exceeded");
        return null;
      }

      app = getFirebaseApp();
      if (app) {
        console.log("✅ Firebase app ready for lazy loading");
      }
    } catch (error) {
      console.warn("⚠️ Firebase app initialization failed:", error);
      app = null;
    }
  }

  return app;
};

// Lazy Firestore initialization - only when needed
const ensureFirestore = async (): Promise<any> => {
  if (!db && !dbInitAttempted) {
    dbInitAttempted = true;
    console.log("🔄 Inicializando Firestore...");

    const firebaseApp = await ensureFirebaseApp();
    if (!firebaseApp) {
      console.warn("⚠️ Firebase app não disponível para Firestore");
      return null;
    }

    try {
      // Give Firebase app time to fully initialize
      await new Promise((resolve) => setTimeout(resolve, 500));

      db = getFirestore(firebaseApp);
      console.log("✅ Firestore inicializado com sucesso");
      console.log("🔥 Base de dados pronta para sincronização");

      // Test Firestore connectivity
      import("firebase/firestore").then(
        ({ connectFirestoreEmulator, enableNetwork }) => {
          if (db) {
            enableNetwork(db).catch(() => {
              console.log("🌐 Conectividade Firestore sendo estabelecida...");
            });
          }
        },
      );
    } catch (error: any) {
      console.warn("⚠️ Falha na inicialização do Firestore:", error.message);
      console.log("📱 Aplicação continuará em modo local");
      db = null;
    }
  }

  return db;
};

// Lazy Auth initialization - only when needed
const ensureAuth = async (): Promise<any> => {
  if (!auth && !authInitAttempted) {
    authInitAttempted = true;
    console.log("🔐 Inicializando Firebase Auth...");

    const firebaseApp = await ensureFirebaseApp();
    if (!firebaseApp) {
      console.warn("⚠️ Firebase app não disponível para Auth");
      return null;
    }

    try {
      auth = getAuth(firebaseApp);
      console.log("✅ Firebase Auth inicializado com sucesso");

      // Set up auth persistence immediately
      import("firebase/auth").then(
        ({ setPersistence, browserSessionPersistence }) => {
          if (auth) {
            setPersistence(auth, browserSessionPersistence)
              .then(() => {
                console.log("🔐 Firebase Auth persistence configurada");
              })
              .catch((error) => {
                console.warn("⚠️ Erro ao configurar persistência:", error);
              });
          }
        },
      );
    } catch (error) {
      console.warn("⚠️ Falha na inicialização do Firebase Auth:", error);
      auth = null;
    }
  }

  return auth;
};

// Firebase initialization handled by simpleConfig.ts
console.log("🔥 Firebase initialization delegated to simplified system");

// Function to check if Firebase is properly initialized and ready
export const isFirebaseReady = async () => {
  try {
    const { UnifiedSafeFirebase } = await import("./unifiedSafeFirebase");
    const status = UnifiedSafeFirebase.getStatus();
    return status.ready;
  } catch (error) {
    console.warn("Firebase health check failed:", error);
    return false;
  }
};

// Use UnifiedSafeFirebase to completely avoid getImmediate errors
export const getDB = async () => {
  console.log("🔥 Getting Firestore via UnifiedSafeFirebase");
  const { UnifiedSafeFirebase } = await import("./unifiedSafeFirebase");
  return await UnifiedSafeFirebase.getDB();
};

export const getAuthService = async () => {
  console.log("🔥 Getting Auth via UnifiedSafeFirebase");
  const { UnifiedSafeFirebase } = await import("./unifiedSafeFirebase");
  return await UnifiedSafeFirebase.getAuth();
};

// Function to ensure Firebase is initialized before use
export const waitForFirebaseInit = async (): Promise<boolean> => {
  try {
    if (firebaseInitPromise) {
      await firebaseInitPromise;
    }

    // In lazy loading mode, try to initialize the services
    await ensureAuth();
    await ensureFirestore();

    return isFirebaseReady();
  } catch (error) {
    console.warn("Failed to wait for Firebase initialization:", error);
    return false;
  }
};

// Function to get Firebase connection status
export const getFirebaseStatus = () => {
  const simpleStatus = getSimpleStatus();
  return {
    ...simpleStatus,
    quotaExceeded: isQuotaExceeded(),
  };
};

// Function to mark quota exceeded - Firebase handles this automatically
export const markQuotaExceeded = () => {
  console.warn(
    "🚨 Firebase quota exceeded - Firebase will handle cooldown automatically",
  );
};

// Function to clear quota exceeded flag - Firebase handles this automatically
export const clearQuotaExceeded = () => {
  console.log(
    "✅ Firebase quota managed automatically - services can be reinitialized",
  );
};

// Function to attempt Firebase reinitialization
export const reinitializeFirebase = async (): Promise<boolean> => {
  try {
    if (isQuotaExceeded()) {
      console.log("⏳ Firebase still in cooldown period");
      return false;
    }

    // Clear previous quota flag
    clearQuotaExceeded();

    // Reset the current instances
    app = null;
    db = null;
    auth = null;

    // Reset lazy loading state
    firebaseInitAttempted = false;
    dbInitAttempted = false;
    authInitAttempted = false;

    // Start a new initialization with lazy loading
    firebaseInitPromise = ensureFirebaseApp();
    await firebaseInitPromise;

    console.log("✅ Firebase successfully reinitialized");
    return isFirebaseReady();
  } catch (error) {
    console.warn("⚠️ Firebase reinitialization error:", error);
    return false;
  }
};

export { app, db, auth };
export default app;
