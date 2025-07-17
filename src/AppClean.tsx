import React, { useState } from "react";
import { LoginPageFixed } from "./pages/LoginPageFixed";

function AppClean() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = async (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => {
    try {
      console.log("🔐 Tentativa de login:", email);

      // Validação simples
      if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
        const user = {
          id: 1,
          name: "Gonçalo Fonseca",
          email: "gongonsilva@gmail.com",
          role: "super_admin",
        };

        setCurrentUser(user);
        setIsAuthenticated(true);
        setLoginError("");

        console.log("✅ Login bem-sucedido!");
      } else {
        setLoginError("Email ou palavra-passe incorretos");
      }
    } catch (error) {
      console.error("❌ Erro no login:", error);
      setLoginError("Erro no sistema de login");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    console.log("👋 Logout realizado");
  };

  if (isAuthenticated && currentUser) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Leirisonda</h1>
                <span className="ml-2 text-sm text-gray-500">
                  Sistema de Gestão
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Bem-vindo, {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Dashboard
              </h3>
              <p className="text-gray-600">Visão geral do sistema</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Obras
              </h3>
              <p className="text-gray-600">Gestão de obras e projetos</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Piscinas
              </h3>
              <p className="text-gray-600">Gestão de piscinas</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Manutenções
              </h3>
              <p className="text-gray-600">Histórico de manutenções</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Clientes
              </h3>
              <p className="text-gray-600">Gestão de clientes</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Relatórios
              </h3>
              <p className="text-gray-600">Relatórios e estatísticas</p>
            </div>
          </div>

          <div className="mt-8 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <div className="flex">
              <div className="py-1">
                <svg
                  className="fill-current h-6 w-6 text-green-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">Sistema funcionando!</p>
                <p className="text-sm">
                  ✅ CSS carregado corretamente
                  <br />
                  ✅ React funcionando
                  <br />
                  ✅ Login operacional
                  <br />✅ Interface renderizada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoginPageFixed
      onLogin={handleLogin}
      loginError={loginError}
      isLoading={false}
    />
  );
}

export default AppClean;
