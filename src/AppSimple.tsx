import React, { useState, useEffect } from "react";
import {
  Building2,
  Menu,
  X,
  Home,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

// Simple storage utilities
const getItem = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore errors
  }
};

function AppSimple() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Check authentication on load
  useEffect(() => {
    const savedUser = getItem("currentUser");
    const isAuth = getItem("isAuthenticated");

    if (savedUser && isAuth === "true") {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch {
        // Clear invalid data
        setItem("currentUser", "");
        setItem("isAuthenticated", "false");
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Default admin login
    if (
      loginForm.email === "gongonsilva@gmail.com" &&
      loginForm.password === "19867gsf"
    ) {
      const user = {
        id: 1,
        name: "Gonçalo Fonseca",
        email: "gongonsilva@gmail.com",
        role: "super_admin",
      };

      setCurrentUser(user);
      setIsAuthenticated(true);
      setItem("currentUser", JSON.stringify(user));
      setItem("isAuthenticated", "true");
      console.log("✅ Login realizado com sucesso");
    } else {
      setLoginError("Credenciais inválidas");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveSection("dashboard");
    setItem("currentUser", "");
    setItem("isAuthenticated", "false");
    console.log("✅ Logout realizado");
  };

  // Login page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Building2 className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Leirisonda</h1>
            <p className="text-gray-600">Sistema de Gestão de Piscinas</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {loginError}
              </div>
            )}

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="seu@email.com"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo: gongonsilva@gmail.com / 19867gsf</p>
          </div>
        </div>
      </div>
    );
  }

  // Main app
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-cyan-600" />
                <h1 className="ml-2 text-xl font-semibold text-gray-900">
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
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:top-16 bg-white border-r">
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex-1 px-3 space-y-1">
              <button
                onClick={() => setActiveSection("dashboard")}
                className={`${
                  activeSection === "dashboard"
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </button>

              <button
                onClick={() => setActiveSection("utilizadores")}
                className={`${
                  activeSection === "utilizadores"
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <Users className="mr-3 h-5 w-5" />
                Utilizadores
              </button>

              <button
                onClick={() => setActiveSection("configuracoes")}
                className={`${
                  activeSection === "configuracoes"
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Configurações
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 flex z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              {/* Mobile nav content */}
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <Building2 className="h-8 w-8 text-cyan-600" />
                  <h1 className="ml-2 text-xl font-semibold text-gray-900">
                    Leirisonda
                  </h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  <button
                    onClick={() => {
                      setActiveSection("dashboard");
                      setSidebarOpen(false);
                    }}
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
                  >
                    <Home className="mr-4 h-6 w-6" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection("utilizadores");
                      setSidebarOpen(false);
                    }}
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
                  >
                    <Users className="mr-4 h-6 w-6" />
                    Utilizadores
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="lg:pl-64 flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {activeSection === "dashboard" && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    Dashboard
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Building2 className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Obras Ativas
                              </dt>
                              <dd className="text-lg font-medium text-gray-900">
                                12
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Users className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Utilizadores
                              </dt>
                              <dd className="text-lg font-medium text-gray-900">
                                8
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Settings className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Sistema
                              </dt>
                              <dd className="text-lg font-medium text-gray-900">
                                Online
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                          Status do Sistema
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Aplicação
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✅ Funcionando
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Base de Dados
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✅ Conectada
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Última Atualização
                            </span>
                            <span className="text-sm text-gray-900">
                              {new Date().toLocaleString("pt-PT")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "utilizadores" && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    Utilizadores
                  </h1>
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <p className="text-gray-600">
                        Gestão de utilizadores em desenvolvimento.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "configuracoes" && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    Configurações
                  </h1>
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <p className="text-gray-600">
                        Configurações do sistema em desenvolvimento.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppSimple;
