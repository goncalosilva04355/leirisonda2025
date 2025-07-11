// Passo 2: Configuração Firebase Auth - simples e segura
import { getAuth, Auth } from "firebase/auth";
import { getFirebaseApp } from "./basicConfig";

// Variável para armazenar a instância do Auth
let firebaseAuth: Auth | null = null;

// Função simples para inicializar Firebase Auth
function initializeFirebaseAuth(): Auth | null {
  try {
    const app = getFirebaseApp();

    if (!app) {
      console.log(
        "⚠️ Firebase App não disponível, mantendo autenticação local",
      );
      firebaseAuth = null;
      return null;
    }

    // Sempre criar nova instância para evitar problemas com instâncias destruídas
    try {
      firebaseAuth = getAuth(app);
      console.log("✅ Firebase Auth: Inicializado com sucesso");
      return firebaseAuth;
    } catch (authError) {
      console.warn("⚠️ Erro ao criar instância Auth:", authError);
      firebaseAuth = null;
      return null;
    }
  } catch (error) {
    console.warn(
      "⚠️ Firebase Auth: Problema na inicialização, mantendo modo local",
    );
    firebaseAuth = null;
    return null;
  }
}

// Função para obter o Firebase Auth
export function getFirebaseAuth(): Auth | null {
  // Sempre tentar reinicializar para garantir instância válida
  return initializeFirebaseAuth();
}

// Função para verificar se Firebase Auth está pronto
export function isFirebaseAuthReady(): boolean {
  return firebaseAuth !== null;
}

// Inicializar Auth automaticamente
setTimeout(() => {
  initializeFirebaseAuth();
}, 500);

// Exportações
export { firebaseAuth };
export default firebaseAuth;
