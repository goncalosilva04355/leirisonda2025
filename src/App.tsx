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
  Play,
  Trash2,
  Save,
  UserPlus,
  Shield,
  Check,
  AlertCircle,
  Download,
  ArrowLeft,
  Bell,
  FileText,
  MapPin,
  Share,
  Database,
} from "lucide-react";
import jsPDF from "jspdf";
import { FirebaseConfig } from "./components/FirebaseConfig";
import { AdvancedSettings } from "./components/AdvancedSettings";
import { InstallPrompt } from "./components/InstallPrompt";
import { UserPermissionsManager } from "./components/UserPermissionsManager";
import { EmergencyLogoutManager } from "./components/EmergencyLogoutManager";
import { RegisterForm } from "./components/RegisterForm";
import { LocationPage } from "./components/LocationPage";
import { PersonalLocationSettings } from "./components/PersonalLocationSettings";
import { FirebaseConnectionStatus } from "./components/FirebaseConnectionStatus";
import { FirebaseConnectionRecovery } from "./components/FirebaseConnectionRecovery";

// Limpar estados que causam modais indesejados
import "./utils/clearModalStates";

import { AutoSyncProvider } from "./components/AutoSyncProvider";
import { InstantSyncManager } from "./components/InstantSyncManager";
import { RealtimeNotifications } from "./components/RealtimeNotifications";
import { WorkAssignmentNotifications } from "./components/WorkAssignmentNotifications";
import { FirebaseReactivatedNotification } from "./components/FirebaseReactivatedNotification";

// SECURITY: RegisterForm removed - only super admin can create users
import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { useSimpleData } from "./hooks/useSimpleData";
import { authService, UserProfile } from "./services/authService";

// Production users - only real admin account
const initialUsers = [
  {
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
  },
];

function App() {
  // SECURITY: Always start as not authenticated - NUNCA mudar para true
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  // Modal states
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isAdvancedUnlocked, setIsAdvancedUnlocked] = useState(false);
  const [loginError, setLoginError] = useState("");

  // SISTEMA SIMPLES - Todos os utilizadores acedem aos mesmos dados
  const {
    users,
    pools,
    maintenance,
    futureMaintenance,
    works,
    clients,
    isLoading: isDataLoading,
    error: dataError,
    userService,
    poolService,
    maintenanceService,
    workService,
    clientService,
  } = useSimpleData();

  // Compatibility functions
  const addPool = (data: any) => poolService.addPool(data);
  const addWork = (data: any) => workService.addWork(data);
  const addMaintenance = (data: any) => maintenanceService.addMaintenance(data);
  const addClient = (data: any) => clientService.addClient(data);

  // Authentication setup
  useEffect(() => {
    console.log("🔒 SECURITY: App initialization started");

    const initializeAuth = async () => {
      try {
        const authPromise = authService.getCurrentUser();

        authPromise
          .then((user) => {
            if (user) {
              console.log("✅ Firebase Auth: User restored", user.email);
              setCurrentUser(user);
              setIsAuthenticated(true);
            } else {
              console.log("❌ Firebase Auth: No user found");
              setCurrentUser(null);
              setIsAuthenticated(false);
            }
          })
          .catch((error) => {
            console.error("❌ Firebase Auth error:", error);
            setCurrentUser(null);
            setIsAuthenticated(false);
          });

        const unsubscribe = authService.onAuthStateChanged((user) => {
          if (user) {
            console.log(
              "🔄 Firebase Auth: State changed - user logged in",
              user.email,
            );
            setCurrentUser(user);
            setIsAuthenticated(true);
          } else {
            console.log("🔄 Firebase Auth: State changed - user logged out");
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        setCurrentUser(null);
        setIsAuthenticated(false);
        return () => {}; // Return empty cleanup function
      }
    };

    let authPromise = initializeAuth();

    // Cleanup on unmount
    return () => {
      authPromise
        .then((unsubscribe) => {
          if (typeof unsubscribe === "function") {
            unsubscribe();
          }
        })
        .catch((error) => {
          console.warn("Cleanup error:", error);
        });
    };

    // Return empty cleanup function since unsubscribe is handled inside the promise
    return () => {};
  }, []);

  // Permission helper
  const hasPermission = (section: string, action: string) => {
    if (!currentUser || !currentUser.permissions) return false;
    return currentUser.permissions[section]?.[action] || false;
  };

  // Navigation helper
  const navigateToSection = (section: string) => {
    setActiveSection(section);
    window.location.hash = section;
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setActiveSection("dashboard");
      console.log("✅ User logged out successfully");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  // Show login screen if not authenticated
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

        {/* Admin Login Modal */}
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

        {/* Admin Page */}
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
    <AutoSyncProvider
      enabled={true}
      syncInterval={60000}
      collections={["users", "pools", "maintenance", "works", "clients"]}
      showNotifications={false}
    >
      <InstantSyncManager>
        <div className="min-h-screen bg-gray-50">
          {/* Firebase Connection Status - Global */}
          <FirebaseConnectionStatus className="fixed top-0 left-0 right-0 z-40" />

          {/* Firebase Connection Recovery Notification */}
          <FirebaseConnectionRecovery />

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
                      <p className="text-sm text-gray-500">
                        Gestão de Serviços
                      </p>
                    </div>
                  </div>
                  {/* Close button for mobile */}
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

              {/* User Info & Logout */}
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
                      {isDataLoading
                        ? "A carregar..."
                        : `${works.length + pools.length + maintenance.length + clients.length} registos`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-6">
              {/* Dashboard Content */}
              {activeSection === "dashboard" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard
                  </h1>

                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex items-center">
                        <Building2 className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">
                            Obras
                          </p>
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

                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Atividade Recente
                      </h2>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600">
                        Sistema simplificado ativo - todos os dados partilhados
                        entre utilizadores
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Other sections would be implemented here */}
              {activeSection !== "dashboard" && (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Secção: {activeSection}
                  </h2>
                  <p className="text-gray-600">
                    Sistema simplificado implementado. Esta secção será
                    desenvolvida em seguida.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </InstantSyncManager>
    </AutoSyncProvider>
  );
}

export default App;
