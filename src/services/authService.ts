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
import { firebaseService } from "../firebase/robustConfig";

export interface UserPermissions {
  [module: string]: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "manager" | "technician";
  permissions: UserPermissions;
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
      // Wait for Firebase to initialize
      const initResult = await firebaseService.initialize();
      if (!initResult) {
        console.warn("⚠️ Firebase failed to initialize, using fallback mode");
        return false;
      }

      this.auth = await firebaseService.getAuth();
      this.db = await firebaseService.getFirestore();

      if (this.auth) {
        this.initialized = true;
        console.log("✅ AuthService initialized with Firebase Auth");
        return true;
      }

      console.warn("⚠️ AuthService: Firebase Auth not available");
      return false;
    } catch (error) {
      console.error("❌ Failed to initialize AuthService:", error);
      return false;
    }
  }

  // Local authentication for development mode
  private localLogin(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): { success: boolean; error?: string; user?: UserProfile } {
    // Simple local authentication for development
    // Accept any email with password "123"
    if (password === "123") {
      const localUser: UserProfile = {
        uid: `local-${email.replace("@", "-").replace(".", "-")}`,
        email: email,
        name:
          email.includes("goncalo") || email.includes("gongonsilva")
            ? "Gonçalo Fonseca"
            : email.split("@")[0],
        role: "super_admin",
        active: true,
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage for persistence
      const storageKey = rememberMe
        ? "leirisonda-user"
        : "leirisonda-session-user";
      localStorage.setItem(storageKey, JSON.stringify(localUser));

      console.log("✅ Local login successful for:", email);
      return { success: true, user: localUser };
    }

    return {
      success: false,
      error: "Credenciais inválidas (use password: 123)",
    };
  }

  // Login
  async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    try {
      // Local development authentication fallback
      // When Firebase is not available, use localStorage authentication
      if (!(await this.initialize())) {
        console.log("🔧 Firebase not available - using local authentication");
        return this.localLogin(email, password, rememberMe);
      }

      // Use retry mechanism for the entire login operation
      return await firebaseService.retryOperation(async () => {
        if (!(await this.initialize())) {
          throw new Error(
            "Firebase: Firebase App named '[DEFAULT]' already deleted (app/app-deleted).",
          );
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
            const userDoc = await getDoc(
              doc(this.db, "users", firebaseUser.uid),
            );

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

              await setDoc(
                doc(this.db, "users", firebaseUser.uid),
                userProfile,
              );
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
      });
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
    try {
      await firebaseService.retryOperation(async () => {
        if (!(await this.initialize())) {
          return;
        }

        await signOut(this.auth);
        console.log("✅ User logged out successfully");
      });
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  }

  // Auth state listener
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    if (!this.auth) {
      this.initialize().then(() => {
        if (this.auth) {
          this._setupAuthStateListener(callback);
        } else {
          callback(null);
        }
      });
      return () => {};
    }

    return this._setupAuthStateListener(callback);
  }

  private _setupAuthStateListener(
    callback: (user: UserProfile | null) => void,
  ): () => void {
    return onAuthStateChanged(
      this.auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            if (this.db) {
              const userDoc = await getDoc(
                doc(this.db, "users", firebaseUser.uid),
              );
              if (userDoc.exists()) {
                const userProfile = userDoc.data() as UserProfile;
                callback(userProfile);
                return;
              }
            }

            // Fallback to basic profile if Firestore is not available
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
            callback(userProfile);
          } catch (error) {
            console.warn("⚠️ Error in auth state change:", error);
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
    if (!(await this.initialize())) {
      // Check for local user when Firebase is not available
      const localUser =
        localStorage.getItem("leirisonda-user") ||
        localStorage.getItem("leirisonda-session-user");
      if (localUser) {
        try {
          return JSON.parse(localUser) as UserProfile;
        } catch (error) {
          console.error("❌ Error parsing local user:", error);
          return null;
        }
      }
      return null;
    }

    if (!this.auth.currentUser) {
      // Also check for local user if no Firebase user
      const localUser =
        localStorage.getItem("leirisonda-user") ||
        localStorage.getItem("leirisonda-session-user");
      if (localUser) {
        try {
          return JSON.parse(localUser) as UserProfile;
        } catch (error) {
          console.error("❌ Error parsing local user:", error);
          return null;
        }
      }
      return null;
    }

    try {
      if (this.db) {
        const userDoc = await getDoc(
          doc(this.db, "users", this.auth.currentUser.uid),
        );
        return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
      }

      // Fallback to basic profile
      return {
        uid: this.auth.currentUser.uid,
        email: this.auth.currentUser.email!,
        name:
          this.auth.currentUser.email === "gongonsilva@gmail.com"
            ? "Gonçalo Fonseca"
            : "Utilizador",
        role:
          this.auth.currentUser.email === "gongonsilva@gmail.com"
            ? "super_admin"
            : "technician",
        active: true,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn("⚠️ Error getting current user profile:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
