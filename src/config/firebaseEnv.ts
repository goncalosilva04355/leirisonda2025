// Configuração Firebase única - projeto Leiria apenas
// Todas as referências a Leirisonda foram removidas para evitar conflitos

// Configuração única do projeto Leiria
export const LEIRIA_FIREBASE_CONFIG = {
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

// Função única para obter configuração
export function getFirebaseConfig() {
  return LEIRIA_FIREBASE_CONFIG;
}

// Exportação padrão
export default LEIRIA_FIREBASE_CONFIG;
