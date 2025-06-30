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
          name: "Gonçalo Silva",
          role: "admin" as const,
          permissions: defaultAdminPermissions,
          createdAt: new Date().toISOString(),
        },
      },

      {
        email: "tecnico@leirisonda.pt",
        userData: {
          email: "tecnico@leirisonda.pt",
          name: "Técnico Leirisonda",
          role: "user" as const,
          permissions: defaultUserPermissions,
          createdAt: new Date().toISOString(),
        },
      },
      {
        email: "supervisor@leirisonda.pt",
        userData: {
          email: "supervisor@leirisonda.pt",
          name: "Supervisor",
          role: "admin" as const,
          permissions: {
            ...defaultAdminPermissions,
            canDeleteUsers: false,
            canDeleteWorks: false,
          },
          createdAt: new Date().toISOString(),
        },
      },
      {
        email: "alexkamaryta@gmail.com",
        userData: {
          email: "alexkamaryta@gmail.com",
          name: "Alexandre Fernandes",
          role: "user" as const,
          permissions: defaultUserPermissions,
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

        console.log("🔐 Starting login process for:", email);

        // Run user data correction first
        fixUserData();

        // First try legacy login for immediate access, then Firebase in background
        const globalUsers = [
          {
            email: "gongonsilva@gmail.com",
            password: "19867gsf",
            user: {
              id: "admin",
              email: "gongonsilva@gmail.com",
              name: "Gonçalo Silva",
              role: "admin" as const,
              permissions: defaultAdminPermissions,
              createdAt: new Date().toISOString(),
            },
          },
          {
            email: "tecnico@leirisonda.pt",
            password: "tecnico123",
            user: {
              id: "tecnico1",
              email: "tecnico@leirisonda.pt",
              name: "Técnico Leirisonda",
              role: "user" as const,
              permissions: defaultUserPermissions,
              createdAt: new Date().toISOString(),
            },
          },
          {
            email: "supervisor@leirisonda.pt",
            password: "supervisor123",
            user: {
              id: "supervisor1",
              email: "supervisor@leirisonda.pt",
              name: "Supervisor",
              role: "admin" as const,
              permissions: {
                ...defaultAdminPermissions,
                canDeleteUsers: false,
                canDeleteWorks: false,
              },
              createdAt: new Date().toISOString(),
            },
          },
          {
            email: "alexkamaryta@gmail.com",
            password: "69alexandre",
            user: {
              id: "alexfernandes1",
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

        console.log("🔍 Checking local credentials first...");
        const localUser = globalUsers.find(
          (u) => u.email === email && u.password === password,
        );

        if (localUser) {
          console.log("✅ Local user authenticated:", localUser.user.name);
          setUser(localUser.user);
          localStorage.setItem(
            "leirisonda_user",
            JSON.stringify(localUser.user),
          );

          // Try Firebase in background for future sync
          if (auth && auth !== null) {
            setTimeout(async () => {
              try {
                console.log("🔄 Attempting Firebase login in background...");
                await signInWithEmailAndPassword(auth, email, password);
                console.log("✅ Firebase auth successful");
                await firebaseService.syncLocalDataToFirebase();
              } catch (bgError: any) {
                if (bgError.code === "auth/user-not-found") {
                  try {
                    await createUserWithEmailAndPassword(auth, email, password);
                    console.log("✅ User created in Firebase");
                  } catch (createError) {
                    console.log(
                      "ℹ️ Firebase user creation failed:",
                      createError,
                    );
                  }
                }
                console.log(
                  "ℹ️ Firebase background auth failed:",
                  bgError.code,
                );
              }
            }, 100);
          }

          return true;
        }

        // Check for dynamically created users
        console.log("🔍 Checking dynamically created users...");
        try {
          const storedUsers = localStorage.getItem("users");
          console.log(
            "📂 Raw stored users:",
            storedUsers ? storedUsers.substring(0, 200) + "..." : "null",
          );

          if (storedUsers) {
            const users = JSON.parse(storedUsers);
            console.log(
              "👥 Parsed users count:",
              users.length,
              "Available emails:",
              users.map((u: User) => u.email),
            );

            // Normalize email for comparison - try multiple variations
            const emailVariations = [
              email,
              email.trim(),
              email.trim().toLowerCase(),
              email.toLowerCase(),
            ];

            let foundUser = null;
            let usedEmailVariation = null;

            // Try all email variations to find the user
            for (const emailVar of emailVariations) {
              foundUser = users.find(
                (u: User) =>
                  u.email &&
                  (u.email === emailVar ||
                    u.email.trim() === emailVar ||
                    u.email.trim().toLowerCase() === emailVar.toLowerCase()),
              );
              if (foundUser) {
                usedEmailVariation = emailVar;
                break;
              }
            }

            if (foundUser) {
              console.log("👤 Found user:", {
                name: foundUser.name,
                id: foundUser.id,
                email: foundUser.email,
                searchedWith: usedEmailVariation,
                inputEmail: email,
              });

              // Enhanced password search with all possible key variations
              const passwordKeys = [
                `password_${foundUser.id}`,
                `password_${foundUser.email}`,
                `password_${foundUser.email?.trim()}`,
                `password_${foundUser.email?.trim().toLowerCase()}`,
                `password_${email}`,
                `password_${email.trim()}`,
                `password_${email.trim().toLowerCase()}`,
                `password_${email.toLowerCase()}`,
              ];

              // Remove duplicates
              const uniquePasswordKeys = [...new Set(passwordKeys)];

              let storedPassword = null;
              let usedKey = null;
              const searchResults: Array<{
                key: string;
                value: string | null;
              }> = [];

              for (const key of uniquePasswordKeys) {
                const pwd = localStorage.getItem(key);
                searchResults.push({ key, value: pwd });
                if (pwd && !storedPassword) {
                  storedPassword = pwd;
                  usedKey = key;
                }
              }

              console.log("🔐 Comprehensive password search:", {
                userId: foundUser.id,
                userEmail: foundUser.email,
                inputEmail: email,
                searchedKeys: uniquePasswordKeys,
                searchResults: searchResults.map((r) => ({
                  key: r.key,
                  hasValue: !!r.value,
                  valueLength: r.value?.length || 0,
                })),
                foundPassword: !!storedPassword,
                usedKey,
                passwordsMatch: storedPassword === password,
                inputPassword: password
                  ? `[${password.length} chars]`
                  : "empty",
                storedPassword: storedPassword
                  ? `[${storedPassword.length} chars]`
                  : "not found",
              });

              if (storedPassword && storedPassword === password) {
                console.log("✅ Dynamic user authenticated:", foundUser.name);

                // Ensure user has complete data structure
                const completeUser = {
                  ...foundUser,
                  permissions:
                    foundUser.permissions ||
                    (foundUser.role === "admin"
                      ? defaultAdminPermissions
                      : defaultUserPermissions),
                  createdAt: foundUser.createdAt || new Date().toISOString(),
                  updatedAt: foundUser.updatedAt || new Date().toISOString(),
                };

                setUser(completeUser);
                localStorage.setItem(
                  "leirisonda_user",
                  JSON.stringify(completeUser),
                );

                // Try Firebase in background for future sync
                if (auth && auth !== null) {
                  setTimeout(async () => {
                    try {
                      console.log(
                        "🔄 Attempting Firebase login in background for dynamic user...",
                      );
                      await signInWithEmailAndPassword(auth, email, password);
                      console.log("✅ Firebase auth successful");
                      await firebaseService.syncLocalDataToFirebase();
                    } catch (bgError: any) {
                      if (bgError.code === "auth/user-not-found") {
                        try {
                          await createUserWithEmailAndPassword(
                            auth,
                            email,
                            password,
                          );
                          console.log("✅ User created in Firebase");
                        } catch (createError) {
                          console.log(
                            "ℹ️ Firebase user creation failed:",
                            createError,
                          );
                        }
                      }
                      console.log(
                        "ℹ️ Firebase background auth failed:",
                        bgError.code,
                      );
                    }
                  }, 100);
                }

                return true;
              } else {
                console.log("❌ Invalid password for dynamic user");

                // Enhanced password debugging
                if (storedPassword) {
                  console.log("🔍 Password comparison debug:", {
                    provided: `"${password}"`,
                    providedType: typeof password,
                    providedLength: password?.length,
                    providedCharCodes: password
                      ?.split("")
                      .map((c) => c.charCodeAt(0)),
                    stored: `"${storedPassword}"`,
                    storedType: typeof storedPassword,
                    storedLength: storedPassword?.length,
                    storedCharCodes: storedPassword
                      ?.split("")
                      .map((c) => c.charCodeAt(0)),
                    exactMatch: storedPassword === password,
                    trimmedMatch: storedPassword.trim() === password.trim(),
                    lowercase:
                      storedPassword.toLowerCase() === password.toLowerCase(),
                  });

                  // Try auto-fix if there's a close match
                  if (
                    storedPassword.trim() === password.trim() ||
                    storedPassword.toLowerCase() === password.toLowerCase()
                  ) {
                    console.log("��� Auto-fixing password mismatch...");
                    uniquePasswordKeys.forEach((key) => {
                      localStorage.setItem(key, password);
                    });
                    console.log("✅ Password auto-fixed, trying again...");
                    return login(email, password); // Recursive call with fixed password
                  }
                } else {
                  console.log(
                    "🔍 No password found for user - possible suggestions:",
                  );
                  const suggestedPasswords = [
                    foundUser.name.toLowerCase().replace(/\s+/g, "") + "123",
                    foundUser.email.split("@")[0] + "123",
                    "password123",
                  ];
                  console.log(
                    "💡 Suggested passwords to try:",
                    suggestedPasswords,
                  );
                }
              }
            } else {
              console.log("❌ Dynamic user not found for any email variation");
              console.log("🔍 Detailed email search debug:", {
                searchEmail: email,
                triedVariations: emailVariations,
                availableUsers: users.map((u: User) => ({
                  id: u.id,
                  email: u.email,
                  name: u.name,
                  emailVariations: [
                    u.email,
                    u.email?.trim(),
                    u.email?.toLowerCase(),
                    u.email?.trim().toLowerCase(),
                  ],
                })),
              });
            }
          } else {
            console.log("📂 No stored users found in localStorage");
          }
        } catch (error) {
          console.error("❌ Error checking dynamic users:", error);
        }

        console.log("❌ Local credentials invalid, trying Firebase...");

        // Check if Firebase is available
        if (auth && auth !== null) {
          console.log("🔐 Attempting Firebase login for:", email);

          try {
            // Try Firebase Auth login
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password,
            );
            const firebaseUser = userCredential.user;

            console.log("✅ Firebase Auth successful");

            // Get user data from Firestore
            const userData = await getUserFromFirestore(firebaseUser);

            if (userData) {
              setUser(userData);
              localStorage.setItem("leirisonda_user", JSON.stringify(userData));

              // Start real-time data sync (with error handling)
              try {
                console.log("🔄 Starting Firebase real-time sync...");
                await firebaseService.syncLocalDataToFirebase();
              } catch (syncError) {
                console.warn(
                  "⚠️ Firebase sync failed, continuing with local data:",
                  syncError,
                );
              }

              return true;
            }

            return false;
          } catch (firebaseError: any) {
            console.log(
              "⚠️ Firebase Auth failed:",
              firebaseError.code,
              firebaseError.message,
            );

            // If user doesn't exist, try to create it
            if (
              firebaseError.code === "auth/user-not-found" ||
              firebaseError.code === "auth/wrong-password"
            ) {
              console.log("👤 Trying to create user in Firebase...");
              try {
                await createUserWithEmailAndPassword(auth, email, password);
                console.log(
                  "✅ User created in Firebase, trying login again...",
                );

                // Try login again after creating user
                const retryCredential = await signInWithEmailAndPassword(
                  auth,
                  email,
                  password,
                );
                const retryUser = retryCredential.user;
                const userData = await getUserFromFirestore(retryUser);

                if (userData) {
                  setUser(userData);
                  localStorage.setItem(
                    "leirisonda_user",
                    JSON.stringify(userData),
                  );
                  return true;
                }
              } catch (createError: any) {
                console.log(
                  "⚠️ Failed to create user in Firebase:",
                  createError.code,
                  createError.message,
                );
              }
            }

            console.log("🔄 Falling back to legacy login...");
          }
        } else {
          console.log("📱 Firebase not available, using local authentication");
        }

        console.error("❌ Login failed");
        setInitError("Credenciais inválidas");
        return false;
      } catch (loginError: any) {
        console.error("❌ Login error:", loginError);
        setInitError("Erro durante o login");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
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
