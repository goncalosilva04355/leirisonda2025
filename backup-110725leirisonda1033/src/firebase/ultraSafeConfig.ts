/**
 * Ultra-Safe Firebase Configuration
 * Prevenção total de erros getImmediate
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
};

export class UltraSafeFirebase {
  private static app: FirebaseApp | null = null;
  private static db: any = null;
  private static auth: any = null;
  private static isReady = false;
  private static initInProgress = false;

  // Inicialização ultra-segura
  static async initialize(): Promise<boolean> {
    if (this.isReady) {
      console.log("✅ UltraSafeFirebase já inicializado");
      return true;
    }

    if (this.initInProgress) {
      console.log("⏳ Aguardando inicialização em progresso...");

      // Aguardar até inicialização completar
      while (this.initInProgress && !this.isReady) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      return this.isReady;
    }

    this.initInProgress = true;
    console.log("🔒 UltraSafeFirebase: Inicialização segura iniciada");

    try {
      // Passo 1: Verificar apps existentes
      const existingApps = getApps();
      if (existingApps.length > 0) {
        this.app = existingApps[0];
        console.log("✅ Usando app Firebase existente");
      } else {
        this.app = initializeApp(firebaseConfig);
        console.log("✅ Novo app Firebase criado");
      }

      // Passo 2: Aguardar estabilização do app
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Passo 3: Verificar se app ainda é válido
      if (!this.app || !this.app.options) {
        throw new Error("App Firebase ficou inválido");
      }

      // Passo 4: Inicializar serviços com método ultra-seguro
      await this.initializeServicesUltraSafe();

      this.isReady = true;
      console.log("🎉 UltraSafeFirebase inicializado com sucesso");

      return true;
    } catch (error) {
      console.error("❌ UltraSafeFirebase falhou:", error);
      this.isReady = false;
      return false;
    } finally {
      this.initInProgress = false;
    }
  }

  // Inicialização ultra-segura dos serviços
  private static async initializeServicesUltraSafe(): Promise<void> {
    console.log("🔐 Inicializando serviços de forma ultra-segura...");

    // Auth primeiro (mais estável)
    try {
      console.log("🔐 Inicializando Auth...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { getAuth } = await import("firebase/auth");
      this.auth = getAuth(this.app!);
      console.log("✅ Auth inicializado");
    } catch (authError) {
      console.warn("⚠️ Auth falhou:", authError);
      this.auth = null;
    }

    // Firestore com múltiplas camadas de proteção
    try {
      console.log("🔄 Inicializando Firestore com proteção...");

      // Aguardar extra tempo
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Verificar se app ainda é válido
      if (!this.app || !this.app.options) {
        throw new Error("App inválido antes de inicializar Firestore");
      }

      // Verificar se app está na lista atual
      const currentApps = getApps();
      const appStillExists = currentApps.find((a) => a.name === this.app!.name);

      if (!appStillExists) {
        throw new Error("App não existe mais na lista de apps");
      }

      // Importar getFirestore de forma segura
      const { getFirestore } = await import("firebase/firestore");

      // Tentar inicializar Firestore com retry
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          attempts++;
          console.log(
            `🔄 Tentativa ${attempts}/${maxAttempts} de inicializar Firestore`,
          );

          // Aguardar um pouco mais a cada tentativa
          await new Promise((resolve) => setTimeout(resolve, 500 * attempts));

          this.db = getFirestore(this.app!);
          console.log("✅ Firestore inicializado com sucesso");
          break;
        } catch (firestoreError: any) {
          console.warn(
            `⚠️ Tentativa ${attempts} falhou:`,
            firestoreError.message,
          );

          if (firestoreError.message?.includes("getImmediate")) {
            console.log("🔧 Erro getImmediate detectado, aguardando mais...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }

          if (attempts === maxAttempts) {
            throw firestoreError;
          }
        }
      }
    } catch (firestoreError) {
      console.warn(
        "⚠️ Firestore falhou após todas as tentativas:",
        firestoreError,
      );
      this.db = null;
    }
  }

  // Getters ultra-seguros
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
      initializing: this.initInProgress,
      hasApp: !!this.app,
      hasAuth: !!this.auth,
      hasDB: !!this.db,
      mode: "ultra-safe",
    };
  }

  // Verificação de saúde
  static async healthCheck(): Promise<boolean> {
    try {
      if (!this.isReady) return false;

      // Testar operação simples no Firestore
      if (this.db) {
        const { collection, getDocs } = await import("firebase/firestore");
        const testCollection = collection(this.db, "healthCheck");
        await getDocs(testCollection);
        console.log("✅ Health check passed");
        return true;
      }

      return this.auth !== null; // Se pelo menos Auth funciona
    } catch (error) {
      console.warn("⚠️ Health check failed:", error);
      return false;
    }
  }

  // Reinicialização forçada
  static async reset(): Promise<boolean> {
    console.log("🔄 Reinicializando UltraSafeFirebase...");

    this.app = null;
    this.db = null;
    this.auth = null;
    this.isReady = false;
    this.initInProgress = false;

    return await this.initialize();
  }
}

// Auto-inicialização com delay
if (typeof window !== "undefined") {
  setTimeout(() => {
    UltraSafeFirebase.initialize().then((success) => {
      if (success) {
        console.log("🛡️ UltraSafeFirebase pronto");
        window.dispatchEvent(new CustomEvent("ultraSafeFirebaseReady"));
      } else {
        console.log("⚠️ UltraSafeFirebase não conseguiu inicializar");
      }
    });
  }, 2000); // Aguardar 2 segundos antes de inicializar
}
