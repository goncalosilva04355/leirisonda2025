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

  // Form states
  const [showPoolForm, setShowPoolForm] = useState(false);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingPool, setEditingPool] = useState<any>(null);
  const [editingWork, setEditingWork] = useState<any>(null);
  const [editingMaintenance, setEditingMaintenance] = useState<any>(null);

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

  console.log("🌐 SISTEMA SIMPLES ATIVO:", {
    obras: works.length,
    manutencoes: maintenance.length,
    piscinas: pools.length,
    clientes: clients.length,
    utilizadores: users.length,
    loading: isDataLoading,
  });

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
  }, []);

  // Hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && hash !== activeSection) {
        setActiveSection(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    // Check initial hash
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && initialHash !== activeSection) {
      setActiveSection(initialHash);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [activeSection]);

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

  // Confirmation dialog
  const confirmDelete = (message: string, onConfirm: () => void) => {
    if (window.confirm(message)) {
      onConfirm();
    }
  };

  // Download PDF helper
  const downloadPDF = (content: string, filename: string) => {
    const doc = new jsPDF();
    const lines = content.split("\n");
    let y = 20;

    lines.forEach((line) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 20, y);
      y += 7;
    });

    doc.save(filename);
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

                {hasPermission("obras", "create") && (
                  <button
                    onClick={() => {
                      navigateToSection("nova-obra");
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === "nova-obra"
                        ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Plus className="h-5 w-5" />
                    <span>Nova Obra</span>
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

                {hasPermission("piscinas", "create") && (
                  <button
                    onClick={() => {
                      navigateToSection("nova-piscina");
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === "nova-piscina"
                        ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Plus className="h-5 w-5" />
                    <span>Nova Piscina</span>
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

                {hasPermission("manutencoes", "create") && (
                  <button
                    onClick={() => {
                      navigateToSection("nova-manutencao");
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === "nova-manutencao"
                        ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Plus className="h-5 w-5" />
                    <span>Nova Manutenção</span>
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

                {hasPermission("clientes", "create") && (
                  <button
                    onClick={() => {
                      navigateToSection("novo-cliente");
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === "novo-cliente"
                        ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Plus className="h-5 w-5" />
                    <span>Novo Cliente</span>
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
                        Sistema Simplificado
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">
                            Sistema operacional
                          </span>
                        </div>
                        <p className="text-green-700 text-sm mt-1">
                          Todos os dados são partilhados entre utilizadores -
                          sem isolamento, sem complexidade
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Utilizadores:</span>
                          <span className="ml-1 font-semibold">
                            {users.length}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Obras:</span>
                          <span className="ml-1 font-semibold">
                            {works.length}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Piscinas:</span>
                          <span className="ml-1 font-semibold">
                            {pools.length}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total:</span>
                          <span className="ml-1 font-semibold">
                            {works.length +
                              pools.length +
                              maintenance.length +
                              clients.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Works Section */}
              {activeSection === "obras" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Obras</h1>
                    {hasPermission("obras", "create") && (
                      <button
                        onClick={() => navigateToSection("nova-obra")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Nova Obra</span>
                      </button>
                    )}
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Lista de Obras
                      </h2>
                    </div>
                    <div className="p-6">
                      {works.length === 0 ? (
                        <div className="text-center py-8">
                          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhuma obra encontrada
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Comece por criar a primeira obra
                          </p>
                          {hasPermission("obras", "create") && (
                            <button
                              onClick={() => navigateToSection("nova-obra")}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              Criar Obra
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {works.map((work) => (
                            <div
                              key={work.id}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {work.title}
                                  </h3>
                                  <p className="text-gray-600">
                                    {work.client} • {work.location}
                                  </p>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    <span>Tipo: {work.type}</span>
                                    <span>Estado: {work.status}</span>
                                    <span>Responsável: {work.assignedTo}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {hasPermission("obras", "edit") && (
                                    <button
                                      onClick={() => {
                                        setEditingWork(work);
                                        navigateToSection("editar-obra");
                                      }}
                                      className="p-2 text-gray-400 hover:text-gray-600"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </button>
                                  )}
                                  {hasPermission("obras", "delete") && (
                                    <button
                                      onClick={() =>
                                        confirmDelete(
                                          `Tem a certeza que deseja apagar a obra "${work.title}"?`,
                                          () => workService.deleteWork(work.id),
                                        )
                                      }
                                      className="p-2 text-gray-400 hover:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* New Work Form */}
              {activeSection === "nova-obra" && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigateToSection("obras")}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Nova Obra
                    </h1>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Detalhes da Obra
                      </h2>
                    </div>
                    <div className="p-6">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(
                            e.target as HTMLFormElement,
                          );
                          const workData = {
                            title: formData.get("title") as string,
                            description: formData.get("description") as string,
                            client: formData.get("client") as string,
                            location: formData.get("location") as string,
                            type: formData.get("type") as string,
                            status: "pending",
                            startDate: formData.get("startDate") as string,
                            assignedTo: formData.get("assignedTo") as string,
                            budget:
                              parseFloat(formData.get("budget") as string) || 0,
                          };

                          workService.addWork(workData);
                          navigateToSection("obras");
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Título
                            </label>
                            <input
                              type="text"
                              name="title"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Cliente
                            </label>
                            <input
                              type="text"
                              name="client"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Localização
                            </label>
                            <input
                              type="text"
                              name="location"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tipo
                            </label>
                            <select
                              name="type"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Selecionar tipo</option>
                              <option value="construcao">Construção</option>
                              <option value="manutencao">Manutenção</option>
                              <option value="renovacao">Renovação</option>
                              <option value="reparacao">Reparação</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Data de Início
                            </label>
                            <input
                              type="date"
                              name="startDate"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Responsável
                            </label>
                            <input
                              type="text"
                              name="assignedTo"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Orçamento (€)
                            </label>
                            <input
                              type="number"
                              name="budget"
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição
                          </label>
                          <textarea
                            name="description"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={() => navigateToSection("obras")}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Criar Obra
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Other sections placeholder */}
              {!["dashboard", "obras", "nova-obra"].includes(activeSection) && (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Secção: {activeSection}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Sistema simplificado implementado. Esta secção será
                    desenvolvida em seguida.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-blue-800 font-medium">
                      🎯 Sistema Operacional
                    </p>
                    <p className="text-blue-700 text-sm mt-1">
                      Todos os utilizadores acedem aos mesmos dados -{" "}
                      {works.length +
                        pools.length +
                        maintenance.length +
                        clients.length}{" "}
                      registos disponíveis
                    </p>
                  </div>
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
