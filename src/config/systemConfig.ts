/**
 * Configuração do sistema para resolver problemas de loops e refreshs constantes
 */

export const SystemConfig = {
  // Configurações normais
  DISABLE_AUTO_SYNC: false,
  DISABLE_AUTO_LOGIN: false,
  DISABLE_EXCESSIVE_INTERVALS: false,
  DISABLE_AUTO_RELOAD: false,

  // Configurações padrão
  MAX_RETRIES: 3,
  RETRY_DELAY: 5000, // 5 segundos

  // Intervalos normais
  SYNC_INTERVAL: 30000, // 30 segundos
  STATUS_CHECK_INTERVAL: 10000, // 10 segundos

  // Modo normal
  FORCE_EMERGENCY_MODE: false,

  // Firebase ativo
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
