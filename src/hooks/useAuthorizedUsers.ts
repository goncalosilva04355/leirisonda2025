import { useState, useEffect } from "react";
import {
  AuthorizedUser,
  getCurrentAuthorizedUsers,
} from "../config/authorizedUsers";

// Hook para gerir utilizadores autorizados
export function useAuthorizedUsers() {
  const [users, setUsers] = useState<AuthorizedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar utilizadores
  const loadUsers = () => {
    try {
      const currentUsers = getCurrentAuthorizedUsers();
      setUsers(currentUsers);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar utilizadores:", error);
      setUsers([]);
      setIsLoading(false);
    }
  };

  // Carregar na inicialização
  useEffect(() => {
    loadUsers();

    // Listener para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authorizedUsers") {
        loadUsers();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Função para atualizar utilizadores
  const updateUsers = (newUsers: AuthorizedUser[]) => {
    localStorage.setItem("authorizedUsers", JSON.stringify(newUsers));
    setUsers(newUsers);

    // Disparar evento personalizado para outros componentes
    window.dispatchEvent(
      new CustomEvent("authorizedUsersChanged", {
        detail: newUsers,
      }),
    );
  };

  return {
    users,
    isLoading,
    updateUsers,
    reloadUsers: loadUsers,
  };
}
