/**
 * LIMPEZA NUCLEAR ÚNICA - Executa uma única vez e para
 */

// Verificar se já foi executada
const CLEANUP_KEY = "nuclear_cleanup_executed";
if (localStorage.getItem(CLEANUP_KEY)) {
  console.log("✅ Limpeza nuclear já executada anteriormente");
} else {
  console.log("☢️ EXECUTANDO LIMPEZA NUCLEAR ÚNICA");

  try {
    // 1. Limpar COMPLETAMENTE o localStorage de qualquer coisa relacionada a piscinas
    const allKeys = Object.keys(localStorage);
    let removed = 0;

    allKeys.forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("pool") ||
        lowerKey.includes("piscina") ||
        lowerKey.includes("maintenance") ||
        lowerKey.includes("manutenc")
      ) {
        // Preservar APENAS dados de usuário
        if (!key.includes("user") && !key.includes("auth")) {
          localStorage.removeItem(key);
          removed++;
          console.log(`☢️ NUKADO: ${key}`);
        }
      }
    });

    // 2. Limpar sessionStorage
    Object.keys(sessionStorage).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("pool") ||
        lowerKey.includes("piscina") ||
        lowerKey.includes("maintenance") ||
        lowerKey.includes("manutenc")
      ) {
        sessionStorage.removeItem(key);
        console.log(`☢️ SESSION NUKADA: ${key}`);
      }
    });

    console.log(`☢️ LIMPEZA NUCLEAR CONCLUÍDA: ${removed} itens destruídos`);

    // Marcar como executada para não repetir
    localStorage.setItem(CLEANUP_KEY, new Date().toISOString());
  } catch (error) {
    console.error("💥 Erro na limpeza nuclear:", error);
  }
}

export {};
