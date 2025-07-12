// Teste automático do Firestore - Passo 3
import {
  testFirebaseFirestore,
  isFirebaseFirestoreAvailable,
} from "../firebase/basicConfig";

export async function runFirestoreTest() {
  console.log("🧪 Teste Firestore - Passo 3");

  try {
    // Verificar se Firestore está disponível
    const isAvailable = isFirebaseFirestoreAvailable();
    console.log("📊 Firestore disponível:", isAvailable ? "Sim" : "Não");

    if (isAvailable) {
      // Executar teste básico
      const testResult = await testFirebaseFirestore();

      if (testResult) {
        console.log("✅ Firestore: Teste bem-sucedido");
        console.log("🎉 Passo 3: Firestore pronto para uso!");
        return true;
      } else {
        console.log("⚠️ Firestore: Teste falhou, usando modo local");
        return false;
      }
    } else {
      console.log("📱 Firestore: Não inicializado, mantendo modo local");
      return false;
    }
  } catch (error) {
    console.warn("⚠️ Erro no teste Firestore:", error);
    console.log("💡 Sistema continua funcional em modo local");
    return false;
  }
}

// Executar teste automaticamente após delay
setTimeout(() => {
  runFirestoreTest();
}, 1500);
