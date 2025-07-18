import {
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "./firestoreRestApi";

const DUPLICATE_IDS = [
  "1752578821484",
  "1752513775718",
  "1752582282132",
  "1752574634617",
  "1752517424794",
  "1752582282133",
  "1752604451507",
  "1752602368414",
];

export const directKillDuplicates = async () => {
  console.log("💀 ELIMINAÇÃO DIRETA - Matando duplicados específicos...");

  for (const duplicateId of DUPLICATE_IDS) {
    console.log(`💀 Tentando eliminar: ${duplicateId}`);

    try {
      // Tentar eliminar múltiplas vezes para garantir
      for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`   Tentativa ${attempt}/3...`);

        const success = await deleteFromFirestoreRest("obras", duplicateId);

        if (success) {
          console.log(`   ✅ ELIMINADO na tentativa ${attempt}`);
          break;
        } else {
          console.warn(`   ⚠️ Falha na tentativa ${attempt}`);
          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }

      // Delay entre IDs
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`   ❌ ERRO ao eliminar ${duplicateId}:`, error);
    }
  }

  console.log("💀 ELIMINAÇÃO DIRETA CONCLUÍDA");

  // Verificar resultado
  console.log("🔍 Verificando resultado...");
  setTimeout(async () => {
    try {
      const obras = await readFromFirestoreRest("obras");
      const remainingDuplicates = [];

      DUPLICATE_IDS.forEach((id) => {
        const count = obras.filter((obra) => obra.id === id).length;
        if (count > 1) {
          remainingDuplicates.push(`${id}(${count})`);
        }
      });

      if (remainingDuplicates.length > 0) {
        console.error("🚨 AINDA EXISTEM DUPLICADOS:", remainingDuplicates);
      } else {
        console.log("✅ TODOS OS DUPLICADOS FORAM ELIMINADOS!");
      }

      // Recarregar independentemente
      console.log("🔄 Recarregando página...");
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("❌ Erro na verificação:", error);
      // Recarregar mesmo com erro
      setTimeout(() => window.location.reload(), 2000);
    }
  }, 3000);
};

// Executar imediatamente quando importado
console.log("💀 ELIMINAÇÃO DIRETA CARREGADA - Executando em 1 segundo...");
setTimeout(directKillDuplicates, 1000);

// Disponibilizar globalmente
(window as any).directKillDuplicates = directKillDuplicates;
(window as any).KILL_DUPLICATES_NOW = directKillDuplicates;

console.log(
  "💀 COMANDO: Digite 'KILL_DUPLICATES_NOW()' para eliminação imediata",
);

export default directKillDuplicates;
