// Configuração Firebase única e limpa - projeto Leiria apenas
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Configuração única do projeto Leiria
const leiriaFirebaseConfig = {
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

// Verificar se deve inicializar Firebase
const IS_NETLIFY_BUILD =
  import.meta.env.NETLIFY === "true" ||
  import.meta.env.VITE_IS_NETLIFY === "true";
const FORCE_FIREBASE_PRODUCTION =
  IS_NETLIFY_BUILD || import.meta.env.VITE_FORCE_FIREBASE;

// Inicialização simples e única
function initializeLeiria(): boolean {
  // Respeitar configurações de ambiente
  if (!FORCE_FIREBASE_PRODUCTION) {
    console.log(
      "🚫 Firebase Leiria não inicializado - modo desenvolvimento ativo",
    );
    console.log("📝 Para testar Firebase localmente: VITE_FORCE_FIREBASE=true");
    return false;
  }

  try {
    // Verificar se já existe uma app
    const existingApps = getApps();

    if (existingApps.length > 0) {
      // Usar app existente
      app = existingApps[0];
    } else {
      // Criar nova app
      app = initializeApp(leiriaFirebaseConfig, "leiria-app");
    }

    // Inicializar serviços
    db = getFirestore(app);
    auth = getAuth(app);

    console.log("✅ Firebase Leiria inicializado com sucesso");
    return true;
  } catch (error) {
    console.warn("⚠️ Firebase Leiria não disponível, usando modo local");
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
