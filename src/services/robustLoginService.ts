// Serviço de login robusto que sincroniza Firebase + Local
import { authService } from "./firebaseAuthService";

export interface UserPermissions {
  [module: string]: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export interface UserProfile {
  id?: string | number;
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "manager" | "technician";
  permissions?: UserPermissions;
  active: boolean;
  createdAt: string;
  firestoreId?: string;
  password?: string;
  firebaseUid?: string; // Para associar com Firebase
}

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: UserProfile;
  method?: "firebase" | "local" | "fallback";
}

class RobustLoginService {
  async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<LoginResult> {
    console.log("🔐 RobustLoginService: Iniciando login HÍBRIDO para", email);

    // Validação básica
    if (!email || !password) {
      return {
        success: false,
        error: "Email e password são obrigatórios",
      };
    }

    // MÉTODO 1: Firebase (com timeout e fallback)
    try {
      console.log("🔥 Tentando login Firebase...");

      const firebaseResult = await authService.signIn(
        email,
        password,
        rememberMe,
      );

      if (firebaseResult.success && firebaseResult.user) {
        console.log("✅ Login Firebase bem-sucedido");

        // Converter Firebase User para UserProfile
        const userProfile: UserProfile = {
          uid: `firebase-${firebaseResult.user.uid}`,
          firebaseUid: firebaseResult.user.uid,
          email: firebaseResult.user.email || email,
          name:
            firebaseResult.user.displayName ||
            this.generateNameFromEmail(email),
          role: this.determineRole(email),
          permissions: this.getDefaultPermissions(),
          active: true,
          createdAt: new Date().toISOString(),
        };

        // Salvar no localStorage para sincronização
        const storageKey = rememberMe
          ? "leirisonda-user"
          : "leirisonda-session-user";
        localStorage.setItem(storageKey, JSON.stringify(userProfile));

        // Sincronizar com sistema local
        await this.syncFirebaseUserToLocal(userProfile);

        return {
          success: true,
          user: userProfile,
          method: "firebase",
        };
      }

      console.log("⚠️ Firebase não conseguiu autenticar, tentando local...");
    } catch (error) {
      console.warn("⚠️ Erro Firebase, usando fallback local:", error);
    }

    // MÉTODO 2: Autenticação local (password "123")
    console.log("🔧 Tentando autenticação local...");
    const localResult = this.localAuthentication(email, password, rememberMe);

    if (localResult.success) {
      console.log("✅ Login local bem-sucedido");

      // Tentar sincronizar com Firebase em background
      this.tryBackgroundFirebaseSync(localResult.user!, email, password);

      return {
        ...localResult,
        method: "local",
      };
    }

    // MÉTODO 3: Fallback final
    console.log("🆘 Usando fallback final...");
    const fallbackResult = this.fallbackAuthentication(
      email,
      password,
      rememberMe,
    );

    if (fallbackResult.success) {
      console.log("✅ Login fallback bem-sucedido");

      // Tentar sincronizar com Firebase em background
      this.tryBackgroundFirebaseSync(fallbackResult.user!, email, password);

      return {
        ...fallbackResult,
        method: "fallback",
      };
    }

    return {
      success: false,
      error: "Credenciais inválidas",
    };
  }

  private async syncFirebaseUserToLocal(
    firebaseUser: UserProfile,
  ): Promise<void> {
    try {
      // Adicionar/atualizar no sistema local de utilizadores
      const existingUsers = this.getAllUsers();
      const existingIndex = existingUsers.findIndex(
        (u) =>
          u.email.toLowerCase() === firebaseUser.email.toLowerCase() ||
          u.firebaseUid === firebaseUser.firebaseUid,
      );

      if (existingIndex >= 0) {
        existingUsers[existingIndex] = {
          ...existingUsers[existingIndex],
          ...firebaseUser,
        };
      } else {
        existingUsers.push(firebaseUser);
      }

      localStorage.setItem("app-users", JSON.stringify(existingUsers));
      console.log("✅ Utilizador Firebase sincronizado para local");
    } catch (error) {
      console.warn("⚠️ Erro ao sincronizar Firebase user para local:", error);
    }
  }

