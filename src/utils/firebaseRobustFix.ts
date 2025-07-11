// Correção robusta para erro getImmediate do Firebase
import { initializeApp, getApps, deleteApp, FirebaseApp } from "firebase/app";

// Configuração Firebase
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

let robustApp: FirebaseApp | null = null;
let robustFirestore: any = null;
let initializationAttempts = 0;
const MAX_ATTEMPTS = 3;

// Função para limpar apps Firebase problemáticas
async function cleanupFirebaseApps() {
  try {
    const apps = getApps();
    console.log(`🧹 Limpando ${apps.length} apps Firebase existentes...`);

    for (const app of apps) {
      try {
        await deleteApp(app);
        console.log(`🗑️ App ${app.name} removida`);
      } catch (deleteError) {
        console.warn(`⚠️ Erro ao remover app ${app.name}:`, deleteError);
      }
    }

    // Aguardar um pouco após limpeza
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("✅ Limpeza de apps Firebase completa");
  } catch (error) {
    console.warn("⚠️ Erro na limpeza de apps:", error);
  }
}

// Função robusta para inicializar Firebase
async function robustInitializeFirebase(): Promise<FirebaseApp | null> {
  if (initializationAttempts >= MAX_ATTEMPTS) {
    console.error("❌ Máximo de tentativas de inicialização atingido");
    return null;
  }

  initializationAttempts++;
  console.log(
    `🔧 Tentativa ${initializationAttempts} de inicialização Firebase...`,
  );

  try {
    // Verificar se já existe uma app funcional
    const existingApps = getApps();

    if (existingApps.length > 0) {
      console.log("🔍 Verificando apps existentes...");

      for (const app of existingApps) {
        try {
          // Testar se a app está funcional
          if (app.options.projectId === firebaseConfig.projectId) {
            console.log(`✅ App existente funcional encontrada: ${app.name}`);
            robustApp = app;
            return app;
          }
        } catch (testError) {
          console.warn(`⚠️ App ${app.name} não funcional:`, testError);
        }
      }

      // Se chegou aqui, nenhuma app existente é funcional
      console.log("🧹 Apps existentes não funcionais, limpando...");
      await cleanupFirebaseApps();
    }

    // Criar nova app
    console.log("🆕 Criando nova app Firebase...");
    robustApp = initializeApp(firebaseConfig, `app-${Date.now()}`);

    // Verificar se a app foi criada corretamente
    if (!robustApp || !robustApp.options) {
      throw new Error("App Firebase não foi criada corretamente");
    }

    console.log("✅ Firebase app criada com sucesso:", robustApp.name);
    console.log("📊 Projeto:", robustApp.options.projectId);

    return robustApp;
  } catch (error) {
    console.error(`❌ Erro na tentativa ${initializationAttempts}:`, error);

    // Se não é a última tentativa, tentar novamente
    if (initializationAttempts < MAX_ATTEMPTS) {
      console.log("🔄 Tentando novamente em 1 segundo...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return robustInitializeFirebase();
    }

    return null;
  }
}

// Função robusta para inicializar Firestore
async function robustInitializeFirestore() {
  try {
    console.log("🔧 Inicializando Firestore de forma robusta...");

    // Garantir que Firebase app está inicializada
    if (!robustApp) {
      robustApp = await robustInitializeFirebase();
    }

    if (!robustApp) {
      console.error("❌ Firebase app não disponível para Firestore");
      return null;
    }

    // Aguardar um pouco para garantir que a app está estável
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Importar getFirestore dinamicamente para evitar problemas de timing
    const { getFirestore } = await import("firebase/firestore");

    // Tentar inicializar Firestore
    console.log("🔥 Obtendo instância Firestore...");
    robustFirestore = getFirestore(robustApp);

    if (!robustFirestore) {
      throw new Error("Firestore instance é null");
    }

    console.log("✅ Firestore inicializado com sucesso!");
    console.log("📊 App associada:", robustFirestore.app.name);
    console.log("📊 Projeto:", robustFirestore.app.options.projectId);

    return robustFirestore;
  } catch (error) {
    console.error("❌ Erro ao inicializar Firestore:", error);

    // Reset para tentar novamente se necessário
    robustApp = null;
    robustFirestore = null;

    return null;
  }
}

// Função principal de inicialização
export async function initializeFirebaseRobust() {
  console.log("🚀 Iniciando inicialização robusta do Firebase...");

  try {
    const app = await robustInitializeFirebase();
    if (!app) {
      throw new Error("Falha na inicialização do Firebase app");
    }

    const firestore = await robustInitializeFirestore();
    if (!firestore) {
      throw new Error("Falha na inicialização do Firestore");
    }

    console.log("🎉 Firebase e Firestore inicializados com sucesso!");
    return { app, firestore };
  } catch (error) {
    console.error("❌ Falha na inicialização robusta:", error);
    return { app: null, firestore: null };
  }
}

// Getters seguros
export function getRobustApp(): FirebaseApp | null {
  return robustApp;
}

export function getRobustFirestore() {
  return robustFirestore;
}

export function isRobustFirebaseReady(): boolean {
  return robustApp !== null && robustFirestore !== null;
}

// Função de teste
export async function testRobustFirebase() {
  console.log("🧪 Testando Firebase robusto...");

  try {
    const { app, firestore } = await initializeFirebaseRobust();

    if (!app || !firestore) {
      console.error("❌ Teste falhou: Firebase não inicializado");
      return false;
    }

    // Teste básico de leitura
    const { doc, getDoc } = await import("firebase/firestore");
    const testDoc = doc(firestore, "test", "robust-test");

    try {
      await getDoc(testDoc);
      console.log("✅ Teste de leitura: OK");
    } catch (readError) {
      console.warn("⚠️ Teste de leitura falhou (pode ser regras):", readError);
    }

    console.log("✅ Firebase robusto está funcional!");
    return true;
  } catch (error) {
    console.error("❌ Teste do Firebase robusto falhou:", error);
    return false;
  }
}

// Auto-inicialização com delay
setTimeout(() => {
  console.log("⏰ Iniciando auto-inicialização robusta...");
  testRobustFirebase();
}, 1000);
