import React, { useState, useEffect } from "react";
import { LogOut, Settings } from "lucide-react";

function AppClean() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    console.log("🔐 Login attempt:", email);

    if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
      const user = {
        email,
        name: "Gonçalo Fonseca",
        role: "super_admin",
      };

      setCurrentUser(user);
      setIsAuthenticated(true);
      setLoginError("");

      // Save to localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");

      console.log("✅ Login successful");
    } else {
      setLoginError("Credenciais inválidas");
      console.log("❌ Login failed");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAuthenticated");
    console.log("✅ Logout successful");
  };

  // Restore authentication on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const savedAuth = localStorage.getItem("isAuthenticated");

    if (savedUser && savedAuth === "true") {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        console.log("🔄 Authentication restored for:", user.email);
      } catch (error) {
        console.error("❌ Error restoring auth:", error);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isAuthenticated");
      }
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Leirisonda</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;
              handleLogin(email, password);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                defaultValue="gongonsilva@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavra-passe
              </label>
              <input
                name="password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {loginError && (
              <div className="text-red-600 text-sm text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            Leirisonda - Sistema de Gestão
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Olá, {currentUser?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
            <p className="text-gray-600 mb-6">
              Bem-vindo ao sistema de gestão da Leirisonda.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Obras</h3>
                <p className="text-blue-700 text-sm">
                  Gestão de obras e projetos
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  Manutenções
                </h3>
                <p className="text-green-700 text-sm">
                  Controlo de manutenções
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Piscinas</h3>
                <p className="text-purple-700 text-sm">Gestão de piscinas</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">
                🚧 Sistema em Modo Simplificado
              </h4>
              <p className="text-yellow-800 text-sm">
                A aplicação está a funcionar em modo local apenas. Todas as
                funcionalidades básicas estão disponíveis.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppClean;
