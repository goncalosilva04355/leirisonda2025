// Robust Firebase configuration that prevents app deletion errors
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
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

class FirebaseService {
  private static instance: FirebaseService;
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private firestore: Firestore | null = null;
  private initialized = false;
  private initializing = false;

  private constructor() {}

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    if (this.initializing) {
      // Wait for ongoing initialization
      while (this.initializing) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return this.initialized;
    }

    this.initializing = true;

    try {
      // Check if Firebase app already exists
      const existingApps = getApps();
      if (existingApps.length === 0) {
        this.app = initializeApp(firebaseConfig);
        console.log("✅ Firebase app initialized");
      } else {
        // Use the first existing app
        this.app = existingApps[0];
        console.log("✅ Using existing Firebase app");
      }

      if (this.app) {
        // Initialize Auth
        try {
          this.auth = getAuth(this.app);
          console.log("✅ Firebase Auth initialized");
        } catch (authError) {
          console.warn("⚠️ Firebase Auth initialization failed:", authError);
          this.auth = null;
        }

        // Initialize Firestore
        try {
          this.firestore = getFirestore(this.app);
          console.log("✅ Firebase Firestore initialized");
        } catch (firestoreError) {
          console.warn(
            "⚠️ Firebase Firestore initialization failed:",
            firestoreError,
          );
          this.firestore = null;
        }

        this.initialized = true;
        return true;
      } else {
        throw new Error("Failed to initialize Firebase app");
      }
    } catch (error) {
      console.error("❌ Firebase initialization failed:", error);
      this.app = null;
      this.auth = null;
      this.firestore = null;
      this.initialized = false;

      // Try to provide fallback functionality
      console.log(
        "🔄 Firebase initialization failed, app will work in offline mode",
      );
      return false;
    } finally {
      this.initializing = false;
    }
  }

  async getAuth(): Promise<Auth | null> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.auth;
  }

  async getFirestore(): Promise<Firestore | null> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.firestore;
  }

  getApp(): FirebaseApp | null {
    return this.app;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  // Retry mechanism for operations
  async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
  ): Promise<T> {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;

        // If it's an app-deleted error, try to reinitialize
        if (
          error.code === "app/app-deleted" ||
          error.message?.includes("app-deleted")
        ) {
          console.log(
            `🔄 Attempt ${attempt}: App deleted error, reinitializing...`,
          );
          this.initialized = false;
          this.app = null;
          this.auth = null;
          this.firestore = null;
          await this.initialize();
        }

        if (attempt < maxRetries) {
          console.log(
            `🔄 Attempt ${attempt} failed, retrying in ${delay}ms...`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.5; // Exponential backoff
        }
      }
    }

    throw lastError;
  }
}

// Export singleton instance
export const firebaseService = FirebaseService.getInstance();

// Legacy exports for compatibility
export const getAuthService = () => firebaseService.getAuth();
export const attemptFirestoreInit = () => firebaseService.getFirestore();
export const isFirebaseReady = () => firebaseService.isInitialized();

// Initialize on module load
firebaseService.initialize().catch(console.error);
