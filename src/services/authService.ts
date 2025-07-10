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
  // Login
  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
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

        await setDoc(doc(db, "users", firebaseUser.uid), userProfile);
        return { success: true, user: userProfile };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
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
