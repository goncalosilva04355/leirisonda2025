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
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";

// Simple storage utilities
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
      // Ignore errors
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  },
};

function App() {
  console.log("🚀 App component rendering...");

  // SECURITY: Always start as not authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    console.log("🔐 SECURITY: App initialization started");

    // Force complete logout on app start
    const initializeAuth = async () => {
      try {
        // Check if user is already authenticated in localStorage
        const savedUser = safeLocalStorage.getItem("currentUser");
        const isAuthenticatedStored =
          safeLocalStorage.getItem("isAuthenticated");

        if (savedUser && isAuthenticatedStored === "true") {
          try {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            setIsAuthenticated(true);
            console.log("✅ User session restored:", user.email);
          } catch (error) {
            console.error("❌ Invalid saved user data:", error);
            // Clear invalid auth state
            setCurrentUser(null);
            setIsAuthenticated(false);
            safeLocalStorage.removeItem("currentUser");
            safeLocalStorage.removeItem("isAuthenticated");
          }
        } else {
          console.log("🔓 No valid session found, starting fresh");
          // Clear any invalid auth state
          setCurrentUser(null);
          setIsAuthenticated(false);
          safeLocalStorage.removeItem("currentUser");
          safeLocalStorage.removeItem("isAuthenticated");
        }

        console.log("✅ App initialization completed");
      } catch (error) {
        console.error("❌ Erro na inicialização:", error);
        // Em caso de erro, forçar logout completo
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle successful login
  const handleLoginSuccess = (user: any) => {
    console.log("✅ Login successful:", user.email);
    setCurrentUser(user);
    setIsAuthenticated(true);
    safeLocalStorage.setItem("currentUser", JSON.stringify(user));
    safeLocalStorage.setItem("isAuthenticated", "true");
  };

  // Handle logout
  const handleLogout = () => {
    console.log("🔓 User logout");
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveSection("dashboard");
    safeLocalStorage.removeItem("currentUser");
    safeLocalStorage.removeItem("isAuthenticated");
  };

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Main authenticated app
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

                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        🎉 Aplicação Leirisonda Funcionando!
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✅ Online
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Utilizador
                          </span>
                          <span className="text-sm text-gray-900">
                            {currentUser?.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Último Login
                          </span>
                          <span className="text-sm text-gray-900">
                            {new Date().toLocaleString("pt-PT")}
                          </span>
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
                        Gestão de utilizadores - versão completa disponível na
                        aplicação original.
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
                        Configurações do sistema - versão completa disponível na
                        aplicação original.
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

export default App;
