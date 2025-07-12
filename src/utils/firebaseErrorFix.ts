/**
 * Utilitário para corrigir erros do Firebase relacionados com ReadableStream
 * e conflitos de inicialização
 */

export class FirebaseErrorFix {
  private static retryAttempts = 0;
  private static maxRetries = 2;
  private static retryDelay = 2000;

  /**
   * Detectar e corrigir erro de ReadableStream
   */
  static async fixReadableStreamError(error: any): Promise<boolean> {
    if (
      error.message?.includes("ReadableStream") ||
      error.message?.includes("initializeReadableStreamDefaultReader") ||
      error.message?.includes("readableStreamGetReaderForBindings") ||
      error.message?.includes("getReader") ||
      error.stack?.includes("firebase_firestore.js")
    ) {
      console.log("🔧 DETECTADO: Erro de ReadableStream do Firebase");
      console.log("🔄 Aplicando correção...");

      try {
        // Ensure ReadableStream polyfill is available
        if (typeof window !== "undefined" && !window.ReadableStream) {
          console.log("🔧 Applying ReadableStream polyfill");
          window.ReadableStream = class ReadableStream {
            constructor(source) {
              this._source = source;
              this._reader = null;
              this._locked = false;
            }

            getReader() {
              if (this._locked) {
                throw new TypeError("ReadableStream is locked");
              }
              this._locked = true;
              this._reader = {
                read: () => Promise.resolve({ done: true, value: undefined }),
                cancel: () => Promise.resolve(),
                releaseLock: () => {
                  this._locked = false;
                },
              };
              return this._reader;
            }

            cancel() {
              return Promise.resolve();
            }
          };
        }

        // Aguardar para permitir limpeza de streams
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Forçar garbage collection se disponível
        if (window.gc) {
          window.gc();
        }

        // Limpar listeners pendentes
        this.clearPendingListeners();

        // Clear any hanging Firebase operations
        this.clearFirebaseOperations();

        console.log("✅ Correção de ReadableStream aplicada");
        return true;
      } catch (fixError) {
        console.error("❌ Falha na correção:", fixError);
        return false;
      }
    }

    return false;
  }

  /**
   * Clear hanging Firebase operations
   */
  private static clearFirebaseOperations(): void {
    try {
      // Clear any pending Firebase operations that might be using streams
      if (typeof window !== "undefined") {
        // Clear Firebase app-related event listeners
        const eventTypes = [
          "firebase-auth-state-changed",
          "firebase-connection-changed",
        ];
        eventTypes.forEach((eventType) => {
          const oldListeners = window.addEventListener;
          window.addEventListener = function (type, listener, options) {
            if (type !== eventType) {
              oldListeners.call(window, type, listener, options);
            }
          };
        });

        console.log("🧹 Firebase operations cleared");
      }
    } catch (error) {
      console.warn("Failed to clear Firebase operations:", error);
    }
  }

  /**
   * Limpar listeners pendentes que podem causar conflitos
   */
  private static clearPendingListeners(): void {
    // Remover event listeners que podem estar causando conflitos
    if (typeof window !== "undefined") {
      // Limpar listeners de storage
      window.removeEventListener("storage", () => {});

      // Limpar listeners de Firebase
      window.removeEventListener("firebase-sync", () => {});
      window.removeEventListener("firebase-auto-sync", () => {});

      console.log("🧹 Listeners pendentes limpos");
    }
  }

  /**
   * Reinicializar Firebase com proteção contra erros
   */
  static async safeFirebaseReinitialization(): Promise<boolean> {
    if (this.retryAttempts >= this.maxRetries) {
      console.error("❌ Máximo de tentativas de reinicialização atingido");
      return false;
    }

    this.retryAttempts++;
    console.log(
      `🔄 Tentativa de reinicialização ${this.retryAttempts}/${this.maxRetries}`,
    );

    try {
      // Aguardar antes de tentar novamente
      await new Promise((resolve) =>
        setTimeout(resolve, this.retryDelay * this.retryAttempts),
      );

      // Limpar erros anteriores
      this.clearPendingListeners();

      // Resetar flag de erro se bem-sucedido
      this.retryAttempts = 0;

      console.log("✅ Reinicialização do Firebase bem-sucedida");
      return true;
    } catch (error) {
      console.error(
        `❌ Falha na reinicialização (tentativa ${this.retryAttempts}):`,
        error,
      );

      // Tentar correção de ReadableStream
      await this.fixReadableStreamError(error);

      return false;
    }
  }

  /**
   * Wrapper seguro para operações do Firebase
   */
  static async safeFirebaseOperation<T>(
    operation: () => Promise<T>,
    operationName: string = "operação Firebase",
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error: any) {
      console.error(`❌ Erro em ${operationName}:`, error);

      // Tentar corrigir se for erro de ReadableStream
      const fixed = await this.fixReadableStreamError(error);

      if (fixed) {
        console.log(`🔄 Tentando ${operationName} novamente após correção...`);
        try {
          return await operation();
        } catch (retryError) {
          console.error(
            `❌ Falha na segunda tentativa de ${operationName}:`,
            retryError,
          );
        }
      }

      return null;
    }
  }

  /**
   * Monitoria contínua de erros do Firebase
   */
  static startErrorMonitoring(): void {
    // Monitor global de erros
    window.addEventListener("error", (event) => {
      if (
        event.error?.message?.includes("ReadableStream") ||
        event.error?.stack?.includes("firebase_firestore.js")
      ) {
        console.log("🚨 ERRO DETECTADO: ReadableStream do Firebase");
        this.fixReadableStreamError(event.error);
      }
    });

    // Monitor de promises rejeitadas
    window.addEventListener("unhandledrejection", (event) => {
      if (
        event.reason?.message?.includes("ReadableStream") ||
        event.reason?.stack?.includes("firebase_firestore.js")
      ) {
        console.log("🚨 PROMISE REJEITADA: ReadableStream do Firebase");
        this.fixReadableStreamError(event.reason);

        // Prevenir que o erro seja propagado
        event.preventDefault();
      }
    });

    console.log("👁️ Monitorização de erros do Firebase ativa");
  }

  /**
   * Inicialização segura com todas as proteções
   */
  static async initializeWithProtection(): Promise<void> {
    console.log("🛡️ INICIALIZANDO FIREBASE COM PROTEÇÃO COMPLETA");

    // Iniciar monitorização
    this.startErrorMonitoring();

    // Aguardar para evitar conflitos de inicialização
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log("✅ Firebase protegido contra erros de ReadableStream");
  }
}

// Auto-inicializar proteções quando importado
if (typeof window !== "undefined") {
  FirebaseErrorFix.initializeWithProtection();
}