  private async tryBackgroundFirebaseSync(
    user: UserProfile,
    email: string,
    password: string,
  ): Promise<void> {
    // DESABILITAR sync background para evitar erros checkDestroyed
    console.log(
      "💾 Background sync desabilitado - usando apenas sistema local por estabilidade",
    );

    // Firebase sync será apenas manual ou quando explicitamente solicitado
    // Isso evita os erros checkDestroyed que podem aparecer em background

    return; // Early return - sem background sync

    // Código original comentado:
    /*
    setTimeout(async () => {
      try {
        console.log("🔄 Tentando sincronização background com Firebase...");
        const firebaseResult = await authService.signIn(email, password, true);
        if (!firebaseResult.success) {
          const signupResult = await authService.signUp(email, password);
          if (signupResult.success) {
            console.log("✅ Conta Firebase criada em background");
          }
        } else {
          console.log("✅ Sincronização Firebase background bem-sucedida");
        }
      } catch (error) {
        console.log("ℹ️ Sincronização Firebase background falhou");
      }
    }, 2000);
    */
  }

  private localAuthentication(
    email: string,
    password: string,
    rememberMe: boolean,
  ): LoginResult {
    // Aceita password "123" ou qualquer user existente no sistema
    const existingUsers = this.getAllUsers();
    const existingUser = existingUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    // Se utilizador existe e password é 123, ou se utilizador existe e tem password guardada
    if (
      existingUser &&
      (password === "123" || existingUser.password === password)
    ) {
      const user: UserProfile = {
        ...existingUser,
        uid: existingUser.uid || `local-${Date.now()}`,
      };

      const storageKey = rememberMe
        ? "leirisonda-user"
        : "leirisonda-session-user";
      localStorage.setItem(storageKey, JSON.stringify(user));

      return { success: true, user };
    }

    // Se password é 123, criar novo utilizador local
    if (password === "123") {
      const user: UserProfile = {
        uid: `local-${Date.now()}`,
        email: email,
        name: this.generateNameFromEmail(email),
        role: this.determineRole(email),
        permissions: this.getDefaultPermissions(),
        active: true,
        createdAt: new Date().toISOString(),
      };

      const storageKey = rememberMe
        ? "leirisonda-user"
        : "leirisonda-session-user";
      localStorage.setItem(storageKey, JSON.stringify(user));

      // Adicionar ao sistema local
      existingUsers.push(user);
      localStorage.setItem("app-users", JSON.stringify(existingUsers));

      return { success: true, user };
    }

    return {
      success: false,
      error: "Password incorreta (use: 123 ou password do utilizador)",
    };
  }

