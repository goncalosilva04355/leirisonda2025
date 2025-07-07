/**
 * Script de limpeza imediata para remover utilizadores problemáticos
 * Este ficheiro executa a limpeza automaticamente quando importado
 */

import { executeCompleteCleanup } from "./completeBadUserCleanup";

// Função para executar limpeza imediatamente
const runImmediateCleanup = async () => {
  console.log(
    "🚀 EXECUTANDO LIMPEZA IMEDIATA DE UTILIZADORES PROBLEMÁTICOS...",
  );

  try {
    const result = await executeCompleteCleanup();

    if (result.success) {
      console.log("🎉 LIMPEZA IMEDIATA CONCLUÍDA COM SUCESSO!");
      console.log(`📊 Resultados:
        - Emails encontrados: ${result.details.emailsFound.length}
        - Emails removidos: ${result.details.emailsRemoved.length}
        - Sistemas limpos: ${result.details.systemsCleaned.length}
      `);
    } else {
      console.error("❌ FALHA NA LIMPEZA IMEDIATA:", result.message);
    }

    return result;
  } catch (error) {
    console.error("💥 ERRO CRÍTICO NA LIMPEZA IMEDIATA:", error);
    return { success: false, message: `Erro crítico: ${error}` };
  }
};

// Executar imediatamente quando este módulo for importado
console.log("⚡ Iniciando limpeza imediata...");
runImmediateCleanup();

export { runImmediateCleanup };
