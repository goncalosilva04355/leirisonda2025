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
        if (
          auth &&
          !(
            typeof window !== "undefined" &&
            (window as any).EMERGENCY_MODE_ACTIVE
          )
        ) {
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

          // Persistir sessão se rememberMe for true
          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
            localStorage.setItem("autoLoginEnabled", "true");
            console.log("💾 Sessão persistida - auto-login ativo");
          }

          console.log("✅ Login Firebase bem-sucedido");
          return { success: true, user: userProfile };
        }
      } catch (firebaseError: any) {
        console.warn(
          "⚠️ Firebase login falhou:",
          firebaseError.code || firebaseError.message,
        );

        // Tratar erros específicos do Firebase
        if (firebaseError.code === "auth/too-many-requests") {
          return {
            success: false,
            error:
              "Muitas tentativas de login. Aguarde alguns minutos e tente novamente.",
          };
        } else if (firebaseError.code === "auth/weak-password") {
          return {
            success: false,
            error: "Password deve ter pelo menos 6 caracteres.",
          };
        } else if (firebaseError.code === "auth/user-not-found") {
          console.log(
            "🔧 Utilizador não encontrado no Firebase, tentando modo local...",
          );
        } else if (firebaseError.code === "auth/wrong-password") {
          console.log(
            "🔧 Password incorreta no Firebase, tentando modo local...",
          );
        } else {
          console.log("🔧 Erro Firebase genérico, tentando modo local...");
        }

        // Fallback para local (exceto para erros que não devem fazer fallback)
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
