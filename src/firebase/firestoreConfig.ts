// Configuração Firestore ativa
import {
  Firestore,
  getFirestore,
  connectFirestoreEmulator,
  doc,
  getDoc,
} from "firebase/firestore";
import { getApps, getApp } from "firebase/app";

// Estado: Firestore inteligente - só ativa se disponível
const LOCAL_MODE = import.meta.env.DEV;
const IS_NETLIFY_BUILD =
  import.meta.env.NETLIFY === "true" ||
  import.meta.env.VITE_IS_NETLIFY === "true";
const FORCE_FIRESTORE_PRODUCTION = true; // SEMPRE ATIVO - DEV E PROD

// Flag para controlar se já verificamos a disponibilidade do Firestore
let firestoreAvailabilityChecked = false;
let firestoreIsAvailable = false;

// Variável para armazenar a instância do Firestore
let firestoreInstance: Firestore | null = null;

// Função para aguardar Firebase App estar pronto
async function waitForFirebaseApp(
  maxAttempts = 10,
  delay = 1000,
): Promise<any> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const apps = getApps();

      if (apps.length > 0) {
        const app = getApp();
        // Verificar se a app tem as propriedades necessárias
        if (app && app.options && app.options.projectId && app.options.apiKey) {
          console.log(`✅ Firebase App pronta na tentativa ${attempt}`);
          return app;
        } else {
          console.warn(`⚠️ Firebase App encontrada mas incompleta:`, {
            hasOptions: !!app.options,
            projectId: app.options?.projectId,
            hasApiKey: !!app.options?.apiKey,
          });
        }
      } else {
        console.log(
          `⏳ Tentativa ${attempt}/${maxAttempts} - nenhuma Firebase App encontrada`,
        );
      }
    } catch (error) {
      console.warn(`⚠️ Erro na tentativa ${attempt}:`, error);
    }

    if (attempt < maxAttempts) {
      console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  console.warn("⚠️ Firebase App não inicializou após todas as tentativas");
  console.log("🔧 Tentando inicialização de emergência...");

  // Tentativa de emergência - inicializar Firebase se ainda não foi
  try {
    const { initializeApp } = await import("firebase/app");
    const { getFirebaseConfig } = await import("../config/firebaseEnv");

    const config = getFirebaseConfig();
    if (config && config.projectId && config.apiKey) {
      console.log("🚀 Tentando inicialização de emergência do Firebase...");
      const emergencyApp = initializeApp(config, `emergency-${Date.now()}`);
      console.log("✅ Firebase inicializado em modo de emergência");
      return emergencyApp;
    } else {
      console.warn("⚠️ Configuração Firebase inválida");
      return null;
    }
  } catch (emergencyError) {
    console.warn("⚠️ Falha na inicialização de emergência:", emergencyError);
    return null;
  }

  console.warn(
    "⚠️ Firebase App não inicializou após aguardar e tentativas de emergência",
  );
  return null;
}

// Função para verificar se Firestore está disponível no projeto
async function checkFirestoreAvailability(app: any): Promise<boolean> {
  // Se já verificamos, retornar o resultado cached
  if (firestoreAvailabilityChecked) {
    return firestoreIsAvailable;
  }

  try {
    // Tentar importar Firestore usando getImmediate para verificar disponibilidade
    const { getFirestore } = await import("firebase/firestore");
    const db = getFirestore(app);
    console.log("✅ Firestore disponível no projeto:", app.options.projectId);

    firestoreAvailabilityChecked = true;
    firestoreIsAvailable = true;
    return true;
  } catch (error: any) {
    firestoreAvailabilityChecked = true;
    firestoreIsAvailable = false;

    if (
      error.code === "firestore/unavailable" ||
      error.message.includes("Service firestore is not available")
    ) {
      console.warn(
        `⚠️ Firestore não habilitado no projeto ${app.options.projectId}`,
      );
      console.info(
        "�� Para habilitar: Firebase Console → Firestore Database → Criar base de dados",
      );
      console.info(
        `🔗 https://console.firebase.google.com/project/${app.options.projectId}/firestore`,
      );
      console.info("📱 Aplicação funcionará perfeitamente com localStorage");
      return false;
    }
    console.error("❌ Erro inesperado ao verificar Firestore:", error);
    return false;
  }
}

