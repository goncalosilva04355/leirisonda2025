// Teste simples para verificar se Firebase App está a funcionar (Passo 1)
import { getFirebaseApp, isFirebaseReady } from "../firebase/basicConfig";

export function testFirebaseBasic() {
  console.log("🧪 Teste Firebase Básico - Passo 1");

  try {
    // Testar se a app está inicializada
    const app = getFirebaseApp();
    const ready = isFirebaseReady();

    if (app && ready) {
      console.log("✅ Firebase App: Inicializada com sucesso");
      console.log("📱 Project ID:", app.options.projectId);
      console.log("🔑 API Key:", app.options.apiKey ? "Presente" : "Ausente");
      return true;
    } else {
      console.error("❌ Firebase App: Não inicializada");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro no teste Firebase:", error);
    return false;
  }
}

// Executar teste automaticamente
setTimeout(() => {
  testFirebaseBasic();
}, 1000);
