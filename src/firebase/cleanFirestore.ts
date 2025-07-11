// Firestore limpo e simples - com verificação de conflitos
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const config = {
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

let db = null;

try {
  // Verificar se já existe uma app Firebase
  const existingApps = getApps();
  let app;

  if (existingApps.length > 0) {
    // Usar app existente
    app = existingApps[0];
    console.log("🔄 Usando Firebase app existente");
  } else {
    // Criar nova app
    app = initializeApp(config);
    console.log("🆕 Nova Firebase app criada");
  }

  // Inicializar Firestore
  db = getFirestore(app);
  console.log("✅ Firestore limpo inicializado");
} catch (error) {
  console.error("❌ Erro Firebase:", error.message);
  db = null;
}

export { db };
