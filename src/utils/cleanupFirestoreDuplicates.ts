import {
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "./firestoreRestApi";

export const cleanupFirestoreDuplicates = async () => {
  console.log("🧹 Iniciando limpeza de duplicados no Firestore...");

  try {
    // Carregar todas as obras
    const obras = await readFromFirestoreRest("obras");
    console.log(`📊 Total de obras encontradas: ${obras.length}`);

    // Identificar duplicados
    const seenIds = new Set();
    const duplicates: any[] = [];
    const unique: any[] = [];

    obras.forEach((obra) => {
      if (seenIds.has(obra.id)) {
        duplicates.push(obra);
        console.warn(`🚨 Duplicado encontrado: ${obra.id}`);
      } else {
        seenIds.add(obra.id);
        unique.push(obra);
      }
    });

    console.log(`📈 Estatísticas:
    - Total: ${obras.length}
    - Únicos: ${unique.length}
    - Duplicados: ${duplicates.length}`);

    if (duplicates.length === 0) {
      console.log("✅ Nenhum duplicado encontrado!");
      return { success: true, cleaned: 0 };
    }

    // Eliminar duplicados
    console.log(`🗑️ Eliminando ${duplicates.length} duplicados...`);
    let cleaned = 0;

    for (const duplicate of duplicates) {
      try {
        const deleted = await deleteFromFirestoreRest("obras", duplicate.id);
        if (deleted) {
          cleaned++;
          console.log(`✅ Eliminado: ${duplicate.id}`);
        } else {
          console.warn(`⚠️ Falha ao eliminar: ${duplicate.id}`);
        }
      } catch (error) {
        console.error(`❌ Erro ao eliminar ${duplicate.id}:`, error);
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log(
      `🎉 Limpeza concluída! ${cleaned}/${duplicates.length} duplicados eliminados`,
    );

    return {
      success: true,
      cleaned,
      total: obras.length,
      duplicates: duplicates.length,
      remaining: unique.length,
    };
  } catch (error) {
    console.error("❌ Erro na limpeza de duplicados:", error);
    return { success: false, error: error.message };
  }
};

// Auto-execute cleanup on import (only once)
let cleanupExecuted = false;
if (!cleanupExecuted && typeof window !== "undefined") {
  cleanupExecuted = true;

  setTimeout(async () => {
    console.log("🚀 Auto-executando limpeza de duplicados...");
    const result = await cleanupFirestoreDuplicates();

    if (result.success && result.cleaned > 0) {
      console.log("🔄 Recarregando página após limpeza...");
      // Refresh page to reload clean data
      setTimeout(() => window.location.reload(), 2000);
    }
  }, 5000); // Wait 5 seconds after page load
}

export default cleanupFirestoreDuplicates;
