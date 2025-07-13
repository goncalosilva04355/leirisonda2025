// Configuração Firestore ultra-robusta para evitar completamente erros getImmediate
import { Firestore } from "firebase/firestore";

// Variável para armazenar a instância do Firestore
let firestoreInstance: Firestore | null = null;
let isInitializing = false;

// Função ultra-segura para inicializar Firestore
async function ultraSafeInitializeFirestore(): Promise<Firestore | null> {
  // Evitar múltiplas inicializações simultâneas
  if (isInitializing) {
    console.log("🔄 Firestore já está a ser inicializado, aguardando...");
    // Aguardar um pouco e verificar novamente
    await new Promise((resolve) => setTimeout(resolve, 500));
    return firestoreInstance;
  }

  // Se já temos instância, retorná-la
  if (firestoreInstance) {
    return firestoreInstance;
  }

  isInitializing = true;

  try {
    // Importar dinamicamente para evitar problemas de inicialização
    const { getFirestore } = await import("firebase/firestore");
    const { getFirebaseApp } = await import("./basicConfig");

    // Aguardar Firebase App estar completamente pronto
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const app = getFirebaseApp();
    if (!app) {
      console.log("📱 Firebase App não disponível - modo local ativo");
      return null;
    }

    // Verificar se a app tem as configurações necessárias
    if (!app.options?.projectId) {
      console.warn("⚠️ Firebase App sem projectId válido");
      return null;
    }

    // Tentar inicializar Firestore com múltiplas tentativas
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        // Aguardar progressivamente mais tempo em cada tentativa
        if (attempts > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
        }

        firestoreInstance = getFirestore(app);
        console.log(
          "✅ Firestore: Inicializado com sucesso (tentativa " +
            (attempts + 1) +
            ")",
        );
        return firestoreInstance;
      } catch (error: any) {
        attempts++;
        console.warn(
          `⚠️ Firestore tentativa ${attempts}/${maxAttempts} falhou:`,
          error.message || error,
        );

        if (attempts === maxAttempts) {
          console.error("❌ Firestore: Todas as tentativas falharam");
          return null;
        }
      }
    }

    return null;
  } catch (error: any) {
    console.warn(
      "⚠️ Erro geral na inicialização Firestore:",
      error.message || error,
    );
    return null;
  } finally {
    isInitializing = false;
  }
}

// Função principal para obter Firestore (sempre segura)
export function getFirebaseFirestore(): Firestore | null {
  // Se já temos instância, retorná-la imediatamente
  if (firestoreInstance) {
    return firestoreInstance;
  }

  // Se não temos instância, inicializar em background
  ultraSafeInitializeFirestore().catch((error) => {
    console.warn("⚠️ Inicialização Firestore em background falhou:", error);
  });

  // Retornar null por agora (app funcionará em modo local)
  return null;
}

// Função assíncrona para obter Firestore
export async function getFirebaseFirestoreAsync(): Promise<Firestore | null> {
  // Se já temos instância, retorná-la
  if (firestoreInstance) {
    return firestoreInstance;
  }

  // Tentar inicializar
  return await ultraSafeInitializeFirestore();
}

// Função para verificar se Firestore está pronto
export function isFirestoreReady(): boolean {
  return firestoreInstance !== null;
}

// Função de teste simples para Firestore
export async function testFirestore(): Promise<boolean> {
  try {
    const db = await getFirebaseFirestoreAsync();
    if (!db) {
      console.log("📱 Firestore não disponível - modo local ativo");
      return false;
    }

    console.log("✅ Firestore disponível e pronto para uso");
    return true;
  } catch (error) {
    console.warn("⚠️ Teste Firestore falhou:", error);
    return false;
  }
}

// Função para forçar inicialização (útil para debugging)
export async function forceFirestoreInit(): Promise<boolean> {
  try {
    firestoreInstance = null; // Reset
    isInitializing = false; // Reset
    const db = await ultraSafeInitializeFirestore();
    return db !== null;
  } catch (error) {
    console.error("❌ Erro ao forçar inicialização Firestore:", error);
    return false;
  }
}

// Função para limpar instância (útil para debugging)
export function clearFirestoreInstance(): void {
  firestoreInstance = null;
  isInitializing = false;
  console.log("🧹 Instância Firestore limpa");
}

// Exportações
export { firestoreInstance };
export default firestoreInstance;
