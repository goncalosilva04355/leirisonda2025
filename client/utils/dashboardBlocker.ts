/**
 * BLOQUEADOR PERMANENTE DO DASHBOARD
 * Impede que piscinas apareçam no dashboard
 */

console.log(
  "🚫 DASHBOARD BLOCKER: Carregado para impedir piscinas no dashboard",
);

// Interceptar qualquer acesso a dados de maintenances no dashboard
if (typeof window !== "undefined") {
  // Sobrescrever localStorage para interceptar maintenances
  const originalGetItem = localStorage.getItem;
  localStorage.getItem = function (key: string) {
    if (key.includes("maintenance") || key.includes("pool")) {
      console.log(
        `🚫 BLOQUEADO: Tentativa de acessar ${key} - retornando vazio`,
      );
      return "[]"; // Sempre retorna array vazio
    }
    return originalGetItem.call(this, key);
  };

  // Interceptar set para impedir salvamento
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key: string, value: string) {
    if (key.includes("maintenance") || key.includes("pool")) {
      console.log(`🚫 BLOQUEADO: Tentativa de salvar ${key} - impedido`);
      return; // Não salva nada relacionado a piscinas
    }
    return originalSetItem.call(this, key, value);
  };

  console.log("🔒 Dashboard completamente bloqueado para dados de piscinas");
}

export {};
