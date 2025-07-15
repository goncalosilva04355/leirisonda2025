/**
 * Configuração do sistema para resolver problemas de loops e refreshs constantes
 */

export const SystemConfig = {
  // Desativar auto-sync para evitar loops
  DISABLE_AUTO_SYNC: true,

  // Desativar auto-login para evitar loops de autenticação
  DISABLE_AUTO_LOGIN: true,

  // Desativar setInterval excessivos
  DISABLE_EXCESSIVE_INTERVALS: true,

  // Desativar window.location.reload automático
  DISABLE_AUTO_RELOAD: true,

  // Configurações de retry mais conservadoras
  MAX_RETRIES: 2,
  RETRY_DELAY: 30000, // 30 segundos em vez de 3-5

  // Configurações de polling menos agressivas
  SYNC_INTERVAL: 300000, // 5 minutos em vez de 5-10 segundos
  STATUS_CHECK_INTERVAL: 60000, // 1 minuto em vez de 5-10 segundos

  // Modo emergência sempre ativo para evitar problemas Firebase
  FORCE_EMERGENCY_MODE: true,
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
