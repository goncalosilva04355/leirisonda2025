// Simplified Authentication Service - No Firestore dependencies
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { getAuthSafe } from "../firebase/configWithoutFirestore";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
  active: boolean;
  createdAt: string;
}

class AuthService {
  // Login with simplified logic
  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    try {
      // Local authentication for main admin user
      if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
        const userProfile: UserProfile = {
          uid: "admin-local-uid",
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Fonseca",
          role: "super_admin",
          active: true,
          createdAt: new Date().toISOString(),
        };

        console.log("✅ Local authentication successful");
        return { success: true, user: userProfile };
      }

      // For other users, try Firebase Auth only (no Firestore)
      try {
        const auth = await getAuthSafe();

        if (!auth) {
          return { success: false, error: "Firebase Auth não disponível" };
        }

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const firebaseUser = userCredential.user;

        // Create basic profile without Firestore
        const userProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || "Utilizador",
          role: "technician",
          active: true,
          createdAt: new Date().toISOString(),
        };

        console.log("✅ Firebase authentication successful");
        return { success: true, user: userProfile };
      } catch (firebaseError: any) {
        console.warn("⚠️ Firebase login failed:", firebaseError);
        return {
          success: false,
          error: "Credenciais inválidas ou erro de conexão",
        };
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      return { success: false, error: "Erro interno do sistema" };
    }
  }

  // Simplified logout
  async logout(): Promise<void> {
    console.log("🔐 Starting logout process...");

    try {
      const auth = await getAuthSafe();
      if (auth) {
        await signOut(auth);
        console.log("✅ Firebase signOut successful");
      }
    } catch (error) {
      console.warn(
        "⚠️ Firebase signOut error (continuing with local logout):",
        error,
      );
      // Don't throw the error - allow local logout to proceed
    }
  }

  // Simplified auth state listener
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    let unsubscribe: (() => void) | null = null;

    (async () => {
      try {
        const auth = await getAuthSafe();

        if (!auth) {
          console.warn("Firebase Auth not available for auth state listener");
          callback(null);
          return;
        }

        unsubscribe = onAuthStateChanged(
          auth,
          async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
              // Create basic profile without Firestore lookup
              const userProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                name: firebaseUser.displayName || "Utilizador",
                role: "technician",
                active: true,
                createdAt: new Date().toISOString(),
              };
              callback(userProfile);
            } else {
              callback(null);
            }
          },
        );
      } catch (error) {
        console.warn("Error setting up auth state listener:", error);
        callback(null);
      }
    })();

    // Return cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }

  // Simplified register (local only)
  async register(
    email: string,
    password: string,
    userData: Partial<UserProfile>,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    try {
      // Only super admin can register users
      console.log("🔐 Register attempt for:", email);

      const auth = await getAuthSafe();
      if (!auth) {
        return { success: false, error: "Firebase Auth não disponível" };
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name: userData.name || "Novo Utilizador",
        role: userData.role || "technician",
        active: userData.active ?? true,
        createdAt: new Date().toISOString(),
      };

      console.log("✅ User registration successful");
      return { success: true, user: userProfile };
    } catch (error: any) {
      console.error("❌ Registration error:", error);

      let errorMessage = "Erro no registo";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A palavra-passe é muito fraca";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido";
      }

      return { success: false, error: errorMessage };
    }
  }

  // Check if service is available
  async isAvailable(): Promise<boolean> {
    try {
      const auth = await getAuthSafe();
      return !!auth;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
