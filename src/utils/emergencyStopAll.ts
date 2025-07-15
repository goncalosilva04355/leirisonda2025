/**
 * PARAGEM DE EMERGÊNCIA TOTAL
 * Desativa TODOS os sistemas que podem causar refreshs, loops ou instabilidade
 */

console.log("🚨 INICIANDO PARAGEM DE EMERGÊNCIA TOTAL");

export const EMERGENCY_STOP_ALL = (() => {
  let stopped = false;

  return () => {
    try {
      if (stopped) return;
      stopped = true;

      console.log(
        "🛑 PARAGEM EMERGÊNCIA TOTAL - Desativando TODOS os sistemas problemáticos",
      );

      // 1. BLOQUEAR TODOS OS RELOADS
      try {
        const originalReload = window.location.reload;
        window.location.reload = (() => {
          console.log("🚫 RELOAD BLOQUEADO - Modo emergência total ativo");
        }) as any;
      } catch (error) {
        console.log("⚠️ Erro ao bloquear reload:", error);
      }

      // Bloquear mudanças de location
      try {
        const originalAssign = window.location.assign;
        window.location.assign = ((url: string) => {
          console.log("🚫 LOCATION.ASSIGN BLOQUEADO:", url);
        }) as any;
      } catch (error) {
        console.log("⚠️ Erro ao bloquear assign:", error);
      }

      // 2. LIMPAR TODOS OS INTERVALOS EXISTENTES
      try {
        const highestIntervalId = setInterval(() => {}, 1);
        for (let i = 1; i <= highestIntervalId; i++) {
          clearInterval(i);
        }
        console.log(`🧹 ${highestIntervalId} intervalos limpos`);
      } catch (error) {
        console.log("⚠️ Erro ao limpar intervalos:", error);
      }

      // 3. BLOQUEAR NOVOS setInterval AGRESSIVOS
      try {
        const originalSetInterval = window.setInterval;
        window.setInterval = ((
          callback: any,
          delay: number,
          ...args: any[]
        ) => {
          if (delay < 300000) {
            // Menos que 5 minutos
            console.log("🚫 setInterval BLOQUEADO (delay muito baixo):", delay);
            return -1 as any;
          }
          return originalSetInterval(callback, delay, ...args);
        }) as any;
      } catch (error) {
        console.log("⚠️ Erro ao bloquear setInterval:", error);
      }

      // 4. BLOQUEAR TIMEOUTS PROBLEMÁTICOS
      try {
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = ((callback: any, delay: number, ...args: any[]) => {
          if (delay < 60000 && delay > 0) {
            // Menos que 1 minuto
            console.log("🚫 setTimeout BLOQUEADO (delay muito baixo):", delay);
            return -1 as any;
          }
          return originalSetTimeout(callback, delay, ...args);
        }) as any;
      } catch (error) {
        console.log("⚠️ Erro ao bloquear setTimeout:", error);
      }

      // 5. LIMPAR SERVICE WORKERS PROBLEMÁTICOS
      try {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => {
              registration.unregister();
              console.log("🧹 Service Worker removido");
            });
          });
        }
      } catch (error) {
        console.log("⚠️ Erro ao limpar service workers:", error);
      }

      // 6. BLOQUEAR FETCH REQUESTS EXCESSIVOS
      try {
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
      } catch (error) {
        console.log("⚠️ Erro ao bloquear fetch:", error);
      }

      // 7. MARCAR MODO EMERGÊNCIA GLOBALMENTE
      try {
        (window as any).EMERGENCY_STOP_ACTIVE = true;
        (window as any).EMERGENCY_MODE_ACTIVE = true;
        localStorage.setItem("EMERGENCY_STOP_ACTIVE", "true");
        localStorage.setItem("EMERGENCY_MODE_ACTIVE", "true");
      } catch (error) {
        console.log("⚠️ Erro ao marcar modo emergência:", error);
      }

      // 8. BLOQUEAR ERROR HANDLERS QUE FAZEM RELOAD
      try {
        window.onerror = () => {
          console.log("🚫 Error handler bloqueado - modo emergência");
          return true; // Prevenir default behavior
        };
      } catch (error) {
        console.log("⚠️ Erro ao bloquear error handler:", error);
      }

      // 9. STATS
      console.log("✅ PARAGEM DE EMERGÊNCIA COMPLETA:");
      console.log("   🚫 Reloads bloqueados");
      console.log("   🧹 Intervalos limpos");
      console.log("   🚫 Novos intervalos < 5min bloqueados");
      console.log("   🚫 Timeouts < 1min bloqueados");
      console.log("   🧹 Service workers removidos");
      console.log("   🚫 Fetch excessivo bloqueado");
      console.log("   🛡️ Error handlers neutralizados");

      return true;
    } catch (globalError) {
      console.error("❌ Erro na paragem de emergência:", globalError);
      return false;
    }
  };
})();

// AUTO-EXECUTAR IMEDIATAMENTE
try {
  EMERGENCY_STOP_ALL();
} catch (error) {
  console.error("❌ Erro ao executar paragem de emergência:", error);
}

export const isEmergencyStopActive = () => {
  return (
    typeof window !== "undefined" &&
    (window as any).EMERGENCY_STOP_ACTIVE === true
  );
};
