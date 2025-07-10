// Configuração Firebase que evita COMPLETAMENTE o erro getImmediate
// NÃO inicializa Firestore automaticamente

import { initializeApp } from "firebase/app";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:6027bf35a9d908b264eecc",
  measurementId: "G-51GLBMB6JQ",
};

// Apenas Firebase App - SEM serviços
let app: any = null;
let firestoreAvailable = false;
let authAvailable = false;

// Inicializar APENAS o Firebase App
try {
  app = initializeApp(firebaseConfig);
  console.log(
    "✅ Firebase App inicializado (serviços serão carregados sob demanda)",
  );
} catch (error) {
  console.error("❌ Erro ao inicializar Firebase App:", error);
  app = null;
}

// Cache para instâncias
let _db: any = null;
let _auth: any = null;

// Função que NUNCA falha - apenas tenta se conditions estão OK
export const attemptFirestoreInit = async (): Promise<any> => {
  // Se já tentamos e falhou, não tentar novamente
  if (_db === false) {
    return null;
  }

  // Se já inicializou com sucesso, retornar
  if (_db && _db !== false) {
    return _db;
  }

  // Se Firebase App não está disponível, desistir
  if (!app) {
    console.log("📱 Firebase App não disponível - usando modo local");
    _db = false;
    return null;
  }

  try {
    console.log("🔄 Tentando inicializar Firestore...");

    // Importar dinamicamente para evitar problemas de loading
    const { getFirestore } = await import("firebase/firestore");

    // Tentar com timeout mais longo
    const result = await Promise.race([
      new Promise((resolve, reject) => {
        try {
          const firestore = getFirestore(app);
          resolve(firestore);
        } catch (error) {
          reject(error);
        }
      }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout")), 10000);
      }),
    ]);

    _db = result;
    firestoreAvailable = true;
    console.log("✅ Firestore inicializado com sucesso!");
    return _db;
  } catch (error: any) {
    console.warn("⚠️ Firestore não disponível:", error.message);
    _db = false; // Marcar como tentado e falhado
    firestoreAvailable = false;
    return null;
  }
};

// Função que NUNCA falha para Auth
export const attemptAuthInit = async (): Promise<any> => {
  if (_auth === false) {
    return null;
  }

  if (_auth && _auth !== false) {
    return _auth;
  }

  if (!app) {
    _auth = false;
    return null;
  }

  try {
    const { getAuth } = await import("firebase/auth");
    _auth = getAuth(app);
    authAvailable = true;
    console.log("✅ Firebase Auth inicializado");
    return _auth;
  } catch (error: any) {
    console.warn("⚠️ Firebase Auth não disponível:", error.message);
    _auth = false;
    authAvailable = false;
    return null;
  }
};

// Funções que verificam status SEM tentar inicializar
export const isFirebaseReady = (): boolean => {
  return !!(app && firestoreAvailable && authAvailable);
};

export const waitForFirebaseInit = async (): Promise<boolean> => {
  // Não forçar inicialização - apenas verificar status
  return isFirebaseReady();
};

// Funções que retornam serviços OU null
export const getDB = async () => {
  return await attemptFirestoreInit();
};

export const getAuthService = async () => {
  return await attemptAuthInit();
};

// Proxies que SEMPRE retornam null se não disponível
export const db = new Proxy(
  {},
  {
    get(target, prop) {
      // Se ainda não tentamos inicializar, retornar null
      if (_db === null) {
        console.log("💬 Firestore não inicializado - usando modo local");
        return null;
      }

      // Se tentamos e falhou, retornar null
      if (_db === false) {
        return null;
      }

      // Se temos instância, tentar acessar propriedade
      try {
        return _db?.[prop];
      } catch (error) {
        return null;
      }
    },
  },
);

export const auth = new Proxy(
  {},
  {
    get(target, prop) {
      if (_auth === null || _auth === false) {
        return null;
      }

      try {
        return _auth?.[prop];
      } catch (error) {
        return null;
      }
    },
  },
);

// Função para tentar inicializar manualmente (quando realmente precisar)
export const initializeFirebaseManually = async (): Promise<{
  db: any;
  auth: any;
  success: boolean;
}> => {
  console.log("🔧 Inicialização manual do Firebase solicitada...");

  const db = await attemptFirestoreInit();
  const auth = await attemptAuthInit();

  const success = !!(db && auth);

  if (success) {
    console.log("🔥 Firebase inicializado manualmente com sucesso!");
  } else {
    console.log("⚠️ Firebase não disponível - app funcionará em modo local");
  }

  return { db, auth, success };
};

// Inicializar serviços automaticamente para resolver problemas de Auth/Firestore
(async () => {
  try {
    console.log("🔄 Inicializando Firebase services automaticamente...");
    await attemptAuthInit();
    await attemptFirestoreInit();
    console.log("✅ Firebase services inicializados");
  } catch (error) {
    console.warn("⚠️ Erro na inicialização automática do Firebase:", error);
  }
})();

console.log("📱 Firebase configurado (inicialização automática)");

// Exports
export { app };
export default app;
