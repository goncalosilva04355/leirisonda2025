// Sistema de monitorização de estabilidade para prevenir crashes
export class StabilityMonitor {
  private static renderCount = 0;
  private static lastRender = Date.now();
  private static errorCount = 0;
  private static maxRenderFrequency = 100; // Max renders per second
  private static maxErrors = 10; // Max errors before emergency stop

  // Detectar re-renders excessivos
  static checkRenderFrequency(componentName: string): boolean {
    this.renderCount++;
    const now = Date.now();
    const timeDiff = now - this.lastRender;

    if (timeDiff < 1000 / this.maxRenderFrequency) {
      console.warn(`⚠️ ${componentName}: Render frequency too high`, {
        renderCount: this.renderCount,
        timeDiff,
        component: componentName,
      });

      // Se renders muito frequentes, pausar por 100ms
      if (this.renderCount > 50) {
        console.error(
          `🚨 EMERGENCY: ${componentName} render loop detected! Pausing...`,
        );
        this.emergencyPause();
        return false;
      }
    }

    this.lastRender = now;
    return true;
  }

  // Pausa de emergência para quebrar loops infinitos
  static emergencyPause() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.renderCount = 0;
        resolve(true);
      }, 100);
    });
  }

  // Monitorizar erros
  static recordError(error: Error, context: string) {
    this.errorCount++;

    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      errorCount: this.errorCount,
    };

    console.error(`🚨 Stability Error [${this.errorCount}]:`, errorInfo);

    // Guardar no localStorage para debug
    try {
      const errors = JSON.parse(
        localStorage.getItem("stability_errors") || "[]",
      );
      errors.push(errorInfo);

      // Manter apenas os últimos 20 erros
      if (errors.length > 20) {
        errors.splice(0, errors.length - 20);
      }

      localStorage.setItem("stability_errors", JSON.stringify(errors));
    } catch (e) {
      console.warn("Failed to store error in localStorage:", e);
    }

    // Emergency reset se muitos erros
    if (this.errorCount > this.maxErrors) {
      this.emergencyReset();
    }
  }

  // Reset de emergência
  static emergencyReset() {
    console.error("🆘 EMERGENCY RESET: Too many errors detected");

    // Limpar estados problemáticos
    try {
      sessionStorage.removeItem("savedLoginCredentials");
      localStorage.removeItem("currentUser");

      // Notificar utilizador
      alert(
        "A aplicação detetou problemas de estabilidade e vai recarregar para resolver.",
      );

      // Recarregar página após delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Emergency reset failed:", error);
      window.location.reload(); // Fallback
    }
  }

  // Verificar memória (se disponível)
  static checkMemoryUsage(): { warning: boolean; info: any } {
    try {
      const memory = (performance as any).memory;
      if (memory) {
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
        const percentage = (usedMB / limitMB) * 100;

        const warning = percentage > 80;

        if (warning) {
          console.warn("⚠️ Memory usage high:", {
            used: `${usedMB.toFixed(2)} MB`,
            limit: `${limitMB.toFixed(2)} MB`,
            percentage: `${percentage.toFixed(1)}%`,
          });
        }

        return {
          warning,
          info: {
            used: usedMB,
            limit: limitMB,
            percentage,
          },
        };
      }
    } catch (error) {
      console.warn("Memory check failed:", error);
    }

    return { warning: false, info: null };
  }

  // Hook para useEffect seguro
  static createSafeEffect(
    callback: () => void | (() => void),
    deps: any[],
    name: string,
  ) {
    return () => {
      try {
        if (!this.checkRenderFrequency(`useEffect:${name}`)) {
          return;
        }

        return callback();
      } catch (error: any) {
        this.recordError(error, `useEffect:${name}`);
        return () => {}; // Return safe cleanup
      }
    };
  }

  // Wrapper para componentes
  static wrapComponent<T>(Component: React.ComponentType<T>, name: string) {
    return (props: T) => {
      try {
        if (!this.checkRenderFrequency(`Component:${name}`)) {
          return null; // Skip render se muito frequente
        }

        return React.createElement(Component, props);
      } catch (error: any) {
        this.recordError(error, `Component:${name}`);
        return React.createElement(
          "div",
          {
            className:
              "p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm",
          },
          `Erro no componente ${name}`,
        );
      }
    };
  }

  // Reset contadores (chamar periodicamente)
  static reset() {
    this.renderCount = 0;
    this.errorCount = 0;
    this.lastRender = Date.now();
  }

  // Inicializar monitorização
  static initialize() {
    console.log("🛡️ Stability Monitor inicializado");

    // Reset contadores a cada 10 segundos
    setInterval(() => {
      this.reset();
    }, 10000);

    // Verificar memória a cada minuto
    setInterval(() => {
      this.checkMemoryUsage();
    }, 60000);

    // Escutar erros globais
    window.addEventListener("error", (event) => {
      this.recordError(event.error, "Global Error");
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.recordError(
        new Error(event.reason?.message || "Unhandled Promise Rejection"),
        "Promise Rejection",
      );
    });
  }

  // Obter relatório de estabilidade
  static getStabilityReport() {
    const errors = JSON.parse(localStorage.getItem("stability_errors") || "[]");
    const memory = this.checkMemoryUsage();

    return {
      renderCount: this.renderCount,
      errorCount: this.errorCount,
      recentErrors: errors.slice(-5),
      memory: memory.info,
      timestamp: new Date().toISOString(),
    };
  }
}

export default StabilityMonitor;
