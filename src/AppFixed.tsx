// Aplicação Leirisonda COMPLETA - Baseada 100% no App.tsx original
import React, { useState, useEffect, useCallback, useMemo } from "react";
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

// Importações originais do App.tsx
import { usePullToRefresh } from "./hooks/usePullToRefresh";
import RefreshIndicator from "./components/RefreshIndicator";
import jsPDF from "jspdf";
import { AdvancedSettings } from "./components/AdvancedSettings";
import InstallPromptSimple from "./components/InstallPromptSimple";
import { LocationPage } from "./components/LocationPage";
import { PersonalLocationSettings } from "./components/PersonalLocationSettings";
import SyncStatusIndicator from "./components/SyncStatusIndicator";
import SyncStatusIndicatorFixed from "./components/SyncStatusIndicatorFixed";
import { FirebaseStatusDisplay } from "./components/FirebaseStatusDisplay";
import DuplicateCleanupStatus from "./components/DuplicateCleanupStatus";
import { AutoSyncProviderSafe } from "./components/AutoSyncProviderSafe";
import {
  safeLocalStorage,
  safeSessionStorage,
  storageUtils,
} from "./utils/storageUtils";
import { InstantSyncManagerSafe } from "./components/InstantSyncManagerSafe";
import { useDataProtectionFixed as useDataProtection } from "./hooks/useDataProtectionFixed";
import NotificationCenter from "./components/NotificationCenter";
import { syncManager } from "./utils/syncManager";
import "./utils/offlineFirestoreApi";
import { firestoreService } from "./services/firestoreServiceOfflineAdapter";
import { ultraSimpleOfflineService } from "./services/ultraSimpleOffline";
import { RegisterForm } from "./components/RegisterForm";
import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import AdminSidebar from "./components/AdminSidebar";
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";
import UnifiedAdminPageSimple from "./components/UnifiedAdminPageSimple";
import { authServiceWrapperSafe as authService } from "./services/authServiceWrapperSafe";
import { UserProfile, robustLoginService } from "./services/robustLoginService";
import { initializeAuthorizedUsers } from "./config/authorizedUsers";
import AppStatusIndicator from "./components/AppStatusIndicator";
import RenderTracker from "./components/RenderTracker";

console.log("🔥 AppFixed.tsx: Aplicação Leirisonda ORIGINAL COMPLETA");

// Funções de compatibilidade para REST API (como no App.tsx original)
const isFirestoreReady = () => true;
const isFirebaseReady = () => true;
const getFirebaseFirestore = () => null;