  private fallbackAuthentication(
    email: string,
    password: string,
    rememberMe: boolean,
  ): LoginResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return { success: false, error: "Email inválido" };
    }

    if (password.length < 3) {
      return {
        success: false,
        error: "Password muito curta (mínimo 3 caracteres)",
      };
    }

    const user: UserProfile = {
      uid: `fallback-${Date.now()}`,
      email: email,
      name: this.generateNameFromEmail(email),
      role: "technician",
      permissions: this.getDefaultPermissions(),
      active: true,
      createdAt: new Date().toISOString(),
    };

    const storageKey = rememberMe
      ? "leirisonda-user"
      : "leirisonda-session-user";
    localStorage.setItem(storageKey, JSON.stringify(user));

    // Adicionar ao sistema local
    const existingUsers = this.getAllUsers();
    existingUsers.push(user);
    localStorage.setItem("app-users", JSON.stringify(existingUsers));

    return { success: true, user };
  }

  private generateNameFromEmail(email: string): string {
    if (email.includes("goncalo") || email.includes("gongonsilva")) {
      return "Gonçalo Fonseca";
    }
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private determineRole(
    email: string,
  ): "super_admin" | "admin" | "manager" | "technician" {
    if (email.includes("goncalo") || email.includes("gongonsilva")) {
      return "super_admin";
    }
    if (email.includes("admin")) return "admin";
    if (email.includes("manager")) return "manager";
    return "technician";
  }

  private getDefaultPermissions(): any {
    return {
      obras: { view: true, create: true, edit: true, delete: true },
      manutencoes: { view: true, create: true, edit: true, delete: true },
      piscinas: { view: true, create: true, edit: true, delete: true },
      utilizadores: { view: true, create: true, edit: true, delete: true },
      relatorios: { view: true, create: true, edit: true, delete: true },
      clientes: { view: true, create: true, edit: true, delete: true },
    };
  }

  async logout(): Promise<void> {
    try {
      // Logout Firebase se disponível
      await authService.signOut();
    } catch (error) {
      console.warn("⚠️ Erro logout Firebase:", error);
    }

    // Limpar localStorage
    localStorage.removeItem("leirisonda-user");
    localStorage.removeItem("leirisonda-session-user");
    localStorage.removeItem("savedLoginCredentials");

    console.log("✅ Logout completo realizado");
  }

  getCurrentUser(): UserProfile | null {
    const localUser =
      localStorage.getItem("leirisonda-user") ||
      localStorage.getItem("leirisonda-session-user");

    if (localUser) {
      try {
        return JSON.parse(localUser);
      } catch (error) {
        console.error("❌ Erro ao parsear utilizador local:", error);
      }
    }
    return null;
  }

  async register(
    email: string,
    password: string,
    name: string,
    role: "super_admin" | "admin" | "manager" | "technician" = "technician",
    permissions?: any,
  ): Promise<LoginResult> {
    console.log("👥 Criando novo utilizador:", email);

    try {
      // Verificar se email já existe
      const existingUsers = this.getAllUsers();
      const emailExists = existingUsers.some(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (emailExists) {
        return { success: false, error: "Este email já está em uso" };
      }

      // Tentar criar no Firebase primeiro
      let firebaseUid: string | undefined;
      try {
        const firebaseResult = await authService.signUp(email, password);
        if (firebaseResult.success && firebaseResult.user) {
          firebaseUid = firebaseResult.user.uid;
          console.log("✅ Utilizador criado no Firebase");
        }
      } catch (error) {
        console.log("ℹ️ Firebase indisponível, criando apenas local");
      }

      // Criar utilizador local
      const newUser: UserProfile = {
        uid: firebaseUid ? `firebase-${firebaseUid}` : `local-${Date.now()}`,
        firebaseUid,
        email,
        name,
        role,
        permissions: permissions || this.getDefaultPermissions(),
        active: true,
        createdAt: new Date().toISOString(),
      };

      existingUsers.push(newUser);
      localStorage.setItem("app-users", JSON.stringify(existingUsers));

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("usersUpdated"));
      }

      console.log("✅ Utilizador criado com sucesso");
      return {
        success: true,
        user: newUser,
        method: firebaseUid ? "firebase" : "local",
      };
    } catch (error) {
      console.error("❌ Erro ao criar utilizador:", error);
      return { success: false, error: "Erro ao criar utilizador" };
    }
  }

  private getAllUsers(): UserProfile[] {
    try {
      const savedUsers = localStorage.getItem("app-users") || "[]";
      return JSON.parse(savedUsers);
    } catch (error) {
      console.error("❌ Erro ao carregar utilizadores:", error);
      return [];
    }
  }

  // Método para sincronização manual de dados
  async syncWithFirebase(): Promise<boolean> {
    try {
      console.log("🔄 Iniciando sincronização manual com Firebase...");

      // Force reinitialize Firebase if needed
      await authService.forceReinitialize();

      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.firebaseUid) {
        // Re-autenticar se possível
        console.log(
          "✅ Utilizador Firebase encontrado, sincronização disponível",
        );
        return true;
      }

      console.log("ℹ️ Sem utilizador Firebase, mantendo dados locais");
      return false;
    } catch (error) {
      console.warn("⚠️ Sincronização Firebase falhou:", error);
      return false;
    }
  }
}

export const robustLoginService = new RobustLoginService();
export default robustLoginService;
