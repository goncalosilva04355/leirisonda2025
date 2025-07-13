/**
 * Firebase Ultra-Simples que SEMPRE funciona
 * Versão mínima sem erros getImmediate garantidos
 */

const firebaseConfig = {
  apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
  authDomain: "leirisonda-16f8b.firebaseapp.com",
  projectId: "leirisonda-16f8b",
  storageBucket: "leirisonda-16f8b.firebasestorage.app",
  messagingSenderId: "540456875574",
  appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
  measurementId: "G-R9W43EHH2C",
};

export class UltimateSimpleFirebase {
  private static app: any = null;
  private static db: any = null;
  private static auth: any = null;
  private static status = "not-started";

  // Método extremamente simples - completamente silencioso
  static async simpleInit(): Promise<boolean> {
    try {
      this.status = "initializing";

      // 1. Importar Firebase
      const { initializeApp, getApps } = await import("firebase/app");

      // 2. Verificar se já existe app
      const existingApps = getApps();
      if (existingApps.length > 0) {
        this.app = existingApps[0];
      } else {
        this.app = initializeApp(firebaseConfig);
      }

      // 3. Aguardar tempo suficiente para estabilização
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // 4. Tentar Auth (silenciosamente)
      try {
        const { getAuth } = await import("firebase/auth");
        this.auth = getAuth(this.app);
      } catch (authError) {
        this.auth = null;
      }

      // 5. Tentar Firestore (silenciosamente)
      try {
        const { getFirestore, connectFirestoreEmulator } = await import(
          "firebase/firestore"
        );
        this.db = getFirestore(this.app);

        // Test Firestore connectivity
        const { collection, getDocs } = await import("firebase/firestore");
        const testCol = collection(this.db, "__test__");
        await getDocs(testCol);

        console.log("✅ Firestore initialized and tested successfully");
      } catch (firestoreError) {
        console.warn("⚠️ Firestore initialization failed:", firestoreError);
        this.db = null;
      }

      // 6. Resultado final
      const success = !!(this.app && (this.auth || this.db));
      this.status = success ? "ready" : "failed";

      return success;
    } catch (error) {
      this.status = "failed";
      return false;
    }
  }

  // Getters simples
  static getDB(): any {
    return this.db;
  }

  static getAuth(): any {
    return this.auth;
  }

  static getStatus() {
    return {
      status: this.status,
      hasApp: !!this.app,
      hasAuth: !!this.auth,
      hasDB: !!this.db,
      ready: this.status === "ready",
    };
  }

  // Teste simples de conectividade
  static async testFirestore(): Promise<boolean> {
    if (!this.db) {
      console.log("❌ Firestore não disponível para teste");
      return false;
    }

    try {
      console.log("🧪 Testando Firestore...");
      const { collection, getDocs } = await import("firebase/firestore");

      const testCollection = collection(this.db, "test");
      await getDocs(testCollection);

      console.log("✅ Teste Firestore: SUCESSO");
      return true;
    } catch (error) {
      console.log("❌ Teste Firestore falhou:", error);
      return false;
    }
  }

  // Reset simples
  static reset() {
    this.app = null;
    this.db = null;
    this.auth = null;
    this.status = "not-started";
    console.log("🔄 UltimateSimpleFirebase reset");
  }
}

// Auto-initialize Firebase silently in background
if (typeof window !== "undefined") {
  setTimeout(async () => {
    console.log("🔇 Firebase inicializing silently in background...");
    const success = await UltimateSimpleFirebase.simpleInit();
    if (success) {
      console.log("🔇 Firebase ready silently");
    } else {
      console.log("🔇 Firebase partially ready - app will work in local mode");
    }
  }, 3000); // Start after 3 seconds to avoid startup conflicts
}
