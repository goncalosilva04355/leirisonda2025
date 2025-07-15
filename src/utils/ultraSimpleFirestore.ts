import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";

// Configuração que funciona SEMPRE
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

export const initFirestore = () => {
  if (!app) {
    app = initializeApp(config);
    db = getFirestore(app);
    console.log("✅ Firestore inicializado");
  }
  return db;
};

export const getDB = () => {
  if (!db) {
    initFirestore();
  }
  return db;
};

export const saveUser = async (user: any) => {
  try {
    const database = getDB();
    await setDoc(
      doc(database, "users", user.uid || `user-${Date.now()}`),
      user,
    );
    console.log("✅ Utilizador guardado");
    return true;
  } catch (error) {
    console.error("❌ Erro:", error);
    return false;
  }
};

export const saveData = async (coll: string, data: any) => {
  try {
    const database = getDB();
    const id = data.id || `${coll}-${Date.now()}`;
    await setDoc(doc(database, coll, id), { ...data, id });
    console.log(`✅ ${coll} guardado:`, id);
    return id;
  } catch (error) {
    console.error(`❌ Erro ${coll}:`, error);
    throw error;
  }
};

export const getData = async (coll: string) => {
  try {
    const database = getDB();
    const snapshot = await getDocs(collection(database, coll));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`❌ Erro obter ${coll}:`, error);
    return [];
  }
};

export const deleteData = async (coll: string, id: string) => {
  try {
    const database = getDB();
    await deleteDoc(doc(database, coll, id));
    console.log(`✅ ${coll} eliminado:`, id);
    return true;
  } catch (error) {
    console.error(`❌ Erro eliminar ${coll}:`, error);
    throw error;
  }
};

// Auto-init
setTimeout(() => {
  initFirestore();
  console.log("🚀 UltraSimple Firestore PRONTO");
}, 100);
