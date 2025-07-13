// Passo 3: Configuração Firestore - base de dados na nuvem
import { getFirestore, Firestore } from "firebase/firestore";
import { getFirebaseApp, getFirebaseAppAsync } from "./basicConfig";

// Variável para armazenar a instância do Firestore
let firestoreInstance: Firestore | null = null;
let firestoreInitPromise: Promise<Firestore | null> | null = null;

// Função assíncrona robusta para inicializar Firestore
async function initializeFirestoreAsync(): Promise<Firestore | null> {
  // Se já estamos inicializando, retornar a promise existente
  if (firestoreInitPromise) {
    return firestoreInitPromise;
  }

  // Se já temos uma instância válida, retorná-la
  if (firestoreInstance) {
    console.log("✅ Firestore: Instância existente válida");
    return firestoreInstance;
  }

  // Criar promise de inicialização
  firestoreInitPromise = (async () => {
    try {
      // Aguardar Firebase App estar completamente pronta
      const app = await getFirebaseAppAsync();

      if (!app) {
        console.warn("⚠️ Firebase App não disponível para Firestore");
        return null;
      }

      // Aguardar a app estar completamente pronta
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Verificar se a app não foi deletada com validação mais robusta
      try {
        const projectId = app.options?.projectId;
        const authDomain = app.options?.authDomain;

        if (!projectId || !authDomain) {
          console.warn(
            "⚠️ Firebase App inválida (faltam configurações essenciais)",
          );
          return null;
        }

        // Verificar se a app está na lista de apps válidas
        const { getApps } = await import("firebase/app");
        const validApps = getApps();
        if (!validApps.includes(app)) {
          console.warn("⚠️ Firebase App não está na lista de apps válidas");
          return null;
        }
      } catch (appError) {
        console.warn("⚠️ Firebase App não é válida:", appError);
        return null;
      }

      // Inicializar Firestore com retry automático
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          firestoreInstance = getFirestore(app);
          console.log("✅ Firestore: Inicializado com sucesso (assíncrono)");
          console.log("🔥 Firestore sempre ativo - dados sincronizados");
          return firestoreInstance;
        } catch (firestoreError: any) {
          retryCount++;
          console.warn(
            `⚠️ Firestore: Tentativa ${retryCount}/${maxRetries} falhou:`,
            firestoreError.code || firestoreError.message,
          );

          // Se for erro específico de getImmediate, aguardar mais tempo
          if (firestoreError.message?.includes("getImmediate")) {
            console.log(
              "🔄 Erro getImmediate detectado, aguardando app estar pronta...",
            );
            await new Promise((resolve) =>
              setTimeout(resolve, 3000 * retryCount),
            );
          } else if (retryCount < maxRetries) {
            // Para outros erros, aguardar menos tempo
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount),
            );
          }

          // Se foi a última tentativa
          if (retryCount === maxRetries) {
            console.error(
              "❌ Firestore: Erro específico na inicialização após todas as tentativas:",
              firestoreError,
            );

            // Se for erro de app deletada, limpar referência
            if (firestoreError.code === "app/app-deleted") {
              console.log(
                "🧹 Firestore: App foi deletada, limpando referência",
              );
              firestoreInstance = null;
            }

            return null;
          }
        }
      }

      // Se chegou aqui, todas as tentativas falharam (não deve acontecer)
      return null;
    } catch (error: any) {
      console.error(
        "❌ Firestore: Erro geral na inicialização assíncrona:",
        error,
      );
      return null;
    } finally {
      // Limpar promise após conclusão
      firestoreInitPromise = null;
    }
  })();

  return firestoreInitPromise;
}

// Função síncrona para compatibilidade (pode retornar null se não estiver pronta)
function initializeFirestore(): Firestore | null {
  // Se já temos instância, retorná-la
  if (firestoreInstance) {
    return firestoreInstance;
  }

  // Tentar inicialização síncrona apenas se Firebase App já existir
  const app = getFirebaseApp();
  if (!app) {
    console.warn(
      "⚠️ Firebase App não disponível para Firestore (modo síncrono)",
    );

    // Iniciar inicialização assíncrona em background
    initializeFirestoreAsync().catch((error) => {
      console.error(
        "❌ Firestore: Erro na inicialização assíncrona em background:",
        error,
      );
    });

    return null;
  }

  try {
    // Verificar se a app é válida
    const projectId = app.options.projectId;
    if (!projectId) {
      console.warn("⚠️ Firebase App inválida (sem projectId) no modo síncrono");
      return null;
    }

    // Tentar inicializar Firestore
    firestoreInstance = getFirestore(app);
    console.log("�� Firestore: Inicializado com sucesso (síncrono)");
    return firestoreInstance;
  } catch (firestoreError: any) {
    console.warn(
      "⚠️ Firestore: Erro na inicialização síncrona:",
      firestoreError,
    );

    // Iniciar inicialização assíncrona em background
    initializeFirestoreAsync().catch((error) => {
      console.error(
        "❌ Firestore: Erro na inicialização assíncrona em background:",
        error,
      );
    });

    return null;
  }
}

// Função para obter o Firestore (síncrona)
export function getFirebaseFirestore(): Firestore | null {
  if (!firestoreInstance) {
    return initializeFirestore();
  }
  return firestoreInstance;
}

// Função assíncrona para obter o Firestore
export async function getFirebaseFirestoreAsync(): Promise<Firestore | null> {
  return await initializeFirestoreAsync();
}

// Função para verificar se Firestore está pronto
export function isFirestoreReady(): boolean {
  return firestoreInstance !== null;
}

// Função de teste simples para Firestore
export async function testFirestore(): Promise<boolean> {
  try {
    const db = getFirebaseFirestore();
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

// Inicialização lazy do Firestore - apenas quando necessário
// setTimeout(() => { initializeFirestore(); }, 800); // Removido para evitar conflitos

// Exportações
export { firestoreInstance };
export default firestoreInstance;
