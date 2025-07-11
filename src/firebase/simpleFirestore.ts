// Configuração simples e direta do Firestore com inicialização segura
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do projeto leiria-1cfc9
const firebaseConfig = {
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

let app: any = null;
let db: any = null;

// Função para inicializar Firebase de forma segura
function initializeFirebaseSafe() {
  try {
    // Verificar se já existe uma app
    const existingApps = getApps();

    if (existingApps.length > 0) {
      app = existingApps[0];
      console.log("✅ Usando Firebase app existente");
    } else {
      app = initializeApp(firebaseConfig);
      console.log("✅ Nova Firebase app criada");
    }

    return app;
  } catch (error) {
    console.error("❌ Erro ao inicializar Firebase:", error);
    return null;
  }
}

// Função para inicializar Firestore de forma segura
function initializeFirestoreSafe() {
  try {
    if (!app) {
      console.error("❌ Firebase app não disponível");
      return null;
    }

    db = getFirestore(app);
    console.log("✅ Firestore inicializado");
    console.log("📊 Projeto:", firebaseConfig.projectId);

    return db;
  } catch (error) {
    console.error("❌ Erro ao inicializar Firestore:", error);
    return null;
  }
}

// Inicialização com delay para evitar problemas de timing
setTimeout(() => {
  console.log("🔧 Iniciando Firebase de forma segura...");

  const firebaseApp = initializeFirebaseSafe();
  if (firebaseApp) {
    const firestoreDb = initializeFirestoreSafe();
    if (firestoreDb) {
      console.log("🎉 Firebase e Firestore prontos!");
    }
  }
}, 100);

// Getter seguro para o Firestore
export function getDb() {
  if (!db) {
    console.warn("⚠️ Firestore ainda não inicializado");
    return null;
  }
  return db;
}

// Getter seguro para a app
export function getApp() {
  if (!app) {
    console.warn("⚠️ Firebase app ainda não inicializada");
    return null;
  }
  return app;
}

// Verificar se está pronto
export function isReady() {
  return app !== null && db !== null;
}

// Exportações para compatibilidade
export { db, app };
export default db;
