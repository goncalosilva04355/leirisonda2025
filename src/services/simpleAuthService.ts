// Simplified authentication service with direct Firebase calls
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  getFirebaseAuth,
  getFirebaseFirestore,
} from "../firebase/simpleConfig";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
  active: boolean;
  createdAt: string;
}

class SimpleAuthService {
  // Direct login without complex retry mechanisms
  async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        return {
          success: false,
          error: "Firebase Auth não está disponível",
        };
      }

      // Set persistence
      try {
        const persistence = rememberMe
          ? browserLocalPersistence
          : browserSessionPersistence;
        await setPersistence(auth, persistence);
      } catch (persistError) {
        console.warn("⚠️ Could not set persistence:", persistError);
      }

      // Sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      // Create user profile
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

      // Try to save to Firestore if available
      const firestore = getFirebaseFirestore();
      if (firestore) {
        try {
          const userDoc = await getDoc(
            doc(firestore, "users", firebaseUser.uid),
          );
          if (userDoc.exists()) {
            const existingProfile = userDoc.data() as UserProfile;
            return { success: true, user: existingProfile };
          } else {
            await setDoc(
              doc(firestore, "users", firebaseUser.uid),
              userProfile,
            );
          }
        } catch (firestoreError) {
          console.warn(
            "⚠️ Firestore operation failed, using basic profile:",
            firestoreError,
          );
        }
      }

      return { success: true, user: userProfile };
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
        case "auth/invalid-credential":
          errorMessage = "Credenciais inválidas";
          break;
        default:
          errorMessage = error.message || "Erro desconhecido";
      }

      return { success: false, error: errorMessage };
    }
  }

  // Simple logout
  async logout(): Promise<void> {
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        await signOut(auth);
        console.log("✅ User logged out successfully");
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  }

  // Auth state listener
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    const auth = getFirebaseAuth();
    if (!auth) {
      callback(null);
      return () => {};
    }

    return onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            const firestore = getFirebaseFirestore();
            if (firestore) {
              const userDoc = await getDoc(
                doc(firestore, "users", firebaseUser.uid),
              );
              if (userDoc.exists()) {
                const userProfile = userDoc.data() as UserProfile;
                callback(userProfile);
                return;
              }
            }

            // Fallback to basic profile
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
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) return null;

    try {
      const firestore = getFirebaseFirestore();
      if (firestore) {
        const userDoc = await getDoc(
          doc(firestore, "users", auth.currentUser.uid),
        );
        if (userDoc.exists()) {
          return userDoc.data() as UserProfile;
        }
      }

      // Fallback profile
      return {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email!,
        name:
          auth.currentUser.email === "gongonsilva@gmail.com"
            ? "Gonçalo Fonseca"
            : "Utilizador",
        role:
          auth.currentUser.email === "gongonsilva@gmail.com"
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

export const simpleAuthService = new SimpleAuthService();
export default simpleAuthService;
