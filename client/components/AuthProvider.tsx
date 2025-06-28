import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User, AuthContextType, UserPermissions } from "@shared/types";
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
  const [isLoading, setIsLoading] = useState(false); // Start with false

  const loadStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("leirisonda_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        // Add default permissions if missing
        if (!parsedUser.permissions) {
          parsedUser.permissions =
            parsedUser.role === "admin"
              ? defaultAdminPermissions
              : defaultUserPermissions;
        }

        console.log("Stored user loaded:", parsedUser.email);
        setUser(parsedUser);
      } else {
        console.log("No stored user found");
      }
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("leirisonda_user");
    }
  };

  useEffect(() => {
    // Load stored user on mount
    loadStoredUser();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        // Predefined global users that work on any device
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
            email: "user@leirisonda.pt",
            password: "user123",
            user: {
              id: "user1",
              email: "user@leirisonda.pt",
              name: "Utilizador",
              role: "user" as const,
              permissions: defaultUserPermissions,
              createdAt: new Date().toISOString(),
            },
          },
          {
            email: "alexkamaryta@gmail.com",
            password: "69alexandre",
            user: {
              id: "alexandre1",
              email: "alexkamaryta@gmail.com",
              name: "Alexandre Fernandes",
              role: "admin" as const,
              permissions: defaultAdminPermissions,
              createdAt: new Date().toISOString(),
            },
          },
        ];

        // Check global users first
        console.log("🔍 Checking global users for:", email);
        const globalUser = globalUsers.find(
          (u) => u.email === email && u.password === password,
        );

        if (globalUser) {
          console.log("✅ Global user found:", globalUser.user.name);
          setUser(globalUser.user);
          localStorage.setItem(
            "leirisonda_user",
            JSON.stringify(globalUser.user),
          );

          // Start auto-sync when user logs in
          console.log("🔄 Starting automatic data synchronization...");
          dataSyncService.startAutoSync(5); // Sync every 5 minutes

          return true;
        } else {
          console.log("❌ No global user match for:", email, password);
        }

        // Check additional users
        const storedUsers = localStorage.getItem("leirisonda_users");
        console.log("🔍 Checking stored users:", storedUsers);

        if (storedUsers) {
          const users: User[] = JSON.parse(storedUsers);
          console.log("👥 Parsed users:", users);

          const foundUser = users.find((u) => u.email === email);
          console.log("🔎 Found user for email", email, ":", foundUser);

          if (foundUser) {
            const storedPassword = localStorage.getItem(
              `password_${foundUser.id}`,
            );
            console.log(
              "🔐 Stored password for user",
              foundUser.id,
              ":",
              storedPassword,
            );
            console.log("🔑 Provided password:", password);

            if (storedPassword === password) {
              console.log("✅ Password match! Logging in...");
              setUser(foundUser);
              localStorage.setItem(
                "leirisonda_user",
                JSON.stringify(foundUser),
              );
              return true;
            } else {
              console.log("❌ Password mismatch");
            }
          } else {
            console.log("❌ User not found");
          }
        } else {
          console.log("❌ No stored users found");
        }

        return false;
      } catch (error) {
        console.error("Login error:", error);
        return false;
      }
    },
    [],
  );

  const logout = useCallback(() => {
    try {
      setUser(null);
      localStorage.removeItem("leirisonda_user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("useAuth called outside of AuthProvider context");
    // Return a default context instead of throwing during development
    return {
      user: null,
      login: async () => false,
      logout: () => {},
      isLoading: false,
    };
  }
  return context;
}
