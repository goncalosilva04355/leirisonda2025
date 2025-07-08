import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  db,
  auth,
  isFirebaseReady,
  waitForFirebaseInit,
  getDB,
  getAuthService,
} from "../firebase/config";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
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

// Local fallback data
const defaultAdmin: UserProfile = {
  id: "1",
  name: "Gonçalo Fonseca",
  email: "gongonsilva@gmail.com",
  role: "super_admin",
  permissions: {
    obras: { view: true, create: true, edit: true, delete: true },
    manutencoes: { view: true, create: true, edit: true, delete: true },
    piscinas: { view: true, create: true, edit: true, delete: true },
    utilizadores: { view: true, create: true, edit: true, delete: true },
    relatorios: { view: true, create: true, edit: true, delete: true },
    clientes: { view: true, create: true, edit: true, delete: true },
  },
  active: true,
  createdAt: "2024-01-01T00:00:00.000Z",
};

export const authService = {
  // Login function with Firebase support
  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    console.log("🔐 Attempting login:", email);

    // Check if Firebase is available
    if (isFirebaseReady() && auth) {
      try {
        await waitForFirebaseInit();
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        if (userCredential.user) {
          // Get user profile from Firestore
          const userDoc = await getDoc(
            doc(db, "users", userCredential.user.uid),
          );
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            sessionStorage.setItem("currentUser", JSON.stringify(userData));
            console.log("✅ Firebase login successful");
            return { success: true, user: userData };
          }
        }
      } catch (error: any) {
        console.warn("⚠️ Firebase login failed:", error.message);
        // Fall through to local login
      }
    }

    // Local fallback login
    if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
      sessionStorage.setItem("currentUser", JSON.stringify(defaultAdmin));
      console.log("✅ Local login successful");
      return { success: true, user: defaultAdmin };
    }

    console.log("❌ Login failed");
    return { success: false, error: "Email ou password incorretos" };
  },

  // Register function (Firebase + local fallback)
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: "super_admin" | "manager" | "technician";
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    if (isFirebaseReady() && auth && db) {
      try {
        await waitForFirebaseInit();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password,
        );

        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: userData.name,
          });

          const userProfile: UserProfile = {
            id: userCredential.user.uid,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            permissions: {
              obras: { view: true, create: true, edit: true, delete: true },
              manutencoes: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
              piscinas: { view: true, create: true, edit: true, delete: true },
              utilizadores: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              relatorios: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
              clientes: { view: true, create: true, edit: true, delete: true },
            },
            active: true,
            createdAt: new Date().toISOString(),
          };

          await setDoc(doc(db, "users", userCredential.user.uid), userProfile);
          console.log("✅ Firebase registration successful");
          return { success: true, user: userProfile };
        }
      } catch (error: any) {
        console.warn("⚠️ Firebase registration failed:", error.message);
        return { success: false, error: error.message };
      }
    }

    return {
      success: false,
      error: "Registo não disponível - Firebase não configurado",
    };
  },

  // Logout function
  async logout(): Promise<void> {
    if (isFirebaseReady() && auth) {
      try {
        await signOut(auth);
        console.log("🚪 Firebase logout successful");
      } catch (error) {
        console.warn("⚠️ Firebase logout failed:", error);
      }
    }

    sessionStorage.removeItem("currentUser");
    console.log("🚪 Local logout completed");
  },

  // Get current user
  getCurrentUser(): UserProfile | null {
    try {
      const userData = sessionStorage.getItem("currentUser");
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  // Auth state change listener with Firebase support
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    // Initial call
    callback(this.getCurrentUser());

    let firebaseUnsubscribe: (() => void) | null = null;

    // Set up Firebase listener if available
    if (isFirebaseReady() && auth) {
      firebaseUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data() as UserProfile;
              sessionStorage.setItem("currentUser", JSON.stringify(userData));
              callback(userData);
              return;
            }
          } catch (error) {
            console.warn("Error getting user profile:", error);
          }
        }

        // If no Firebase user or error, check local storage
        callback(this.getCurrentUser());
      });
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      callback(this.getCurrentUser());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      if (firebaseUnsubscribe) {
        firebaseUnsubscribe();
      }
      window.removeEventListener("storage", handleStorageChange);
    };
  },
};
