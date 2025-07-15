import {
  getFirebaseFirestoreAsync,
  forceFirestoreInit,
} from "../firebase/firestoreConfig";

/**
 * Força a inicialização do Firestore logo no início da aplicação
 */
export const initializeFirestoreEarly = async () => {
  console.log("🚀 INICIALIZAÇÃO FORÇADA: Garantindo que Firestore está pronto");

  try {
    // 1. Tentar inicialização forçada
    console.log("💪 Tentando inicialização forçada...");
    const forceResult = await forceFirestoreInit();
    console.log("💪 Resultado da inicialização forçada:", forceResult);

    // 2. Aguardar um pouco e tentar obter instância
    console.log("⏳ Aguardando 2 segundos...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3. Tentar obter instância
    console.log("🔍 Tentando obter instância do Firestore...");
    const db = await getFirebaseFirestoreAsync();

    if (db) {
      console.log("✅ SUCESSO: Firestore está inicializado e pronto!");

      // 4. Teste básico de conectividade
      try {
        console.log("🧪 Teste básico de conectividade...");
        const { doc, getDoc } = await import("firebase/firestore");
        const testRef = doc(db, "__test__", "connectivity");
        await getDoc(testRef); // Não importa se o documento existe ou não
        console.log("✅ Conectividade confirmada!");
      } catch (connectError: any) {
        console.warn("⚠️ Teste de conectividade falhou:", connectError.message);
      }
    } else {
      console.error("❌ FALHA: Firestore ainda não está disponível");
    }
  } catch (error: any) {
    console.error("❌ Erro na inicialização forçada:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};

// Executar imediatamente quando o módulo é carregado
if (typeof window !== "undefined") {
  // Executar assim que possível
  setTimeout(() => {
    initializeFirestoreEarly();
  }, 100);
}

export default initializeFirestoreEarly;
