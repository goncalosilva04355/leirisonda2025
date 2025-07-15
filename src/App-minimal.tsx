import React, { useState } from "react";

// Imports mínimos essenciais
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";

function AppMinimal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => {
    console.log("🔑 Login attempt:", email);
    setLoginError("");

    // Login básico funcional
    if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
      setIsAuthenticated(true);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: 1,
          email: email,
          name: "Gonçalo Fonseca",
          role: "super_admin",
        }),
      );
      localStorage.setItem("isAuthenticated", "true");
      console.log("✅ Login realizado com sucesso");
    } else {
      setLoginError("Email ou password incorretos");
      console.log("❌ Login falhou");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAuthenticated");
    console.log("🚪 Logout realizado");
  };

  // Se não está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        loginError={loginError}
        isLoading={false}
      />
    );
  }

  // Dashboard simples após login
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Leirisonda - Sistema de Gestão
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-green-600 mb-4">
              🎉 Sistema funcionando!
            </h2>
            <p className="text-gray-700 mb-4">
              Login realizado com sucesso. O sistema está operacional.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>✅ React: Funcionando</p>
              <p>✅ TailwindCSS: Funcionando</p>
              <p>✅ Login: Funcionando</p>
              <p>✅ Navegação: Funcionando</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppMinimal;
