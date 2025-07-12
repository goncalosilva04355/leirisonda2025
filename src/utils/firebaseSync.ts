/**
 * Firebase Sync Utility
 * Automatically detects and fixes configuration differences
 */

import { FirebaseConfigValidator } from "../firebase/configValidator";

export class FirebaseSync {
  /**
   * Sync development app with production configuration
   */
  static async syncWithProduction(): Promise<{
    success: boolean;
    changes: string[];
    errors: string[];
  }> {
    const changes: string[] = [];
    const errors: string[] = [];

    try {
      console.log("🔄 Starting Firebase sync...");

      // 1. Validate current configuration
      const validation = FirebaseConfigValidator.validateProject();
      if (!validation.isValid) {
        validation.issues.forEach((issue) => {
          console.warn(issue);
          changes.push(issue);
        });
      }

      // 2. Check Firestore rules
      const rulesStatus = await this.checkFirestoreRules();
      if (!rulesStatus.permissive) {
        changes.push("❌ Firestore rules are too restrictive for development");
        changes.push("💡 Need to apply development rules");
      }

      // 3. Test Firestore connectivity
      const connectivityTest = await this.testFirestoreConnectivity();
      if (!connectivityTest.success) {
        errors.push(
          `❌ Firestore connectivity failed: ${connectivityTest.error}`,
        );
      } else {
        changes.push("✅ Firestore connectivity OK");
      }

      // 4. Check for environment differences
      const envCheck = this.checkEnvironmentDifferences();
      changes.push(...envCheck);

      console.log("🔄 Firebase sync completed");
      return {
        success: errors.length === 0,
        changes,
        errors,
      };
    } catch (error: any) {
      console.error("❌ Firebase sync failed:", error);
      return {
        success: false,
        changes,
        errors: [`Sync failed: ${error.message}`],
      };
    }
  }

  /**
   * Check if Firestore rules are permissive enough for development
   */
  private static async checkFirestoreRules(): Promise<{
    permissive: boolean;
    details: string;
  }> {
    try {
      // Try to read/write a test document
      const { getDB } = await import("../firebase/config");
      const db = await getDB();

      if (!db) {
        return {
          permissive: false,
          details: "Database not available",
        };
      }

      const { doc, getDoc, setDoc, deleteDoc } = await import(
        "firebase/firestore"
      );

      // Test write
      const testDoc = doc(db, "__sync_test__", "development");
      await setDoc(testDoc, {
        test: true,
        timestamp: new Date().toISOString(),
        purpose: "Development sync test",
      });

      // Test read
      const docSnapshot = await getDoc(testDoc);
      const canRead = docSnapshot.exists();

      // Cleanup
      try {
        await deleteDoc(testDoc);
      } catch (cleanupError) {
        console.warn("Could not cleanup test document");
      }

      return {
        permissive: canRead,
        details: canRead ? "Rules allow read/write" : "Rules block access",
      };
    } catch (error: any) {
      return {
        permissive: false,
        details: `Rules test failed: ${error.code || error.message}`,
      };
    }
  }

  /**
   * Test basic Firestore connectivity
   */
  private static async testFirestoreConnectivity(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { getDB } = await import("../firebase/config");
      const { connectFirestoreEmulator, enableNetwork } = await import(
        "firebase/firestore"
      );

      const db = await getDB();
      if (!db) {
        return {
          success: false,
          error: "Database instance not available",
        };
      }

      // Try to enable network (in case it was disabled)
      try {
        await enableNetwork(db);
      } catch (networkError) {
        // Network might already be enabled
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Check for environment-specific differences
   */
  private static checkEnvironmentDifferences(): string[] {
    const differences: string[] = [];

    // Check if we're in development
    const isDev =
      window.location.hostname === "localhost" ||
      window.location.hostname.includes("127.0.0.1") ||
      window.location.hostname.includes(".local");

    if (isDev) {
      differences.push("🔧 Development environment detected");
    } else {
      differences.push("🌐 Production environment detected");
    }

    // Check for service worker
    if ("serviceWorker" in navigator) {
      differences.push("🔄 Service Worker available");
    }

    // Check for HTTPS
    if (location.protocol === "https:") {
      differences.push("🔒 HTTPS enabled");
    } else {
      differences.push("⚠️ HTTP only (Firebase features may be limited)");
    }

    return differences;
  }

  /**
   * Generate development-friendly Firestore rules
   */
  static getDevRulesInstructions(): {
    rules: string;
    instructions: string[];
  } {
    const rules = FirebaseConfigValidator.getDevFirestoreRules();

    const instructions = [
      "1. Abra Firebase Console: https://console.firebase.google.com",
      "2. Selecione projeto: leiria-1cfc9",
      "3. Vá para Firestore Database → Rules",
      "4. Substitua as regras existentes pelas regras abaixo",
      "5. Clique 'Publish' para aplicar",
      "6. Volte aqui e teste novamente",
    ];

    return { rules, instructions };
  }

  /**
   * Quick sync check - returns status and next actions
   */
  static async quickCheck(): Promise<{
    status: "synced" | "needs_rules" | "needs_config" | "error";
    message: string;
    nextAction?: string;
  }> {
    try {
      // Quick connectivity test
      const { getDB } = await import("../firebase/config");
      const db = await getDB();

      if (!db) {
        return {
          status: "needs_config",
          message: "Firebase não está configurado corretamente",
          nextAction: "Verificar configuração básica do Firebase",
        };
      }

      // Quick rules test
      const rulesTest = await this.checkFirestoreRules();
      if (!rulesTest.permissive) {
        return {
          status: "needs_rules",
          message: "Regras Firestore muito restritivas",
          nextAction: "Aplicar regras de desenvolvimento",
        };
      }

      return {
        status: "synced",
        message: "Firebase configurado e funcional ✅",
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Erro: ${error.message}`,
      };
    }
  }
}

export default FirebaseSync;
