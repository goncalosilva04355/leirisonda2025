import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getAuthService } from "../firebase/config";

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

class FirebaseAuthService {
  private auth: any = null;
  private initialized = false;

  async initialize(): Promise<boolean> {
    // FIREBASE AUTH DISABLED to prevent checkDestroyed errors
    console.log(
      "⚠️ Firebase Auth disabled to prevent errors - using local auth only",
    );
    this.initialized = false;
    this.auth = null;
    return false;
  }

  async signIn(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<AuthResult> {
    // FIREBASE AUTH DISABLED - return failure to force local auth
    console.log("⚠️ Firebase Auth disabled - forcing local authentication");
    return {
      success: false,
      error: "Firebase Auth disabled - using local auth",
    };
  }

  async signUp(email: string, password: string): Promise<AuthResult> {
    // FIREBASE AUTH DISABLED - return failure to force local auth
    console.log("⚠️ Firebase Auth disabled - cannot create Firebase users");
    return {
      success: false,
      error: "Firebase Auth disabled - use local user creation",
    };
  }

  async signOut(): Promise<void> {
    // FIREBASE AUTH DISABLED - just reset state
    console.log("⚠️ Firebase Auth disabled - local signout only");
    this.initialized = false;
    this.auth = null;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    // FIREBASE AUTH DISABLED - return empty unsubscribe function
    console.log("⚠️ Firebase Auth disabled - no auth state changes");
    return () => {};
  }

  getCurrentUser(): User | null {
    // FIREBASE AUTH DISABLED - always return null
    return null;
  }

  async getIdToken(): Promise<string | null> {
    // FIREBASE AUTH DISABLED - always return null
    return null;
  }

  async refreshToken(): Promise<void> {
    // FIREBASE AUTH DISABLED - do nothing
    console.log("⚠️ Firebase Auth disabled - cannot refresh token");
  }

  isInitialized(): boolean {
    return false; // Always false since Firebase Auth is disabled
  }
}

export const authService = new FirebaseAuthService();
export default authService;
