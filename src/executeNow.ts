/**
 * EXECUÇÃO IMEDIATA - Eliminar usuários específicos AGORA
 * Este arquivo executa automaticamente quando importado
 */

import { eliminateSpecificUsers } from "./utils/eliminateSpecificUsers";

console.log("🚨 INICIANDO ELIMINAÇÃO IMEDIATA DOS USUÁRIOS ESPECÍFICOS...");

// Executar imediatamente
eliminateSpecificUsers()
  .then((result) => {
    console.log("🎯 RESULTADO FINAL:", result);

    if (result.success) {
      console.log("✅ USUÁRIOS ELIMINADOS COM SUCESSO!");
      console.log("📧 Usuários eliminados:", result.details.usersEliminated);
      console.log("🧹 Sistemas limpos:", result.details.systemsCleaned);

      // Mostrar alerta visual
      if (typeof window !== "undefined") {
        alert(
          `✅ USUÁRIOS ELIMINADOS!\n\nEliminados: ${result.details.usersEliminated.join(", ")}\n\nA página irá recarregar...`,
        );
      }
    } else {
      console.error("❌ FALHA NA ELIMINAÇÃO:", result.message);

      if (typeof window !== "undefined") {
        alert(`❌ ERRO: ${result.message}`);
      }
    }
  })
  .catch((error) => {
    console.error("💥 ERRO CRÍTICO:", error);

    if (typeof window !== "undefined") {
      alert(`💥 ERRO CRÍTICO: ${error}`);
    }
  });
