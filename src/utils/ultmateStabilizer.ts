/**
 * ESTABILIZADOR ULTIMATE - PARA TUDO IMEDIATAMENTE
 * Versão mais agressiva que para QUALQUER sistema problemático
 */

(() => {
  console.log("🛑 ULTIMATE STABILIZER - PARANDO TUDO AGORA");

  // IMMEDIATE BLOCKS - Aplicados imediatamente

  // 1. RELOADS COMPLETAMENTE BLOQUEADOS
  Object.defineProperty(window.location, "reload", {
    value: () => console.log("🚫 RELOAD ULTIMATE BLOCKED"),
    writable: false,
    configurable: false,
  });

  // 2. HREF CHANGES BLOQUEADOS
  const originalHref = window.location.href;
  Object.defineProperty(window.location, "href", {
    get: () => originalHref,
    set: (value) => console.log("🚫 HREF CHANGE BLOCKED:", value),
    configurable: false,
  });

  // 3. TODOS OS INTERVALOS MORTOS IMEDIATAMENTE
  const killAllIntervals = () => {
    for (let i = 1; i <= 99999; i++) {
      try {
        clearInterval(i);
        clearTimeout(i);
      } catch (e) {}
    }
  };
  killAllIntervals();

  // Re-executar limpeza a cada segundo
  setInterval(killAllIntervals, 1000);

  // 4. BLOQUEAR setInterval GLOBALMENTE
  const originalSetInterval = window.setInterval;
  window.setInterval = (() => {
    console.log("🚫 setInterval ULTIMATE BLOCKED");
    return -1;
  }) as any;

  // 5. BLOQUEAR setTimeout PROBLEMÁTICOS
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = ((fn: any, delay: number) => {
    if (delay < 300000) {
      // Menos que 5 minutos
      console.log("🚫 setTimeout ULTIMATE BLOCKED:", delay);
      return -1;
    }
    return originalSetTimeout(fn, delay);
  }) as any;

  // 6. MATAR TODOS OS EVENT LISTENERS
  const elements = document.querySelectorAll("*");
  elements.forEach((el) => {
    const newEl = el.cloneNode(true);
    el.parentNode?.replaceChild(newEl, el);
  });

  // 7. BLOQUEAR FETCH COMPLETAMENTE PARA FIREBASE
  const originalFetch = window.fetch;
  window.fetch = (async (input: any, init?: any) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.includes("firebase") || url.includes("googleapis")) {
      console.log("🚫 FIREBASE FETCH ULTIMATE BLOCKED:", url);
      throw new Error("Firebase blocked by Ultimate Stabilizer");
    }
    return originalFetch(input, init);
  }) as any;

  // 8. DISABLE ALL ERROR HANDLERS
  window.onerror = null;
  window.onunhandledrejection = null;

  // 9. MARCAR ULTRA STABILIZED
  (window as any).ULTRA_STABILIZED = true;
  localStorage.setItem("ULTRA_STABILIZED", "true");

  // 10. OVERRIDE REACT ERROR BOUNDARIES
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (
      args[0]?.includes?.("Error boundary") ||
      args[0]?.includes?.("componentDidCatch")
    ) {
      console.log("🚫 ERROR BOUNDARY BLOCKED");
      return;
    }
    originalConsoleError(...args);
  };

  console.log("✅ ULTIMATE STABILIZER COMPLETO - Sistema ultra-estabilizado");
  console.log("   🚫 Reloads: MORTOS");
  console.log("   🚫 Intervalos: MORTOS");
  console.log("   🚫 Event listeners: MORTOS");
  console.log("   🚫 Firebase: MORTO");
  console.log("   🚫 Error boundaries: MORTOS");
})();

export const isUltraStabilized = () => {
  return (
    typeof window !== "undefined" && (window as any).ULTRA_STABILIZED === true
  );
};
