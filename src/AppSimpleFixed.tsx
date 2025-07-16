import React, { useState, useEffect } from "react";
import { Building2, Menu, X, Home, Users, Waves, LogOut } from "lucide-react";
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";
import { authServiceWrapperSafe as authService } from "./services/authServiceWrapperSafe";
import { UserProfile } from "./services/robustLoginService";
import { safeLocalStorage } from "./utils/storageUtils";

function AppSimpleFixed() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loginError, setLoginError] = useState("");

  // Initialize authentication state
  useEffect(() => {
    // Always start as not authenticated for security
    setIsAuthenticated(false);
    setCurrentUser(null);
    safeLocalStorage.removeItem("currentUser");
    safeLocalStorage.removeItem("isAuthenticated");
  }, []);

  const handleLogin = async (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => {
    setLoginError("");

    if (!email?.trim() || !password?.trim()) {
      setLoginError("Por favor, preencha todos os campos");
      return;
    }

    try {
      const result = await authService.login(
        email.trim(),
        password,
        rememberMe,
      );

      if (result?.success && result?.user) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        setActiveSection("dashboard");
      } else {
        setLoginError("Login incorreto");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setLoginError("Login incorreto");
    }
  };

  const handleLogout = async () => {
    try {
      setSidebarOpen(false);
      setCurrentUser(null);
      setIsAuthenticated(false);
      await authService.logout();
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Force clear state even if logout service fails
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  const navigateToSection = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    if (!currentUser || !isAuthenticated) {
      return (
        <LoginPage
          onLogin={handleLogin}
          loginError={loginError}
          isLoading={false}
        />
      );
    }

    switch (activeSection) {
      case "dashboard":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-4">
              {/* Welcome Header */}
              <div className="bg-cyan-600 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                  Olá, {currentUser?.name || "Utilizador"}
                </h1>
                <p className="text-cyan-100">
                  {new Date().toLocaleDateString("pt-PT", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Obras Pendentes
                  </h3>
                  <p className="text-3xl font-bold text-red-500">0</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Em Progresso
                  </h3>
                  <p className="text-3xl font-bold text-orange-500">0</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Concluídas
                  </h3>
                  <p className="text-3xl font-bold text-green-500">0</p>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Bem-vindo ao Sistema Leirisonda
                </h2>
                <p className="text-gray-600">
                  Sistema de gestão de obras, piscinas e manutenções da
                  Leirisonda - Furos e Captações de Água, Lda.
                </p>
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✅ Sistema funcionando corretamente
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    Aplicação carregada e pronta para utilização.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "obras":
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Gestão de Obras
            </h1>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-600">
                Funcionalidade de gestão de obras em desenvolvimento.
              </p>
            </div>
          </div>
        );

      case "piscinas":
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Gestão de Piscinas
            </h1>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-600">
                Funcionalidade de gestão de piscinas em desenvolvimento.
              </p>
            </div>
          </div>
        );

      case "utilizadores":
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Gestão de Utilizadores
            </h1>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-600">
                Funcionalidade de gestão de utilizadores em desenvolvimento.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Página não encontrada
            </h1>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-600">
                A página solicitada não foi encontrada.
              </p>
              <button
                onClick={() => navigateToSection("dashboard")}
                className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {isAuthenticated && (
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </button>
            <div className="text-lg font-semibold text-gray-900">
              Leirisonda
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {isAuthenticated && (
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="flex flex-col h-full">
            {/* Logo Header */}
            <div className="px-6 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">LS</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Leirisonda
                    </p>
                    <p className="text-xs text-gray-500">Furos e Captações</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <button
                onClick={() => navigateToSection("dashboard")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "dashboard"
                    ? "bg-cyan-50 text-cyan-700 border-l-4 border-cyan-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => navigateToSection("obras")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "obras"
                    ? "bg-cyan-50 text-cyan-700 border-l-4 border-cyan-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span>Obras</span>
              </button>

              <button
                onClick={() => navigateToSection("piscinas")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "piscinas"
                    ? "bg-cyan-50 text-cyan-700 border-l-4 border-cyan-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Waves className="h-5 w-5" />
                <span>Piscinas</span>
              </button>

              <button
                onClick={() => navigateToSection("utilizadores")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "utilizadores"
                    ? "bg-cyan-50 text-cyan-700 border-l-4 border-cyan-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Utilizadores</span>
              </button>
            </nav>

            {/* User Info */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {currentUser?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser?.name || "Utilizador"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser?.email || "email@exemplo.com"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md hover:bg-gray-100"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`${isAuthenticated ? "lg:ml-80" : ""} min-h-screen`}>
        {renderContent()}
      </main>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default AppSimpleFixed;
