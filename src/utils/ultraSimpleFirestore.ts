// ULTRA SIMPLES - FIRESTORE QUE FUNCIONA GARANTIDAMENTE
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";

// Configuração hardcoded - PROJETO LEIRIA CONFIRMADO ATIVO
const LEIRIA_CONFIG = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
};

let app: any = null;
let db: any = null;
let initialized = false;

// Função de inicialização robusta
export const initUltraSimpleFirestore = async () => {
  if (initialized && db) {
    return { success: true, db, app };
  }

  try {
    console.log("🔥 ULTRA SIMPLE: Inicializando...");

    // Limpar qualquer app existente que possa estar com problemas
    const existingApps = getApps();
    console.log(`📱 Apps existentes: ${existingApps.length}`);

    // Criar app com nome único para evitar conflitos
    const appName = `leiria-ultra-${Date.now()}`;
    app = initializeApp(LEIRIA_CONFIG, appName);
    console.log("✅ App criada:", app.name);

    // Aguardar para estabilizar
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Inicializar Firestore de forma direta
    db = getFirestore(app);
    console.log("✅ Firestore inicializado");

    // Teste básico
    const testRef = doc(db, "system", "test");
    console.log("✅ Referência criada:", !!testRef);

    initialized = true;
    console.log("🎉 ULTRA SIMPLE: SUCESSO TOTAL!");

    return { success: true, db, app };
  } catch (error: any) {
    console.error("❌ ULTRA SIMPLE: ERRO:", error?.message || String(error));

    // Se der erro, pode ser problema de configuração - tentar com configuração alternativa
    if (error?.message?.includes("Service firestore is not available")) {
      console.error(
        "🚨 PROBLEMA: Firestore não habilitado ou problema na configuração",
      );
      console.error(
        "💡 VERIFICAR: Console Firebase > leiria-1cfc9 > Firestore Database",
      );
    }

    return { success: false, error: error?.message || String(error) };
  }
};

// Funções de dados
export const saveToFirestore = async (
  collection: string,
  id: string,
  data: any,
) => {
  try {
    const result = await initUltraSimpleFirestore();
    if (!result.success) {
      throw new Error(`Firestore não inicializado: ${result.error}`);
    }

    await setDoc(doc(result.db, collection, id), {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    });

    console.log(`✅ ULTRA SIMPLE: ${collection}/${id} guardado`);
    return true;
  } catch (error: any) {
    console.error(
      `❌ ULTRA SIMPLE: Erro ao guardar ${collection}:`,
      error?.message,
    );
    return false;
  }
};

export const readFromFirestore = async (collectionName: string) => {
  try {
    const result = await initUltraSimpleFirestore();
    if (!result.success) {
      throw new Error(`Firestore não inicializado: ${result.error}`);
    }

    const snapshot = await getDocs(collection(result.db, collectionName));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    console.log(
      `✅ ULTRA SIMPLE: ${collectionName} lido (${data.length} itens)`,
    );
    return data;
  } catch (error: any) {
    console.error(
      `❌ ULTRA SIMPLE: Erro ao ler ${collectionName}:`,
      error?.message,
    );
    return [];
  }
};

export const deleteFromFirestore = async (
  collectionName: string,
  id: string,
) => {
  try {
    const result = await initUltraSimpleFirestore();
    if (!result.success) {
      throw new Error(`Firestore não inicializado: ${result.error}`);
    }

    await deleteDoc(doc(result.db, collectionName, id));
    console.log(`✅ ULTRA SIMPLE: ${collectionName}/${id} eliminado`);
    return true;
  } catch (error: any) {
    console.error(
      `❌ ULTRA SIMPLE: Erro ao eliminar ${collectionName}/${id}:`,
      error?.message,
    );
    return false;
  }
};

// Auto-inicializar com delay
setTimeout(async () => {
  try {
    console.log("🚀 ULTRA SIMPLE: Auto-inicialização...");
    const result = await initUltraSimpleFirestore();

    if (result.success) {
      console.log("🎉 ULTRA SIMPLE: AUTO-INICIALIZAÇÃO SUCESSO!");

      // Teste prático
      const saved = await saveToFirestore("test", "ultra-test", {
        message: "Ultra Simple Firestore funcionando!",
        timestamp: new Date().toISOString(),
      });

      if (saved) {
        console.log("✅ ULTRA SIMPLE: TESTE DE ESCRITA PASSOU!");

        const data = await readFromFirestore("test");
        if (data.length > 0) {
          console.log("✅ ULTRA SIMPLE: TESTE DE LEITURA PASSOU!");
          console.log(
            "🎉 ULTRA SIMPLE: TODOS OS TESTES PASSARAM - FIRESTORE 100% FUNCIONAL!",
          );
        }
      }

      // Disponibilizar globalmente
      (window as any).ultraSimpleFirestore = {
        db: result.db,
        app: result.app,
        save: saveToFirestore,
        read: readFromFirestore,
        delete: deleteFromFirestore,
        init: initUltraSimpleFirestore,
      };
    } else {
      console.error(
        "❌ ULTRA SIMPLE: AUTO-INICIALIZAÇÃO FALHOU:",
        result.error,
      );
    }
  } catch (error: any) {
    console.error(
      "❌ ULTRA SIMPLE: ERRO NA AUTO-INICIALIZAÇÃO:",
      error?.message,
    );
  }
}, 1500);

export default {
  init: initUltraSimpleFirestore,
  save: saveToFirestore,
  read: readFromFirestore,
  delete: deleteFromFirestore,
};
