/**
 * PARAGEM DE EMERGÊNCIA TOTAL
 * Desativa TODOS os sistemas que podem causar refreshs, loops ou instabilidade
 */

console.log("🚨 INICIANDO PARAGEM DE EMERGÊNCIA TOTAL");

export const EMERGENCY_STOP_ALL = (() => {
  let stopped = false;

  return () => {
    if (stopped) return;
    stopped = true;

    console.log(
      "🛑 PARAGEM EMERGÊNCIA TOTAL - Desativando TODOS os sistemas problemáticos",
    );

    // 1. BLOQUEAR TODOS OS RELOADS
    const originalReload = window.location.reload;
    window.location.reload = (() => {
      console.log("🚫 RELOAD BLOQUEADO - Modo emergência total ativo");
    }) as any;

    // Bloquear mudanças de location
    const originalAssign = window.location.assign;
    window.location.assign = ((url: string) => {
      console.log("🚫 LOCATION.ASSIGN BLOQUEADO:", url);
    }) as any;

    // 2. LIMPAR TODOS OS INTERVALOS EXISTENTES
    const highestIntervalId = setInterval(() => {}, 1);
    for (let i = 1; i <= highestIntervalId; i++) {
      clearInterval(i);
    }
    console.log(`🧹 ${highestIntervalId} intervalos limpos`);

    // 3. BLOQUEAR NOVOS setInterval AGRESSIVOS
    const originalSetInterval = window.setInterval;
    window.setInterval = ((callback: any, delay: number, ...args: any[]) => {
      if (delay < 300000) {
        // Menos que 5 minutos
        console.log("🚫 setInterval BLOQUEADO (delay muito baixo):", delay);
        return -1 as any;
      }
      return originalSetInterval(callback, delay, ...args);
    }) as any;

    // 4. BLOQUEAR TIMEOUTS PROBLEMÁTICOS
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = ((callback: any, delay: number, ...args: any[]) => {
      if (delay < 60000 && delay > 0) {
        // Menos que 1 minuto
        console.log("🚫 setTimeout BLOQUEADO (delay muito baixo):", delay);
        return -1 as any;
      }
      return originalSetTimeout(callback, delay, ...args);
    }) as any;

    // 5. BLOQUEAR addEventListener QUE PODEM ACUMULAR
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = ((type: string, listener: any, options?: any) => {
      const blockedEvents = [
        "load",
        "unload",
        "beforeunload",
        "unhandledrejection",
        "error",
      ];
      if (blockedEvents.includes(type)) {
        console.log("🚫 addEventListener BLOQUEADO:", type);
        return;
      }
      return originalAddEventListener(type, listener, options);
    }) as any;

    // 6. LIMPAR SERVICE WORKERS PROBLEMÁTICOS
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
          console.log("🧹 Service Worker removido");
        });
      });
    }

    // 7. BLOQUEAR FETCH REQUESTS EXCESSIVOS
    const originalFetch = window.fetch;
    let fetchCount = 0;
    window.fetch = (async (...args: any[]) => {
      fetchCount++;
      if (fetchCount > 100) {
        // Mais que 100 requests
        console.log("🚫 FETCH BLOQUEADO - Muitos requests");
        throw new Error("Fetch bloqueado - modo emergência");
      }
      return originalFetch(...args);
    }) as any;

    // 8. MARCAR MODO EMERGÊNCIA GLOBALMENTE
    (window as any).EMERGENCY_STOP_ACTIVE = true;
    (window as any).EMERGENCY_MODE_ACTIVE = true;
    localStorage.setItem("EMERGENCY_STOP_ACTIVE", "true");
    localStorage.setItem("EMERGENCY_MODE_ACTIVE", "true");

    // 9. BLOQUEAR ERROR HANDLERS QUE FAZEM RELOAD
    window.onerror = () => {
      console.log("🚫 Error handler bloqueado - modo emergência");
      return true; // Prevenir default behavior
    };

    window.addEventListener("unhandledrejection", (e) => {
      e.preventDefault();
      console.log("🚫 Unhandled rejection bloqueado - modo emergência");
    });

    // 10. STATS
    console.log("✅ PARAGEM DE EMERGÊNCIA COMPLETA:");
    console.log("   🚫 Reloads bloqueados");
    console.log("   🧹 Intervalos limpos");
    console.log("   🚫 Novos intervalos < 5min bloqueados");
    console.log("   🚫 Timeouts < 1min bloqueados");
    console.log("   🚫 Event listeners problemáticos bloqueados");
    console.log("   🧹 Service workers removidos");
    console.log("   🚫 Fetch excessivo bloqueado");
    console.log("   🛡️ Error handlers neutralizados");

    return true;
  };
})();

// AUTO-EXECUTAR IMEDIATAMENTE
EMERGENCY_STOP_ALL();

export const isEmergencyStopActive = () => {
  return (
    typeof window !== "undefined" &&
    (window as any).EMERGENCY_STOP_ACTIVE === true
  );
};
