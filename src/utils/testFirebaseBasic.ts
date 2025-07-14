// Teste simples para verificar se Firebase App está a funcionar (Passo 1)
import { getFirebaseApp, isFirebaseReady } from "../firebase/basicConfig";

export function testFirebaseBasic() {
  // Firebase desativado em desenvolvimento
  if (import.meta.env.DEV) {
    console.log("🚫 Teste Firebase básico desativado em desenvolvimento");
    return false;
  }

  console.log("🧪 Teste Firebase Básico - Passo 1");

  try {
    // Testar se a app está inicializada
    const app = getFirebaseApp();
    const ready = isFirebaseReady();

    if (app && ready) {
      console.log("✅ Firebase App: Inicializada com sucesso");
      console.log("✅ Status: Pronto para próximos passos");

      // Teste mais seguro sem acessar options diretamente
      try {
        if (app.name) {
          console.log("📱 Firebase App Name:", app.name);
        }
      } catch (optionsError) {
        console.log("📱 Firebase App: Dados internos protegidos (normal)");
      }

      return true;
    } else {
      console.warn("⚠️ Firebase App: Não inicializada completamente");
      return false;
    }
  } catch (error) {
    console.warn(
      "⚠️ Teste Firebase: Erro detectado, mas sistema continua funcional",
    );
    console.log(
      "💡 Dica: Firebase pode ter problemas, mas autenticação local funciona",
    );
    return false;
  }
}

// Executar teste automaticamente (apenas em produção)
if (!import.meta.env.DEV) {
  setTimeout(() => {
    testFirebaseBasic();
  }, 1000);
}
