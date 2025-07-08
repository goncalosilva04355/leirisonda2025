import React, { useState, useEffect } from "react";
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
  Trash2,
  Save,
  UserPlus,
  Shield,
  Check,
  AlertCircle,
  Download,
  ArrowLeft,
  Bell,
} from "lucide-react";
import { LoginPage } from "./pages/LoginPage";
import { useDataSync } from "./hooks/useDataSync";
import { authService, UserProfile } from "./services/authService";

function App() {
  // SECURITY: Always start as not authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loginError, setLoginError] = useState("");

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  // Data sync hook - TODOS OS DADOS GLOBAIS
  const dataSync = useDataSync();

  // Custom setActiveSection that updates URL hash
  const navigateToSection = (section: string) => {
    setActiveSection(section);
    if (section !== "futuras-manutencoes") {
      window.history.replaceState(null, "", `#${section}`);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  // Authentication functions
  const handleLogin = async (email: string, password: string) => {
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
        localStorage.setItem("currentUser", JSON.stringify(result.user));

        // Navigate to dashboard
        const hash = window.location.hash.substring(1);
        if (hash && hash !== "login") {
          setActiveSection(hash);
        } else {
          navigateToSection("dashboard");
        }
      } else {
        console.warn("❌ Login failed:", result.error);
        setLoginError(result.error || "Credenciais inválidas");
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      setLoginError(
        "Erro de conexão. Verifique sua internet e tente novamente.",
      );
    }
  };

  const handleLogout = async () => {
    setSidebarOpen(false);
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    await authService.logout();
    navigateToSection("dashboard");
  };

  // Permission helper
  const hasPermission = (module: string, action: string) => {
    if (!currentUser) return false;
    return currentUser.permissions[module]?.[action] || false;
  };

  // Show login form if not authenticated
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
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-10 bg-white rounded-lg shadow-md p-1">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                    alt="Leirisonda Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Gestão de Serviços</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <button
              onClick={() => {
                navigateToSection("dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "dashboard"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            {hasPermission("obras", "view") && (
              <button
                onClick={() => {
                  navigateToSection("obras");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "obras"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span className="font-medium">Obras</span>
              </button>
            )}

            {hasPermission("piscinas", "view") && (
              <button
                onClick={() => {
                  navigateToSection("piscinas");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "piscinas"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Waves className="h-5 w-5" />
                <span className="font-medium">Piscinas</span>
              </button>
            )}

            {hasPermission("manutencoes", "view") && (
              <button
                onClick={() => {
                  navigateToSection("manutencoes");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "manutencoes"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Wrench className="h-5 w-5" />
                <span className="font-medium">Manutenções</span>
              </button>
            )}

            {hasPermission("utilizadores", "view") && (
              <button
                onClick={() => {
                  navigateToSection("utilizadores");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "utilizadores"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Utilizadores</span>
              </button>
            )}

            {hasPermission("relatorios", "view") && (
              <button
                onClick={() => {
                  navigateToSection("relatorios");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "relatorios"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Relatórios</span>
              </button>
            )}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {currentUser?.role?.replace("_", " ")}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Terminar Sessão</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {activeSection === "dashboard" && "Dashboard"}
                {activeSection === "obras" && "Gestão de Obras"}
                {activeSection === "piscinas" && "Gestão de Piscinas"}
                {activeSection === "manutencoes" && "Gestão de Manutenções"}
                {activeSection === "utilizadores" && "Gestão de Utilizadores"}
                {activeSection === "relatorios" && "Relatórios"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{currentUser?.name}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Obras Ativas</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {
                          dataSync.works.filter((w) => w.status !== "completed")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Waves className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Piscinas</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {dataSync.pools.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Manutenções</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {dataSync.maintenance.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Clientes</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {dataSync.clients.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                  <Check className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">
                      🎉 Sistema Operacional
                    </h3>
                    <p className="text-green-700 mt-1">
                      Login realizado com sucesso! Todos os utilizadores podem
                      ver todos os dados. Sistema simplificado e funcional.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dados Sincronizados
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-900 font-medium">Obras</span>
                    <span className="text-blue-700">
                      {dataSync.works.length} registros
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                    <span className="text-cyan-900 font-medium">Piscinas</span>
                    <span className="text-cyan-700">
                      {dataSync.pools.length} registros
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-900 font-medium">
                      Manutenções
                    </span>
                    <span className="text-yellow-700">
                      {dataSync.maintenance.length} registros
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-purple-900 font-medium">
                      Clientes
                    </span>
                    <span className="text-purple-700">
                      {dataSync.clients.length} registros
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "obras" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Gestão de Obras
              </h2>
              <p className="text-gray-600">
                Funcionalidade completa de obras será implementada aqui. Todos
                os utilizadores podem ver todas as obras.
              </p>
            </div>
          )}

          {activeSection === "piscinas" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Gestão de Piscinas
              </h2>
              <p className="text-gray-600">
                Funcionalidade completa de piscinas será implementada aqui.
                Todos os utilizadores podem ver todas as piscinas.
              </p>
            </div>
          )}

          {activeSection === "manutencoes" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Gestão de Manutenções
              </h2>
              <p className="text-gray-600">
                Funcionalidade completa de manutenções será implementada aqui.
                Todos os utilizadores podem ver todas as manutenções.
              </p>
            </div>
          )}

          {activeSection === "utilizadores" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Gestão de Utilizadores
              </h2>
              <p className="text-gray-600">
                Funcionalidade completa de utilizadores será implementada aqui.
              </p>
            </div>
          )}

          {activeSection === "relatorios" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Relatórios
              </h2>
              <p className="text-gray-600">
                Funcionalidade completa de relatórios será implementada aqui.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
