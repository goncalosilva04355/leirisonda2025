// Sistema de desbloqueio de emergência

console.log("🚨 SISTEMA DE DESBLOQUEIO DE EMERGÊNCIA ATIVADO");

// Limpar todos os storages
try {
  localStorage.clear();
  sessionStorage.clear();
  console.log("🧹 Storage limpo");
} catch (error) {
  console.error("❌ Erro ao limpar storage:", error);
}

// Limpar todos os intervals e timeouts
for (let i = 1; i < 99999; i++) {
  try {
    clearInterval(i);
    clearTimeout(i);
  } catch (e) {
    // Ignorar erros
  }
}
console.log("⏹️ Todos os timers limpos");

// Desabilitar console.error temporariamente para evitar spam
const originalError = console.error;
let errorCount = 0;
console.error = (...args) => {
  errorCount++;
  if (errorCount < 10) {
    originalError.apply(console, args);
  } else if (errorCount === 10) {
    originalError(
      "🚨 Console.error silenciado após 10 mensagens para evitar spam",
    );
  }
};

// Restaurar console.error após 30 segundos
setTimeout(() => {
  console.error = originalError;
  console.log("🔊 Console.error restaurado");
}, 30000);

// Forçar limpeza de qualquer estado problemático
try {
  if (typeof window !== "undefined") {
    // Remover qualquer listener problemático
    window.removeEventListener("storage", () => {});
    window.removeEventListener("beforeunload", () => {});

    // Limpar qualquer variável global que possa estar causando problemas
    (window as any).cleanupInterval = null;
    (window as any).startupCheckExecuted = true;

    console.log("🔧 Estado global limpo");
  }
} catch (error) {
  console.error("❌ Erro na limpeza global:", error);
}

// Função de reboot de emergência
const emergencyReboot = () => {
  console.log("🔄 REBOOT DE EMERGÊNCIA - Recarregando página em 3 segundos...");
  setTimeout(() => {
    window.location.reload();
  }, 3000);
};

// Disponibilizar globalmente
(window as any).emergencyReboot = emergencyReboot;
(window as any).UNBLOCK = emergencyReboot;

console.log("🚨 SISTEMA DESBLOQUEADO");
console.log("🔄 Se ainda houver problemas, digite 'UNBLOCK()' no console");

export default true;
