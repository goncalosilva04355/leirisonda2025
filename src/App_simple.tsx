import React, { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { authService, UserProfile } from "./services/authService";

function AppSimple() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    console.log("🔐 Tentativa de login:", email);
    setLoginError("");

    try {
      const result = await authService.login(email, password);

      if (result.success && result.user) {
        console.log("✅ Login bem-sucedido:", result.user.name);
        setCurrentUser(result.user);
        setIsAuthenticated(true);
      } else {
        console.log("❌ Login falhado:", result.error);
        setLoginError(result.error || "Credenciais inválidas");
      }
    } catch (error) {
      console.error("❌ Erro no login:", error);
      setLoginError("Erro de sistema");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    authService.logout();
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        loginError={loginError}
        isLoading={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Leirisonda</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Olá, {currentUser?.name} ({currentUser?.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Dashboard - Sistema Simplificado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Obras</h3>
              <p className="text-blue-700">Gestão de obras</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Piscinas</h3>
              <p className="text-green-700">Gestão de piscinas</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900">Manutenções</h3>
              <p className="text-yellow-700">Gestão de manutenções</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Clientes</h3>
              <p className="text-purple-700">Gestão de clientes</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sistema Funcionando ✅
            </h3>
            <p className="text-gray-600">
              Login bem-sucedido! Todos os utilizadores podem ver todos os
              dados. Sistema simplificado e operacional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppSimple;
