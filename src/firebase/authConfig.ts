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
      return null;
    }

    if (!firebaseAuth) {
      firebaseAuth = getAuth(app);
      console.log("✅ Firebase Auth: Inicializado com sucesso");
    }

    return firebaseAuth;
  } catch (error) {
    console.warn(
      "⚠️ Firebase Auth: Problema na inicialização, mantendo modo local",
    );
    return null;
  }
}

// Função para obter o Firebase Auth
export function getFirebaseAuth(): Auth | null {
  if (!firebaseAuth) {
    return initializeFirebaseAuth();
  }
  return firebaseAuth;
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
