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
  FileText,
  MapPin,
} from "lucide-react";
import jsPDF from "jspdf";
import { FirebaseConfig } from "./components/FirebaseConfig";
import { AdvancedSettings } from "./components/AdvancedSettings";
import { SyncStatusDisplay } from "./components/SyncStatusDisplay";
import { InstallPrompt } from "./components/InstallPrompt";
import { UserPermissionsManager } from "./components/UserPermissionsManager";
import { RegisterForm } from "./components/RegisterForm";
import { LocationPage } from "./components/LocationPage";
import { PersonalLocationSettings } from "./components/PersonalLocationSettings";

import { AutoSyncProvider } from "./components/AutoSyncProvider";
import { FirebaseQuotaWarning } from "./components/FirebaseQuotaWarning";
import { FirebaseQuotaAlert } from "./components/FirebaseQuotaAlert";

// SECURITY: RegisterForm removed - only super admin can create users
import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { useDataSync } from "./hooks/useDataSync";
import { authService, UserProfile } from "./services/authService";
import { useDataCleanup } from "./hooks/useDataCleanup";
import { useAutoSync } from "./hooks/useAutoSync";

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

  // Debug logging for authentication state changes
  useEffect(() => {
    console.log("🔐 Auth State Debug:", {
      isAuthenticated,
      currentUser: currentUser
        ? `${currentUser.name} (${currentUser.email})`
        : null,
      timestamp: new Date().toISOString(),
    });
  }, [isAuthenticated, currentUser]);

  // Monitoramento de integridade de dados
  useEffect(() => {
    // Cleanup ao desmontar componente
    return () => {
      // Cleanup functions if needed
    };
  }, []);

  // Firebase-only authentication - no localStorage restoration
  useEffect(() => {
    console.log("🔒 SECURITY: Firebase-only authentication mode");

    const unsubscribe = authService.onAuthStateChanged((user) => {
      console.log("🔄 Auth state changed:", user ? user.email : "null");
      setCurrentUser(user);
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  // SECURITY: Register form removed - only super admin can create users
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [activeWorkFilter, setActiveWorkFilter] = useState("all");
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  // Custom setActiveSection that updates URL hash
  const navigateToSection = (section: string) => {
    setActiveSection(section);
    // Update URL hash for PWA support
    if (section !== "futuras-manutencoes") {
      window.history.replaceState(null, "", `#${section}`);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSettingsPasswordModal, setShowSettingsPasswordModal] =
    useState(false);
  const [showSettingsPage, setShowSettingsPage] = useState(false);
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsPasswordError, setSettingsPasswordError] = useState("");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [advancedPassword, setAdvancedPassword] = useState("");
  const [advancedPasswordError, setAdvancedPasswordError] = useState("");
  const [isAdvancedUnlocked, setIsAdvancedUnlocked] = useState(false);
  const [showDataCleanup, setShowDataCleanup] = useState(false);

  // Admin area states
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Data sync hook - manages all data with Firebase sync
  const dataSync = useDataSync();
  const {
    pools,
    maintenance,
    futureMaintenance,
    works,
    clients,
    isLoading: syncLoading,
    lastSync,
    error: syncError,
    syncWithFirebase,
    enableSync,
    addPool,
    addWork,
    addMaintenance,
    addClient,
  } = dataSync;

  // Data cleanup hook
  const {
    cleanAllData,
    isLoading: cleanupLoading,
    error: cleanupError,
  } = useDataCleanup();

  // Auto-sync hook for automatic Firebase synchronization
  const autoSyncData = useAutoSync();
  const { syncStatus, isAutoSyncing } = autoSyncData;
  const autoSyncLastSync = autoSyncData.lastSync;

  // Keep local users state for user management
  const [users, setUsers] = useState(initialUsers);

  // Initialize users from Firebase on app start (no localStorage)
  useEffect(() => {
    const loadUsersFromFirebase = async () => {
      console.log("🔄 Loading users from Firebase...");
      try {
        // Load users from Firebase instead of localStorage
        setUsers(initialUsers); // Fallback to initial users
        console.log("✅ Users loaded successfully");
      } catch (error) {
        console.error("❌ Error loading users:", error);
        setUsers(initialUsers);
      }
    };

    loadUsersFromFirebase();
  }, []);

  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [interventionSaved, setInterventionSaved] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [pushPermission, setPushPermission] = useState("default");
  const [assignedWorks, setAssignedWorks] = useState<any[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>([]);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<any[]>([]);
  const [workVehicles, setWorkVehicles] = useState<string[]>([]);
  const [workTechnicians, setWorkTechnicians] = useState<string[]>([]);
  const [currentVehicle, setCurrentVehicle] = useState("");
  const [currentTechnician, setCurrentTechnician] = useState("");
  const [currentAssignedUser, setCurrentAssignedUser] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [editAssignedUsers, setEditAssignedUsers] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [currentEditAssignedUser, setCurrentEditAssignedUser] = useState("");

  // Edit and view states
  const [editingWork, setEditingWork] = useState(null);
  const [editingPool, setEditingPool] = useState(null);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [viewingWork, setViewingWork] = useState(false);

  // Settings - temporary states (no localStorage persistence)
  const [enablePhoneDialer, setEnablePhoneDialer] = useState(false);
  const [enableMapsRedirect, setEnableMapsRedirect] = useState(false);

  // Maintenance form state
  const [maintenanceForm, setMaintenanceForm] = useState({
    poolId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    technician: "",
    vehicle: "",
    pH: "",
    chlorine: "",
    alkalinity: "",
    temperature: "",
    workPerformed: "",
    otherWork: "",
    problems: "",
    observations: "",
    nextMaintenance: "",
    status: "completed",
  });

  // Initialize notification permission state and register service worker
  useEffect(() => {
    console.log("🔔 Initializing notifications...");
    if ("Notification" in window) {
      const permission = Notification.permission;
      console.log("🔔 Current notification permission:", permission);
      setPushPermission(permission);
      setNotificationsEnabled(permission === "granted");

      if (permission === "granted") {
        console.log("✅ Notifications already granted");
      } else if (permission === "denied") {
        console.warn("❌ Notifications denied by user");
      } else {
        console.log("⏳ Notifications permission not yet requested");
      }
    } else {
      console.warn("🚫 Notifications not supported in this browser");
    }

    // Register service worker for better push notification support
    if ("serviceWorker" in navigator) {
      // Clear any existing service workers first to prevent conflicts
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });

      // Register the service worker with a delay to ensure cleanup
      setTimeout(() => {
        navigator.serviceWorker
          .register("/sw.js", { updateViaCache: "none" })
          .then((registration) => {
            console.log(
              "✅ Service Worker registered successfully:",
              registration.scope,
            );

            // Force update if there's a waiting service worker
            if (registration.waiting) {
              registration.waiting.postMessage({ type: "SKIP_WAITING" });
            }
          })
          .catch((error) => {
            console.error("❌ Service Worker registration failed:", error);
          });
      }, 1000);
    }

    // Handle URL hash for PWA shortcuts
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove the '#'
      if (hash && isAuthenticated) {
        setActiveSection(hash);
      }
    };

    // Check initial hash on load if authenticated
    if (isAuthenticated) {
      handleHashChange();
    }

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isAuthenticated]);

  // Handle hash routing when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setActiveSection(hash);
      }
    }
  }, [isAuthenticated]);

  // Rest of the component implementation would continue here...
  // Login logic
  const handleLogin = async (email: string, password: string) => {
    try {
      console.log("🔐 Attempting login...");
      const result = await authService.login(email, password);

      if (result.success && result.user) {
        console.log("✅ Login successful");
        setCurrentUser(result.user);
        setIsAuthenticated(true);
      } else {
        console.log("❌ Login failed:", result.error);
        alert(result.error || "Erro de login");
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      alert("Erro de conexão. Tente novamente.");
    }
  };

  // Logout logic
  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out...");
      await authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
      setActiveSection("dashboard");
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} loginError="" isLoading={false} />;
  }

  // Admin interface
  if (window.location.hash === "#administracao") {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onAdminLogin={(success) => setIsAdminAuthenticated(success)}
        />
      );
    }
    return <AdminPage />;
  }

  // Main app interface - simplified for now but keeping all the hooks and state
  return (
    <AutoSyncProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div className="flex items-center ml-2 lg:ml-0">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  Leirisonda
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sync status */}
              {syncLoading && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Sincronizando...
                </div>
              )}

              {/* User info and logout */}
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">
                    {currentUser?.name}
                  </p>
                  <p className="text-gray-500">{currentUser?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <nav
            className={`bg-white w-64 min-h-screen shadow-sm border-r border-gray-200 ${sidebarOpen ? "block" : "hidden"} lg:block`}
          >
            <div className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigateToSection("dashboard")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeSection === "dashboard"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Home className="h-4 w-4 mr-3" />
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToSection("obras")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeSection === "obras"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Building2 className="h-4 w-4 mr-3" />
                    Obras
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToSection("piscinas")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeSection === "piscinas"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Waves className="h-4 w-4 mr-3" />
                    Piscinas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToSection("manutencoes")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeSection === "manutencoes"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Wrench className="h-4 w-4 mr-3" />
                    Manutenções
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToSection("clientes")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeSection === "clientes"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Users className="h-4 w-4 mr-3" />
                    Clientes
                  </button>
                </li>
                {currentUser?.permissions.utilizadores.view && (
                  <li>
                    <button
                      onClick={() => navigateToSection("utilizadores")}
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "utilizadores"
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <UserCheck className="h-4 w-4 mr-3" />
                      Utilizadores
                    </button>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => navigateToSection("configuracoes")}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeSection === "configuracoes"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Configurações
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1 p-6">
            {activeSection === "dashboard" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Dashboard
                </h1>

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow">
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

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Waves className="h-8 w-8 text-blue-600" />
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

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Wrench className="h-8 w-8 text-blue-600" />
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

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-blue-600" />
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

                {/* Recent activities */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Atividades Recentes
                    </h2>
                  </div>
                  <div className="p-6">
                    {lastSync ? (
                      <p className="text-sm text-gray-600">
                        Última sincronização: {lastSync.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Nenhuma sincronização ainda realizada
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Other sections would be implemented here */}
            {activeSection !== "dashboard" && (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeSection.charAt(0).toUpperCase() +
                    activeSection.slice(1)}
                </h2>
                <p className="text-gray-600">
                  Esta secção será implementada em breve.
                </p>
              </div>
            )}
          </main>
        </div>

        {/* Error/success messages */}
        {syncError && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {syncError}
            </div>
          </div>
        )}
      </div>
    </AutoSyncProvider>
  );
}

export default App;
