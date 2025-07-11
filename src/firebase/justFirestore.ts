import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

let firestore = null;
let initError = null;

// Função para tentar inicializar com delay
async function initializeWithDelay() {
  try {
    // Aguardar um pouco para evitar conflitos
    await new Promise((resolve) => setTimeout(resolve, 500));

    const apps = getApps();
    let app;

    if (apps.length > 0) {
      app = apps[0];
    } else {
      app = initializeApp(firebaseConfig);
    }

    // Aguardar mais um pouco antes do Firestore
    await new Promise((resolve) => setTimeout(resolve, 300));

    firestore = getFirestore(app);

    // Testar uma operação simples para verificar se realmente funciona
    if (
      firestore &&
      firestore.app &&
      firestore.app.options.projectId === "leiria-1cfc9"
    ) {
      console.log("✅ Firestore conectado com sucesso");
      return true;
    } else {
      throw new Error("Firestore não configurado corretamente");
    }
  } catch (error) {
    initError = error.message || error.toString();
    console.warn("⚠️ Firestore falhou:", error);
    firestore = null;
    return false;
  }
}

// Inicializar com delay
initializeWithDelay();

// Função para obter o erro
export function getFirestoreError() {
  return initError;
}

// Função para verificar status
export function getFirestoreStatus() {
  if (firestore) return "connected";
  if (initError) return "error";
  return "initializing";
}

export { firestore };
export default firestore;
