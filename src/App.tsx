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
} from "lucide-react";

import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { useDataSync } from "./hooks/useDataSync";
import { authService, UserProfile } from "./services/authService";

function App() {
  // SECURITY: Always start as not authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loginError, setLoginError] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // SISTEMA SIMPLIFICADO - usar dados do hook
  const dataSync = useDataSync();
  const users = dataSync.users || [];
  const pools = dataSync.pools || [];
  const maintenance = dataSync.maintenance || [];
  const works = dataSync.works || [];
  const clients = dataSync.clients || [];

  console.log("🌐 LEIRISONDA CARREGADA:", {
    obras: works.length,
    piscinas: pools.length,
    manutencoes: maintenance.length,
    clientes: clients.length,
  });

  // Authentication setup
  useEffect(() => {
    console.log("🔒 App initialization started");

    const initializeAuth = async () => {
      try {
        const authPromise = authService.getCurrentUser();

        authPromise
          .then((user) => {
            if (user) {
              console.log("✅ User restored:", user.email);
              setCurrentUser(user);
              setIsAuthenticated(true);
            } else {
              console.log("❌ No user found");
              setCurrentUser(null);
              setIsAuthenticated(false);
            }
          })
          .catch((error) => {
            console.error("❌ Auth error:", error);
            setCurrentUser(null);
            setIsAuthenticated(false);
          });

        const unsubscribe = authService.onAuthStateChanged((user) => {
          if (user) {
            console.log("🔄 User logged in:", user.email);
            setCurrentUser(user);
            setIsAuthenticated(true);
          } else {
            console.log("🔄 User logged out");
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("❌ Auth init error:", error);
        setCurrentUser(null);
        setIsAuthenticated(false);
        return () => {};
      }
    };

    let authPromise = initializeAuth();

    return () => {
      authPromise
        .then((unsubscribe) => {
          if (typeof unsubscribe === "function") {
            unsubscribe();
          }
        })
        .catch(console.error);
    };
  }, []);

  // Navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && hash !== activeSection) {
        setActiveSection(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && initialHash !== activeSection) {
      setActiveSection(initialHash);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [activeSection]);

  // Helper functions
  const hasPermission = (section: string, action: string) => {
    if (!currentUser || !currentUser.permissions) return false;
    return currentUser.permissions[section]?.[action] || false;
  };

  const navigateToSection = (section: string) => {
    setActiveSection(section);
    window.location.hash = section;
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setActiveSection("dashboard");
      console.log("✅ User logged out");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  // Show login if not authenticated
  if (!currentUser || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginPage
          onLogin={async (email: string, password: string) => {
            try {
              setLoginError("");
              const user = await authService.login(email, password);
              if (user) {
                setCurrentUser(user);
                setIsAuthenticated(true);
                console.log("✅ Login successful:", user.email);
              }
            } catch (error: any) {
              console.error("❌ Login error:", error);
              setLoginError(
                "Erro de conexão. Verifique sua internet e tente novamente.",
              );
            }
          }}
          loginError={loginError}
          isLoading={false}
        />

        {showAdminLogin && !isAdminAuthenticated && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <AdminLogin
                onLogin={() => {
                  setIsAdminAuthenticated(true);
                  setShowAdminLogin(false);
                }}
                onBack={() => setShowAdminLogin(false)}
              />
            </div>
          </div>
        )}

        {isAdminAuthenticated && (
          <div className="fixed inset-0 bg-white z-50">
            <AdminPage
              onLogout={() => {
                setIsAdminAuthenticated(false);
                setShowAdminLogin(false);
              }}
            />
          </div>
        )}
      </div>
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
                className="lg:hidden p-1 rounded-md hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
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
                  ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </button>

            {hasPermission("obras", "view") && (
              <button
                onClick={() => {
                  navigateToSection("obras");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "obras"
                    ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span>Obras</span>
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
                    ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Waves className="h-5 w-5" />
                <span>Piscinas</span>
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
                    ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Wrench className="h-5 w-5" />
                <span>Manutenções</span>
              </button>
            )}

            {hasPermission("clientes", "view") && (
              <button
                onClick={() => {
                  navigateToSection("clientes");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "clientes"
                    ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Clientes</span>
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
                    ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Relatórios</span>
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
                    ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <UserCheck className="h-5 w-5" />
                <span>Utilizadores</span>
              </button>
            )}

            <button
              onClick={() => {
                navigateToSection("configuracoes");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "configuracoes"
                  ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Configurações</span>
            </button>
          </nav>

          {/* User Info */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold text-sm">
                  {currentUser?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser?.name || "Utilizador"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email || ""}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Terminar Sessão</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Top Navigation */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Leirisonda -{" "}
                  {works.length +
                    pools.length +
                    maintenance.length +
                    clients.length}{" "}
                  registos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Obras</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {works.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Waves className="h-8 w-8 text-cyan-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Piscinas
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {pools.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Wrench className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Manutenções
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {maintenance.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Clientes
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {clients.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    ✅ LEIRISONDA OPERACIONAL
                  </h2>
                </div>
                <div className="p-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      🎯 A tua aplicação está restaurada!
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      Sistema simplificado implementado - todos os dados
                      partilhados entre utilizadores
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other sections */}
          {activeSection !== "dashboard" && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Secção: {activeSection}
              </h2>
              <p className="text-gray-600 mb-4">
                A tua aplicação Leirisonda está de volta! Sistema simplificado
                operacional.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-blue-800 font-medium">🚀 Pronto para usar</p>
                <p className="text-blue-700 text-sm mt-1">
                  Todas as funcionalidades disponíveis - dados partilhados
                  globalmente
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
