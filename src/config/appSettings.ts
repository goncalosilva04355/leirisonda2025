// ⚙️ CONFIGURAÇÕES DA APLICAÇÃO
// Configurações centralizadas para controlar funcionalidades

export const APP_SETTINGS = {
  // Notificações completamente desabilitadas
  notifications: {
    enabled: false,
    pushNotifications: false,
    workAssignments: false,
    systemAlerts: false,
    testNotifications: false,
  },

  // Sincronização simplificada - apenas local
  sync: {
    autoSync: false,
    instantSync: false,
    realtimeSync: false,
    showSyncStatus: false,
    showSyncButtons: false,
    firebase: false, // Mantém Firebase apenas para persistência, não para sync ativo
  },

  // Interface limpa
  ui: {
    showSyncIndicators: false,
    showNotificationBells: false,
    showHelpButtons: false,
    showSyncHelp: false,
    cleanInterface: true,
  },

  // Proteção de dados ativa
  dataProtection: {
    enabled: true,
    preventDataLoss: true,
    createBackups: true,
    blockEmptyWrites: true,
    protectFromBuilderIO: true,
  },

  // Performance
  performance: {
    reducedAnimations: true,
    minimalLogging: false, // Mantém logs para debug
    fastMode: true,
  },
};

// Função para verificar se uma funcionalidade está habilitada
export function isFeatureEnabled(
  category: keyof typeof APP_SETTINGS,
  feature: string,
): boolean {
  const categorySettings = APP_SETTINGS[category] as any;
  return categorySettings?.[feature] === true;
}

// Função para obter configurações de uma categoria
export function getCategorySettings(category: keyof typeof APP_SETTINGS) {
  return APP_SETTINGS[category];
}

// Log das configurações ativas
console.log("⚙️ APP SETTINGS LOADED:", {
  notifications: "DISABLED",
  sync: "SIMPLIFIED",
  ui: "CLEAN",
  dataProtection: "ENABLED",
});
