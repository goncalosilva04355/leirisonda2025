// Configuração Firebase de produção funcional
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuração válida do projeto Leiria
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
const app = initializeApp(firebaseConfig, "leiria-prod");
const db = getFirestore(app);
const auth = getAuth(app);

console.log("🔥 Firebase configuração de produção carregada");
console.log("📱 Projeto:", firebaseConfig.projectId);

export { app, db, auth };
export default { app, db, auth };
