// Teste simples do Firestore limpo
import { db } from "../firebase/cleanFirestore";
import { collection, getDocs } from "firebase/firestore";

setTimeout(async () => {
  try {
    if (!db) {
      console.log("❌ Firestore não disponível");
      return;
    }

    const snapshot = await getDocs(collection(db, "test"));
    console.log("✅ Firestore funcionando:", snapshot.size, "documentos");
  } catch (error) {
    console.log("❌ Firestore erro:", error.message || error);
  }
}, 3000);
