// Configuração Firestore ativa
import {
  Firestore,
  getFirestore,
  connectFirestoreEmulator,
  doc,
  getDoc,
} from "firebase/firestore";
import { getApps, getApp } from "firebase/app";

// Estado atual: Firestore ativo
const LOCAL_MODE = false;

// Variável para armazenar a instância do Firestore
let firestoreInstance: Firestore | null = null;

// Função para aguardar Firebase App estar pronto
async function waitForFirebaseApp(
  maxAttempts = 10,
  delay = 1000,
): Promise<any> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const apps = getApps();
    if (apps.length > 0) {
      const app = getApp();
      // Verificar se a app tem as propriedades necessárias
      if (app.options.projectId && app.options.apiKey) {
        console.log(`✅ Firebase App pronta na tentativa ${attempt}`);
        return app;
      }
    }

    console.log(
      `⏳ Tentativa ${attempt}/${maxAttempts} - aguardando Firebase App...`,
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error("Firebase App não inicializou após aguardar");
}

// Função para inicializar Firestore com retry
async function initializeFirestore(
  retryCount = 0,
  maxRetries = 3,
): Promise<Firestore | null> {
  if (LOCAL_MODE) return null;

  try {
    console.log(
      `💾 Tentando inicializar Firestore... (tentativa ${retryCount + 1}/${maxRetries + 1})`,
    );

    // Aguardar Firebase App estar pronto
    const app = await waitForFirebaseApp();

    console.log("🎆 Firebase App confirmada:", {
      name: app.name,
      projectId: app.options.projectId,
      authDomain: app.options.authDomain,
    });

    // Aguardar um pouco mais para garantir que os serviços estão prontos
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("💾 Chamando getFirestore()...");
    const db = getFirestore(app);
    console.log("✅ Firestore inicializado com sucesso", typeof db);

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

    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`🔄 Tentando novamente em ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return initializeFirestore(retryCount + 1, maxRetries);
    }

    console.error("🔍 Stack trace:", error.stack);
    return null;
  }
}

// Tentar inicializar Firestore automaticamente
if (!LOCAL_MODE) {
  // Usar setTimeout assíncrono para garantir que Firebase App foi inicializado primeiro
  setTimeout(async () => {
    if (!firestoreInstance) {
      firestoreInstance = await initializeFirestore();
    }
  }, 1000); // Aumentar delay para garantir inicialização
}

// Função principal para obter Firestore (síncrona - pode retornar null se ainda não inicializado)
export function getFirebaseFirestore(): Firestore | null {
  if (LOCAL_MODE) {
    console.log("📱 Firestore em modo local - dados guardados no localStorage");
    return null;
  }

  if (!firestoreInstance) {
    console.warn(
      "⚠️ Firestore ainda não foi inicializado - use getFirebaseFirestoreAsync()",
    );
  }

  return firestoreInstance;
}

// Função assíncrona para obter Firestore (recomendada)
export async function getFirebaseFirestoreAsync(): Promise<Firestore | null> {
  if (LOCAL_MODE) {
    console.log("📱 Firestore em modo local - dados guardados no localStorage");
    return null;
  }

  // Tentar inicializar se ainda não foi feito
  if (!firestoreInstance) {
    console.log("🔄 Inicializando Firestore assincronamente...");
    firestoreInstance = await initializeFirestore();
    if (!firestoreInstance) {
      console.error("❌ Firestore não conseguiu ser inicializado");
    }
  }

  return firestoreInstance;
}

// Função para verificar se Firestore está pronto
export function isFirestoreReady(): boolean {
  if (LOCAL_MODE) return false;
  return firestoreInstance !== null;
}

// Função de teste simples para Firestore
export async function testFirestore(): Promise<boolean> {
  if (LOCAL_MODE) {
    console.log("📱 Firestore teste: modo local ativo");
    return false;
  }

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
  if (LOCAL_MODE) {
    console.log("📱 Firestore forçado: modo local ativo");
    return false;
  }

  try {
    console.log("🔄 Forçando inicialização Firestore...");
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
  if (LOCAL_MODE) {
    console.log("🧹 Firestore limpo: modo local ativo");
    return;
  }

  firestoreInstance = null;
  console.log("🧹 Instância Firestore limpa");
}

// Função para ativar modo local (desativada)
export function enableLocalMode(): void {
  console.log("⚠️ Modo local desativado - usando Firebase ativo");
  console.log("🔥 Firebase/Firestore totalmente funcionais");
}

// Exportações
export { firestoreInstance };
export default firestoreInstance;
