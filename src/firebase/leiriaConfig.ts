// Configuração Firebase única e limpa - projeto leiria-1cfc9
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Configuração única do projeto leiria-1cfc9 (CORRETO)
const leiriaFirebaseConfig = {
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

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

// Verificar se deve inicializar Firebase - SEMPRE ATIVO PARA DESENVOLVIMENTO IGUAL A PRODUÇÃO
const IS_NETLIFY_BUILD = false; // Simplified for debugging
const FORCE_FIREBASE_PRODUCTION = true; // SEMPRE ATIVO - DESENVOLVIMENTO = PRODUÇÃO

// Inicialização simples e única
function initializeLeiria(): boolean {
  // Verificação específica para produção - simplified for debugging
  const isProduction =
    typeof window !== "undefined" && window.location.hostname !== "localhost";
  if (isProduction) {
    console.log("📱 Firebase em produção - verificando configuração...");
    try {
      // Verificar se configuração está completa
      const requiredFields = ["apiKey", "authDomain", "projectId"];
      const missingFields = requiredFields.filter(
        (field) => !leiriaFirebaseConfig[field],
      );

      if (missingFields.length > 0) {
        console.error("❌ Firebase config incompleto:", missingFields);
        return false;
      }

      console.log("✅ Configuração Firebase verificada para produção");
    } catch (error) {
      console.error("❌ Erro na verificação do Firebase:", error);
      return false;
    }
  }
  // SEMPRE INICIALIZAR FIREBASE - DESENVOLVIMENTO = PRODUÇÃO
  console.log(
    "🔥 Firebase leiria-1cfc9 SEMPRE ATIVO - desenvolvimento como produção",
  );

  try {
    // Verificar se já existe uma app
    const existingApps = getApps();

    if (existingApps.length > 0) {
      // Usar app existente
      app = existingApps[0];
    } else {
      // Criar nova app
      app = initializeApp(leiriaFirebaseConfig, "leiria-1cfc9-app");
    }

    // Inicializar serviços
    db = getFirestore(app);
    auth = getAuth(app);

    console.log("✅ Firebase leiria-1cfc9 inicializado com sucesso");
    return true;
  } catch (error) {
    console.warn("⚠️ Firebase leiria-1cfc9 não disponível, usando modo local");
    return false;
  }
}

// Getters públicos
export function getFirebaseApp(): FirebaseApp | null {
  if (!app && FORCE_FIREBASE_PRODUCTION) initializeLeiria();
  return app;
}

export function getFirebaseFirestore(): Firestore | null {
  if (!db && FORCE_FIREBASE_PRODUCTION) initializeLeiria();
  return db;
}

export function getFirebaseAuth(): Auth | null {
  if (!auth && FORCE_FIREBASE_PRODUCTION) initializeLeiria();
  return auth;
}

export function isFirebaseReady(): boolean {
  return app !== null;
}

export function isFirestoreReady(): boolean {
  return db !== null;
}

// Inicializar apenas em produção ou quando forçado
if (FORCE_FIREBASE_PRODUCTION) {
  initializeLeiria();
}

// Exportações
export { app, db, auth };
export default { app, db, auth };
