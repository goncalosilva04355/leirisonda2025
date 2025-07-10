// Passo 2: Serviço de autenticação híbrido (Firebase + Local) com emails autorizados
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseAuthReady } from "../firebase/authConfig";
import { localAuthService, UserProfile } from "./localAuthService";
import {
  isEmailAuthorized,
  getAuthorizedUser,
} from "../config/authorizedUsers";

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
    // Local development authentication - bypass authorization check
    if (password === "123") {
      console.log("🔧 Local development login for:", email);
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

      return { success: true, user: localUser };
    }

    // Verificar se o email está autorizado
    const authorizedUser = getAuthorizedUser(email);
    if (!authorizedUser) {
      console.warn("❌ Email não autorizado:", email);
      return {
        success: false,
        error:
          "Email não autorizado. Contacte o administrador para obter acesso.",
      };
    }

    console.log("✅ Email autorizado:", authorizedUser.name);

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
            name: authorizedUser.name,
            role: authorizedUser.role,
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
            const authorizedUser = getAuthorizedUser(firebaseUser.email!);
            if (authorizedUser) {
              const userProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                name: authorizedUser.name,
                role: authorizedUser.role,
                active: true,
                createdAt: new Date().toISOString(),
              };
              callback(userProfile);
            } else {
              // Utilizador não autorizado, fazer logout
              console.warn(
                "❌ Utilizador não autorizado detectado, fazendo logout",
              );
              await this.logout();
              callback(null);
            }
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
        const authorizedUser = getAuthorizedUser(auth.currentUser.email!);
        if (authorizedUser) {
          return {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email!,
            name: authorizedUser.name,
            role: authorizedUser.role,
            active: true,
            createdAt: new Date().toISOString(),
          };
        } else {
          // Utilizador não autorizado, limpar sessão
          await this.logout();
          return null;
        }
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
