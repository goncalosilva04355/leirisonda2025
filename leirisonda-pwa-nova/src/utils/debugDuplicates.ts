import { readFromFirestoreRest } from "./firestoreRestApi";

export const debugDuplicateStatus = async () => {
  console.log("🔍 VERIFICANDO STATUS DOS DUPLICADOS...");

  try {
    // Carregar todas as obras do Firestore
    const obras = await readFromFirestoreRest("obras");
    console.log(`📊 Total de obras no Firestore: ${obras.length}`);

    // Verificar duplicados
    const ids = obras.map((obra) => obra.id);
    const uniqueIds = new Set(ids);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    const uniqueDuplicates = [...new Set(duplicates)];

    console.log(`🆔 IDs únicos: ${uniqueIds.size}`);
    console.log(`🔄 Total de duplicados encontrados: ${duplicates.length}`);

    if (uniqueDuplicates.length > 0) {
      console.error("🚨 IDs DUPLICADOS ENCONTRADOS:", uniqueDuplicates);

      // Mostrar detalhes de cada duplicado
      uniqueDuplicates.forEach((duplicateId) => {
        const duplicateWorks = obras.filter((obra) => obra.id === duplicateId);
        console.warn(
          `🚨 ID ${duplicateId}:`,
          duplicateWorks.map((w) => ({
            id: w.id,
            createdAt: w.createdAt,
            updatedAt: w.updatedAt,
            title: w.title || w.workType || "sem título",
          })),
        );
      });

      return {
        total: obras.length,
        unique: uniqueIds.size,
        duplicates: uniqueDuplicates,
        duplicateCount: duplicates.length,
        hasDuplicates: true,
      };
    } else {
      console.log("✅ NENHUM DUPLICADO ENCONTRADO!");
      return {
        total: obras.length,
        unique: uniqueIds.size,
        duplicates: [],
        duplicateCount: 0,
        hasDuplicates: false,
      };
    }
  } catch (error) {
    console.error("❌ Erro ao verificar duplicados:", error);
    return { error: error.message };
  }
};

// Disponibilizar globalmente
(window as any).debugDuplicates = debugDuplicateStatus;

console.log(
  "🛠️ DEBUG: Digite 'debugDuplicates()' no console para verificar duplicados",
);

// Auto-verificar após 3 segundos
setTimeout(() => {
  console.log("🔍 Auto-verificação de duplicados iniciando...");
  debugDuplicateStatus();
}, 3000);
