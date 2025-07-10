// Serviço de autenticação simples
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuthService, attemptFirestoreInit } from "../firebase/config";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
  active: boolean;
  createdAt: string;
}

class AuthService {
  private auth: any = null;
  private db: any = null;
  private initialized = false;

  async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    try {
      this.auth = await getAuthService();
      this.db = await attemptFirestoreInit();

      if (this.auth) {
        this.initialized = true;
        console.log("✅ AuthService initialized");
        return true;
      }

      console.warn("⚠️ AuthService: Firebase Auth not available");
      return false;
    } catch (error) {
      console.error("❌ Failed to initialize AuthService:", error);
      return false;
    }
  }

  // Login
  async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    try {
      if (!(await this.initialize())) {
        return {
          success: false,
          error:
            "Firebase: Firebase App named '[DEFAULT]' already deleted (app/app-deleted).",
        };
      }

      // Set persistence based on remember me preference
      try {
        const persistence = rememberMe
          ? browserLocalPersistence
          : browserSessionPersistence;
        await setPersistence(this.auth, persistence);
      } catch (persistError) {
        console.warn("⚠️ Could not set persistence:", persistError);
      }

      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      // If Firestore is available, try to get user profile
      if (this.db) {
        try {
          const userDoc = await getDoc(doc(this.db, "users", firebaseUser.uid));

          if (userDoc.exists()) {
            const userProfile = userDoc.data() as UserProfile;
            return { success: true, user: userProfile };
          } else {
            // Create basic profile if doesn't exist
            const userProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              name:
                firebaseUser.email === "gongonsilva@gmail.com"
                  ? "Gonçalo Fonseca"
                  : "Utilizador",
              role:
                firebaseUser.email === "gongonsilva@gmail.com"
                  ? "super_admin"
                  : "technician",
              active: true,
              createdAt: new Date().toISOString(),
            };

            await setDoc(doc(this.db, "users", firebaseUser.uid), userProfile);
            return { success: true, user: userProfile };
          }
        } catch (firestoreError) {
          console.warn(
            "⚠️ Firestore error, using basic profile:",
            firestoreError,
          );
          // Fallback to basic profile without Firestore
          const userProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            name:
              firebaseUser.email === "gongonsilva@gmail.com"
                ? "Gonçalo Fonseca"
                : "Utilizador",
            role:
              firebaseUser.email === "gongonsilva@gmail.com"
                ? "super_admin"
                : "technician",
            active: true,
            createdAt: new Date().toISOString(),
          };
          return { success: true, user: userProfile };
        }
      } else {
        // No Firestore, create basic profile
        const userProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          name:
            firebaseUser.email === "gongonsilva@gmail.com"
              ? "Gonçalo Fonseca"
              : "Utilizador",
          role:
            firebaseUser.email === "gongonsilva@gmail.com"
              ? "super_admin"
              : "technician",
          active: true,
          createdAt: new Date().toISOString(),
        };
        return { success: true, user: userProfile };
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);

      let errorMessage = "Erro de autenticação";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Utilizador não encontrado";
          break;
        case "auth/wrong-password":
          errorMessage = "Palavra-passe incorreta";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido";
          break;
        case "auth/user-disabled":
          errorMessage = "Conta desativada";
          break;
        case "auth/too-many-requests":
          errorMessage = "Muitas tentativas. Tente novamente mais tarde";
          break;
        case "auth/network-request-failed":
          errorMessage = "Erro de conexão. Verifique sua internet";
          break;
        case "auth/app-deleted":
          errorMessage =
            "Firebase: Firebase App named '[DEFAULT]' already deleted (app/app-deleted).";
          break;
        default:
          errorMessage = error.message || "Erro desconhecido";
      }

      return { success: false, error: errorMessage };
    }
  }

  // Logout
  async logout(): Promise<void> {
    await signOut(auth);
  }

  // Auth state listener
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    return onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              const userProfile = userDoc.data() as UserProfile;
              callback(userProfile);
            } else {
              callback(null);
            }
          } catch (error) {
            callback(null);
          }
        } else {
          callback(null);
        }
      },
    );
  }

  // Get current user
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    if (!auth.currentUser) return null;

    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
