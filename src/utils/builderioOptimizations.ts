/**
 * Otimizações específicas para Builder.io
 * Previne refreshes constantes e melhora a performance no editor
 */

// Detectar se estamos no ambiente Builder.io
const isBuilderIO = () => {
  return (
    window.location.hostname.includes("builder.io") ||
    window.location.search.includes("builder.io") ||
    window.parent !== window || // Em iframe
    document.querySelector("[data-builder-component]") !== null
  );
};

// Desabilitar console logs excessivos no Builder.io
if (isBuilderIO()) {
  console.log("🔧 Builder.io detected - optimizing for editor");

  // Reduzir frequência de logs
  const originalConsoleLog = console.log;
  let logCount = 0;
  const MAX_LOGS_PER_SECOND = 5;
  let lastLogTime = Date.now();

  console.log = (...args) => {
    const now = Date.now();
    if (now - lastLogTime > 1000) {
      logCount = 0;
      lastLogTime = now;
    }

    if (logCount < MAX_LOGS_PER_SECOND) {
      originalConsoleLog.apply(console, args);
      logCount++;
    }
  };

  // Desabilitar alguns listeners de eventos que podem causar refresh
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = (event, handler, options) => {
    // Filtrar eventos que podem causar refresh desnecessário
    if (["resize", "scroll", "mousemove", "touchmove"].includes(event)) {
      return;
    }
    return originalAddEventListener.call(window, event, handler, options);
  };

  // Otimizar observadores de mutation
  const originalMutationObserver = window.MutationObserver;
  window.MutationObserver = class extends originalMutationObserver {
    constructor(callback) {
      const throttledCallback = throttle(callback, 1000); // Throttle para 1 segundo
      super(throttledCallback);
    }
  };
}

// Função de throttle
function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function (...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Desabilitar hot reload quando em Builder.io
if (isBuilderIO() && import.meta.hot) {
  import.meta.hot.dispose(() => {
    // Cleanup function
  });

  // Desabilitar auto-reload
  import.meta.hot.decline();
}

export { isBuilderIO };
