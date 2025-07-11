/**
 * Sistema Firebase Unificado e Seguro
 * Substitui TODOS os outros sistemas Firebase para eliminar conflitos
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
};

export class UnifiedSafeFirebase {
  private static app: FirebaseApp | null = null;
  private static db: any = null;
  private static auth: any = null;
  private static isReady = false;
  private static isInitializing = false;
  private static initPromise: Promise<boolean> | null = null;

  // Singleton pattern - apenas uma inicialização
  static async initialize(): Promise<boolean> {
    // Se já está inicializado, retornar
    if (this.isReady) {
      console.log("✅ UnifiedSafeFirebase já está pronto");
      return true;
    }

    // Se já está inicializando, aguardar
    if (this.isInitializing && this.initPromise) {
      console.log("⏳ Aguardando inicialização em progresso...");
      return await this.initPromise;
    }

    // Iniciar nova inicialização
    this.isInitializing = true;
    console.log("🚀 UnifiedSafeFirebase: Inicialização única iniciada");

    this.initPromise = this.performInitialization();
    const result = await this.initPromise;

    this.isInitializing = false;
    return result;
  }

  private static async performInitialization(): Promise<boolean> {
    try {
      // Passo 1: Limpar qualquer app Firebase existente
      console.log("🧹 Limpando apps Firebase existentes...");
      const existingApps = getApps();
      for (const app of existingApps) {
        try {
          await import("firebase/app").then(({ deleteApp }) => deleteApp(app));
          console.log("🗑️ App Firebase removido");
        } catch (error) {
          console.warn("⚠️ Erro ao remover app:", error);
        }
      }

      // Passo 2: Aguardar limpeza completa
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Passo 3: Criar novo app Firebase
      console.log("🔧 Criando novo app Firebase...");
      this.app = initializeApp(firebaseConfig);

      if (!this.app || !this.app.options) {
        throw new Error("Falha ao criar app Firebase");
      }

      console.log("✅ App Firebase criado:", this.app.name);

      // Passo 4: Aguardar estabilização do app
      console.log("⏳ Aguardando estabilização...");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Passo 5: Verificar se app ainda é válido
      const currentApps = getApps();
      const appExists = currentApps.find((a) => a.name === this.app!.name);

      if (!appExists) {
        throw new Error("App Firebase desapareceu após estabilização");
      }

      // Passo 6: Inicializar Auth de forma segura
      await this.initializeAuth();

      // Passo 7: Inicializar Firestore de forma segura
      await this.initializeFirestore();

      // Passo 8: Verificar se pelo menos um serviço funciona
      const success = this.auth !== null || this.db !== null;

      if (success) {
        this.isReady = true;
        console.log("🎉 UnifiedSafeFirebase inicializado com sucesso!");
        console.log(`📊 Status: Auth=${!!this.auth}, DB=${!!this.db}`);

        // Notificar componentes
        window.dispatchEvent(
          new CustomEvent("unifiedFirebaseReady", {
            detail: { auth: !!this.auth, db: !!this.db },
          }),
        );

        return true;
      } else {
        throw new Error("Nenhum serviço Firebase funcionou");
      }
    } catch (error) {
      console.error("❌ UnifiedSafeFirebase falhou:", error);
      this.isReady = false;
      return false;
    }
  }

  private static async initializeAuth(): Promise<void> {
    try {
      console.log("🔐 Inicializando Auth...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { getAuth } = await import("firebase/auth");
      this.auth = getAuth(this.app!);

      console.log("✅ Auth inicializado");
    } catch (error) {
      console.warn("⚠️ Auth falhou:", error);
      this.auth = null;
    }
  }

  private static async initializeFirestore(): Promise<void> {
    try {
      console.log("🔄 Inicializando Firestore com máxima segurança...");

      // Aguardar ainda mais para Firestore
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Verificar se app ainda é válido
      if (!this.app || !this.app.options) {
        throw new Error("App inválido antes de Firestore");
      }

      // Verificar se app ainda está na lista
      const currentApps = getApps();
      const ourApp = currentApps.find((a) => a.name === this.app!.name);

      if (!ourApp) {
        throw new Error("App não encontrado na lista");
      }

      // Tentar inicializar Firestore com retry
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        try {
          attempts++;
          console.log(`🔄 Tentativa ${attempts}/${maxAttempts} Firestore...`);

          // Aguardar mais a cada tentativa
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));

          const { getFirestore } = await import("firebase/firestore");
          this.db = getFirestore(ourApp);

          console.log("✅ Firestore inicializado!");
          break;
        } catch (firestoreError: any) {
          console.warn(
            `⚠️ Tentativa ${attempts} falhou:`,
            firestoreError.message,
          );

          if (firestoreError.message?.includes("getImmediate")) {
            console.log("🔧 getImmediate detectado, aguardando mais...");
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }

          if (attempts === maxAttempts) {
            console.error("❌ Firestore falhou após todas as tentativas");
            this.db = null;
            break;
          }
        }
      }
    } catch (error) {
      console.error("❌ Erro geral no Firestore:", error);
      this.db = null;
    }
  }

  // Getters públicos seguros
  static async getDB(): Promise<any> {
    if (!this.isReady) {
      const success = await this.initialize();
      if (!success) return null;
    }
    return this.db;
  }

  static async getAuth(): Promise<any> {
    if (!this.isReady) {
      const success = await this.initialize();
      if (!success) return null;
    }
    return this.auth;
  }

  static getStatus() {
    return {
      ready: this.isReady,
      initializing: this.isInitializing,
      hasApp: !!this.app,
      hasAuth: !!this.auth,
      hasDB: !!this.db,
      mode: "unified-safe",
    };
  }

  // Teste de conectividade
  static async testConnectivity(): Promise<{
    canRead: boolean;
    canWrite: boolean;
    error?: string;
  }> {
    const result = {
      canRead: false,
      canWrite: false,
      error: undefined as string | undefined,
    };

    try {
      const db = await this.getDB();

      if (!db) {
        result.error = "Firestore não disponível";
        return result;
      }

      console.log("🧪 Testando conectividade Firestore...");

      // Teste de leitura
      try {
        const { collection, getDocs } = await import("firebase/firestore");
        const testCol = collection(db, "connectivityTest");
        await getDocs(testCol);
        result.canRead = true;
        console.log("✅ Leitura OK");
      } catch (readError) {
        console.log("❌ Leitura falhou:", readError);
        result.error = `Leitura: ${readError}`;
      }

      // Teste de escrita
      try {
        const { collection, addDoc } = await import("firebase/firestore");
        const testCol = collection(db, "connectivityTest");
        await addDoc(testCol, {
          timestamp: new Date(),
          test: "unified-connectivity",
          device: "iPhone",
        });
        result.canWrite = true;
        console.log("✅ Escrita OK");
      } catch (writeError) {
        console.log("❌ Escrita falhou:", writeError);
        if (!result.error) {
          result.error = `Escrita: ${writeError}`;
        }
      }
    } catch (error) {
      result.error =
        error instanceof Error ? error.message : "Erro desconhecido";
    }

    return result;
  }

  // Reset completo
  static async reset(): Promise<void> {
    console.log("🔄 Reset completo do UnifiedSafeFirebase...");

    this.app = null;
    this.db = null;
    this.auth = null;
    this.isReady = false;
    this.isInitializing = false;
    this.initPromise = null;
  }
}

// Exportar como sistema padrão
export const firebaseDB = {
  getDB: () => UnifiedSafeFirebase.getDB(),
  getAuth: () => UnifiedSafeFirebase.getAuth(),
  initialize: () => UnifiedSafeFirebase.initialize(),
  getStatus: () => UnifiedSafeFirebase.getStatus(),
  testConnectivity: () => UnifiedSafeFirebase.testConnectivity(),
};

console.log(
  "🛡️ UnifiedSafeFirebase carregado (sem auto-init para evitar conflitos)",
);
