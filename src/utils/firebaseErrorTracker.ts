/**
 * Sistema para rastrear erros Firebase e prevenir TOO_MANY_ATTEMPTS
 */

interface FirebaseError {
  timestamp: number;
  message: string;
  code?: string;
  stack?: string;
}

class FirebaseErrorTracker {
  private maxErrors = 10;
  private timeWindow = 5 * 60 * 1000; // 5 minutos

  logError(error: any) {
    try {
      const errorEntry: FirebaseError = {
        timestamp: Date.now(),
        message: error.message || "Unknown error",
        code: error.code,
        stack: error.stack,
      };

      // Obter erros existentes
      const existingErrors = this.getRecentErrors();

      // Adicionar novo erro
      existingErrors.push(errorEntry);

      // Limitar a maxErrors mais recentes
      const limitedErrors = existingErrors.slice(-this.maxErrors);

      // Guardar
      localStorage.setItem(
        "recent_firebase_errors",
        JSON.stringify(limitedErrors),
      );

      // Verificar se deve bloquear
      if (this.shouldBlock()) {
        console.warn(
          "🚨 TOO_MANY_ATTEMPTS detectado - ativando modo emergência",
        );
        this.activateEmergencyMode();
      }
    } catch (e) {
      console.error("Erro ao registar erro Firebase:", e);
    }
  }

  getRecentErrors(): FirebaseError[] {
    try {
      const stored = localStorage.getItem("recent_firebase_errors");
      if (!stored) return [];

      const errors = JSON.parse(stored);
      const now = Date.now();

      // Filtrar apenas erros recentes
      return errors.filter(
        (error: FirebaseError) => now - error.timestamp < this.timeWindow,
      );
    } catch (e) {
      return [];
    }
  }

  shouldBlock(): boolean {
    const recentErrors = this.getRecentErrors();

    // Contar erros críticos
    const criticalErrors = recentErrors.filter(
      (error) =>
        error.message.includes("TOO_MANY_ATTEMPTS") ||
        error.message.includes("WEAK_PASSWORD") ||
        error.code === "auth/too-many-requests" ||
        error.code === "auth/weak-password",
    );

    return criticalErrors.length >= 3; // 3 erros críticos = bloquear
  }

  activateEmergencyMode() {
    // Ativar modo emergência
    localStorage.setItem("firebase_blocked", "true");
    localStorage.setItem("force_emergency_login", "true");

    // Marcar globalmente
    (window as any).FIREBASE_BLOCKED = true;
    (window as any).FORCE_EMERGENCY_LOGIN = true;

    console.log("🚨 Modo emergência ativado devido a erros Firebase");
  }

  clearErrors() {
    localStorage.removeItem("recent_firebase_errors");
    localStorage.removeItem("firebase_blocked");
    localStorage.removeItem("force_emergency_login");

    delete (window as any).FIREBASE_BLOCKED;
    delete (window as any).FORCE_EMERGENCY_LOGIN;

    console.log("🧹 Erros Firebase limpos");
  }

  isBlocked(): boolean {
    return (
      localStorage.getItem("firebase_blocked") === "true" ||
      (window as any).FIREBASE_BLOCKED === true
    );
  }

  getStats() {
    const errors = this.getRecentErrors();
    const criticalCount = errors.filter(
      (e) =>
        e.message.includes("TOO_MANY_ATTEMPTS") ||
        e.message.includes("WEAK_PASSWORD"),
    ).length;

    return {
      totalErrors: errors.length,
      criticalErrors: criticalCount,
      isBlocked: this.isBlocked(),
      shouldBlock: this.shouldBlock(),
    };
  }
}

// Instanciar globalmente
const firebaseErrorTracker = new FirebaseErrorTracker();
(window as any).firebaseErrorTracker = firebaseErrorTracker;

// Interceptar erros Firebase automaticamente
const originalConsoleError = console.error;
console.error = (...args) => {
  // Verificar se é erro Firebase
  const errorStr = args.join(" ");
  if (
    errorStr.includes("Firebase") ||
    errorStr.includes("TOO_MANY_ATTEMPTS") ||
    errorStr.includes("WEAK_PASSWORD")
  ) {
    firebaseErrorTracker.logError({
      message: errorStr,
      timestamp: Date.now(),
    });
  }

  // Chamar console.error original
  originalConsoleError(...args);
};

console.log("🔍 Firebase Error Tracker ativo. Use window.firebaseErrorTracker");

export { firebaseErrorTracker, FirebaseErrorTracker };
