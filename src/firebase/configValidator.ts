/**
 * Firebase Configuration Validator
 * Ensures all Firebase operations use the correct project configuration
 */

// Configuração oficial do projeto leiria-1cfc9
export const OFFICIAL_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  databaseURL:
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
  measurementId: "G-Q2QWQVH60L",
};

// Configurações antigas que devem ser evitadas
const DEPRECATED_PROJECT_IDS = ["leirisonda-16f8b", "leirisonda-old"];

export class FirebaseConfigValidator {
  /**
   * Validates that Firebase is using the correct project
   */
  static validateProject(): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check if any deprecated project IDs are being used
    const configString = JSON.stringify(OFFICIAL_FIREBASE_CONFIG);

    DEPRECATED_PROJECT_IDS.forEach((deprecatedId) => {
      if (document.documentElement.innerHTML.includes(deprecatedId)) {
        issues.push(
          `❌ Found reference to deprecated project: ${deprecatedId}`,
        );
      }
    });

    // Check current Firebase app configuration
    try {
      const { getApps } = require("firebase/app");
      const apps = getApps();

      apps.forEach((app, index) => {
        const appConfig = app.options;
        if (appConfig.projectId !== OFFICIAL_FIREBASE_CONFIG.projectId) {
          issues.push(
            `❌ Firebase app ${index} using wrong project: ${appConfig.projectId}`,
          );
        }
      });
    } catch (error) {
      // Firebase may not be loaded yet
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  /**
   * Gets the official Firebase configuration
   */
  static getOfficialConfig() {
    return OFFICIAL_FIREBASE_CONFIG;
  }

  /**
   * Ensures all Firebase operations use the correct configuration
   */
  static enforceCorrectConfig() {
    const validation = this.validateProject();

    if (!validation.isValid) {
      console.warn("🚨 Firebase Configuration Issues Detected:");
      validation.issues.forEach((issue) => console.warn(issue));

      console.log(
        "✅ Using official configuration:",
        OFFICIAL_FIREBASE_CONFIG.projectId,
      );
    }

    return OFFICIAL_FIREBASE_CONFIG;
  }

  /**
   * Development rules for Firestore (permissive for testing)
   */
  static getDevFirestoreRules(): string {
    return `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // DEVELOPMENT RULES - Allow all access for testing
    // ⚠️ Change these rules before going to production!
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Test collection for connectivity testing
    match /__test__/{testId} {
      allow read, write: if true;
    }
  }
}`;
  }

  /**
   * Production rules for Firestore (secure)
   */
  static getProdFirestoreRules(): string {
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
    
    // Test collection for connectivity testing
    match /__test__/{testId} {
      allow read, write: if true;
    }
  }
}`;
  }
}

export default FirebaseConfigValidator;
