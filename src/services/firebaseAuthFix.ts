// Firebase Auth Error Fix - Resolve app deletion and auth instance errors
import {
  signInWithEmailAndPassword,
  Auth,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getAuth } from "../firebase/basicConfig";

export interface FirebaseAuthFixResult {
  success: boolean;
  user?: any;
  error?: string;
  method: "firebase" | "fallback";
}

class FirebaseAuthFix {
  private maxRetries = 3;
  private retryDelay = 1000;

  async safeSignIn(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<FirebaseAuthFixResult> {
    console.log("🔧 FirebaseAuthFix: Attempting safe sign in");

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${this.maxRetries}`);

        // Force re-initialization of Firebase
        await this.ensureFirebaseReady();

        const auth = await this.getSafeAuthInstance();
        if (!auth) {
          throw new Error("Auth instance not available");
        }

        // Set persistence safely
        await this.setSafePersistence(auth, rememberMe);

        // Verificar modo emergência
        if (
          typeof window !== "undefined" &&
          (window as any).EMERGENCY_MODE_ACTIVE
        ) {
          console.log("🚨 firebaseAuthFix bloqueado - modo emergência");
          throw new Error("Firebase desativado temporariamente");
        }

        // Attempt sign in
        console.log("🔐 Attempting signInWithEmailAndPassword...");
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        console.log("✅ Firebase Auth successful!");
        return {
          success: true,
          user: userCredential.user,
          method: "firebase",
        };
      } catch (error: any) {
        console.warn(`❌ Attempt ${attempt} failed:`, error);

        // Check if it's a specific Firebase error that we can handle
        if (this.isRecoverableError(error)) {
          if (attempt < this.maxRetries) {
            console.log(`🔄 Retrying in ${this.retryDelay}ms...`);
            await this.delay(this.retryDelay);
            this.retryDelay *= 1.5; // Exponential backoff
            continue;
          }
        } else {
          // Non-recoverable error, break early
          console.error("❌ Non-recoverable Firebase error:", error);
          break;
        }
      }
    }

    console.log("🆘 All Firebase attempts failed, using fallback");
    return {
      success: false,
      error: "Firebase authentication failed after multiple attempts",
      method: "fallback",
    };
  }

  private async ensureFirebaseReady(): Promise<void> {
    try {
      console.log("🔧 Ensuring Firebase is ready...");

      // Check if Firebase app is available
      const { getFirebaseApp } = await import("../firebase/basicConfig");
      const app = getFirebaseApp();

      if (!app) {
        throw new Error("Firebase app not available");
      }

      console.log("✅ Firebase ready");
    } catch (error) {
      console.error("❌ Firebase initialization error:", error);
      throw error;
    }
  }

  private async getSafeAuthInstance(): Promise<Auth | null> {
    try {
      const auth = getAuth();

      if (!auth) {
        console.warn("⚠️ No auth instance available");
        return null;
      }

      // Verify auth instance is not destroyed
      if ((auth as any)._deleted) {
        console.warn("⚠️ Auth instance is deleted, getting new instance...");
        return getAuth();
      }

      return auth;
    } catch (error) {
      console.error("❌ Error getting auth instance:", error);
      return null;
    }
  }

  private async setSafePersistence(
    auth: Auth,
    rememberMe: boolean,
  ): Promise<void> {
    try {
      const persistence = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(auth, persistence);
      console.log("✅ Persistence set successfully");
    } catch (error) {
      console.warn("⚠️ Could not set persistence, continuing anyway:", error);
      // Don't throw, persistence is not critical
    }
  }

  private isRecoverableError(error: any): boolean {
    const recoverableErrors = [
      "app/app-deleted",
      "auth/network-request-failed",
      "auth/timeout",
      "app-deleted",
    ];

    const errorCode = error.code || "";
    const errorMessage = error.message || "";

    return recoverableErrors.some(
      (recoverable) =>
        errorCode.includes(recoverable) ||
        errorMessage.includes(recoverable) ||
        errorMessage.includes("checkDestroyed"),
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Emergency auth instance getter that bypasses all checks
  async getEmergencyAuth(): Promise<Auth | null> {
    try {
      console.log("🆘 Getting emergency auth instance...");

      // Try to get app directly and create new auth
      const { getFirebaseApp } = await import("../firebase/basicConfig");
      const app = getFirebaseApp();
      if (app) {
        const auth = getAuth(app);
        console.log("✅ Emergency auth instance created");
        return auth;
      }

      return null;
    } catch (error) {
      console.error("❌ Emergency auth failed:", error);
      return null;
    }
  }
}

export const firebaseAuthFix = new FirebaseAuthFix();
export default firebaseAuthFix;
