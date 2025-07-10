// Sistema de cache agressivo para máxima performance
export class CacheManager {
  private static memoryCache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();
  private static storageCache = new Map<string, any>();

  // Cache em memória com TTL
  static setMemoryCache<T>(key: string, data: T, ttlMs: number = 60000): void {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });

    // Cleanup automático
    setTimeout(() => {
      this.memoryCache.delete(key);
    }, ttlMs);
  }

  static getMemoryCache<T>(key: string): T | null {
    const cached = this.memoryCache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.memoryCache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  // Cache persistente otimizado
  static setStorageCache<T>(key: string, data: T): void {
    try {
      this.storageCache.set(key, data);
      localStorage.setItem(`cache_${key}`, JSON.stringify(data));
    } catch (error) {
      console.warn("Storage cache failed:", error);
      // Use only memory cache if localStorage fails
      this.setMemoryCache(key, data, 300000); // 5 minutes
    }
  }

  static getStorageCache<T>(key: string): T | null {
    // Try memory cache first (faster)
    const memoryData = this.storageCache.get(key);
    if (memoryData) return memoryData as T;

    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        const data = JSON.parse(stored) as T;
        this.storageCache.set(key, data); // Cache in memory for next time
        return data;
      }
    } catch (error) {
      console.warn("Storage cache read failed:", error);
    }

    return null;
  }

  // Cache para funções com memoização automática
  static memoize<TArgs extends any[], TReturn>(
    fn: (...args: TArgs) => TReturn,
    keyGenerator?: (...args: TArgs) => string,
    ttlMs: number = 60000,
  ): (...args: TArgs) => TReturn {
    return (...args: TArgs): TReturn => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      const cacheKey = `fn_${fn.name}_${key}`;

      // Check cache first
      const cached = this.getMemoryCache<TReturn>(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Execute function and cache result
      const result = fn(...args);
      this.setMemoryCache(cacheKey, result, ttlMs);

      return result;
    };
  }

  // Cache para promises (evita múltiplas chamadas simultâneas)
  private static promiseCache = new Map<string, Promise<any>>();

  static memoizePromise<TArgs extends any[], TReturn>(
    fn: (...args: TArgs) => Promise<TReturn>,
    keyGenerator?: (...args: TArgs) => string,
    ttlMs: number = 60000,
  ): (...args: TArgs) => Promise<TReturn> {
    return async (...args: TArgs): Promise<TReturn> => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      const cacheKey = `promise_${fn.name}_${key}`;

      // Check if promise is already running
      const runningPromise = this.promiseCache.get(cacheKey);
      if (runningPromise) {
        return runningPromise;
      }

      // Check memory cache
      const cached = this.getMemoryCache<TReturn>(cacheKey);
      if (cached !== null) {
        return Promise.resolve(cached);
      }

      // Execute promise and cache
      const promise = fn(...args);
      this.promiseCache.set(cacheKey, promise);

      try {
        const result = await promise;
        this.setMemoryCache(cacheKey, result, ttlMs);
        return result;
      } finally {
        this.promiseCache.delete(cacheKey);
      }
    };
  }

  // Cleanup e gestão de memória
  static cleanup(): void {
    const now = Date.now();

    // Clean expired memory cache
    for (const [key, cached] of this.memoryCache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.memoryCache.delete(key);
      }
    }

    // Clean storage cache if too large
    if (this.storageCache.size > 100) {
      const keys = Array.from(this.storageCache.keys());
      const toDelete = keys.slice(0, 50); // Remove oldest 50
      toDelete.forEach((key) => {
        this.storageCache.delete(key);
        localStorage.removeItem(`cache_${key}`);
      });
    }

    console.log(
      `🧹 Cache cleanup: ${this.memoryCache.size} memory, ${this.storageCache.size} storage`,
    );
  }

  // Inicialização
  static initialize(): void {
    console.log("💾 Cache Manager initialized");

    // Cleanup automático a cada 2 minutos
    setInterval(() => this.cleanup(), 120000);

    // Cleanup quando página é escondida
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.cleanup();
      }
    });

    // Emergency cleanup em caso de memory pressure
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;

        if (usedMB > 150) {
          // Se usar mais de 150MB
          console.warn("🚨 Memory pressure detected, aggressive cleanup");
          this.memoryCache.clear();
          this.storageCache.clear();
          this.promiseCache.clear();
        }
      }, 30000);
    }
  }

  // Estatísticas
  static getStats(): {
    memoryCache: number;
    storageCache: number;
    promiseCache: number;
  } {
    return {
      memoryCache: this.memoryCache.size,
      storageCache: this.storageCache.size,
      promiseCache: this.promiseCache.size,
    };
  }

  // Clear all caches
  static clearAll(): void {
    this.memoryCache.clear();
    this.storageCache.clear();
    this.promiseCache.clear();

    // Clear localStorage cache entries
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("cache_")) {
        localStorage.removeItem(key);
      }
    });

    console.log("🧹 All caches cleared");
  }
}

export default CacheManager;
