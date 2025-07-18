import {
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "./firestoreRestApi";

export const enhancedDebugDuplicates = async () => {
  console.log("🔍 DEBUG MELHORADO - Análise completa de duplicados...");

  try {
    // Carregar todas as obras
    const obras = await readFromFirestoreRest("obras");
    console.log(`📊 Total de obras carregadas: ${obras.length}`);

    // Análise detalhada de IDs
    const idMap = new Map();
    const duplicateAnalysis = [];

    obras.forEach((obra, index) => {
      if (!obra.id) {
        console.warn(`⚠️ Obra sem ID no índice ${index}:`, obra);
        return;
      }

      if (idMap.has(obra.id)) {
        // Este é um duplicado
        const existing = idMap.get(obra.id);
        existing.push({
          index,
          createdAt: obra.createdAt,
          updatedAt: obra.updatedAt,
          title: obra.title || obra.workType || "sem título",
          data: obra,
        });
      } else {
        // Primeira ocorrência deste ID
        idMap.set(obra.id, [
          {
            index,
            createdAt: obra.createdAt,
            updatedAt: obra.updatedAt,
            title: obra.title || obra.workType || "sem título",
            data: obra,
          },
        ]);
      }
    });

    // Identificar duplicados
    const duplicateIds = [];
    idMap.forEach((instances, id) => {
      if (instances.length > 1) {
        duplicateIds.push(id);
        duplicateAnalysis.push({
          id,
          count: instances.length,
          instances: instances.map((inst) => ({
            createdAt: inst.createdAt,
            updatedAt: inst.updatedAt,
            title: inst.title,
          })),
        });
      }
    });

    console.log(`🚨 ANÁLISE DE DUPLICADOS:`);
    console.log(`   - IDs únicos: ${idMap.size}`);
    console.log(`   - IDs duplicados: ${duplicateIds.length}`);
    console.log(`   - Total de itens: ${obras.length}`);

    if (duplicateIds.length > 0) {
      console.error(`🚨 DUPLICADOS ENCONTRADOS:`, duplicateIds);

      duplicateAnalysis.forEach((dup) => {
        console.group(`🔍 ID: ${dup.id} (${dup.count} instâncias)`);
        dup.instances.forEach((inst, idx) => {
          console.log(
            `   ${idx + 1}. ${inst.title} - Criado: ${inst.createdAt || "N/A"} - Atualizado: ${inst.updatedAt || "N/A"}`,
          );
        });
        console.groupEnd();
      });

      return {
        hasDuplicates: true,
        total: obras.length,
        unique: idMap.size,
        duplicateIds,
        duplicateAnalysis,
        summary: `${duplicateIds.length} IDs duplicados encontrados`,
      };
    } else {
      console.log("✅ NENHUM DUPLICADO ENCONTRADO!");
      return {
        hasDuplicates: false,
        total: obras.length,
        unique: idMap.size,
        duplicateIds: [],
        duplicateAnalysis: [],
        summary: "Sistema limpo, sem duplicados",
      };
    }
  } catch (error) {
    console.error("❌ ERRO no debug melhorado:", error);
    return { error: error.message };
  }
};

export const testSingleDelete = async (id: string) => {
  console.log(`🧪 TESTANDO DELETE do ID: ${id}`);

  try {
    const result = await deleteFromFirestoreRest("obras", id);
    console.log(`🧪 Resultado do teste de delete:`, result);
    return result;
  } catch (error) {
    console.error(`❌ ERRO no teste de delete:`, error);
    return false;
  }
};

// Disponibilizar globalmente
(window as any).enhancedDebugDuplicates = enhancedDebugDuplicates;
(window as any).testSingleDelete = testSingleDelete;

console.log(
  "🛠️ DEBUG MELHORADO: Digite 'enhancedDebugDuplicates()' para análise completa",
);
console.log(
  "🧪 TESTE DELETE: Digite 'testSingleDelete(\"ID\")' para testar remoção",
);

// Auto-executar debug melhorado
setTimeout(() => {
  console.log("🔍 AUTO-EXECUTANDO DEBUG MELHORADO...");
  enhancedDebugDuplicates();
}, 1000);

export default enhancedDebugDuplicates;
