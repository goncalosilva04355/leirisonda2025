/**
 * Correção de emergência para problemas de conectividade
 * Usa abordagem mais agressiva para forçar reconexão
 */

export class EmergencyConnectivityFix {
  /**
   * Correção de emergência completa
   */
  static async emergencyFix(): Promise<{ success: boolean; message: string }> {
    console.log("🚨 INICIANDO CORREÇÃO DE EMERGÊNCIA...");

    try {
      // 1. Limpar TUDO (cache, storage, etc)
      await this.nuclearCleanup();

      // 2. Forçar reconexão de rede
      await this.forceNetworkReconnection();

      // 3. Reinicializar Firebase do zero
      await this.emergencyFirebaseReset();

      // 4. Aguardar estabilização
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return {
        success: true,
        message:
          "✅ Correção de emergência aplicada! A página será recarregada.",
      };
    } catch (error: any) {
      console.error("❌ Erro na correção de emergência:", error);
      return {
        success: false,
        message: `❌ Falha na correção: ${error.message}`,
      };
    }
  }

  /**
   * Limpeza nuclear de tudo
   */
  private static async nuclearCleanup(): Promise<void> {
    console.log("💥 Limpeza nuclear iniciada...");

    try {
      // Limpar todos os storages
      localStorage.clear();
      sessionStorage.clear();

      // Limpar todos os caches
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
        }
      }

      // Limpar IndexedDB se possível
      if ("indexedDB" in window) {
        try {
          // Tentar limpar Firebase Firestore cache
          const databases = ["firestore"];
          for (const dbName of databases) {
            const deleteReq = indexedDB.deleteDatabase(dbName);
            deleteReq.onsuccess = () =>
              console.log(`Database ${dbName} deleted`);
            deleteReq.onerror = () =>
              console.warn(`Failed to delete ${dbName}`);
          }
        } catch (idbError) {
          console.warn("IndexedDB cleanup failed:", idbError);
        }
      }

      console.log("✅ Limpeza nuclear completa");
    } catch (error) {
      console.warn("⚠️ Erro na limpeza:", error);
    }
  }

  /**
   * Forçar reconexão de rede
   */
  private static async forceNetworkReconnection(): Promise<void> {
    console.log("🌐 Forçando reconexão de rede...");

    try {
      // Simular desconexão e reconexão
      if ("navigator" in window && "serviceWorker" in navigator) {
        // Tentar registrar/desregistrar service worker para forçar cache refresh
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      // Forçar DNS flush (melhor esforço)
      const testUrls = [
        "https://firebase.googleapis.com/favicon.ico",
        "https://firestore.googleapis.com/favicon.ico",
      ];

      for (const url of testUrls) {
        try {
          await fetch(url, {
            mode: "no-cors",
            cache: "no-cache",
            headers: { "Cache-Control": "no-cache" },
          });
        } catch (testError) {
          console.warn(`Teste de conectividade falhou para ${url}:`, testError);
        }
      }

      console.log("✅ Reconexão de rede tentada");
    } catch (error) {
      console.warn("⚠️ Erro na reconexão:", error);
    }
  }

  /**
   * Reset emergencial do Firebase
   */
  private static async emergencyFirebaseReset(): Promise<void> {
    console.log("🔥 Reset emergencial do Firebase...");

    try {
      // Importar dinâmicamente para evitar problemas de carregamento
      const { getApps, deleteApp, initializeApp } = await import(
        "firebase/app"
      );

      // Remover todas as instâncias Firebase existentes
      const apps = getApps();
      for (const app of apps) {
        try {
          await deleteApp(app);
          console.log("Firebase app removida:", app.name);
        } catch (deleteError) {
          console.warn("Erro ao remover app:", deleteError);
        }
      }

      // Aguardar um pouco
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reinicializar com configuração limpa
      const firebaseConfig = {
        apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
        authDomain: "leirisonda-16f8b.firebaseapp.com",
        projectId: "leirisonda-16f8b",
        storageBucket: "leirisonda-16f8b.firebasestorage.app",
        messagingSenderId: "540456875574",
        appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
        measurementId: "G-R9W43EHH2C",
      };

      const newApp = initializeApp(firebaseConfig, "emergency-app");
      console.log("✅ Firebase app emergencial criada:", newApp.name);

      // Tentar inicializar serviços básicos
      const { getFirestore } = await import("firebase/firestore");
      const { getAuth } = await import("firebase/auth");

      const db = getFirestore(newApp);
      const auth = getAuth(newApp);

      console.log("✅ Serviços Firebase emergenciais inicializados");
    } catch (error) {
      console.warn("⚠️ Erro no reset Firebase:", error);
    }
  }

  /**
   * Teste rápido de conectividade
   */
  static async quickConnectivityTest(): Promise<{
    internet: boolean;
    firebase: boolean;
    firestore: boolean;
  }> {
    const result = {
      internet: false,
      firebase: false,
      firestore: false,
    };

    // Teste básico de internet
    try {
      await fetch("https://www.google.com/favicon.ico", {
        mode: "no-cors",
        signal: AbortSignal.timeout(5000),
      });
      result.internet = true;
    } catch (error) {
      console.warn("Internet test failed:", error);
    }

    // Teste Firebase
    try {
      await fetch("https://firebase.googleapis.com", {
        mode: "no-cors",
        signal: AbortSignal.timeout(5000),
      });
      result.firebase = true;
    } catch (error) {
      console.warn("Firebase test failed:", error);
    }

    // Teste Firestore
    try {
      await fetch("https://firestore.googleapis.com", {
        mode: "no-cors",
        signal: AbortSignal.timeout(5000),
      });
      result.firestore = true;
    } catch (error) {
      console.warn("Firestore test failed:", error);
    }

    return result;
  }
}
