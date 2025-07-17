import React, { useState, useEffect } from "react";
import { Building2, Menu, X } from "lucide-react";

// Função para gerar IDs únicos
const generateUniqueId = (prefix: string = "item"): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${random}`;
};

// Utilizador padrão para produção
const defaultUser = {
  id: 1,
  name: "Gonçalo Fonseca",
  email: "gongonsilva@gmail.com",
  password: "19867gsf",
  role: "super_admin",
  permissions: {
    obras: { view: true, create: true, edit: true, delete: true },
    manutencoes: { view: true, create: true, edit: true, delete: true },
    piscinas: { view: true, create: true, edit: true, delete: true },
    utilizadores: { view: true, create: true, edit: true, delete: true },
    relatorios: { view: true, create: true, edit: true, delete: true },
    clientes: { view: true, create: true, edit: true, delete: true },
  },
  active: true,
  createdAt: "2024-01-01",
};

function AppProduction() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  console.log("🚀 AppProduction carregada com sucesso!");

  // Função de login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    console.log("🔐 Tentativa de login:", {
      email: loginForm.email,
      timestamp: new Date().toISOString(),
    });

    // Verificar credenciais
    if (
      loginForm.email === defaultUser.email &&
      loginForm.password === defaultUser.password
    ) {
      console.log("✅ Login bem-sucedido!");
      setCurrentUser(defaultUser);
      setIsAuthenticated(true);

      // Salvar no localStorage
      localStorage.setItem("currentUser", JSON.stringify(defaultUser));
      localStorage.setItem("isAuthenticated", "true");
    } else {
      console.log("❌ Credenciais inválidas");
      setLoginError("Email ou palavra-passe incorretos");
    }
  };

  // Função de logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginForm({ email: "", password: "" });
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAuthenticated");
    console.log("🚪 Logout realizado");
  };

  // Verificar se já está autenticado
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const isAuth = localStorage.getItem("isAuthenticated");

    if (savedUser && isAuth === "true") {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        console.log("🔄 Sessão restaurada:", user.email);
      } catch (error) {
        console.error("❌ Erro ao restaurar sessão:", error);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isAuthenticated");
      }
    }
  }, []);

  // Se não está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Leirisonda</h1>
            <p className="text-gray-600">Sistema de Gestão de Piscinas</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavra-passe
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Versão de Produção Simplificada</p>
            <p className="mt-2">
              <button
                onClick={() => {
                  localStorage.setItem("forceAdvancedApp", "true");
                  localStorage.removeItem("forceSimpleApp");
                  window.location.reload();
                }}
                className="text-blue-600 hover:underline"
              >
                Carregar Versão Completa
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Interface principal simplificada
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center ml-4 lg:ml-0">
                <Building2 className="w-8 h-8 text-blue-600" />
                <h1 className="ml-2 text-xl font-bold text-gray-900">
                  Leirisonda
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Olá, {currentUser?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar móvel */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {[
                "dashboard",
                "obras",
                "piscinas",
                "manutencoes",
                "clientes",
              ].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    setActiveSection(section);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeSection === section
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              Versão de produção simplificada ativa. A aplicação está
              funcionando corretamente.
            </p>
            <p className="text-blue-600 mt-2 text-sm">
              Para aceder a todas as funcionalidades, clique no botão abaixo:
            </p>
            <button
              onClick={() => {
                localStorage.setItem("forceAdvancedApp", "true");
                localStorage.removeItem("forceSimpleApp");
                window.location.reload();
              }}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Carregar Aplicação Completa
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppProduction;
