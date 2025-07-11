import { getDB, getFirebaseAuth, getFirebaseApp } from "../firebase";

export function testFirebaseUnico() {
  console.log("🧪 Testando Firebase único centralizado...");

  try {
    // Testar Firebase App
    const app = getFirebaseApp();
    console.log("✅ Firebase App:", app ? "Inicializada" : "❌ Falhou");

    // Testar Firestore
    const db = getDB();
    console.log("✅ Firestore:", db ? "Conectado" : "❌ Falhou");

    // Testar Auth
    const auth = getFirebaseAuth();
    console.log("✅ Auth:", auth ? "Pronto" : "❌ Falhou");

    if (app && db && auth) {
      console.log("🎉 Firebase único está totalmente funcional!");
      return true;
    } else {
      console.warn("⚠️ Alguns serviços Firebase falharam");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste Firebase único:", error);
    return false;
  }
}

// Executar teste após 2 segundos
setTimeout(testFirebaseUnico, 2000);
