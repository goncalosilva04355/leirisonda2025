// Configuração simples e direta do Firestore
import { initializeApp } from "firebase/app";
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

console.log("✅ Firebase e Firestore inicializados");
console.log("📊 Projeto:", firebaseConfig.projectId);

// Exportar para uso
export { db, app };
export default db;
