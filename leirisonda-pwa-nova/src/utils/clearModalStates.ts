/**
 * Limpar todos os estados que podem causar modais indesejados
 */

export const clearAllModalStates = () => {
  console.log("🧹 Limpando estados de modais indesejados...");

  try {
    // Limpar sessionStorage que pode ter flags de limpeza
    const sessionKeys = [
      "device-memory-cleaned",
      "cleanup-completed",
      "users-eliminated",
      "nuclear-cleanup-done",
      "elimination-success",
    ];

    sessionKeys.forEach((key) => {
      if (sessionStorage.getItem(key)) {
        sessionStorage.removeItem(key);
        console.log(`🗑️ Removido sessionStorage: ${key}`);
      }
    });

    // Limpar localStorage que pode ter flags de limpeza
    const localKeys = [
      "device-memory-cleaned",
      "cleanup-completed",
      "users-eliminated",
      "nuclear-cleanup-done",
      "elimination-success",
      "show-elimination-modal",
      "cleanup-result",
    ];

    localKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Removido localStorage: ${key}`);
      }
    });

    // Disparar evento para forçar re-render
    window.dispatchEvent(new CustomEvent("clearModalStates"));

    console.log("✅ Estados de modais limpos");
  } catch (error) {
    console.error("❌ Erro ao limpar estados:", error);
  }
};

// Executar automaticamente uma vez quando importado
clearAllModalStates();
