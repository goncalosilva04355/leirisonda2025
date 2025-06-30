import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AlertTriangle } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User, AuthContextType, UserPermissions } from "@shared/types";
import { auth, db } from "@/lib/firebase";
import { firebaseService } from "@/services/FirebaseService";
import { dataSyncService } from "@/services/DataSync";
import "@/services/DefaultData"; // Initialize default data

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultAdminPermissions: UserPermissions = {
  canViewWorks: true,
  canCreateWorks: true,
  canEditWorks: true,
  canDeleteWorks: true,
  canViewMaintenance: true,
  canCreateMaintenance: true,
  canEditMaintenance: true,
  canDeleteMaintenance: true,
  canViewUsers: true,
  canCreateUsers: true,
  canEditUsers: true,
  canDeleteUsers: true,
  canViewReports: true,
  canExportData: true,
  canViewDashboard: true,
  canViewStats: true,
};

const defaultUserPermissions: UserPermissions = {
  canViewWorks: true,
  canCreateWorks: false,
  canEditWorks: false,
  canDeleteWorks: false,
  canViewMaintenance: true,
  canCreateMaintenance: false,
  canEditMaintenance: false,
  canDeleteMaintenance: false,
  canViewUsers: false,
  canCreateUsers: false,
  canEditUsers: false,
  canDeleteUsers: false,
  canViewReports: false,
  canExportData: false,
  canViewDashboard: true,
  canViewStats: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const loadStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("leirisonda_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        // Validate user object structure
        if (!parsedUser.email || !parsedUser.name) {
          console.warn("Invalid stored user data, clearing...");
          localStorage.removeItem("leirisonda_user");
          return;
        }

        // Add default permissions if missing
        if (!parsedUser.permissions) {
          parsedUser.permissions =
            parsedUser.role === "admin"
              ? defaultAdminPermissions
              : defaultUserPermissions;
        }

        console.log("✅ Stored user loaded:", parsedUser.email);
        setUser(parsedUser);
      } else {
        console.log("ℹ️ No stored user found");
      }
    } catch (error) {
      console.error("❌ Error parsing stored user:", error);
      localStorage.removeItem("leirisonda_user");
      // Don't set initError immediately, allow user to try login
      console.log("🔄 Continuing without stored user, allowing login...");
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("🔐 Initializing AuthProvider...");

        // Load stored user on mount
        loadStoredUser();
        setInitError(null);

        console.log("✅ AuthProvider initialized successfully");
      } catch (error) {
        console.error("❌ Error during AuthProvider initialization:", error);
        // Only set init error for critical failures
        if (error instanceof Error && error.message.includes("localStorage")) {
          setInitError("Sistema de armazenamento não disponível");
        } else {
          console.log("🔄 Non-critical error, continuing...");
          setInitError(null);
        }
      }
    };

    initializeAuth();
  }, []);

  const createGlobalUsersInFirebase = async () => {
    try {
      // Only try to create users if Firestore is available
      if (!db) {
        console.log(
          "📱 Firestore not available - skipping global user creation",
        );
        return;
      }
    } catch (error) {
      console.log("⚠️ Error checking Firestore availability:", error);
      return;
    }

    const globalUsers = [
      {
        email: "gongonsilva@gmail.com",
        userData: {
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Fonseca",
          role: "admin" as const,
          permissions: defaultAdminPermissions,
          createdAt: new Date().toISOString(),
        },
      },
      {
        email: "alexkamaryta@gmail.com",
        userData: {
          email: "alexkamaryta@gmail.com",
          name: "Alexandre Fernandes",
          role: "user" as const,
          permissions: {
            ...defaultUserPermissions,
            canEditWorks: true,
            canEditMaintenance: true,
            canViewReports: true,
          },
          createdAt: new Date().toISOString(),
        },
      },
    ];

    for (const globalUser of globalUsers) {
      try {
        const userRef = doc(db, "users", globalUser.email);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            id: globalUser.email,
            ...globalUser.userData,
          });
          console.log(`✅ Created global user: ${globalUser.userData.name}`);
        }
      } catch (error) {
        console.error(
          `❌ Error creating global user ${globalUser.email}:`,
          error,
        );
      }
    }
  };

  const getUserFromFirestore = async (
    firebaseUser: FirebaseUser,
  ): Promise<User | null> => {
    try {
      // Check if Firestore is available
      if (!db) {
        console.log("�� Firestore not available - creating local user");
        // Create a local user
        const defaultUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "Utilizador",
          role: "user",
          permissions: defaultUserPermissions,
          createdAt: new Date().toISOString(),
        };
        return defaultUser;
      }

      const userRef = doc(db, "users", firebaseUser.email || firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        return {
          ...userData,
          id: userSnap.id,
        };
      }

      // If user doesn't exist in Firestore, create default user
      const defaultUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name:
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "Utilizador",
        role: "user",
        permissions: defaultUserPermissions,
        createdAt: new Date().toISOString(),
      };

      await setDoc(userRef, defaultUser);
      return defaultUser;
    } catch (error) {
      console.error("Error getting user from Firestore:", error);
      return null;
    }
  };

  const fixUserData = useCallback(() => {
    try {
      console.log("🔧 Running comprehensive user data correction...");
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        let needsUpdate = false;

        users.forEach((user: User) => {
          // Ensure user has complete structure
          if (!user.permissions) {
            user.permissions =
              user.role === "admin"
                ? defaultAdminPermissions
                : defaultUserPermissions;
            needsUpdate = true;
            console.log(`🔧 Added permissions to user ${user.email}`);
          }

          if (!user.updatedAt) {
            user.updatedAt = user.createdAt || new Date().toISOString();
            needsUpdate = true;
            console.log(`🔧 Added updatedAt to user ${user.email}`);
          }

          // Comprehensive password key management
          const passwordKeys = [
            `password_${user.id}`,
            `password_${user.email}`,
            `password_${user.email.trim().toLowerCase()}`,
          ];

          // Find any existing password
          let existingPassword = null;
          let sourceKey = null;
          for (const key of passwordKeys) {
            const pwd = localStorage.getItem(key);
            if (pwd) {
              existingPassword = pwd;
              sourceKey = key;
              break;
            }
          }

          if (existingPassword) {
            // Ensure password is stored with all variations for maximum compatibility
            passwordKeys.forEach((key) => {
              const current = localStorage.getItem(key);
              if (!current) {
                localStorage.setItem(key, existingPassword);
                console.log(
                  `🔧 Duplicated password to key: ${key} from ${sourceKey}`,
                );
              }
            });
          } else {
            console.log(
              `⚠️ No password found for user ${user.email} (${user.id})`,
            );
          }
        });

        if (needsUpdate) {
          localStorage.setItem("users", JSON.stringify(users));
          console.log("🔧 User data structure updated");
        }

        console.log(`🔧 Fixed data for ${users.length} users`);
      } else {
        console.log("🔧 No users found to fix");
      }
    } catch (error) {
      console.error("❌ Error fixing user data:", error);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        setInitError(null);

        console.log("🔐 LOGIN ATTEMPT:", { email, password });

        // Clean inputs
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        console.log("🧹 CLEANED:", { cleanEmail, cleanPassword });

        // Check Gonçalo
        if (
          cleanEmail === "gongonsilva@gmail.com" &&
          cleanPassword === "19867gsf"
        ) {
          const user = {
            id: "admin_goncalo",
            email: "gongonsilva@gmail.com",
            name: "Gonçalo Fonseca",
            role: "admin" as const,
            permissions: defaultAdminPermissions,
            createdAt: new Date().toISOString(),
          };
          console.log("✅ GONÇALO LOGIN SUCCESS");
          setUser(user);
          localStorage.setItem("leirisonda_user", JSON.stringify(user));
          setIsLoading(false);
          return true;
        }

        // Check Alexandre
        if (
          cleanEmail === "alexkamaryta@gmail.com" &&
          cleanPassword === "69alexandre"
        ) {
          const user = {
            id: "user_alexandre",
            email: "alexkamaryta@gmail.com",
            name: "Alexandre Fernandes",
            role: "user" as const,
            permissions: {
              ...defaultUserPermissions,
              canEditWorks: true,
              canEditMaintenance: true,
              canViewReports: true,
            },
            createdAt: new Date().toISOString(),
          };
          console.log("✅ ALEXANDRE LOGIN SUCCESS");
          setUser(user);
          localStorage.setItem("leirisonda_user", JSON.stringify(user));
          setIsLoading(false);
          return true;
        }

        console.error("❌ LOGIN FAILED");
        console.log("Valid credentials:");
        console.log("• gongonsilva@gmail.com / 19867gsf");
        console.log("• alexkamaryta@gmail.com / 69alexandre");
        setIsLoading(false);
        return false;
      } catch (error) {
        console.error("❌ Login error:", error);
        setIsLoading(false);
        return false;
      }
    },
    [setUser, setIsLoading, setInitError],
  );

  const logout = useCallback(async () => {
    try {
      // Only try Firebase signOut if auth is available
      if (auth) {
        await signOut(auth);
      }
      setUser(null);
      localStorage.removeItem("leirisonda_user");
      firebaseService.cleanup();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    // Only setup auth listener if Firebase auth is available
    if (!auth) {
      console.log(
        "📱 Firebase Auth not available - skipping auth state listener",
      );
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !user) {
        // User is signed in with Firebase
        const userData = await getUserFromFirestore(firebaseUser);
        if (userData) {
          setUser(userData);
          localStorage.setItem("leirisonda_user", JSON.stringify(userData));

          // Initialize Firebase sync
          await firebaseService.syncLocalDataToFirebase();
        }
      } else if (!firebaseUser && user) {
        // User is signed out
        setUser(null);
        localStorage.removeItem("leirisonda_user");
        firebaseService.cleanup();
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Initialize global users in Firebase on first load
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        await createGlobalUsersInFirebase();
      } catch (error) {
        console.error("Error initializing Firebase:", error);
      }
    };

    initializeFirebase();
  }, []);

  // Show error state if there's an initialization error
  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Erro de Inicialização
          </h1>
          <p className="text-gray-600 mb-6">{initError}</p>
          <button
            onClick={() => {
              setInitError(null);
              loadStoredUser();
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("❌ useAuth called outside of AuthProvider context");

    // Provide a more robust fallback
    const fallbackContext: AuthContextType = {
      user: null,
      login: async (email: string, password: string) => {
        console.warn("Fallback login called - AuthProvider not available");
        return false;
      },
      logout: () => {
        console.warn("Fallback logout called - AuthProvider not available");
      },
      isLoading: false,
    };

    return fallbackContext;
  }
  return context;
}