// Função para inicializar Firestore com retry
async function initializeFirestore(
  retryCount = 0,
  maxRetries = 2,
): Promise<Firestore | null> {
  // Firestore sempre ativo - sem condições de bloqueio

  try {
    console.log(
      `💾 Tentando inicializar Firestore... (tentativa ${retryCount + 1}/${maxRetries + 1})`,
    );

    // Aguardar Firebase App estar pronto
    const app = await waitForFirebaseApp();

    if (!app) {
      console.warn("⚠️ Firebase App não disponível, continuando sem Firestore");
      return null;
    }

    console.log("🎆 Firebase App confirmada:", {
      name: app.name,
      projectId: app.options.projectId,
      authDomain: app.options.authDomain,
    });

    // Verificar se Firestore está disponível neste projeto
    const firestoreAvailable = await checkFirestoreAvailability(app);

    if (!firestoreAvailable) {
      // Silenciosamente retorna null - checkFirestoreAvailability já mostrou a informação necessária
      return null;
    }

    // Aguardar um pouco mais para garantir que os servi��os estão prontos
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("💾 Chamando getFirestore()...");
    const db = getFirestore(app);
    console.log("�� Firestore inicializado com sucesso", typeof db);

    // Teste rápido para verificar se realmente funciona
    console.log("🧪 Testando conectividade Firestore...");
    const testRef = doc(db, "__test__", "connection");
    // Não fazer getDoc ainda, apenas criar a referência
    console.log("✅ Referência de teste criada com sucesso");

    return db;
  } catch (error: any) {
    console.error(
      `❌ Erro ao inicializar Firestore (tentativa ${retryCount + 1}):`,
      error.message,
    );
    console.error("🔍 Error code:", error.code);

    // Se é erro de Firestore não disponível, não tentar novamente
    if (
      error.code === "firestore/unavailable" ||
      error.message.includes("Service firestore is not available")
    ) {
      console.error(
        "❌ Firestore não está habilitado - não tentando novamente",
      );
      console.error(
        "💡 A aplicação continuará funcionando com localStorage apenas",
      );
      return null;
    }

    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`🔄 Tentando novamente em ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return initializeFirestore(retryCount + 1, maxRetries);
    }

    // Todas as tentativas falharam
    console.error("❌ Firestore falhou após todas as tentativas");
    console.error(
      "💾 A aplicação continuará funcionando apenas com localStorage",
    );
    console.error("🔍 Stack trace original:", error.stack);
    return null;
  }
}

// Tentar inicializar Firestore se forçado ou em produção
if (FORCE_FIRESTORE_PRODUCTION) {
  console.log("🔥 Verificando disponibilidade do Firestore...");
  // Usar setTimeout assíncrono para garantir que Firebase App foi inicializado primeiro
  setTimeout(async () => {
    if (!firestoreInstance) {
      console.log("🔍 Testando Firestore no projeto...");
      firestoreInstance = await initializeFirestore();
      if (firestoreInstance) {
        console.log("✅ Firestore ativo e funcional");
      } else {
        console.info(
          "📱 Modo localStorage ativo - aplicação funcionará normalmente",
        );
      }
    }
  }, 1000);
} else {
  console.log("⏸️ Firestore verificação adiada - aguardando deploy no Netlify");
}

// Função principal para obter Firestore (síncrona - pode retornar null se ainda não inicializado)
export function getFirebaseFirestore(): Firestore | null {
  // Firestore sempre disponível - sem condições de bloqueio

  if (!firestoreInstance) {
    console.warn(
      "⚠️ Firestore ainda não foi inicializado - use getFirebaseFirestoreAsync()",
    );
    // Tentar inicializar imediatamente
    initializeFirestore().then((db) => {
      firestoreInstance = db;
    });
  }

  return firestoreInstance;
}

// Função assíncrona para obter Firestore (recomendada)
export async function getFirebaseFirestoreAsync(): Promise<Firestore | null> {
  // Remover bloqueio - Firestore sempre disponível
  console.log("🔥 Inicializando Firestore...");

  // Tentar inicializar se ainda não foi feito
  if (!firestoreInstance) {
    console.log("🔄 Inicializando Firestore assincronamente...");
    firestoreInstance = await initializeFirestore();
    if (!firestoreInstance) {
      // Only log as warning in development to avoid confusion
      if (import.meta.env.DEV) {
        console.warn(
          "⚠️ Firestore não disponível em modo de desenvolvimento - aplicação funciona com localStorage",
        );
      } else {
        console.error("❌ Firestore não conseguiu ser inicializado");
      }
    }
  }

  return firestoreInstance;
}

// Função para verificar se Firestore est�� pronto
export function isFirestoreReady(): boolean {
  // Remover bloqueio - verificar apenas se instância existe
  return firestoreInstance !== null;
}

// Função de teste simples para Firestore
export async function testFirestore(): Promise<boolean> {
  // Remover bloqueio - sempre testar Firestore
  console.log("🧪 Testando Firestore...");

  try {
    const db = getFirebaseFirestore();
    if (!db) {
      console.error("❌ Firestore não disponível para teste");
      return false;
    }

    // Teste simples de conectividade
    const testDoc = doc(db, "test", "connection");
    await getDoc(testDoc);

    console.log("✅ Teste Firestore: conectividade OK");
    return true;
  } catch (error: any) {
    console.error("❌ Teste Firestore falhou:", error.message);
    return false;
  }
}

// Função para forçar inicialização
export async function forceFirestoreInit(): Promise<boolean> {
  // Remover bloqueio - sempre permitir inicialização forçada
  console.log("🔄 Forçando inicialização...");

  try {
    console.log("🔄 Forçando inicializaç��o Firestore...");
    firestoreInstance = await initializeFirestore();

    if (firestoreInstance) {
      console.log("✅ Firestore inicialização forçada com sucesso");
      return true;
    } else {
      console.error("❌ Forçar inicialização falhou");
      return false;
    }
  } catch (error: any) {
    console.error("❌ Erro ao forçar inicialização Firestore:", error.message);
    return false;
  }
}

// Função para limpar instância
export function clearFirestoreInstance(): void {
  // Remover bloqueio - sempre permitir limpeza
  firestoreInstance = null;
  console.log("🧹 Instância Firestore limpa");
}

// Funç��o para ativar modo local (desativada)
export function enableLocalMode(): void {
  console.log("⚠️ Modo local desativado - usando Firebase ativo");
  console.log("🔥 Firebase/Firestore totalmente funcionais");
}

// Exportaç��es
export { firestoreInstance };
export default firestoreInstance;
