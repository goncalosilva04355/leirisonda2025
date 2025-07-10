// Execução automática da migração para demonstração
import { dataMigrationService } from "../services/dataMigrationService";
import { firestoreDataService } from "../services/firestoreDataService";

// Função para executar migração automática
async function runAutoMigrationDemo() {
  // Aguardar um pouco para o Firestore inicializar
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    console.log("🎬 Demo: Iniciando migração automática...");

    // Verificar se Firestore está disponível
    if (!firestoreDataService.isFirestoreAvailable()) {
      console.log("📱 Demo: Firestore não disponível - saltando migração");
      return;
    }

    console.log("🔥 Demo: Firestore disponível - executando migração");

    // Executar migração completa
    await dataMigrationService.runFullMigrationAndTest();

    console.log("🎉 Demo: Migração automática concluída!");
  } catch (error) {
    console.warn("⚠️ Demo: Erro na migração automática:", error);
  }
}

// Executar automaticamente
runAutoMigrationDemo();

export { runAutoMigrationDemo };
