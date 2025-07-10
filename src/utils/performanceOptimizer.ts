// Sistema de otimização de performance agressivo
import React from "react";

export class PerformanceOptimizer {
  private static renderCounts = new Map<string, number>();
  private static lastRenderTime = new Map<string, number>();
  private static componentCache = new Map<string, any>();

  // Throttle renders para prevenir loops infinitos
  static throttleRender(
    componentName: string,
    maxRendersPerSecond: number = 5,
  ): boolean {
    const now = Date.now();
    const lastRender = this.lastRenderTime.get(componentName) || 0;
    const renderCount = this.renderCounts.get(componentName) || 0;

    // Reset counter se passou 1 segundo
    if (now - lastRender > 1000) {
      this.renderCounts.set(componentName, 0);
    }

    const currentCount = this.renderCounts.get(componentName) || 0;

    if (currentCount >= maxRendersPerSecond) {
      console.warn(
        `⚠️ ${componentName}: Render throttled (${currentCount} renders/sec)`,
      );
      return false; // Skip render
    }

    this.renderCounts.set(componentName, currentCount + 1);
    this.lastRenderTime.set(componentName, now);
    return true; // Allow render
  }

  // Memoização agressiva para componentes
  static memoizeComponent<T>(
    Component: React.ComponentType<T>,
    name: string,
    propsComparator?: (prevProps: T, nextProps: T) => boolean,
  ): React.ComponentType<T> {
    const MemoizedComponent = React.memo(Component, propsComparator);

    return (props: T) => {
      // Throttle renders
      if (!this.throttleRender(name, 3)) {
        // Return cached version if render is throttled
        const cached = this.componentCache.get(name);
        if (cached) {
          return cached;
        }
      }

      try {
        const result = React.createElement(MemoizedComponent, props);
        this.componentCache.set(name, result);
        return result;
      } catch (error) {
        console.error(`Error rendering ${name}:`, error);
        return React.createElement(
          "div",
          {
            className:
              "p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs",
          },
          `Erro no componente ${name}`,
        );
      }
    };
  }

  // Debounce para funções caras
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number = 300,
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  // Cache para resultados de computações caras
  private static computationCache = new Map<
    string,
    { result: any; timestamp: number }
  >();

  static memoizeComputation<T>(
    computation: () => T,
    key: string,
    ttl: number = 5000, // 5 segundos
  ): T {
    const cached = this.computationCache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < ttl) {
      return cached.result;
    }

    const result = computation();
    this.computationCache.set(key, { result, timestamp: now });
    return result;
  }

  // Cleanup periódico para evitar memory leaks
  static startCleanup(intervalMs: number = 30000) {
    setInterval(() => {
      const now = Date.now();

      // Limpar contadores antigos
      for (const [key, timestamp] of this.lastRenderTime.entries()) {
        if (now - timestamp > 10000) {
          // 10 segundos
          this.renderCounts.delete(key);
          this.lastRenderTime.delete(key);
        }
      }

      // Limpar cache antigo
      for (const [key, cached] of this.computationCache.entries()) {
        if (now - cached.timestamp > 60000) {
          // 1 minuto
          this.computationCache.delete(key);
        }
      }

      // Limpar component cache se muito grande
      if (this.componentCache.size > 50) {
        this.componentCache.clear();
      }
    }, intervalMs);
  }

  // Hook otimizado para useState
  static useOptimizedState<T>(
    initialValue: T,
    name: string,
  ): [T, (value: T | ((prev: T) => T)) => void] {
    const [state, setState] = React.useState(initialValue);

    const optimizedSetState = React.useCallback(
      this.debounce((value: T | ((prev: T) => T)) => {
        if (!this.throttleRender(`useState:${name}`, 10)) {
          return; // Skip update se muito frequente
        }
        setState(value);
      }, 50),
      [name],
    );

    return [state, optimizedSetState];
  }

  // Hook otimizado para useEffect
  static useOptimizedEffect(
    effect: React.EffectCallback,
    deps: React.DependencyList | undefined,
    name: string,
  ): void {
    const depsString = JSON.stringify(deps);
    const lastDeps = React.useRef<string>("");

    React.useEffect(() => {
      // Skip se dependências não mudaram
      if (lastDeps.current === depsString) {
        return;
      }

      // Skip se renders muito frequentes
      if (!this.throttleRender(`useEffect:${name}`, 2)) {
        return;
      }

      lastDeps.current = depsString;
      return effect();
    }, deps);
  }

  // Monitorização de performance
  static monitorPerformance() {
    // Monitor memory usage
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;

      if (usedMB > 100) {
        // Se usar mais de 100MB
        console.warn(`⚠️ High memory usage: ${usedMB.toFixed(2)}MB`);

        // Force garbage collection se disponível
        if ("gc" in window) {
          (window as any).gc();
        }

        // Clear caches
        this.componentCache.clear();
        this.computationCache.clear();
      }
    }

    // Monitor render performance
    const renderCounts = Array.from(this.renderCounts.entries());
    const highRenderComponents = renderCounts.filter(
      ([_, count]) => count > 20,
    );

    if (highRenderComponents.length > 0) {
      console.warn(
        "⚠️ Components with high render count:",
        highRenderComponents,
      );
    }
  }

  // Inicialização
  static initialize() {
    console.log("🚀 Performance Optimizer initialized");

    // Start cleanup
    this.startCleanup();

    // Monitor performance every 10 seconds
    setInterval(() => this.monitorPerformance(), 10000);

    // Listen for page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // Clear caches when page is hidden
        this.componentCache.clear();
      }
    });
  }
}

export default PerformanceOptimizer;
