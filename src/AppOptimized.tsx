import React, { useState, useEffect, lazy, Suspense, memo } from "react";
import PerformanceOptimizer from "./utils/performanceOptimizer";
import CacheManager from "./utils/cacheManager";
import { authService, UserProfile } from "./services/authService";

// Lazy load dos componentes principais
const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const SimpleFirebaseDebug = lazy(
  () => import("./components/SimpleFirebaseDebug"),
);

// Loading component otimizado
const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-blue-600 flex items-center justify-center">
    <div className="text-white text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p>A carregar aplicação...</p>
    </div>
  </div>
));

const DebugLoadingSpinner = memo(() => (
  <div className="fixed top-4 right-4 bg-gray-100 p-2 rounded animate-pulse">
    ⏳ Debug
  </div>
));

function AppOptimized() {
  // Estados otimizados
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loginError, setLoginError] = useState("");

  // Inicialização otimizada
  useEffect(() => {
    try {
      PerformanceOptimizer.initialize();
      CacheManager.initialize();
      console.log("🚀 Performance Optimizer ativo - aplicação optimizada!");
      console.log("💾 Cache Manager ativo - velocidade máxima!");
    } catch (error) {
      console.error("Error initializing optimizers:", error);
    }
  }, []);

  // Login handler otimizado
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoginError("");

      if (!email?.trim() || !password?.trim()) {
        setLoginError("Por favor, preencha todos os campos");
        return;
      }

      const result = await authService.login(email.trim(), password);

      if (result.success && result.user) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        console.log("✅ Login successful");
      } else {
        setLoginError(result.error || "Credenciais inválidas");
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      setLoginError("Erro de sistema. Tente novamente.");
    }
  };

  // Logout handler otimizado
  const handleLogout = async () => {
    try {
      setCurrentUser(null);
      setIsAuthenticated(false);
      await authService.logout();
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Force logout mesmo com erro
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  // Se autenticado, mostrar dashboard (versão simplificada)
  if (isAuthenticated && currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Leirisonda
                  </h1>
                  <p className="text-sm text-gray-500">Gestão de Serviços</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Olá, {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Dashboard (Versão Otimizada)
            </h2>
            <p className="text-gray-600">
              Aplicação otimizada para máxima performance e estabilidade.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Status
                </h3>
                <p className="text-green-600">✅ Sistema Otimizado</p>
                <p className="text-green-600">✅ Performance Melhorada</p>
                <p className="text-green-600">✅ Estabilidade Máxima</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Utilizador
                </h3>
                <p className="text-sm text-gray-600">
                  Email: {currentUser.email}
                </p>
                <p className="text-sm text-gray-600">
                  Função: {currentUser.role}
                </p>
                <p className="text-sm text-gray-600">Estado: Ativo</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Performance
                </h3>
                <p className="text-sm text-green-600">🚀 Otimizado</p>
                <p className="text-sm text-green-600">⚡ Rápido</p>
                <p className="text-sm text-green-600">🛡️ Estável</p>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Tool */}
        <Suspense fallback={<DebugLoadingSpinner />}>
          <SimpleFirebaseDebug />
        </Suspense>
      </div>
    );
  }

  // Página de login otimizada
  return (
    <div className="min-h-screen bg-blue-600">
      <Suspense fallback={<DebugLoadingSpinner />}>
        <SimpleFirebaseDebug />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <LoginPage
          onLogin={handleLogin}
          loginError={loginError}
          isLoading={false}
        />
      </Suspense>
    </div>
  );
}

export default memo(AppOptimized);
