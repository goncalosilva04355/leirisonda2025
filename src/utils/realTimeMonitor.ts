/**
 * MONITOR EM TEMPO REAL - Detecta atividade problemática no Builder.io
 * Identifica exatamente o que está a causar refreshs e instabilidade
 */

class RealTimeMonitor {
  private logs: Array<{ timestamp: number; type: string; details: any }> = [];
  private isMonitoring = false;

  startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    console.log(
      "🔍 MONITOR EM TEMPO REAL INICIADO - Detectando atividade problemática",
    );

    // 1. MONITOR DE RELOADS E NAVIGATION - TEMPORARIAMENTE DESATIVADO
    // this.monitorNavigation();

    // 2. MONITOR DE MEMORY USAGE
    this.monitorMemory();

    // 3. MONITOR DE DOM MUTATIONS
    this.monitorDOMChanges();

    // 4. MONITOR DE NETWORK REQUESTS
    this.monitorNetworkActivity();

    // 5. MONITOR DE JAVASCRIPT ERRORS
    this.monitorJSErrors();

    // 6. MONITOR DE EVENT LISTENERS
    this.monitorEventListeners();

    // 7. RELATÓRIO A CADA 5 SEGUNDOS
    setInterval(() => this.generateReport(), 5000);
  }

  private log(type: string, details: any) {
    const entry = {
      timestamp: Date.now(),
      type,
      details,
    };
    this.logs.push(entry);

    // Manter apenas últimos 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

    // Log crítico com melhor formatação
    if (type.includes("CRITICAL")) {
      try {
        console.error(`🚨 ${type}:`, JSON.stringify(details, null, 2));
      } catch (e) {
        console.error(`🚨 ${type}:`, details);
      }
    }
  }

  private monitorNavigation() {
    // Monitor window.location changes
    let lastHref = window.location.href;
    setInterval(() => {
      if (window.location.href !== lastHref) {
        this.log("CRITICAL_NAVIGATION_CHANGE", {
          from: lastHref,
          to: window.location.href,
        });
        lastHref = window.location.href;
      }
    }, 100);

    // Monitor history changes
    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      this.log("HISTORY_PUSH_STATE", args);
      return originalPushState.apply(history, args);
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = (...args) => {
      this.log("HISTORY_REPLACE_STATE", args);
      return originalReplaceState.apply(history, args);
    };
  }

  private monitorMemory() {
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > 100 * 1024 * 1024) {
          // > 100MB
          this.log("CRITICAL_HIGH_MEMORY_USAGE", {
            used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + "MB",
            total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + "MB",
          });
        }
      }, 2000);
    }
  }

  private monitorDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      if (mutations.length > 50) {
        // Muitas mudanças simultâneas
        this.log("CRITICAL_EXCESSIVE_DOM_MUTATIONS", {
          count: mutations.length,
          types: mutations.map((m) => m.type),
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  private monitorNetworkActivity() {
    const originalFetch = window.fetch;
    let requestCount = 0;
    let lastResetTime = Date.now();

    window.fetch = async (...args) => {
      requestCount++;

      // Reset counter a cada minuto
      if (Date.now() - lastResetTime > 60000) {
        requestCount = 0;
        lastResetTime = Date.now();
      }

      // Mais de 50 requests por minuto é suspeito
      if (requestCount > 50) {
        this.log("CRITICAL_EXCESSIVE_NETWORK_REQUESTS", {
          count: requestCount,
          url: typeof args[0] === "string" ? args[0] : args[0]?.url,
        });
      }

      return originalFetch(...args);
    };
  }

  private monitorJSErrors() {
    window.addEventListener("error", (event) => {
      this.log("JAVASCRIPT_ERROR", {
        message: event.error?.message,
        filename: event.filename,
        lineno: event.lineno,
        stack: event.error?.stack,
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.log("UNHANDLED_PROMISE_REJECTION", {
        reason: event.reason,
        stack: event.reason?.stack,
      });
    });
  }

  private monitorEventListeners() {
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    let listenerCount = 0;

    EventTarget.prototype.addEventListener = function (
      type,
      listener,
      options,
    ) {
      listenerCount++;

      if (listenerCount > 1000) {
        // Mais de 1000 listeners é excessivo
        console.warn("🚨 CRITICAL_EXCESSIVE_EVENT_LISTENERS:", {
          count: listenerCount,
          type,
          target: this,
        });
      }

      return originalAddEventListener.call(this, type, listener, options);
    };
  }

  generateReport() {
    const now = Date.now();
    const recentLogs = this.logs.filter((log) => now - log.timestamp < 30000); // Últimos 30s

    const criticalEvents = recentLogs.filter((log) =>
      log.type.includes("CRITICAL"),
    );

    if (criticalEvents.length > 0) {
      console.group(
        "🚨 RELATÓRIO CRÍTICO - Problemas detectados nos últimos 30s:",
      );

      criticalEvents.forEach((event) => {
        console.log(`❌ ${event.type}:`, event.details);
      });

      console.log("\n📊 Estatísticas gerais:");
      console.log("- Total de eventos críticos:", criticalEvents.length);
      console.log("- Eventos por tipo:", this.getEventsByType(criticalEvents));
      console.log(
        "- Primeira ocorrência:",
        new Date(criticalEvents[0]?.timestamp).toLocaleTimeString(),
      );

      console.groupEnd();
    } else {
      console.log(
        "✅ Sistema estável - nenhum problema crítico detectado nos últimos 30s",
      );
    }
  }

  private getEventsByType(events: any[]) {
    const byType: { [key: string]: number } = {};
    events.forEach((event) => {
      byType[event.type] = (byType[event.type] || 0) + 1;
    });
    return byType;
  }

  getFullReport() {
    console.group("📋 RELATÓRIO COMPLETO DO MONITOR");
    console.log("Total de eventos registados:", this.logs.length);
    console.log("Eventos por tipo:", this.getEventsByType(this.logs));
    console.log("Logs completos:", this.logs);
    console.groupEnd();

    return this.logs;
  }
}

// Instanciar e iniciar monitor
const monitor = new RealTimeMonitor();
monitor.startMonitoring();

// Expor globalmente para debug
(window as any).realtimeMonitor = monitor;

console.log(
  "🔍 Monitor em tempo real ativo. Use window.realtimeMonitor.getFullReport() para relatório completo.",
);
