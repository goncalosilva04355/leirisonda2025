// Script de diagnóstico do Firebase
import { getFirebaseApp } from "../firebase/basicConfig";
import {
  getFirebaseFirestore,
  testFirestore,
} from "../firebase/firestoreConfig";

export async function diagnoseFirabaseIssues() {
  console.log("🔍 Iniciando diagnóstico do Firebase...");

  // 1. Verificar Firebase App
  const app = getFirebaseApp();
  if (!app) {
    console.error("❌ Firebase App não está inicializada");
    return { success: false, error: "Firebase App não inicializada" };
  }
  console.log("✅ Firebase App: OK");

  // 2. Verificar Firestore
  const db = getFirebaseFirestore();
  if (!db) {
    console.error("❌ Firestore não está disponível");
    return { success: false, error: "Firestore não disponível" };
  }
  console.log("✅ Firestore Instance: OK");

  // 3. Testar conexão
  const firestoreTest = await testFirestore();
  if (!firestoreTest) {
    console.error("❌ Teste de conexão Firestore falhou");
    return { success: false, error: "Falha na conexão com Firestore" };
  }
  console.log("✅ Firestore Connection: OK");

  // 4. Testar escrita básica
  try {
    const { doc, setDoc } = await import("firebase/firestore");
    const testDoc = doc(db, "diagnostic", "test");
    await setDoc(testDoc, {
      message: "Teste de diagnóstico",
      timestamp: new Date().toISOString(),
    });
    console.log("✅ Firestore Write Test: OK");

    // 5. Testar leitura
    const { getDoc } = await import("firebase/firestore");
    const docSnap = await getDoc(testDoc);
    if (docSnap.exists()) {
      console.log("✅ Firestore Read Test: OK");
      console.log("🎉 Firebase está completamente funcional!");
      return { success: true };
    } else {
      console.error("❌ Documento não foi encontrado após escrita");
      return { success: false, error: "Problema na persistência de dados" };
    }
  } catch (error: any) {
    console.error("❌ Erro nos testes de leitura/escrita:", error);
    return { success: false, error: error.message };
  }
}
