import React, { useState, useEffect, useCallback } from "react";
import {
  Building2,
  Menu,
  X,
  Home,
  Plus,
  Wrench,
  Waves,
  BarChart3,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Edit2,
  Play,
  Trash2,
  Save,
  UserPlus,
  Shield,
  Check,
  AlertCircle,
  Download,
  ArrowLeft,
  FileText,
  MapPin,
  Share,
  Database,
} from "lucide-react";

// Simplified storage utilities
const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.warn("Failed to save to localStorage");
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn("Failed to remove from localStorage");
    }
  },
};

// Default admin user
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
  createdAt: new Date().toISOString(),
};

function AppFixed() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  // Initialize app
  useEffect(() => {
    console.log("🚀 Leirisonda App iniciada com sucesso");

    // Ensure default user exists
    const savedUsers = safeLocalStorage.getItem("app-users");
    if (!savedUsers) {
      safeLocalStorage.setItem("app-users", JSON.stringify([defaultUser]));
    }

    // Check for existing session
    const savedCurrentUser = safeLocalStorage.getItem("currentUser");
    const isAuthenticatedStored = safeLocalStorage.getItem("isAuthenticated");

    if (savedCurrentUser && isAuthenticatedStored === "true") {
      try {
        const user = JSON.parse(savedCurrentUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        console.log("✅ Sessão restaurada para:", user.email);
      } catch (error) {
        console.warn("Erro ao restaurar sessão:", error);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginForm.email || !loginForm.password) {
      setLoginError("Por favor, preencha todos os campos");
      return;
    }

    try {
      const savedUsers = safeLocalStorage.getItem("app-users");
      const users = savedUsers ? JSON.parse(savedUsers) : [defaultUser];

      const user = users.find(
        (u: any) =>
          u.email === loginForm.email && u.password === loginForm.password,
      );

      if (user && user.active) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        safeLocalStorage.setItem("currentUser", JSON.stringify(user));
        safeLocalStorage.setItem("isAuthenticated", "true");
        setLoginForm({ email: "", password: "" });
        console.log("✅ Login realizado com sucesso:", user.email);
      } else {
        setLoginError("Credenciais inválidas ou utilizador inativo");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setLoginError("Erro interno. Tente novamente.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    safeLocalStorage.removeItem("currentUser");
    safeLocalStorage.removeItem("isAuthenticated");
    setActiveSection("dashboard");
    setSidebarOpen(false);
    console.log("🔓 Logout realizado");
  };

  // Login screen
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Conta de teste: gongonsilva@gmail.com / 19867gsf
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main app interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Leirisonda</h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              Olá, {currentUser?.name}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <nav className="w-64 bg-white shadow-lg h-screen fixed left-0 top-16 z-10">
            <div className="p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection("dashboard")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeSection === "dashboard"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Home className="w-5 h-5 mr-3" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveSection("obras")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeSection === "obras"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Building2 className="w-5 h-5 mr-3" />
                  Obras
                </button>
                <button
                  onClick={() => setActiveSection("piscinas")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeSection === "piscinas"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Waves className="w-5 h-5 mr-3" />
                  Piscinas
                </button>
                <button
                  onClick={() => setActiveSection("manutencoes")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeSection === "manutencoes"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Wrench className="w-5 h-5 mr-3" />
                  Manutenções
                </button>
                <button
                  onClick={() => setActiveSection("clientes")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeSection === "clientes"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Users className="w-5 h-5 mr-3" />
                  Clientes
                </button>
                <button
                  onClick={() => setActiveSection("relatorios")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeSection === "relatorios"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Relatórios
                </button>
                <button
                  onClick={() => setActiveSection("utilizadores")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeSection === "utilizadores"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <UserCheck className="w-5 h-5 mr-3" />
                  Utilizadores
                </button>
              </div>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : ""}`}
        >
          <div className="max-w-7xl mx-auto">
            {activeSection === "dashboard" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Dashboard
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Obras
                        </h3>
                        <p className="text-2xl font-bold text-blue-600">0</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-cyan-100 rounded-lg">
                        <Waves className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Piscinas
                        </h3>
                        <p className="text-2xl font-bold text-cyan-600">0</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Wrench className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Manutenções
                        </h3>
                        <p className="text-2xl font-bold text-green-600">0</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Clientes
                        </h3>
                        <p className="text-2xl font-bold text-purple-600">0</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Bem-vindo ao Leirisonda!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Sistema completo para gestão de piscinas, obras e
                      manutenções.
                    </p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setActiveSection("obras")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 inline mr-2" />
                        Nova Obra
                      </button>
                      <button
                        onClick={() => setActiveSection("piscinas")}
                        className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 inline mr-2" />
                        Nova Piscina
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "obras" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Obras</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Nova Obra
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma obra encontrada.</p>
                    <p className="text-sm text-gray-400">
                      Comece criando a sua primeira obra.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "piscinas" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Piscinas</h2>
                  <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Nova Piscina
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 text-center">
                    <Waves className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma piscina encontrada.</p>
                    <p className="text-sm text-gray-400">
                      Comece criando a sua primeira piscina.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "manutencoes" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Manutenções
                  </h2>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Nova Manutenção
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 text-center">
                    <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Nenhuma manutenção encontrada.
                    </p>
                    <p className="text-sm text-gray-400">
                      Comece criando a sua primeira manutenção.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "clientes" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Novo Cliente
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum cliente encontrado.</p>
                    <p className="text-sm text-gray-400">
                      Comece criando o seu primeiro cliente.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "relatorios" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Relatórios
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <BarChart3 className="w-8 h-8 text-blue-600" />
                      <h3 className="text-lg font-semibold ml-3">
                        Relatório de Obras
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Resumo de todas as obras e seu estado atual.
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4 inline mr-2" />
                      Gerar PDF
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Waves className="w-8 h-8 text-cyan-600" />
                      <h3 className="text-lg font-semibold ml-3">
                        Relatório de Piscinas
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Estado e manutenção de todas as piscinas.
                    </p>
                    <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors">
                      <Download className="w-4 h-4 inline mr-2" />
                      Gerar PDF
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Wrench className="w-8 h-8 text-green-600" />
                      <h3 className="text-lg font-semibold ml-3">
                        Relatório de Manutenções
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Histórico completo de manutenções realizadas.
                    </p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      <Download className="w-4 h-4 inline mr-2" />
                      Gerar PDF
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "utilizadores" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Utilizadores
                  </h2>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    <UserPlus className="w-4 h-4 inline mr-2" />
                    Novo Utilizador
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {currentUser?.name}
                          </h3>
                          <p className="text-gray-600">{currentUser?.email}</p>
                          <div className="mt-2">
                            <span className="inline-block px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                              <Shield className="w-3 h-3 inline mr-1" />
                              Super Administrador
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Permissões:
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            <Check className="w-3 h-3 mr-1" />
                            Obras
                          </span>
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-cyan-100 text-cyan-800 rounded">
                            <Check className="w-3 h-3 mr-1" />
                            Piscinas
                          </span>
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            <Check className="w-3 h-3 mr-1" />
                            Manutenções
                          </span>
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                            <Check className="w-3 h-3 mr-1" />
                            Clientes
                          </span>
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">
                            <Check className="w-3 h-3 mr-1" />
                            Utilizadores
                          </span>
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                            <Check className="w-3 h-3 mr-1" />
                            Relatórios
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppFixed;
