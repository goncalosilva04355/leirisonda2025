/**
 * Configuração do sistema para resolver problemas de loops e refreshs constantes
 */

export const SystemConfig = {
  // REATIVAR auto-sync para Firebase
  DISABLE_AUTO_SYNC: false,

  // REATIVAR auto-login para Firebase
  DISABLE_AUTO_LOGIN: false,

  // Permitir intervalos controlados
  DISABLE_EXCESSIVE_INTERVALS: false,

  // Permitir reloads quando necessário
  DISABLE_AUTO_RELOAD: false,

  // Configurações normais de retry
  MAX_RETRIES: 3,
  RETRY_DELAY: 5000, // 5 segundos

  // Configurações normais para Firebase sync
  SYNC_INTERVAL: 30000, // 30 segundos
  STATUS_CHECK_INTERVAL: 10000, // 10 segundos

  // DESATIVAR modo emergência para permitir Firebase
  FORCE_EMERGENCY_MODE: false,

  // Novas configurações para Firebase
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
