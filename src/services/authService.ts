// Serviço de autenticação simples
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
  active: boolean;
  createdAt: string;
}

class AuthService {
  // Login
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

      // For other users, try Firebase if available
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const firebaseUser = userCredential.user;

        // Buscar perfil do usuário
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

        if (userDoc.exists()) {
          const userProfile = userDoc.data() as UserProfile;
          return { success: true, user: userProfile };
        } else {
          // Criar perfil básico se não existir
          const userProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            name: "Utilizador",
            role: "technician",
            active: true,
            createdAt: new Date().toISOString(),
          };

          await setDoc(doc(db, "users", firebaseUser.uid), userProfile);
          return { success: true, user: userProfile };
        }
      } catch (firebaseError) {
        console.warn(
          "Firebase authentication failed, falling back to local auth",
        );
        return { success: false, error: "Credenciais inválidas" };
      }
    } catch (error: any) {
      return { success: false, error: "Erro de sistema. Tente novamente." };
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
