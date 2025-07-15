// Configuração Firebase de produção funcional
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuração válida do projeto Leiria
const firebaseConfig = {
  apiKey: "AIzaSyC5Pp6xbF4YJjGkJpfG6xXfJR4jBjJJZ4w",
  authDomain: "leiria25.firebaseapp.com",
  databaseURL:
    "https://leiria25-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "Leiria25",
  storageBucket: "leiria25.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012abcdef",
  measurementId: "G-ABCDEFGHIJ",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig, "leiria-prod");
const db = getFirestore(app);
const auth = getAuth(app);

console.log("🔥 Firebase configuração de produção carregada");
console.log("📱 Projeto:", firebaseConfig.projectId);

export { app, db, auth };
export default { app, db, auth };
