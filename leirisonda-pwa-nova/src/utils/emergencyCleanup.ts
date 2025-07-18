import {
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "./firestoreRestApi";

export const emergencyCleanup = async () => {
  console.log("🚨 EMERGÊNCIA: LIMPEZA TOTAL DE DUPLICADOS INICIADA!");

  const targetIds = [
    "1752578821484",
    "1752513775718",
    "1752582282132",
    "1752574634617",
    "1752517424794",
    "1752582282133",
    "1752604451507",
    "1752602368414",
  ];

  console.log("🎯 IDs alvo para remoção:", targetIds);

  try {
    const obras = await readFromFirestoreRest("obras");
    console.log(`📊 Carregadas ${obras.length} obras`);

    let totalDeleted = 0;
    const deleteLog = [];

    for (const targetId of targetIds) {
      console.log(`\n🔍 Processando ID: ${targetId}`);

      // Encontrar todas as instâncias
      const instances = obras.filter((obra) => obra.id === targetId);
      console.log(`   Encontradas ${instances.length} instâncias`);

      if (instances.length <= 1) {
        console.log(`   ✅ OK - Apenas ${instances.length} instância(s)`);
        continue;
      }

      // Ordenar por data
      const sorted = instances.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateA - dateB;
      });

      console.log(`   📌 Mantendo: ${sorted[0].createdAt || "sem data"}`);
      console.log(`   🗑️ Removendo ${sorted.length - 1} duplicados...`);

      // Remover todos exceto o primeiro (mais antigo)
      for (let i = 1; i < sorted.length; i++) {
        const toDelete = sorted[i];
        console.log(`      🗑️ Removendo: ${toDelete.createdAt || "sem data"}`);

        try {
          const success = await deleteFromFirestoreRest("obras", targetId);
          if (success) {
            totalDeleted++;
            deleteLog.push({
              id: targetId,
              instance: i,
              date: toDelete.createdAt || toDelete.updatedAt,
              status: "SUCESSO",
            });
            console.log(`      ✅ REMOVIDO com sucesso`);
          } else {
            deleteLog.push({
              id: targetId,
              instance: i,
              date: toDelete.createdAt || toDelete.updatedAt,
              status: "FALHA",
            });
            console.log(`      ❌ FALHA na remoção`);
          }

          // Delay entre deletes
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`      ❌ ERRO:`, error);
          deleteLog.push({
            id: targetId,
            instance: i,
            date: toDelete.createdAt || toDelete.updatedAt,
            status: "ERRO",
            error: error.message,
          });
        }
      }
    }

    console.log(`\n🎉 EMERGÊNCIA CONCLUÍDA:`);
    console.log(`   Total removido: ${totalDeleted}`);
    console.log(`   Log detalhado:`, deleteLog);

    if (totalDeleted > 0) {
      console.log("🔄 Recarregando página em 3 segundos...");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }

    return {
      success: true,
      deleted: totalDeleted,
      log: deleteLog,
    };
  } catch (error) {
    console.error("❌ ERRO na limpeza de emergência:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Disponibilizar globalmente
(window as any).emergencyCleanup = emergencyCleanup;
(window as any).EMERGENCY_CLEANUP = emergencyCleanup;

console.log("🚨 EMERGÊNCIA: Digite 'EMERGENCY_CLEANUP()' para limpeza total");

export default emergencyCleanup;
