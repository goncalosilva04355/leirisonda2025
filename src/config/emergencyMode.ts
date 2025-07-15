/**
 * MODO EMERGÊNCIA TOTAL
 * Desativa todos os sistemas que podem causar loops, refreshs ou instabilidade
 */

// Configuração de emergência ultra-conservadora
export const EMERGENCY_MODE = {
  // Desativar TODOS os sistemas automáticos
  DISABLE_ALL_AUTO_SYSTEMS: true,

  // Desativar Firebase completamente
  DISABLE_FIREBASE_COMPLETELY: true,

  // Desativar todos os intervalos
  DISABLE_ALL_INTERVALS: true,

  // Desativar todos os listeners
  DISABLE_ALL_LISTENERS: true,

  // Desativar auto-sync
  DISABLE_AUTO_SYNC: true,

  // Desativar auto-login
  DISABLE_AUTO_LOGIN: true,

  // Desativar monitoring
  DISABLE_MONITORING: true,

  // Só localStorage
  FORCE_LOCALSTORAGE_ONLY: true,
};

// Função para verificar se estamos em modo emergência total
export function isEmergencyModeActive(): boolean {
  return EMERGENCY_MODE.DISABLE_ALL_AUTO_SYSTEMS;
}

// Função para verificar se um sistema específico deve ser desativado
export function shouldDisableSystem(systemName: string): boolean {
  return isEmergencyModeActive();
}

// Interceptar todas as funções problemáticas
export function disableProblematicSystems() {
  if (!isEmergencyModeActive()) return;

  console.log(
    "🚨 MODO EMERGÊNCIA TOTAL ATIVO - Desativando todos os sistemas automáticos",
  );

  // Desativar setInterval globalmente para sistemas automáticos
  const originalSetInterval = window.setInterval;
  window.setInterval = function (callback: any, delay: number, ...args: any[]) {
    // Só permitir intervalos com delay > 5 minutos ou explicitamente permitidos
    if (delay < 300000) {
      // 5 minutos
      console.log("⚠️ setInterval bloqueado (modo emergência):", delay);
      return -1 as any;
    }
    return originalSetInterval(callback, delay, ...args);
  };

  // Desativar setTimeout problemáticos
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function (callback: any, delay: number, ...args: any[]) {
    // Só permitir timeouts > 30 segundos ou explicitamente permitidos
    if (delay < 30000 && delay > 0) {
      console.log("⚠️ setTimeout bloqueado (modo emergência):", delay);
      return -1 as any;
    }
    return originalSetTimeout(callback, delay, ...args);
  };

  // Marcar modo emergência como ativo globalmente
  (window as any).EMERGENCY_MODE_ACTIVE = true;

  console.log("🛡️ Sistemas problemáticos desativados com sucesso");
}

// Auto-executar ao importar
disableProblematicSystems();
