// Teste DIRETO de escrita no Firestore
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { getFirestoreDB } from "../firebase/simpleFirestore";

export async function testDirectWrite(): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  console.log("🧪 Teste direto de escrita no Firestore...");

  // Obter instância do Firestore assincronamente
  const firestoreDB = await getFirestoreDB();

  if (!firestoreDB) {
    return {
      success: false,
      message:
        "Firestore não conseguiu ser inicializado - verifique se está habilitado no Firebase Console",
    };
  }

  try {
    // Tentar escrever documento
    const testDoc = doc(firestoreDB, "test-direct", "write-test");
    const testData = {
      message: "Teste direto funcionou!",
      timestamp: serverTimestamp(),
      user: "Gonçalo Fonseca",
      test: true,
    };

    console.log("📝 Escrevendo documento...", testData);
    await setDoc(testDoc, testData);
    console.log("✅ Documento escrito com sucesso");

    // Tentar ler documento
    console.log("📖 Lendo documento...");
    const docSnap = await getDoc(testDoc);

    if (docSnap.exists()) {
      const readData = docSnap.data();
      console.log("✅ Documento lido com sucesso:", readData);

      return {
        success: true,
        message: "Firestore funcionando perfeitamente!",
        data: {
          written: testData,
          read: readData,
          timestamp: new Date().toISOString(),
        },
      };
    } else {
      return {
        success: false,
        message: "Documento foi escrito mas não pode ser lido",
      };
    }
  } catch (error: any) {
    console.error("❌ Erro no teste direto:", error);
    return {
      success: false,
      message: `Erro: ${error.message}`,
      data: { error: error.code, stack: error.stack },
    };
  }
}
