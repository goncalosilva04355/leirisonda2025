import React, { useState, useEffect } from "react";
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";

const AppFixed: React.FC = () => {
  console.log("🚀 AppFixed iniciando - versão sem loops");

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize app - simplified version without loops
  useEffect(() => {
    const initApp = async () => {
      try {
        console.log("🔄 Inicializando AppFixed...");

        // Minimal delay to prevent flash
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Check for existing auth
        const savedUser = localStorage.getItem("currentUser");
        const isAuthStored = localStorage.getItem("isAuthenticated");

        if (savedUser && isAuthStored === "true") {
          try {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            setIsAuthenticated(true);
            console.log("✅ Utilizador autenticado encontrado:", user.email);
          } catch (e) {
            console.warn("⚠️ Dados de autenticação corrompidos, limpando...");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("isAuthenticated");
          }
        }

        setIsLoading(false);
        console.log("✅ AppFixed inicializado com sucesso");
      } catch (error) {
        console.error("❌ Erro na inicialização:", error);
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  // Simple loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-200 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          {/* Logo Leirisonda */}
          <div className="text-center mb-8">
            <div className="bg-white rounded-lg shadow-lg p-4 mx-auto border border-gray-200 max-w-sm">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F9413eeead84d4fecb67b4e817e791c86?format=webp&width=800"
                alt="Leirisonda - Furos e Captações de Água, Lda"
                className="w-full h-auto object-contain"
                style={{ maxHeight: "80px" }}
              />
            </div>
          </div>

          {/* Title and loading */}
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Leirisonda
              </h1>
              <p className="text-gray-600 text-sm">
                Sistema de Gestão de Piscinas
              </p>
            </div>

            {/* Loading indicator */}
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700 text-sm">
                  A inicializar sistema...
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-300 h-2 rounded-full w-2/3 transition-all duration-1000"></div>
              </div>

              <p className="text-gray-500 text-xs">Por favor aguarde...</p>
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-400 text-center pt-4 border-t border-gray-100">
              <p>Furos e Captações de Água, Lda</p>
              <p>Versão 2025.07</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={async (
          email: string,
          password: string,
          rememberMe?: boolean,
        ) => {
          console.log("🔑 Tentativa de login:", email);

          try {
            // Hardcoded login for demo
            if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
              const user = {
                id: 1,
                email,
                name: "Gonçalo Fonseca",
                role: "super_admin",
              };

              setCurrentUser(user);
              setIsAuthenticated(true);

              localStorage.setItem("currentUser", JSON.stringify(user));
              localStorage.setItem("isAuthenticated", "true");

              console.log("✅ Login bem-sucedido");
            } else {
              throw new Error("Credenciais inválidas");
            }
          } catch (error) {
            console.log("❌ Erro no login:", error);
            setError(error instanceof Error ? error.message : "Erro no login");
            throw error;
          }
        }}
        loginError={error || ""}
      />
    );
  }

  // Authenticated - show main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 text-white">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🏊‍♂️ Leirisonda</h1>
          <p className="text-white/80 text-sm">Sistema de Gestão de Piscinas</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-white/80">
            Olá, {currentUser?.name || "Utilizador"}
          </span>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setCurrentUser(null);
              localStorage.removeItem("currentUser");
              localStorage.removeItem("isAuthenticated");
              console.log("👋 Logout realizado");
            }}
            className="bg-white/20 border border-white/30 px-4 py-2 rounded-md hover:bg-white/30 transition-colors text-sm"
          >
            🚪 Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-4">Aplicação Funcionando!</h2>
          <p className="text-xl text-white/80 mb-8">
            A aplicação está carregada e funcionando corretamente.
          </p>

          <div className="grid gap-4 max-w-md mx-auto text-left">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🔐 Autenticação</h3>
              <p className="text-sm text-white/80">
                Sistema de login funcionando
              </p>
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">💾 Persistência</h3>
              <p className="text-sm text-white/80">Dados salvos no navegador</p>
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🚀 Performance</h3>
              <p className="text-sm text-white/80">
                Carregamento rápido e estável
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppFixed;
