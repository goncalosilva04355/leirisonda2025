import {
  readFromFirestoreRest,
  deleteFromFirestoreRest,
} from "./firestoreRestApi";

const TARGET_IDS = [
  "1752578821484",
  "1752513775718",
  "1752582282132",
  "1752574634617",
  "1752517424794",
  "1752582282133",
  "1752604451507",
  "1752602368414",
];

const bruteForceDelete = async (id: string) => {
  console.log(`💀 BRUTE FORCE DELETE: ${id}`);

  // Múltiplas tentativas com diferentes métodos
  const results = [];

  // Método 1: Delete direto
  for (let i = 0; i < 5; i++) {
    try {
      const success = await deleteFromFirestoreRest("obras", id);
      results.push({ method: `direct-${i + 1}`, success });
      if (success) console.log(`✅ Sucesso método direto ${i + 1}`);
      await new Promise((r) => setTimeout(r, 200));
    } catch (error) {
      results.push({
        method: `direct-${i + 1}`,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
};

export const ultraDirectKill = async () => {
  console.log("💀 ULTRA DIRECT KILL - Eliminação forçada sem logs visuais");

  const startTime = Date.now();
  let totalAttempts = 0;

  for (const targetId of TARGET_IDS) {
    console.log(`\n🎯 Processando ID: ${targetId}`);

    try {
      const attempts = await bruteForceDelete(targetId);
      totalAttempts += attempts.length;

      const successes = attempts.filter((a) => a.success).length;
      console.log(`   Tentativas: ${attempts.length}, Sucessos: ${successes}`);
    } catch (error) {
      console.error(`❌ Erro no ID ${targetId}:`, error);
    }
  }

  const duration = Date.now() - startTime;
  console.log(`\n💀 ULTRA KILL CONCLUÍDO:`);
  console.log(`   Duração: ${duration}ms`);
  console.log(`   Total de tentativas: ${totalAttempts}`);

  // Verificação final
  console.log("🔍 Verificação final...");
  setTimeout(async () => {
    try {
      const obras = await readFromFirestoreRest("obras");
      const remaining = TARGET_IDS.filter(
        (id) => obras.filter((obra) => obra.id === id).length > 1,
      );

      if (remaining.length === 0) {
        console.log("✅ SUCESSO TOTAL! Nenhum duplicado restante.");
      } else {
        console.error(`🚨 Ainda existem duplicados: ${remaining.join(", ")}`);
      }

      console.log("🔄 Recarregando em 3 segundos...");
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      console.error("❌ Erro na verificação final:", error);
      setTimeout(() => window.location.reload(), 3000);
    }
  }, 2000);
};

// Auto-executar imediatamente
console.log("💀 ULTRA DIRECT KILL carregado - Executando AGORA...");
ultraDirectKill();

// Disponibilizar globalmente
(window as any).ultraDirectKill = ultraDirectKill;
(window as any).ULTRA_KILL = ultraDirectKill;

console.log("💀 COMANDO DE EMERGÊNCIA: ULTRA_KILL()");

export default ultraDirectKill;
