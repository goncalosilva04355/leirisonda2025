// Teste simples do Firebase Leiria
import {
  getFirebaseFirestore,
  isFirestoreReady,
} from "../firebase/leiriaConfig";

export function testFirebaseLeiria() {
  console.log("🧪 Testando Firebase Leiria...");

  try {
    const db = getFirebaseFirestore();
    const ready = isFirestoreReady();

    console.log(
      "Firebase Leiria - Firestore:",
      db ? "✅ Disponível" : "❌ Indisponível",
    );
    console.log(
      "Firebase Leiria - Ready:",
      ready ? "✅ Pronto" : "❌ Não pronto",
    );

    if (db && ready) {
      console.log("🎉 Firebase Leiria funcionando corretamente!");
      return true;
    } else {
      console.log("⚠️ Firebase Leiria com problemas - usando modo offline");
      return false;
    }
  } catch (error) {
    console.warn("❌ Erro no teste Firebase Leiria:", error);
    return false;
  }
}

// Auto-executar teste após 1 segundo
setTimeout(() => {
  testFirebaseLeiria();
}, 1000);
