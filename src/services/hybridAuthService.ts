// Passo 2: Serviço de autenticação híbrido (Firebase + Local)
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseAuthReady } from "../firebase/authConfig";
import { localAuthService, UserProfile } from "./localAuthService";

class HybridAuthService {
  private useFirebase = false;

  constructor() {
    // Verificar se Firebase Auth está disponível
    setTimeout(() => {
      this.useFirebase = isFirebaseAuthReady();
      if (this.useFirebase) {
        console.log("🔥 Hybrid Auth: Modo Firebase ativo");
      } else {
        console.log("🔒 Hybrid Auth: Modo Local ativo");
      }
    }, 1000);
  }

  async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    // Tentar Firebase primeiro, se disponível
    if (this.useFirebase) {
      try {
        const auth = getFirebaseAuth();
        if (auth) {
          console.log("🔥 Tentando login Firebase...");
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
          );

          const userProfile: UserProfile = {
            uid: userCredential.user.uid,
            email: userCredential.user.email!,
            name:
              email === "gongonsilva@gmail.com"
                ? "Gonçalo Fonseca"
                : "Utilizador Firebase",
            role:
              email === "gongonsilva@gmail.com" ? "super_admin" : "technician",
            active: true,
            createdAt: new Date().toISOString(),
          };

          console.log("✅ Login Firebase bem-sucedido");
          return { success: true, user: userProfile };
        }
      } catch (firebaseError: any) {
        console.warn(
          "⚠️ Firebase login falhou, tentando modo local:",
          firebaseError.message,
        );
        // Fallback para local
      }
    }

    // Fallback para autenticação local
    console.log("🔒 Usando autenticação local...");
    return await localAuthService.login(email, password, rememberMe);
  }

  async logout(): Promise<void> {
    // Logout Firebase se disponível
    if (this.useFirebase) {
      try {
        const auth = getFirebaseAuth();
        if (auth) {
          await signOut(auth);
          console.log("✅ Logout Firebase");
        }
      } catch (error) {
        console.warn("⚠️ Erro logout Firebase:", error);
      }
    }

    // Logout local sempre
    await localAuthService.logout();
    console.log("✅ Logout Local");
  }

  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    // Se Firebase disponível, usar listener Firebase
    if (this.useFirebase) {
      const auth = getFirebaseAuth();
      if (auth) {
        return onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              name:
                firebaseUser.email === "gongonsilva@gmail.com"
                  ? "Gonçalo Fonseca"
                  : "Utilizador Firebase",
              role:
                firebaseUser.email === "gongonsilva@gmail.com"
                  ? "super_admin"
                  : "technician",
              active: true,
              createdAt: new Date().toISOString(),
            };
            callback(userProfile);
          } else {
            callback(null);
          }
        });
      }
    }

    // Fallback para listener local
    return localAuthService.onAuthStateChanged(callback);
  }

  async getCurrentUserProfile(): Promise<UserProfile | null> {
    // Verificar Firebase primeiro
    if (this.useFirebase) {
      const auth = getFirebaseAuth();
      if (auth?.currentUser) {
        return {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email!,
          name:
            auth.currentUser.email === "gongonsilva@gmail.com"
              ? "Gonçalo Fonseca"
              : "Utilizador Firebase",
          role:
            auth.currentUser.email === "gongonsilva@gmail.com"
              ? "super_admin"
              : "technician",
          active: true,
          createdAt: new Date().toISOString(),
        };
      }
    }

    // Fallback para local
    return await localAuthService.getCurrentUserProfile();
  }

  getCurrentUser(): UserProfile | null {
    return localAuthService.getCurrentUser();
  }

  isAuthenticated(): boolean {
    return localAuthService.isAuthenticated();
  }
}

export const hybridAuthService = new HybridAuthService();
export default hybridAuthService;
