/**
 * Script para eliminar completamente todos os usuários antigos
 * Este script executa a limpeza nuclear automaticamente
 */

import { completeUserCleanupService } from "../services/completeUserCleanup";

export const eliminateOldUsersNow = async () => {
  console.log("🚨 INICIANDO ELIMINAÇÃO TOTAL DE USUÁRIOS ANTIGOS...");

  try {
    // 1. Primeiro verificar se há usuários antigos
    const hasOldUsers = await completeUserCleanupService.hasOldUsersLoggedIn();
    console.log("🔍 Usuários antigos detectados:", hasOldUsers);

    // 2. Analisar dados antes da limpeza
    const analysis = await completeUserCleanupService.analyzeUserData();
    console.log("���� Análise completa:", analysis);

    if (analysis.firebaseAuthUser) {
      console.log(
        "⚠️ FIREBASE AUTH ATIVO - USUÁRIO ANTIGO LOGADO:",
        analysis.details.firebaseCurrentUser,
      );
    }

    // 3. Executar limpeza nuclear
    console.log("💥 EXECUTANDO LIMPEZA NUCLEAR...");
    const result = await completeUserCleanupService.nuclearUserCleanup();

    console.log("✅ RESULTADO DA LIMPEZA:", result);

    if (result.success) {
      console.log("🎉 USUÁRIOS ANTIGOS ELIMINADOS COM SUCESSO!");
      console.log(`📊 Estatísticas:
        - localStorage limpo: ${result.details.localStorageKeysCleared.length} chaves
        - sessionStorage limpo: ${result.details.sessionStorageCleared}
        - Firebase Auth limpo: ${result.details.firebaseAuthCleared}
        - IndexedDB limpo: ${result.details.indexedDBCleared}
        - Super admin recriado: ${result.details.superAdminRecreated}
      `);

      // Forçar reload após 3 segundos
      setTimeout(() => {
        console.log("🔄 Recarregando aplicação para garantir estado limpo...");
        window.location.reload();
      }, 3000);

      return {
        success: true,
        message: "Usuários antigos eliminados com sucesso!",
      };
    } else {
      console.error("❌ FALHA NA LIMPEZA:", result.message);
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("💥 ERRO CRÍTICO NA ELIMINAÇÃO:", error);
    return { success: false, message: `Erro crítico: ${error}` };
  }
};

// Função para executar imediatamente quando o módulo é importado
export const executeImmediateCleanup = () => {
  // Aguardar um pouco para garantir que a aplicação está carregada
  setTimeout(async () => {
    await eliminateOldUsersNow();
  }, 1000);
};

// Auto-execução se necessário (descomente a linha abaixo para execução automática)
// executeImmediateCleanup();
