// Configuração Firebase única - projeto Leiria com credenciais reais
// Configuração para sincronização sempre ativa

// Configuração real do projeto Leiria
export const LEIRIA_FIREBASE_CONFIG = {
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

// Função única para obter configuração
export function getFirebaseConfig() {
  return LEIRIA_FIREBASE_CONFIG;
}

// Exportação padrão
export default LEIRIA_FIREBASE_CONFIG;
