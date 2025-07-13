// Teste das regras de segurança do Firestore
import { getFirebaseFirestore } from "../firebase/firestoreConfig";

export async function testFirestoreSecurityRules() {
  console.log("🔒 Testando regras de segurança do Firestore...");

  const db = getFirebaseFirestore();
  if (!db) {
    console.error("❌ Firestore não está disponível");
    return false;
  }

  try {
    const { doc, getDoc, setDoc } = await import("firebase/firestore");

    // Teste 1: Tentar ler um documento público
    console.log("🔍 Teste 1: Leitura de documento...");
    const testDoc = doc(db, "test", "public");

    try {
      await getDoc(testDoc);
      console.log("✅ Leitura: Permitida");
    } catch (readError: any) {
      console.warn("⚠️ Leitura: Bloqueada -", readError.message);
    }

    // Teste 2: Tentar escrever um documento
    console.log("🔍 Teste 2: Escrita de documento...");
    try {
      await setDoc(testDoc, {
        message: "Teste de escrita",
        timestamp: new Date().toISOString(),
        public: true,
      });
      console.log("✅ Escrita: Permitida");
      return true;
    } catch (writeError: any) {
      console.error("❌ Escrita: Bloqueada -", writeError.message);

      // Verificar se é problema de autenticação
      if (writeError.code === "permission-denied") {
        console.log("🔐 Problema: Regras de segurança requerem autenticação");
        console.log("💡 Solução: Fazer login antes de salvar dados");
        return false;
      }

      // Outros erros
      console.log("🔧 Outros problemas de segurança detectados");
      return false;
    }
  } catch (error: any) {
    console.error("❌ Erro geral no teste:", error);
    return false;
  }
}

// Função para testar após login
export async function testFirestoreWithAuth() {
  console.log("🔐 Testando Firestore com autenticação...");

  const db = getFirebaseFirestore();
  if (!db) {
    return false;
  }

  try {
    const { collection, addDoc } = await import("firebase/firestore");

    // Tentar criar uma obra de teste
    const testWork = {
      title: "Obra de Teste",
      client: "Cliente Teste",
      location: "Teste",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "obras"), testWork);
    console.log("🎉 Obra de teste criada com sucesso:", docRef.id);

    // Limpar teste
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(docRef);
    console.log("🧹 Obra de teste removida");

    return true;
  } catch (error: any) {
    console.error("❌ Erro no teste com autenticação:", error);
    return false;
  }
}
