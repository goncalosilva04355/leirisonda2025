import { readFromFirestoreRest } from "./firestoreRestApi";

export const reportDuplicatesOnly = async () => {
  console.log(
    "🔍 RELATÓRIO SIMPLES DE DUPLICADOS - Apenas verificação, sem eliminação",
  );

  try {
    const obras = await readFromFirestoreRest("obras");
    console.log(`📊 Total de obras carregadas: ${obras.length}`);

    const idCounts = new Map<string, number>();
    const duplicateIds: string[] = [];

    // Contar IDs
    obras.forEach((obra) => {
      if (obra.id) {
        const count = idCounts.get(obra.id) || 0;
        idCounts.set(obra.id, count + 1);
      }
    });

    // Identificar duplicados
    idCounts.forEach((count, id) => {
      if (count > 1) {
        duplicateIds.push(id);
      }
    });

    if (duplicateIds.length > 0) {
      console.warn(`🚨 DUPLICADOS ENCONTRADOS: ${duplicateIds.join(",")}`);
      console.log("📝 Para eliminar manualmente, acesse o Firebase Console");
      console.log(
        "🔗 https://console.firebase.google.com/project/leiria-1cfc9/firestore/databases/-default-/data/~2Fobras",
      );

      return {
        hasDuplicates: true,
        duplicateIds,
        total: obras.length,
        uniqueCount: idCounts.size,
      };
    } else {
      console.log("✅ NENHUM DUPLICADO ENCONTRADO!");
      return {
        hasDuplicates: false,
        duplicateIds: [],
        total: obras.length,
        uniqueCount: idCounts.size,
      };
    }
  } catch (error) {
    console.error("❌ Erro ao verificar duplicados:", error);
    return { error: error.message };
  }
};

// Disponibilizar globalmente para verificação manual
(window as any).reportDuplicatesOnly = reportDuplicatesOnly;

console.log(
  "🔍 RELATÓRIO: Digite 'reportDuplicatesOnly()' no console para verificar duplicados",
);

export default reportDuplicatesOnly;