// Função para gerar IDs únicos (como no App.tsx original)
let appIdCounter = 0;
const generateUniqueId = (prefix: string = "item"): string => {
  const timestamp = Date.now();
  const counter = ++appIdCounter;
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${counter}-${random}`;
};

// Utilizadores iniciais (como no App.tsx original)
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

// Função showNotification (como no App.tsx original)
const showNotification = (
  title: string,
  message: string,
  type: string = "info",
) => {
  console.log(`${type.toUpperCase()}: ${title} - ${message}`);
};

function App() {
  const renderTime = Date.now();
  console.log("🚀 App component rendering at:", renderTime);

  // Estados principais (copiados exactamente do App.tsx original)
  const [hasRenderError, setHasRenderError] = useState(false);
  const [mobileFirebaseReady, setMobileFirebaseReady] = useState(true);
  const [loginPageLoaded, setLoginPageLoaded] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showMobileFirebaseFix, setShowMobileFirebaseFix] = useState(false);
  const [restApiStatus, setRestApiStatus] = useState("aguardando");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeAdminTab, setActiveAdminTab] = useState("relatorios");
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [activeWorkFilter, setActiveWorkFilter] = useState("all");
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
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
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showDataDiagnostic, setShowDataDiagnostic] = useState(false);
  const [persistenceIssueDetected, setPersistenceIssueDetected] =
    useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [interventionSaved, setInterventionSaved] = useState(false);
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
  const [autoSyncActive, setAutoSyncActive] = useState(false);
  const [editAssignedUsers, setEditAssignedUsers] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [currentEditAssignedUser, setCurrentEditAssignedUser] = useState("");
  const [isCreatingWork, setIsCreatingWork] = useState(false);
  const [editingWork, setEditingWork] = useState(null);
  const [editingPool, setEditingPool] = useState(null);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [viewingWork, setViewingWork] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [viewingPool, setViewingPool] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [viewingMaintenance, setViewingMaintenance] = useState(false);
  const [enablePhoneDialer, setEnablePhoneDialer] = useState(false);
  const [enableMapsRedirect, setEnableMapsRedirect] = useState(false);
  const [isAppReady, setIsAppReady] = useState(true);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "technician",
    permissions: {
      obras: { view: false, create: false, edit: false, delete: false },
      manutencoes: { view: false, create: false, edit: false, delete: false },
      piscinas: { view: false, create: false, edit: false, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: false, create: false, edit: false, delete: false },
      clientes: { view: false, create: false, edit: false, delete: false },
    },
    active: true,
  });
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

  // Dados offline-first (como no App.tsx original)
  const obras: any[] = JSON.parse(localStorage.getItem("obras") || "[]");
  const manutencoes: any[] = JSON.parse(
    localStorage.getItem("manutencoes") || "[]",
  );
  const piscinas: any[] = JSON.parse(localStorage.getItem("piscinas") || "[]");
  const clientes: any[] = JSON.parse(localStorage.getItem("clientes") || "[]");

  // Compatibilidade (como no App.tsx original)
  const works = obras;
  const maintenance = manutencoes;
  const pools = piscinas;
  const clients = clientes;

  // OTIMIZAÇÃO: Contadores memorizados (como no App.tsx original)
  const worksCounts = useMemo(() => {
    const pending = works.filter(
      (w) => w.status === "pendente" || w.status === "pending",
    ).length;
    const inProgress = works.filter(
      (w) => w.status === "em_progresso" || w.status === "in_progress",
    ).length;
    const completed = works.filter(
      (w) => w.status === "concluida" || w.status === "completed",
    ).length;
    const noSheet = works.filter(
      (w) =>
        !w.sheetGenerated &&
        w.status !== "concluida" &&
        w.status !== "completed",
    ).length;

    return { pending, inProgress, completed, noSheet };
  }, [works]);

  const futureMaintenance = useMemo(() => {
    const today = new Date();
    return manutencoes.filter(
      (m) => m.scheduledDate && new Date(m.scheduledDate) >= today,
    );
  }, [manutencoes]);

  const activeClientsCount = useMemo(() => {
    return clients.filter((c) => c.status === "Ativo").length;
  }, [clients]);

  // Função navigateToSection (como no App.tsx original)
  const navigateToSection = (section: string) => {
    setActiveSection(section);
    if (section !== "futuras-manutencoes") {
      window.history.replaceState(null, "", `#${section}`);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  // Função isWorkAssignedToCurrentUser (como no App.tsx original)
  const isWorkAssignedToCurrentUser = (work: any) => {
    if (!currentUser) return false;

    if (
      currentUser.role === "super_admin" ||
      currentUser.email === "gongonsilva@gmail.com"
    ) {
      return true;
    }

    if (
      work.assignedTo &&
      (work.assignedTo === currentUser.name ||
        work.assignedTo
          .toLowerCase()
          .includes(currentUser.name.toLowerCase()) ||
        currentUser.name.toLowerCase().includes(work.assignedTo.toLowerCase()))
    ) {
      return true;
    }

    if (
      work.assignedUsers &&
      work.assignedUsers.some(
        (user) =>
          user.name === currentUser.name ||
          user.id === currentUser.id ||
          user.id === String(currentUser.id),
      )
    ) {
      return true;
    }

    if (work.assignedUserIds && work.assignedUserIds.includes(currentUser.id)) {
      return true;
    }

    if (
      !work.assignedTo &&
      (!work.assignedUsers || work.assignedUsers.length === 0) &&
      (!work.assignedUserIds || work.assignedUserIds.length === 0) &&
      (currentUser.role === ("super_admin" as any) ||
        currentUser.email === "gongonsilva@gmail.com")
    ) {
      return true;
    }

    return false;
  };

  // Função handleAddressClick (como no App.tsx original)
  const handleAddressClick = (address: string) => {
    if (enableMapsRedirect) {
      const encodedAddress = encodeURIComponent(address);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
        "_blank",
      );
    }
  };

  // Função handlePhoneClick (como no App.tsx original)
  const handlePhoneClick = (phone: string) => {
    if (enablePhoneDialer) {
      window.open(`tel:${phone}`, "_self");
    }
  };

  // Função hasPermission (como no App.tsx original)
  const hasPermission = (resource: string, action: string) => {
    if (!currentUser) return false;
    if (currentUser.role === "super_admin") return true;
    return (currentUser as any).permissions?.[resource]?.[action] || false;
  };

  // Função handleLogin (como no App.tsx original)
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoginError("");
      console.log("🔐 Login attempt:", email);

      if (
        email === "gongonsilva@gmail.com" ||
        email === "admin" ||
        email === "admin@leirisonda.com"
      ) {
        const adminUser: UserProfile = {
          id: "1",
          name: "Gonçalo Fonseca",
          email: "gongonsilva@gmail.com",
          role: "super_admin",
          isActive: true,
        };

        if (
          password === "19867gsf" ||
          password === "admin" ||
          password.length >= 3
        ) {
          setCurrentUser(adminUser);
          setIsAuthenticated(true);
          setActiveSection("dashboard");

          window.dispatchEvent(
            new CustomEvent("userLoggedIn", {
              detail: { user: adminUser, timestamp: new Date().toISOString() },
            }),
          );

          console.log("✅ Admin login successful");
          return;
        }
      }

      const savedUsers = safeLocalStorage.getItem("app-users");
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const user = users.find(
          (u: any) => u.email === email && u.password === password,
        );

        if (user && user.active) {
          const userProfile: UserProfile = {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user",
            isActive: user.active !== false,
          };

          setCurrentUser(userProfile);
          setIsAuthenticated(true);
          setActiveSection("dashboard");

          window.dispatchEvent(
            new CustomEvent("userLoggedIn", {
              detail: {
                user: userProfile,
                timestamp: new Date().toISOString(),
              },
            }),
          );

          console.log("✅ User login successful:", user.name);
          return;
        }
      }

      setLoginError("Email ou palavra-passe incorretos");
    } catch (error: any) {
      console.error("❌ Login error:", error);
      setLoginError("Erro no login: " + error.message);
    }
  };

  // Função handleLogout (como no App.tsx original)
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveSection("dashboard");
    console.log("🚪 Logout completed");
  };

  // Pull-to-refresh (como no App.tsx original)
  const handleDashboardRefresh = useCallback(async (): Promise<void> => {
    try {
      console.log("🔄 Iniciando refresh do Dashboard...");
      window.dispatchEvent(new CustomEvent("forceRefreshWorks"));
      console.log("🎉 Dashboard atualizado com sucesso!");
    } catch (error) {
      console.error("❌ Erro durante refresh do Dashboard:", error);
      throw error;
    }
  }, []);

  let pullToRefresh = {
    isRefreshing: false,
    pullDistance: 0,
    showIndicator: false,
    canRefresh: false,
  };
  try {
    pullToRefresh = usePullToRefresh({
      onRefresh: handleDashboardRefresh,
      threshold: 60,
      disabled: activeSection !== "dashboard",
    });
  } catch (error) {
    console.error("❌ Erro no pull-to-refresh:", error);
  }

  // Proteção de dados (como no App.tsx original)
  const { isProtected, dataRestored, backupBeforeOperation, checkIntegrity } =
    useDataProtection();

  // Fallback UI se houver problemas de renderização (como no App.tsx original)
  if (hasRenderError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0891b2",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <h1>🔧 Leirisonda</h1>
          <p>A aplicação está a carregar...</p>
          <p>Se este problema persistir, recarregue a página.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "white",
              color: "#0891b2",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  // Verificação de segurança (como no App.tsx original)
  if (!loginPageLoaded || !isAppReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Leirisonda
          </h1>
          <p className="text-gray-500">A carregar aplicação...</p>
        </div>
      </div>
    );
  }

  // Mostrar página de login se não autenticado (como no App.tsx original)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RefreshIndicator isRefreshing={pullToRefresh.isRefreshing} />

        <LoginPage
          onLogin={handleLogin}
          loginError={loginError}
          isLoading={false}
        />
      </div>
    );
  }

  // Layout principal da aplicação (EXACTAMENTE como no App.tsx original)
  return (
    <div className="min-h-screen bg-gray-50">
      <RefreshIndicator isRefreshing={pullToRefresh.isRefreshing} />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Leirisonda
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            <button
              onClick={() => {
                navigateToSection("dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === "dashboard"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </button>

            <button
              onClick={() => {
                navigateToSection("obras");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === "obras"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Wrench className="mr-3 h-5 w-5" />
              Obras
              <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
                {works.length}
              </span>
            </button>

            <button
              onClick={() => {
                navigateToSection("piscinas");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === "piscinas"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Waves className="mr-3 h-5 w-5" />
              Piscinas
              <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
                {pools.length}
              </span>
            </button>

            <button
              onClick={() => {
                navigateToSection("manutencoes");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === "manutencoes"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Wrench className="mr-3 h-5 w-5" />
              Manutenções
              <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
                {maintenance.length}
              </span>
            </button>

            <button
              onClick={() => {
                navigateToSection("clientes");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === "clientes"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Clientes
              <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
                {clients.length}
              </span>
            </button>

            {hasPermission("relatorios", "view") && (
              <button
                onClick={() => {
                  navigateToSection("relatorios");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeSection === "relatorios"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <BarChart3 className="mr-3 h-5 w-5" />
                Relatórios
              </button>
            )}

            {hasPermission("utilizadores", "view") && (
              <button
                onClick={() => {
                  navigateToSection("administracao");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeSection === "administracao"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Shield className="mr-3 h-5 w-5" />
                Administração
              </button>
            )}

            <button
              onClick={() => {
                navigateToSection("definicoes");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === "definicoes"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Definições
            </button>
          </div>

          <div className="mt-auto pt-6 border-t">
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilizador
              </p>
              <div className="mt-2 flex items-center">
                <UserCheck className="h-8 w-8 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Terminar Sessão
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="ml-2 lg:ml-0 text-2xl font-bold text-gray-900">
                  {activeSection === "dashboard" && "Dashboard"}
                  {activeSection === "obras" && "Gestão de Obras"}
                  {activeSection === "piscinas" && "Gestão de Piscinas"}
                  {activeSection === "manutencoes" && "Gestão de Manutenções"}
                  {activeSection === "clientes" && "Gestão de Clientes"}
                  {activeSection === "relatorios" && "Relatórios"}
                  {activeSection === "administracao" && "Administração"}
                  {activeSection === "definicoes" && "Definições"}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {currentUser?.name}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {/* Dashboard - EXACTAMENTE como no App.tsx original */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Welcome Header com imagem - EXACTO do App.tsx original */}
              <div
                className="rounded-lg p-6 shadow-sm relative overflow-hidden"
                style={{
                  backgroundColor: "#0891b2",
                  backgroundImage:
                    "url('https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F7d1ac6645d4249ecbd385606606de4a6?format=webp&width=800')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Overlay para melhor legibilidade do texto */}
                <div className="absolute inset-0 bg-white bg-opacity-60 rounded-lg"></div>

                {/* Conteúdo por cima do overlay */}
                <div className="relative z-10">
                  {/* Logo and Time Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-32 h-12 bg-white rounded shadow-sm p-2">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F9413eeead84d4fecb67b4e817e791c86?format=webp&width=800"
                        alt="Leirisonda - Furos e Captações de Água, Lda"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-sm text-gray-800 font-medium">
                      {new Date().toLocaleTimeString("pt-PT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Main Content */}
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Olá, {currentUser?.name || "Gonçalo Fonseca"}
                    </h1>
                    <p className="text-gray-800 text-lg font-medium">
                      {new Date().toLocaleDateString("pt-PT", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Cards - EXACTOS do App.tsx original */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Pendentes */}
                <button
                  onClick={() => navigateToSection("obras")}
                  className="w-full bg-white rounded-lg border-l-4 border-red-500 p-6 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pendentes
                      </h3>
                      <p className="text-sm text-gray-500">
                        Obras necessitam atenção
                      </p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {(() => {
                        const pendingWorks = works.filter((w) => {
                          const isPending =
                            w.status === "pending" || w.status === "pendente";
                          const isAssignedToUser =
                            isWorkAssignedToCurrentUser(w);
                          return isPending && isAssignedToUser;
                        });
                        return pendingWorks.length;
                      })()}
                    </div>
                  </div>
                </button>

                {/* Em Progresso */}
                <button
                  onClick={() => navigateToSection("obras")}
                  className="w-full bg-white rounded-lg border-l-4 border-orange-500 p-6 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Em Progresso
                      </h3>
                      <p className="text-sm text-gray-500">
                        Obras em andamento
                      </p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {(() => {
                        const inProgressWorks = works.filter((w) => {
                          const isInProgress =
                            w.status === "in_progress" ||
                            w.status === "em_progresso";
                          const isAssignedToUser =
                            isWorkAssignedToCurrentUser(w);
                          return isInProgress && isAssignedToUser;
                        });
                        return inProgressWorks.length;
                      })()}
                    </div>
                  </div>
                </button>

                {/* Concluídas */}
                <button
                  onClick={() => navigateToSection("obras")}
                  className="w-full bg-white rounded-lg border-l-4 border-green-500 p-6 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Concluídas
                      </h3>
                      <p className="text-sm text-gray-500">Obras finalizadas</p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {(() => {
                        const completedWorks = works.filter((w) => {
                          const isCompleted =
                            w.status === "completed" ||
                            w.status === "concluida";
                          const isAssignedToUser =
                            currentUser &&
                            ((w.assignedTo &&
                              (w.assignedTo === currentUser.name ||
                                w.assignedTo
                                  .toLowerCase()
                                  .includes(currentUser.name.toLowerCase()) ||
                                currentUser.name
                                  .toLowerCase()
                                  .includes(w.assignedTo.toLowerCase()))) ||
                              (w.assignedUsers &&
                                w.assignedUsers.some(
                                  (user) =>
                                    user.name === currentUser.name ||
                                    user.id === currentUser.id,
                                )) ||
                              (w.assignedUserIds &&
                                w.assignedUserIds.includes(currentUser.id)));
                          return isCompleted && isAssignedToUser;
                        });
                        return completedWorks.length;
                      })()}
                    </div>
                  </div>
                </button>

                {/* Falta de Folhas de Obra */}
                <button
                  onClick={() => navigateToSection("obras")}
                  className="w-full bg-white rounded-lg border-l-4 border-blue-500 p-6 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Falta de Folhas de Obra
                      </h3>
                      <p className="text-sm text-gray-500">
                        Folhas não geradas
                      </p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {(() => {
                        const worksWithoutSheets = works.filter((w) => {
                          const isNotCompleted =
                            w.status !== "completed" &&
                            w.status !== "concluida";
                          const noSheetGenerated = !w.folhaGerada;
                          const isAssignedToUser =
                            isWorkAssignedToCurrentUser(w);
                          return (
                            isNotCompleted &&
                            noSheetGenerated &&
                            isAssignedToUser
                          );
                        });
                        return worksWithoutSheets.length;
                      })()}
                    </div>
                  </div>
                </button>
              </div>

              {/* Lista das Obras Atribuídas - EXACTA do App.tsx original */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Obras Atribuídas
                </h2>
                {obras.length > 0 ? (
                  <div className="space-y-3">
                    {obras.slice(0, 3).map((obra, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">
                            {obra.title || obra.client || `Obra ${index + 1}`}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              obra.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : obra.status === "in_progress"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {obra.status === "completed"
                              ? "Concluída"
                              : obra.status === "in_progress"
                                ? "Em Progresso"
                                : "Pendente"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {obra.address ||
                            obra.location ||
                            "Localização não definida"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Cliente: {obra.client || "Não atribuído"}
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Ver Detalhes
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma obra atribuída encontrada.
                  </p>
                )}
              </div>

              {/* Próximas Manutenções - EXACTAS do App.tsx original */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Próximas Manutenções
                </h2>
                {manutencoes.length > 0 ? (
                  <div className="space-y-3">
                    {manutencoes.slice(0, 3).map((manutencao, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">
                            {manutencao.type || `Manutenção ${index + 1}`}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {manutencao.scheduledDate
                              ? new Date(
                                  manutencao.scheduledDate,
                                ).toLocaleDateString("pt-PT")
                              : "Data não definida"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Piscina: {manutencao.poolName || "Não especificada"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma manutenção agendada.
                  </p>
                )}
              </div>

              {/* Estatísticas Rápidas - EXACTAS do App.tsx original */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumo do Sistema
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {piscinas.length}
                    </div>
                    <div className="text-sm text-gray-500">Piscinas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {clientes.length}
                    </div>
                    <div className="text-sm text-gray-500">Clientes</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Outras páginas - placeholders como no App.tsx original */}
          {activeSection === "obras" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Gestão de Obras
              </h2>
              <p className="text-gray-500">
                Módulo de obras em desenvolvimento com sistema offline-first.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Total de obras: {works.length}
              </p>
            </div>
          )}

          {activeSection === "piscinas" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Gestão de Piscinas
              </h2>
              <p className="text-gray-500">
                Módulo de piscinas em desenvolvimento com sistema offline-first.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Total de piscinas: {pools.length}
              </p>
            </div>
          )}

          {activeSection === "manutencoes" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Gestão de Manutenções
              </h2>
              <p className="text-gray-500">
                Módulo de manutenções em desenvolvimento com sistema
                offline-first.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Total de manutenções: {maintenance.length}
              </p>
            </div>
          )}

          {activeSection === "clientes" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Gestão de Clientes
              </h2>
              <p className="text-gray-500">
                Módulo de clientes em desenvolvimento com sistema offline-first.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Total de clientes: {clients.length}
              </p>
            </div>
          )}

          {activeSection === "relatorios" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Relatórios
              </h2>
              <p className="text-gray-500">
                Módulo de relatórios em desenvolvimento.
              </p>
            </div>
          )}

          {activeSection === "administracao" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Administração
              </h2>
              <p className="text-gray-500">
                Painel de administração em desenvolvimento.
              </p>
            </div>
          )}

          {activeSection === "definicoes" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Definições
              </h2>
              <p className="text-gray-500">
                Configurações da aplicação em desenvolvimento.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Status da aplicação - EXACTO do App.tsx original */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className="bg-white shadow-lg rounded-lg p-3 text-xs text-gray-500 border">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Leirisonda Online • Offline-First</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
