import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "worker";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking authentication from localStorage or API
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("leirisonda-user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate login API call
    if (email === "admin@leirisonda.pt" && password === "admin123") {
      const user: User = {
        id: "1",
        name: "Administrador",
        email: "admin@leirisonda.pt",
        role: "admin",
      };

      localStorage.setItem("leirisonda-user", JSON.stringify(user));
      setUser(user);
      return true;
    }

    throw new Error("Credenciais inválidas");
  };

  const logout = () => {
    localStorage.removeItem("leirisonda-user");
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
}
