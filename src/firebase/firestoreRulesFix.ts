/**
 * Firestore Rules Fix - Detects and suggests fixes for Firestore security rules
 * Specifically for iOS/Safari connectivity issues
 */

export class FirestoreRulesFix {
  /**
   * Test if current rules are blocking access
   */
  static async testFirestoreAccess(): Promise<{
    canRead: boolean;
    canWrite: boolean;
    error?: string;
    suggestion: string;
  }> {
    try {
      console.log("🧪 Testing Firestore access with current rules...");

      // Get Firebase services
      const { getDB } = await import("./config");
      const db = await getDB();

      if (!db) {
        return {
          canRead: false,
          canWrite: false,
          error: "Database not initialized",
          suggestion:
            "Database service is not available. Try the INTENSIVE FIX first.",
        };
      }

      const { collection, doc, getDoc, setDoc, deleteDoc } = await import(
        "firebase/firestore"
      );

      let canRead = false;
      let canWrite = false;
      let error = "";

      // Test READ access
      try {
        const testDoc = doc(db, "__test__", "rules-test");
        await getDoc(testDoc);
        canRead = true;
        console.log("✅ Firestore READ access: OK");
      } catch (readError: any) {
        console.warn("❌ Firestore READ access: BLOCKED");
        console.warn("Read error:", readError.code, readError.message);
        error += `READ: ${readError.code} - ${readError.message}. `;
      }

      // Test WRITE access
      try {
        const testDoc = doc(db, "__test__", "rules-test");
        await setDoc(testDoc, {
          test: true,
          timestamp: new Date().toISOString(),
          platform: "iOS Safari",
        });
        canWrite = true;
        console.log("✅ Firestore WRITE access: OK");

        // Clean up test document
        try {
          await deleteDoc(testDoc);
        } catch (cleanupError) {
          console.warn("⚠️ Could not clean up test document");
        }
      } catch (writeError: any) {
        console.warn("❌ Firestore WRITE access: BLOCKED");
        console.warn("Write error:", writeError.code, writeError.message);
        error += `WRITE: ${writeError.code} - ${writeError.message}. `;
      }

      // Generate suggestion based on errors
      let suggestion = "";
      if (!canRead && !canWrite) {
        if (error.includes("permission-denied")) {
          suggestion =
            "🚨 FIRESTORE RULES PROBLEM: Access is being blocked by security rules. Go to Firebase Console → Firestore → Rules and set permissive rules for development.";
        } else if (
          error.includes("unavailable") ||
          error.includes("deadline-exceeded")
        ) {
          suggestion =
            "🌐 NETWORK PROBLEM: Connection to Firestore is failing. Check internet connection or try again.";
        } else {
          suggestion =
            "🔧 CONFIGURATION PROBLEM: Firestore is not properly configured. Check project settings.";
        }
      } else if (canRead && !canWrite) {
        suggestion =
          "📝 WRITE RULES PROBLEM: Can read but cannot write. Update Firestore rules to allow write access.";
      } else if (!canRead && canWrite) {
        suggestion =
          "👁️ READ RULES PROBLEM: Can write but cannot read. Update Firestore rules to allow read access.";
      } else {
        suggestion =
          "✅ FIRESTORE ACCESS: Working correctly! Rules allow both read and write access.";
      }

      return {
        canRead,
        canWrite,
        error: error || undefined,
        suggestion,
      };
    } catch (error: any) {
      console.error("💥 Firestore access test failed:", error);
      return {
        canRead: false,
        canWrite: false,
        error: error.message,
        suggestion:
          "🔧 TEST FAILED: Could not test Firestore access. Try the intensive fix or check Firebase configuration.",
      };
    }
  }

  /**
   * Generate development-friendly Firestore rules
   */
  static getDevelopmentRules(): string {
    return `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // DEVELOPMENT RULES - Allow all access for testing
    // ⚠️ Change these rules before going to production!
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Alternative: More specific rules for your app
    // match /users/{userId} {
    //   allow read, write: if true;
    // }
    // match /obras/{obraId} {
    //   allow read, write: if true;
    // }
    // match /manutencoes/{manutencaoId} {
    //   allow read, write: if true;
    // }
    // match /piscinas/{piscinaId} {
    //   allow read, write: if true;
    // }
    // match /clientes/{clienteId} {
    //   allow read, write: if true;
    // }
  }
}`;
  }

  /**
   * Generate production-ready Firestore rules
   */
  static getProductionRules(): string {
    return `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authentication required for all operations
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /obras/{obraId} {
      allow read, write: if request.auth != null;
    }
    
    match /manutencoes/{manutencaoId} {
      allow read, write: if request.auth != null;
    }
    
    match /piscinas/{piscinaId} {
      allow read, write: if request.auth != null;
    }
    
    match /clientes/{clienteId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow test documents for connectivity testing
    match /__test__/{testId} {
      allow read, write: if true;
    }
  }
}`;
  }

  /**
   * Instructions for fixing rules manually
   */
  static getManualFixInstructions(): string[] {
    return [
      "📱 Abra o Firefox Console: console.firebase.google.com",
      "🎯 Vá para o seu projeto: leirisonda-16f8b",
      "🔧 Clique em 'Firestore Database'",
      "📋 Clique no separador 'Regras' (Rules)",
      "✏️ Substitua as regras existentes pelas regras de desenvolvimento",
      "✅ Clique em 'Publicar' (Publish)",
      "⏰ Aguarde alguns segundos para as regras serem aplicadas",
      "🔄 Volte à app e teste novamente o login",
    ];
  }
}
