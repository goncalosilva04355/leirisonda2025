import React, { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { authService, UserProfile } from "./services/authService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loginError, setLoginError] = useState("");

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={async (email: string, password: string) => {
          console.log("🔐 Login attempt for:", email);
          setLoginError("");

          if (!email?.trim() || !password?.trim()) {
            setLoginError("Por favor, preencha todos os campos");
            return;
          }

          try {
            const result = await authService.login(email.trim(), password);

            if (result.success && result.user) {
              console.log("✅ Login successful for:", result.user.email);
              setCurrentUser(result.user);
              setIsAuthenticated(true);
            } else {
              console.warn("❌ Login failed:", result.error);
              setLoginError(result.error || "Credenciais inválidas");
            }
          } catch (error: any) {
            console.error("❌ Login error:", error);
            setLoginError("Erro de conexão. Tente novamente.");
          }
        }}
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
            <h1 className="text-2xl font-bold text-gray-900">
              Leirisonda - Gestão
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Olá, {currentUser?.name} ({currentUser?.role})
              </span>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ✅ Sistema Operacional
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Login realizado com sucesso! Todos os utilizadores podem ver todos
            os dados.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 text-lg">Obras</h3>
              <p className="text-blue-700 mt-2">Gestão de obras</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 text-lg">Piscinas</h3>
              <p className="text-green-700 mt-2">Gestão de piscinas</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-semibold text-yellow-900 text-lg">
                Manutenções
              </h3>
              <p className="text-yellow-700 mt-2">Gestão de manutenções</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-purple-900 text-lg">
                Clientes
              </h3>
              <p className="text-purple-700 mt-2">Gestão de clientes</p>
            </div>
          </div>

          <div className="mt-12 bg-white p-8 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-green-600 mb-4">
              🎉 SISTEMA FUNCIONANDO!
            </h3>
            <p className="text-gray-600 text-lg">
              O sistema está operacional e simplificado. <br />
              Todos os utilizadores têm acesso a todos os dados globalmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
