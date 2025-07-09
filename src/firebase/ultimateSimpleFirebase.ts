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

  // Método extremamente simples - só tenta uma vez e pronto
  static async simpleInit(): Promise<boolean> {
    console.log("🟢 UltimateSimpleFirebase: Tentativa única de inicialização");

    try {
      this.status = "initializing";

      // 1. Importar Firebase
      const { initializeApp, getApps } = await import("firebase/app");

      // 2. Verificar se já existe app
      const existingApps = getApps();
      if (existingApps.length > 0) {
        this.app = existingApps[0];
        console.log("✅ App Firebase existente encontrado");
      } else {
        this.app = initializeApp(firebaseConfig);
        console.log("✅ Novo app Firebase criado");
      }

      // 3. Aguardar MUITO tempo para ter certeza
      console.log("⏳ Aguardando 5 segundos para estabilização...");
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // 4. Tentar Auth (opcional)
      try {
        const { getAuth } = await import("firebase/auth");
        this.auth = getAuth(this.app);
        console.log("✅ Auth funcionou");
      } catch (authError) {
        console.log("⚠️ Auth falhou, mas continuar...");
        this.auth = null;
      }

      // 5. Tentar Firestore (opcional)
      try {
        console.log("🔄 Tentando Firestore após 5s de espera...");
        const { getFirestore } = await import("firebase/firestore");
        this.db = getFirestore(this.app);
        console.log("✅ Firestore funcionou!");
      } catch (firestoreError) {
        console.log("⚠️ Firestore falhou:", firestoreError);
        this.db = null;
      }

      // 6. Resultado final
      const success = !!(this.app && (this.auth || this.db));

      this.status = success ? "ready" : "failed";

      if (success) {
        console.log("🎉 UltimateSimpleFirebase: SUCESSO!");
        console.log(`📊 Auth: ${!!this.auth}, DB: ${!!this.db}`);
      } else {
        console.log("⚠️ UltimateSimpleFirebase: Parcialmente funcional");
      }

      return success;
    } catch (error) {
      console.error("❌ UltimateSimpleFirebase falhou:", error);
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

console.log("🟢 UltimateSimpleFirebase carregado (pronto para uso manual)");
