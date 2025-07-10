// Diagnóstico completo da aplicação para identificação de bugs
export class AppDiagnostics {
  static async runFullDiagnostic(): Promise<{
    firebase: any;
    localStorage: any;
    errors: any[];
    performance: any;
    browser: any;
  }> {
    const report = {
      timestamp: new Date().toISOString(),
      firebase: await this.checkFirebase(),
      localStorage: this.checkLocalStorage(),
      errors: this.getStoredErrors(),
      performance: this.checkPerformance(),
      browser: this.checkBrowser(),
      features: this.checkFeatures(),
    };

    console.log("🔍 DIAGNÓSTICO COMPLETO DA APLICAÇÃO:", report);
    return report;
  }

  static async checkFirebase() {
    try {
      // Check Firebase configuration
      const firebaseStatus = {
        app: false,
        auth: false,
        firestore: false,
        errors: [] as string[],
      };

      // Try to import Firebase modules
      try {
        const { isFirebaseReady } = await import("../firebase/config");
        firebaseStatus.app = true;

        if (isFirebaseReady()) {
          firebaseStatus.auth = true;
          firebaseStatus.firestore = true;
        }
      } catch (error: any) {
        firebaseStatus.errors.push(`Firebase import error: ${error.message}`);
      }

      return firebaseStatus;
    } catch (error: any) {
      return {
        app: false,
        auth: false,
        firestore: false,
        errors: [`General Firebase error: ${error.message}`],
      };
    }
  }

  static checkLocalStorage() {
    try {
      const storageInfo = {
        available: true,
        quota: 0,
        usage: 0,
        keys: [] as string[],
        errors: [] as string[],
      };

      // Check if localStorage is available
      if (typeof Storage !== "undefined") {
        // Get all keys
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) storageInfo.keys.push(key);
        }

        // Estimate storage usage
        let totalSize = 0;
        storageInfo.keys.forEach((key) => {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        });
        storageInfo.usage = totalSize;

        // Check quota if available
        if (navigator.storage && navigator.storage.estimate) {
          navigator.storage.estimate().then((estimate) => {
            storageInfo.quota = estimate.quota || 0;
          });
        }
      } else {
        storageInfo.available = false;
        storageInfo.errors.push("localStorage not supported");
      }

      return storageInfo;
    } catch (error: any) {
      return {
        available: false,
        quota: 0,
        usage: 0,
        keys: [],
        errors: [`localStorage error: ${error.message}`],
      };
    }
  }

  static getStoredErrors() {
    try {
      const errors = JSON.parse(localStorage.getItem("app_errors") || "[]");
      return errors.slice(-10); // Last 10 errors
    } catch (error) {
      return [];
    }
  }

  static checkPerformance() {
    try {
      const performance = {
        memory: (window.performance as any)?.memory,
        timing: window.performance?.timing,
        navigation: window.performance?.navigation,
      };

      return performance;
    } catch (error: any) {
      return { error: error.message };
    }
  }

  static checkBrowser() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      platform: navigator.platform,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  }

  static checkFeatures() {
    return {
      serviceWorker: "serviceWorker" in navigator,
      notifications: "Notification" in window,
      geolocation: "geolocation" in navigator,
      indexedDB: "indexedDB" in window,
      webGL: this.checkWebGL(),
    };
  }

  static checkWebGL() {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return !!gl;
    } catch (error) {
      return false;
    }
  }

  static logError(error: Error, context: string) {
    try {
      const errorLog = {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      };

      const errors = JSON.parse(localStorage.getItem("app_errors") || "[]");
      errors.push(errorLog);

      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }

      localStorage.setItem("app_errors", JSON.stringify(errors));

      console.error(`🚨 [${context}]`, error);
    } catch (e) {
      console.error("Failed to log error:", e);
    }
  }

  static clearErrors() {
    localStorage.removeItem("app_errors");
    console.log("🧹 Error log cleared");
  }

  static async generateReport(): Promise<string> {
    const diagnostic = await this.runFullDiagnostic();

    let report = `RELATÓRIO DE DIAGNÓSTICO DA APLICAÇÃO
========================================
Data: ${diagnostic.timestamp}

FIREBASE:
---------
App: ${diagnostic.firebase.app ? "✅ OK" : "❌ FALHA"}
Auth: ${diagnostic.firebase.auth ? "✅ OK" : "❌ FALHA"}  
Firestore: ${diagnostic.firebase.firestore ? "✅ OK" : "❌ FALHA"}
Erros: ${diagnostic.firebase.errors.join(", ") || "Nenhum"}

ARMAZENAMENTO LOCAL:
-------------------
Disponível: ${diagnostic.localStorage.available ? "✅ SIM" : "❌ NÃO"}
Uso: ${(diagnostic.localStorage.usage / 1024).toFixed(2)} KB
Chaves: ${diagnostic.localStorage.keys.length}
Erros: ${diagnostic.localStorage.errors.join(", ") || "Nenhum"}

NAVEGADOR:
----------
User Agent: ${diagnostic.browser.userAgent}
Idioma: ${diagnostic.browser.language}
Online: ${diagnostic.browser.onLine ? "✅ SIM" : "❌ NÃO"}
Viewport: ${diagnostic.browser.viewport.width}x${diagnostic.browser.viewport.height}

FUNCIONALIDADES:
---------------
Service Worker: ${diagnostic.features.serviceWorker ? "✅ Suportado" : "❌ Não suportado"}
Notificações: ${diagnostic.features.notifications ? "✅ Suportado" : "❌ Não suportado"}
WebGL: ${diagnostic.features.webGL ? "✅ Suportado" : "❌ Não suportado"}

ERROS RECENTES:
--------------
${diagnostic.errors.length > 0 ? diagnostic.errors.map((err: any) => `${err.timestamp}: ${err.message}`).join("\n") : "Nenhum erro registado"}

========================================`;

    return report;
  }
}

export default AppDiagnostics;
