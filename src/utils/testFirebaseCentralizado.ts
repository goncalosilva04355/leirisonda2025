import {
  getDB,
  getFirebaseAuth,
  isFirebaseReady,
  isFirestoreReady,
} from "../firebase";

export function testFirebaseCentralizado() {
  console.log("🧪 Testando Firebase centralizado...");

  try {
    // Testar inicialização
    const ready = isFirebaseReady();
    console.log("✅ Firebase App:", ready ? "OK" : "❌");

    // Testar Firestore
    const db = getDB();
    const firestoreReady = isFirestoreReady();
    console.log("✅ Firestore:", db && firestoreReady ? "OK" : "❌");

    // Testar Auth
    const auth = getFirebaseAuth();
    console.log("✅ Auth:", auth ? "OK" : "❌");

    console.log("🎉 Teste Firebase centralizado concluído!");
    return true;
  } catch (error) {
    console.error("❌ Erro no teste Firebase:", error);
    return false;
  }
}

// Executar teste automaticamente
setTimeout(testFirebaseCentralizado, 2000);
