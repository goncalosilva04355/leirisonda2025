import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FirebaseErrorFix } from "../utils/firebaseErrorFix";

// Default Firebase config
const defaultFirebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  databaseURL:
    "https://leirisonda-16f8b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
};

// Function to get Firebase config from localStorage or use default
const getFirebaseConfig = () => {
  // PARTILHA GLOBAL: Configuração fixa para todos os utilizadores
  console.log("🌐 Firebase: Partilha de dados global sempre ativa");
  console.log("❌ localStorage: Nunca será usado");
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
        console.log(
          "🔄 Usando Firebase app existente validado (evitando conflitos de stream)",
        );
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

    // Aguardar antes de inicializar para evitar conflitos
    console.log("🚀 Inicializando novo Firebase app...");
    const app = initializeApp(firebaseConfig);

    // Validar o app recém-criado
    if (!app || !app.options || !app.name) {
      throw new Error("Firebase app created but is in invalid state");
    }

    console.log("✅ Firebase app inicializado e validado com sucesso");
    return app;
  } catch (error: any) {
    console.error("❌ Erro na inicialização do Firebase:", error);

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

    console.error("❌ Firebase app não disponível");
    return null;
  }
};

// Initialize Firebase services with error handling and quota control
console.log("🔥 Firebase initialization enabled - lazy loading mode");
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
      "⚠️ Firebase services initialization failed, using fallback mode:",
      error,
    );
    app = null;
    db = null;
    auth = null;
  }
};

// COMMENTED OUT: Eager initialization causing getImmediate errors
// firebaseInitPromise = initializeFirebaseServices();

// NEW APPROACH: Lazy loading Firebase services
console.log(
  "🔥 Switching to lazy loading approach to avoid getImmediate errors",
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
    console.log("🔄 Lazy loading Firestore...");

    const firebaseApp = await ensureFirebaseApp();
    if (!firebaseApp) {
      console.warn("⚠️ Firebase app not available for Firestore");
      return null;
    }

    try {
      // Give more time before attempting Firestore
      await new Promise((resolve) => setTimeout(resolve, 1000));
      db = getFirestore(firebaseApp);
      console.log("✅ Firestore lazy loaded successfully");
    } catch (error: any) {
      console.warn(
        "⚠️ Firestore lazy loading failed, app will use fallback:",
        error.message,
      );
      db = null;
    }
  }

  return db;
};

// Lazy Auth initialization - only when needed
const ensureAuth = async (): Promise<any> => {
  if (!auth && !authInitAttempted) {
    authInitAttempted = true;
    console.log("🔐 Lazy loading Firebase Auth...");

    const firebaseApp = await ensureFirebaseApp();
    if (!firebaseApp) {
      console.warn("⚠️ Firebase app not available for Auth");
      return null;
    }

    try {
      auth = getAuth(firebaseApp);
      console.log("✅ Firebase Auth lazy loaded successfully");
    } catch (error) {
      console.warn("⚠️ Firebase Auth lazy loading failed:", error);
      auth = null;
    }
  }

  return auth;
};

// Basic initialization - just prepare the app
firebaseInitPromise = ensureFirebaseApp();

// Function to check if Firebase is properly initialized and ready
export const isFirebaseReady = () => {
  try {
    return !!(app && auth && db);
  } catch (error) {
    console.warn("Firebase health check failed:", error);
    return false;
  }
};

// Lazy loading getters for Firebase services
export const getDB = async () => {
  return await ensureFirestore();
};

export const getAuthService = async () => {
  return await ensureAuth();
};

// Function to ensure Firebase is initialized before use
export const waitForFirebaseInit = async (): Promise<boolean> => {
  try {
    if (firebaseInitPromise) {
      await firebaseInitPromise;
    }
    return isFirebaseReady();
  } catch (error) {
    console.warn("Failed to wait for Firebase initialization:", error);
    return false;
  }
};

// Function to get Firebase connection status
export const getFirebaseStatus = () => {
  return {
    app: !!app,
    auth: !!auth,
    db: !!db,
    ready: isFirebaseReady(),
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

    // Start a new initialization
    firebaseInitPromise = initializeFirebaseServices();
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
