/**
 * Firebase-Only Auth - DISABLED (Firestore not available)
 * Safe stub to prevent Firestore initialization errors
 */

console.log("🚫 FirebaseOnlyAuth disabled - Firestore not available");

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
  permissions: {
    obras: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    manutencoes: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    piscinas: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    utilizadores: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    relatorios: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    clientes: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
  active: boolean;
  createdAt: string;
}

export class FirebaseOnlyAuth {
  static async initialize(): Promise<boolean> {
    console.log("🚫 FirebaseOnlyAuth disabled - Firestore not available");
    return false;
  }

  static async login(email: string, password: string) {
    console.log("🚫 Firebase-only login disabled - using authService");
    return { success: false, error: "Firebase-only auth disabled" };
  }

  static async register(
    email: string,
    password: string,
    name: string,
    role: string,
  ) {
    console.log("🚫 Firebase-only register disabled - using authService");
    return { success: false, error: "Firebase-only auth disabled" };
  }

  static async logout() {
    console.log("🚫 Firebase-only logout disabled - using authService");
    return false;
  }
}
