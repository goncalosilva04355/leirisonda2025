import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  connectFirestoreEmulator,
} from "firebase/firestore";

// Configuração que DEVE funcionar
const config = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
};

let app: any = null;
let db: any = null;
let isReady = false;

export const forceInitFirestore = async (): Promise<any> => {
  if (isReady && db) {
    return db;
  }

  try {
    console.log("🔥 FORÇA FIRESTORE: Inicializando...");

    // Limpar apps existentes se houver problema
    const existingApps = getApps();
    if (existingApps.length > 0) {
      console.log("🔄 Apps existentes encontradas:", existingApps.length);
    }

    // Inicializar app
    if (existingApps.length === 0) {
      app = initializeApp(config);
      console.log("✅ Firebase App criada:", app.name);
    } else {
      app = existingApps[0];
      console.log("✅ Usando Firebase App existente:", app.name);
    }

    // Aguardar um pouco para garantir inicialização
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Inicializar Firestore
    console.log("💾 Inicializando Firestore...");
    db = getFirestore(app);

    // Aguardar mais um pouco
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("✅ Firestore inicializado:", typeof db);
    console.log("📊 App options:", {
      projectId: app.options.projectId,
      authDomain: app.options.authDomain,
    });

    isReady = true;
    return db;
  } catch (error: any) {
    console.error("❌ FORÇA FIRESTORE: Erro:", error?.message || String(error));
    console.error("🔍 Detalhes do erro:", {
      message: error?.message || "Mensagem não disponível",
      code: error?.code || "Código não disponível",
      name: error?.name || "Nome não disponível",
      toString: String(error),
    });

    // Se der erro, tentar uma segunda vez com delay maior
    console.log("🔄 Segunda tentativa...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      if (!app) {
        app = initializeApp(config, `app-${Date.now()}`);
      }
      db = getFirestore(app);
      isReady = true;
      console.log("✅ Segunda tentativa bem-sucedida");
      return db;
    } catch (error2: any) {
      console.error(
        "❌ Segunda tentativa falhou:",
        error2?.message || String(error2),
      );
      console.error("🔍 Error detalhado:", error2);
      throw error2;
    }
  }
};

export const saveUser = async (user: any): Promise<boolean> => {
  try {
    const database = await forceInitFirestore();
    const userId = user.uid || user.id || `user-${Date.now()}`;

    await setDoc(doc(database, "users", userId), {
      ...user,
      uid: userId,
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Utilizador guardado no Firestore:", user.email);
    return true;
  } catch (error: any) {
    console.error(
      "❌ Erro ao guardar utilizador:",
      error?.message || String(error),
    );
    console.error("🔍 Detalhes:", error);
    return false;
  }
};

export const saveData = async (coll: string, data: any): Promise<string> => {
  const database = await forceInitFirestore();
  const id = data.id || `${coll}-${Date.now()}`;

  await setDoc(doc(database, coll, id), {
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  });

  console.log(`✅ ${coll} guardado no Firestore:`, id);
  return id;
};

export const getData = async (coll: string): Promise<any[]> => {
  const database = await forceInitFirestore();
  const snapshot = await getDocs(collection(database, coll));
  const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log(`✅ ${coll} obtido do Firestore:`, results.length);
  return results;
};

export const deleteData = async (
  coll: string,
  id: string,
): Promise<boolean> => {
  const database = await forceInitFirestore();
  await deleteDoc(doc(database, coll, id));
  console.log(`✅ ${coll} eliminado do Firestore:`, id);
  return true;
};

// Inicializar imediatamente
// DESABILITADO - usando REST API
// setTimeout(async () => {
//   try {
//     await forceInitFirestore();
//     console.log("🎉 FORÇA FIRESTORE: Pronto para uso!");

//     // Disponibilizar globalmente
//     (window as any).forceFirestore = {
//       db,
//       app,
//       saveUser,
//       saveData,
//       getData,
//       deleteData,
//       isReady: () => isReady,
//     };
//   } catch (error: any) {
//     console.error(
//       "❌ FORÇA FIRESTORE: Falha na inicialização:",
//       error?.message || String(error),
//     );
//     console.error("🔍 Erro completo:", error);
//   }
// }, 500);
console.log("🚫 ForceFirestore: DESABILITADO - usando REST API");

export default { saveUser, saveData, getData, deleteData };
