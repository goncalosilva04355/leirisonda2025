import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";

// Sistema híbrido: Firestore se disponível, localStorage caso contrário
let useFirestore = false;
let db: any = null;

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

const initStorage = async () => {
  try {
    console.log("🔄 Tentando inicializar Firestore...");
    const app = initializeApp(config);
    db = getFirestore(app);

    // Teste rápido para ver se Firestore funciona
    await getDocs(collection(db, "__test__"));
    useFirestore = true;
    console.log("✅ Firestore disponível e funcionando");
  } catch (error: any) {
    console.warn(
      "⚠️ Firestore não disponível, usando localStorage:",
      error.message,
    );
    useFirestore = false;
    db = null;
  }
};

// Funções que funcionam sempre
export const saveUser = async (user: any): Promise<boolean> => {
  try {
    if (useFirestore && db) {
      await setDoc(doc(db, "users", user.uid || `user-${Date.now()}`), user);
      console.log("✅ Utilizador guardado no Firestore");
    } else {
      // Fallback para localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingIndex = users.findIndex((u: any) => u.uid === user.uid);
      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem("users", JSON.stringify(users));
      console.log("✅ Utilizador guardado no localStorage");
    }
    return true;
  } catch (error) {
    console.error("❌ Erro ao guardar utilizador:", error);
    return false;
  }
};

export const saveData = async (coll: string, data: any): Promise<string> => {
  const id = data.id || `${coll}-${Date.now()}`;
  const dataWithId = { ...data, id, updatedAt: new Date().toISOString() };

  try {
    if (useFirestore && db) {
      await setDoc(doc(db, coll, id), dataWithId);
      console.log(`✅ ${coll} guardado no Firestore:`, id);
    } else {
      // Fallback para localStorage
      const items = JSON.parse(localStorage.getItem(coll) || "[]");
      const existingIndex = items.findIndex((item: any) => item.id === id);
      if (existingIndex >= 0) {
        items[existingIndex] = dataWithId;
      } else {
        items.push(dataWithId);
      }
      localStorage.setItem(coll, JSON.stringify(items));
      console.log(`✅ ${coll} guardado no localStorage:`, id);
    }
    return id;
  } catch (error) {
    console.error(`❌ Erro ao guardar ${coll}:`, error);
    throw error;
  }
};

export const getData = async (coll: string): Promise<any[]> => {
  try {
    if (useFirestore && db) {
      const snapshot = await getDocs(collection(db, coll));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(`✅ ${coll} obtido do Firestore:`, data.length);
      return data;
    } else {
      // Fallback para localStorage
      const data = JSON.parse(localStorage.getItem(coll) || "[]");
      console.log(`✅ ${coll} obtido do localStorage:`, data.length);
      return data;
    }
  } catch (error) {
    console.error(`❌ Erro ao obter ${coll}:`, error);
    return [];
  }
};

export const deleteData = async (
  coll: string,
  id: string,
): Promise<boolean> => {
  try {
    if (useFirestore && db) {
      await deleteDoc(doc(db, coll, id));
      console.log(`✅ ${coll} eliminado do Firestore:`, id);
    } else {
      // Fallback para localStorage
      const items = JSON.parse(localStorage.getItem(coll) || "[]");
      const filtered = items.filter((item: any) => item.id !== id);
      localStorage.setItem(coll, JSON.stringify(filtered));
      console.log(`✅ ${coll} eliminado do localStorage:`, id);
    }
    return true;
  } catch (error) {
    console.error(`❌ Erro ao eliminar ${coll}:`, error);
    throw error;
  }
};

export const getStorageStatus = () => {
  return {
    usingFirestore: useFirestore,
    hasDB: !!db,
    mode: useFirestore ? "Firestore" : "localStorage",
  };
};

// Auto-inicializar
setTimeout(async () => {
  await initStorage();
  const status = getStorageStatus();
  console.log(`🚀 Storage inicializado: ${status.mode}`);

  // Disponibilizar globalmente
  (window as any).storageStatus = status;
  (window as any).hybridStorage = {
    saveUser,
    saveData,
    getData,
    deleteData,
    getStorageStatus,
  };
}, 200);

export default { saveUser, saveData, getData, deleteData, getStorageStatus };
