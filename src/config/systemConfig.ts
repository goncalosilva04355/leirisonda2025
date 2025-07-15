/**
 * Configuração do sistema para resolver problemas de loops e refreshs constantes
 */

export const SystemConfig = {
  // REATIVAR modo emergência devido a TOO_MANY_ATTEMPTS
  DISABLE_AUTO_SYNC: true,

  // DESATIVAR auto-login que está a causar loops
  DISABLE_AUTO_LOGIN: true,

  // Desativar intervalos excessivos
  DISABLE_EXCESSIVE_INTERVALS: true,

  // Desativar reloads que podem causar loops
  DISABLE_AUTO_RELOAD: true,

  // Configurações conservadoras
  MAX_RETRIES: 1,
  RETRY_DELAY: 30000, // 30 segundos

  // Intervalos conservadores
  SYNC_INTERVAL: 300000, // 5 minutos
  STATUS_CHECK_INTERVAL: 60000, // 1 minuto

  // REATIVAR modo emergência temporariamente
  FORCE_EMERGENCY_MODE: true,

  // Manter Firebase disponível mas controlado
  ENABLE_FIREBASE_DEV: true,
  ENABLE_FIREBASE_PROD: true,
};

// Função para verificar se um sistema deve ser desativado
export function isSystemDisabled(
  systemName: keyof typeof SystemConfig,
): boolean {
  return SystemConfig[systemName] === true;
}

// Função para obter intervalo seguro
export function getSafeInterval(type: "sync" | "status"): number {
  switch (type) {
    case "sync":
      return SystemConfig.SYNC_INTERVAL;
    case "status":
      return SystemConfig.STATUS_CHECK_INTERVAL;
    default:
      return 60000; // 1 minuto por padrão
  }
}

console.log("⚙️ SystemConfig carregado:", SystemConfig);
