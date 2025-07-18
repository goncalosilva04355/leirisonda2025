import {
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "./firestoreRestApi";

const TARGET_DUPLICATES = [
  "1752578821484",
  "1752513775718",
  "1752582282132",
  "1752574634617",
  "1752517424794",
  "1752582282133",
  "1752604451507",
  "1752602368414",
];

let cleanupInterval: NodeJS.Timeout | null = null;
let cleanupAttempts = 0;
const MAX_ATTEMPTS = 20; // Máximo 20 tentativas (200 segundos)

const checkAndCleanDuplicates = async () => {
  cleanupAttempts++;
  console.log(`🔄 VERIFICAÇÃO CONTÍNUA #${cleanupAttempts}/${MAX_ATTEMPTS}`);

  try {
    const obras = await readFromFirestoreRest("obras");
    const foundDuplicates = [];

    // Verificar cada ID alvo
    TARGET_DUPLICATES.forEach((targetId) => {
      const instances = obras.filter((obra) => obra.id === targetId);
      if (instances.length > 1) {
        foundDuplicates.push({
          id: targetId,
          count: instances.length,
          instances,
        });
      }
    });

    if (foundDuplicates.length === 0) {
      console.log("✅ SUCESSO! Todos os duplicados foram eliminados!");
      stopContinuousCleanup();
      return true;
    }

    console.warn(
      `🚨 Ainda existem ${foundDuplicates.length} IDs com duplicados`,
    );

    // Eliminar duplicados encontrados
    for (const duplicate of foundDuplicates) {
      console.log(
        `🗑️ Eliminando duplicados de ${duplicate.id} (${duplicate.count} instâncias)`,
      );

      // Ordenar por data e manter o mais antigo
      const sorted = duplicate.instances.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateA - dateB;
      });

      // Eliminar todas as instâncias exceto a primeira
      for (let i = 1; i < sorted.length; i++) {
        try {
          console.log(`   🗑️ Eliminando instância ${i} de ${duplicate.id}`);
          await deleteFromFirestoreRest("obras", duplicate.id);
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`   ❌ Erro ao eliminar instância ${i}:`, error);
        }
      }
    }

    if (cleanupAttempts >= MAX_ATTEMPTS) {
      console.error(
        "❌ MÁXIMO DE TENTATIVAS ATINGIDO - Parando limpeza contínua",
      );
      stopContinuousCleanup();
      return false;
    }

    return false;
  } catch (error) {
    console.error("❌ Erro na verificação contínua:", error);
    return false;
  }
};

const startContinuousCleanup = () => {
  if (cleanupInterval) {
    console.log("🔄 Limpeza contínua já está ativa");
    return;
  }

  console.log("🚀 INICIANDO LIMPEZA CONTÍNUA (a cada 10 segundos)");

  // Executar imediatamente
  checkAndCleanDuplicates();

  // Configurar interval
  cleanupInterval = setInterval(checkAndCleanDuplicates, 10000);
};

const stopContinuousCleanup = () => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    console.log("⏹️ Limpeza contínua parada");
  }
};

// Auto-iniciar após 2 segundos
setTimeout(() => {
  console.log("🔄 Iniciando limpeza contínua automática...");
  startContinuousCleanup();
}, 2000);

// Disponibilizar globalmente
(window as any).startContinuousCleanup = startContinuousCleanup;
(window as any).stopContinuousCleanup = stopContinuousCleanup;
(window as any).checkAndCleanDuplicates = checkAndCleanDuplicates;

console.log("🔄 COMANDOS:");
console.log("   startContinuousCleanup() - Iniciar limpeza contínua");
console.log("   stopContinuousCleanup() - Parar limpeza contínua");

export {
  startContinuousCleanup,
  stopContinuousCleanup,
  checkAndCleanDuplicates,
};
export default startContinuousCleanup;
