import {
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "./firestoreRestApi";

// Lista específica de duplicados reportados
const KNOWN_DUPLICATES = [
  "1752578821484",
  "1752513775718",
  "1752582282132",
  "1752574634617",
  "1752517424794",
  "1752582282133",
  "1752604451507",
  "1752602368414",
];

export const forceRemoveSpecificDuplicates = async () => {
  console.log("🚨 REMOVENDO DUPLICADOS ESPECÍFICOS REPORTADOS...");
  console.log("🎯 IDs para verificar:", KNOWN_DUPLICATES);

  try {
    // Carregar todas as obras
    const obras = await readFromFirestoreRest("obras");
    console.log(`📊 Total de obras no Firestore: ${obras.length}`);

    let removedCount = 0;
    const removalLog = [];

    // Para cada ID duplicado conhecido
    for (const duplicateId of KNOWN_DUPLICATES) {
      console.log(`🔍 Processando ID: ${duplicateId}`);

      // Encontrar todas as obras com este ID
      const worksWithId = obras.filter((obra) => obra.id === duplicateId);

      if (worksWithId.length <= 1) {
        console.log(
          `✅ ID ${duplicateId}: Apenas ${worksWithId.length} obra(s) - OK`,
        );
        continue;
      }

      console.warn(
        `🚨 ID ${duplicateId}: ${worksWithId.length} duplicados encontrados!`,
      );

      // Ordenar por data de criação para manter o mais antigo
      const sortedWorks = worksWithId.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateA - dateB;
      });

      const keepWork = sortedWorks[0]; // Manter o mais antigo
      const toDelete = sortedWorks.slice(1); // Eliminar o resto

      console.log(
        `📌 Mantendo obra mais antiga: ${keepWork.createdAt || keepWork.updatedAt || "sem data"}`,
      );
      console.log(`🗑️ Eliminando ${toDelete.length} duplicados...`);

      // Eliminar duplicados
      for (const work of toDelete) {
        try {
          console.log(
            `🗑️ Eliminando: ${work.id} (${work.createdAt || work.updatedAt || "sem data"})`,
          );

          const deleted = await deleteFromFirestoreRest("obras", work.id);

          if (deleted) {
            removedCount++;
            removalLog.push({
              id: work.id,
              createdAt: work.createdAt || work.updatedAt,
              status: "ELIMINADO",
            });
            console.log(`✅ ELIMINADO: ${work.id}`);
          } else {
            removalLog.push({
              id: work.id,
              createdAt: work.createdAt || work.updatedAt,
              status: "FALHA",
            });
            console.error(`❌ FALHA ao eliminar: ${work.id}`);
          }

          // Delay para evitar rate limiting
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`❌ ERRO ao eliminar ${work.id}:`, error);
          removalLog.push({
            id: work.id,
            createdAt: work.createdAt || work.updatedAt,
            status: "ERRO",
            error: error.message,
          });
        }
      }
    }

    console.log(`🎉 LIMPEZA ESPECÍFICA CONCLUÍDA!`);
    console.log(`📊 Estatísticas:`);
    console.log(`   - IDs verificados: ${KNOWN_DUPLICATES.length}`);
    console.log(`   - Duplicados removidos: ${removedCount}`);
    console.log(`📋 Log detalhado:`, removalLog);

    if (removedCount > 0) {
      console.log("🔄 Recarregando página em 3 segundos...");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }

    return {
      success: true,
      verified: KNOWN_DUPLICATES.length,
      removed: removedCount,
      log: removalLog,
    };
  } catch (error) {
    console.error("❌ ERRO na remoção específica:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Disponibilizar globalmente
(window as any).forceRemoveSpecificDuplicates = forceRemoveSpecificDuplicates;
(window as any).removeDuplicatesNow = forceRemoveSpecificDuplicates;

console.log("🛠️ FORÇA ESPECÍFICA: Digite 'removeDuplicatesNow()' no console");

// Auto-executar após 2 segundos
setTimeout(() => {
  console.log("🚀 AUTO-EXECUTANDO REMOÇÃO ESPECÍFICA...");
  forceRemoveSpecificDuplicates();
}, 2000);

export default forceRemoveSpecificDuplicates;
