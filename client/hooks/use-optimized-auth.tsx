import { useAuth } from "@/components/AuthProvider";
import { useMemo } from "react";

/**
 * Hook otimizado que evita re-renders desnecessários do contexto de autenticação
 */
export function useOptimizedAuth() {
  const authContext = useAuth();

  // Memoize apenas as propriedades que realmente importam
  const optimizedContext = useMemo(() => {
    if (!authContext) return null;

    return {
      user: authContext.user,
      isAuthenticated: !!authContext.user,
      isLoading: authContext.isLoading,
      isInitialized: authContext.isInitialized,
      login: authContext.login,
      logout: authContext.logout,
      getAllUsers: authContext.getAllUsers,
      // Propriedades derivadas para evitar recálculos
      userPermissions: authContext.user?.permissions || {},
      userName: authContext.user?.name || "",
      userEmail: authContext.user?.email || "",
      userRole: authContext.user?.role || "user",
      canCreateWorks: authContext.user?.permissions?.canCreateWorks || false,
      canDeleteWorks: authContext.user?.permissions?.canDeleteWorks || false,
      canViewReports: authContext.user?.permissions?.canViewReports || false,
    };
  }, [
    authContext?.user,
    authContext?.isLoading,
    authContext?.isInitialized,
    authContext?.login,
    authContext?.logout,
    authContext?.getAllUsers,
  ]);

  return optimizedContext;
}

/**
 * Hook especializado apenas para verificar se está logado (muito rápido)
 */
export function useIsAuthenticated() {
  const authContext = useAuth();
  return useMemo(() => !!authContext?.user, [authContext?.user]);
}

/**
 * Hook especializado apenas para permissões (evita re-renders)
 */
export function useUserPermissions() {
  const authContext = useAuth();
  return useMemo(
    () => authContext?.user?.permissions || {},
    [authContext?.user?.permissions],
  );
}
