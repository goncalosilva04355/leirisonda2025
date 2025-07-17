// Configuração Firebase única e limpa - projeto leiria-1cfc9
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Configuração usando variáveis de ambiente
const leiriaFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

// Verificar se deve inicializar Firebase - SEMPRE ATIVO PARA DESENVOLVIMENTO IGUAL A PRODUÇÃO
const IS_NETLIFY_BUILD =
  import.meta.env.NETLIFY === "true" ||
  import.meta.env.VITE_IS_NETLIFY === "true";
const FORCE_FIREBASE_PRODUCTION = true; // SEMPRE ATIVO - DESENVOLVIMENTO = PRODUÇÃO

// Inicialização simples e única
function initializeLeiria(): boolean {
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
