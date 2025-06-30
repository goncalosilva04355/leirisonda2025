import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@shared/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega utilizador do localStorage na inicialização
  useEffect(() => {
    console.log("🚀 AUTH INIT");
    try {
      const stored = localStorage.getItem("leirisonda_user");
      if (stored) {
        const parsedUser = JSON.parse(stored);
        console.log("👤 UTILIZADOR CARREGADO:", parsedUser.email);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar utilizador:", error);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("🔐 TENTATIVA LOGIN:", { email, password });
    setIsLoading(true);

    try {
      // Gonçalo
      if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
        const goncaloUser: User = {
          id: "admin_goncalo",
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Fonseca",
          role: "admin",
          permissions: {
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
          },
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem("leirisonda_user", JSON.stringify(goncaloUser));
        setUser(goncaloUser);
        console.log("✅ GONÇALO LOGIN SUCESSO");
        setIsLoading(false);
        return true;
      }

      // Alexandre
      if (email === "alexkamaryta@gmail.com" && password === "69alexandre") {
        const alexandreUser: User = {
          id: "user_alexandre",
          email: "alexkamaryta@gmail.com",
          name: "Alexandre Fernandes",
          role: "user",
          permissions: {
            canViewWorks: true,
            canCreateWorks: false,
            canEditWorks: true,
            canDeleteWorks: false,
            canViewMaintenance: true,
            canCreateMaintenance: false,
            canEditMaintenance: true,
            canDeleteMaintenance: false,
            canViewUsers: false,
            canCreateUsers: false,
            canEditUsers: false,
            canDeleteUsers: false,
            canViewReports: true,
            canExportData: false,
            canViewDashboard: true,
            canViewStats: true,
          },
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem("leirisonda_user", JSON.stringify(alexandreUser));
        setUser(alexandreUser);
        console.log("✅ ALEXANDRE LOGIN SUCESSO");
        setIsLoading(false);
        return true;
      }

      console.log("❌ CREDENCIAIS INVÁLIDAS");
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("❌ ERRO LOGIN:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("leirisonda_user");
    setUser(null);
    console.log("👋 LOGOUT");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
