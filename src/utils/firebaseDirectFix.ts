// Correção direta do problema "Firestore não inicializado"
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Configuração exata do projeto leiria-1cfc9
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

console.log("🔧 FIREBASE DIRECT FIX: Iniciando correção...");

// Inicialização forçada
let fixedApp;
let fixedFirestore;

try {
  // Limpar apps existentes se necessário
  const existingApps = getApps();
  console.log(`📱 Apps existentes: ${existingApps.length}`);

  if (existingApps.length > 0) {
    fixedApp = existingApps[0];
    console.log("✅ Usando app Firebase existente");
  } else {
    fixedApp = initializeApp(firebaseConfig);
    console.log("✅ Nova app Firebase criada");
  }

  // Inicializar Firestore
  fixedFirestore = getFirestore(fixedApp);
  console.log("✅ FIRESTORE INICIALIZADO COM SUCESSO!");
  console.log("📊 Projeto:", fixedFirestore.app.options.projectId);

  // Testar conexão básica
  setTimeout(async () => {
    try {
      const { doc, getDoc } = await import("firebase/firestore");
      const testDoc = doc(fixedFirestore, "test", "connection");

      const docSnap = await getDoc(testDoc);
      console.log("✅ Teste de conexão Firestore: OK");

      if (docSnap.exists()) {
        console.log("📄 Documento de teste encontrado");
      } else {
        console.log("📄 Documento de teste não encontrado (normal)");
      }
    } catch (testError) {
      console.warn("⚠️ Teste de conexão falhou:", testError);
      console.log("💡 Pode ser problema de regras de segurança do Firestore");
      console.log("💡 Verifica se as regras permitem leitura/escrita");
    }
  }, 1000);
} catch (error) {
  console.error("❌ ERRO NA CORREÇÃO FIREBASE:", error);
}

// Exportar instâncias corrigidas
export { fixedApp as app, fixedFirestore as db };
export const isReady = () => fixedFirestore !== null;

// Função para verificar estado
export function checkFirebaseStatus() {
  console.log("🔍 ESTADO FIREBASE:");
  console.log("App:", fixedApp ? "✅ OK" : "❌ ERRO");
  console.log("Firestore:", fixedFirestore ? "✅ OK" : "❌ ERRO");

  if (fixedFirestore) {
    console.log("📊 Projeto ID:", fixedFirestore.app.options.projectId);
  }

  return {
    app: !!fixedApp,
    firestore: !!fixedFirestore,
    projectId: fixedFirestore?.app.options.projectId,
  };
}

// Auto-verificação
setTimeout(() => {
  console.log("🔍 Auto-verificação Firebase:");
  checkFirebaseStatus();
}, 2000);
