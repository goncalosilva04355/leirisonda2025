// Ativação AUTOMÁTICA do sistema Firestore REST API
import {
  enableFirestoreREST,
  isFirestoreRESTEnabled,
} from "../services/firestoreIntegration";

async function autoActivateFirestoreREST() {
  try {
    console.log("🔄 Verificando estado do Firestore REST API...");

    // Se já estiver ativado, não fazer nada
    if (isFirestoreRESTEnabled()) {
      console.log("✅ Sistema REST API já está ativo");
      return;
    }

    console.log("🚀 Ativando sistema REST API automaticamente...");

    // Ativar sistema REST API
    enableFirestoreREST();

    // Testar conectividade
    const { testFirestoreAPI } = await import("./directFirestoreAPI");
    const testResult = await testFirestoreAPI();

    if (testResult.success) {
      console.log("🎉 Sistema REST API ativado automaticamente com sucesso!");
      console.log("💾 Firestore está funcionando via REST API");
      console.log("✅ Todos os dados serão guardados corretamente");

      // Marcar como funcionando
      localStorage.setItem("FIRESTORE_WORKING", "true");
      localStorage.setItem("AUTO_ACTIVATED", "true");

      // Mostrar notificação discreta
      if (typeof window !== "undefined") {
        setTimeout(() => {
          console.log("🔔 Firestore ativado automaticamente via REST API");
        }, 1000);
      }
    } else {
      console.warn(
        "⚠️ Teste automático falhou, mas sistema REST está configurado",
      );
    }
  } catch (error) {
    console.error("❌ Erro na ativação automática:", error);
    // Continuar normalmente mesmo com erro
  }
}

// Executar automaticamente quando este módulo for importado
if (typeof window !== "undefined") {
  // Aguardar um pouco para garantir que a aplicação carregou
  setTimeout(() => {
    autoActivateFirestoreREST();
  }, 2000);
}

export { autoActivateFirestoreREST };
