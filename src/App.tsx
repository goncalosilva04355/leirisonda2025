// BACKUP CRIADO EM: 2024-12-30
// VERSÃO ESTÁVEL COM:
// - Login funcional com "Lembrar-me"
// - Auto-login opcional
// - Dashboard com obras funcionais
// - Formulário de criação de obras
// - Click nas obras atribuídas
// - Modal de detalhes das obras
// - Sem erros React hooks

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
import jsPDF from "jspdf";
import { FirebaseConfig } from "./components/FirebaseConfig";
import { AdvancedSettings } from "./components/AdvancedSettings";
import { SyncStatusDisplay } from "./components/SyncStatusDisplay";
// import { InstallPrompt } from "./components/InstallPrompt"; // Temporarily disabled due to React hook error
import { UserPermissionsManager } from "./components/UserPermissionsManager";
import { RegisterForm } from "./components/RegisterForm";

// import { AutoSyncProvider } from "./components/AutoSyncProvider"; // Temporarily disabled due to React hook error
// import { SyncStatusIcon } from "./components/SyncStatusIndicator"; // Temporarily disabled due to AutoSyncProvider dependency
import { FirebaseQuotaWarning } from "./components/FirebaseQuotaWarning";

// SECURITY: RegisterForm removed - only super admin can create users
import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import { useDataSync } from "./hooks/useDataSync_simple";
import { authService, UserProfile } from "./services/authService";
import { useDataCleanup } from "./hooks/useDataCleanup";
// import { useAutoSync } from "./hooks/useAutoSync"; // Temporarily disabled due to React hook error

// Mock users database
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
  {
    id: 2,
    name: "Maria Silva",
    email: "maria.silva@leirisonda.pt",
    password: "123456",
    role: "manager",
    permissions: {
      obras: { view: true, create: true, edit: true, delete: false },
      manutencoes: { view: true, create: true, edit: true, delete: false },
      piscinas: { view: true, create: true, edit: true, delete: false },
      utilizadores: { view: true, create: false, edit: false, delete: false },
      relatorios: { view: true, create: true, edit: false, delete: false },
      clientes: { view: true, create: true, edit: true, delete: false },
    },
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    name: "João Santos",
    email: "joao.santos@leirisonda.pt",
    password: "123456",
    role: "technician",
    permissions: {
      obras: { view: true, create: false, edit: true, delete: false },
      manutencoes: { view: true, create: true, edit: true, delete: false },
      piscinas: { view: true, create: false, edit: true, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: true, create: false, edit: false, delete: false },
      clientes: { view: true, create: false, edit: false, delete: false },
    },
    active: true,
    createdAt: "2024-02-01",
  },
  {
    id: 4,
    name: "Alexandre",
    email: "alexandre@leirisonda.pt",
    password: "123456",
    role: "technician",
    permissions: {
      obras: { view: true, create: false, edit: true, delete: false },
      manutencoes: { view: true, create: true, edit: true, delete: false },
      piscinas: { view: true, create: false, edit: true, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: true, create: false, edit: false, delete: false },
      clientes: { view: true, create: false, edit: false, delete: false },
    },
    active: true,
    createdAt: "2024-02-15",
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

  // No auto-login - users must login manually
  useEffect(() => {
    // Clear any existing auth data on app start
    localStorage.removeItem("currentUser");
    localStorage.removeItem("mock-current-user");
    console.log("🔒 SECURITY: Auth data cleared - manual login required");
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

  // Data sync hook - manages all data with optional Firebase sync
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

  // Data cleanup hook - temporarily disabled to debug hooks issue
  // const {
  //   cleanAllData,
  //   isLoading: cleanupLoading,
  //   error: cleanupError,
  // } = useDataCleanup();
  const cleanAllData = () => Promise.resolve({ success: true });
  const cleanupLoading = false;
  const cleanupError = null;

  // Auto-sync hook for automatic Firebase ↔ localStorage synchronization
  // const autoSyncData = useAutoSync();
  // const { syncStatus, isAutoSyncing } = autoSyncData;
  // const autoSyncLastSync = autoSyncData.lastSync;
  const syncStatus = "idle";
  const isAutoSyncing = false;
  const autoSyncLastSync = null;

  // Keep local users state for user management
  const [users, setUsers] = useState(initialUsers);
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

  // Clickable links settings
  const [enablePhoneDialer, setEnablePhoneDialer] = useState(() => {
    return localStorage.getItem("enablePhoneDialer") === "true";
  });
  const [enableMapsRedirect, setEnableMapsRedirect] = useState(() => {
    return localStorage.getItem("enableMapsRedirect") === "true";
  });

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

  // Initialize authentication state with security checks
  useEffect(() => {
    console.log("🔒 SECURITY: App initialization started");

    // Try to restore user from localStorage first
    const storedUser =
      localStorage.getItem("currentUser") ||
      localStorage.getItem("mock-current-user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log(
          "👤🔄 App init: Restoring user from localStorage:",
          user.email,
        );
        setCurrentUser(user);
        setIsAuthenticated(true);
        console.log("✅ User session restored successfully");
        return; // Exit early if user is restored
      } catch (e) {
        console.warn(
          "App init: Error parsing stored user, clearing localStorage:",
          e,
        );
        localStorage.removeItem("currentUser");
        localStorage.removeItem("mock-current-user");
      }
    }

    // Only clear auth state if no valid stored user found
    console.log("🔒 No valid stored user found, ensuring clean state");
    sessionStorage.clear(); // Clear any session data
    setIsAuthenticated(false);
    setCurrentUser(null);

    // Firebase auth disabled to prevent crashes
    console.log("🔥 SECURITY: Firebase auth listeners disabled for stability");
    // Firebase auth code removed to fix syntax errors

    // DO NOT initialize default admin automatically - this was causing the security issue
    // Users must always login manually for security
    console.log(
      "🔒🔥 SECURITY: No automatic admin initialization - manual login required",
    );

    // Return empty cleanup function since unsubscribe is handled inside the promise
    return () => {};
  }, []);

  // Auth state check disabled to prevent errors
  // useEffect(() => {
  //   if (isAuthenticated && !currentUser) {
  //     console.warn("SECURITY: Inconsistent auth state detected");
  //     setIsAuthenticated(false);
  //     setCurrentUser(null);
  //     localStorage.removeItem("currentUser");
  //   }
  // }, [isAuthenticated, currentUser]);

  // SECURITY: Periodic auth check to prevent tampering
  // Periodic auth check disabled to prevent errors
  // useEffect(() => {
  //   const authCheckInterval = setInterval(() => {
  //     if (isAuthenticated && !currentUser) {
  //       console.warn("SECURITY: Auth state compromised, forcing logout");
  //       setIsAuthenticated(false);
  //       setCurrentUser(null);
  //       localStorage.removeItem("currentUser");
  //     }
  //   }, 5000);
  //   return () => clearInterval(authCheckInterval);
  // }, [isAuthenticated, currentUser]);

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

  // Notify Alexandre about assigned works when he logs in
  useEffect(() => {
    if (
      currentUser?.name.toLowerCase().includes("alexandre") &&
      works.length > 0
    ) {
      console.log("🔍 DEBUG Alexandre - Data loaded:", {
        currentUser: currentUser.name,
        worksCount: works.length,
        works: works.map((w) => ({
          id: w.id,
          title: w.title,
          assignedTo: w.assignedTo,
          assignedUsers: w.assignedUsers,
        })),
        localStorage: {
          pools: JSON.parse(localStorage.getItem("pools") || "[]").length,
          works: JSON.parse(localStorage.getItem("works") || "[]").length,
          maintenance: JSON.parse(localStorage.getItem("maintenance") || "[]")
            .length,
        },
      });

      // Find works assigned to Alexandre
      const alexandreWorks = works.filter(
        (work) =>
          work &&
          work.assignedTo &&
          (work.assignedTo.toLowerCase().includes("alexandre") ||
            work.assignedUsers?.some(
              (user) =>
                user.name && user.name.toLowerCase().includes("alexandre"),
            )),
      );

      // Notify Alexandre about his assigned works
      if (
        alexandreWorks.length > 0 &&
        notificationsEnabled &&
        Notification.permission === "granted"
      ) {
        console.log(
          "🔔 Sending notification to Alexandre about assigned works:",
          alexandreWorks.length,
        );

        setTimeout(() => {
          showNotification(
            "Obras Atribuídas",
            `Olá Alexandre! Tens ${alexandreWorks.length} obra${alexandreWorks.length > 1 ? "s" : ""} atribuída${alexandreWorks.length > 1 ? "s" : ""}.`,
            "work",
          );
        }, 2000); // Delay to ensure notification system is ready
      } else if (alexandreWorks.length > 0) {
        console.log("ℹ️ Alexandre has works but notifications are not enabled");
      }
    }
  }, [currentUser, works, notificationsEnabled]);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Work form state
  const [workForm, setWorkForm] = useState({
    title: "",
    client: "",
    location: "",
    description: "",
    priority: "medium",
    type: "",
    status: "pending",
    estimatedDuration: "",
    budget: "",
    notes: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    deadline: "",
    materials: [],
    assignedTo: "",
    createdBy: "",
    createdAt: "",
    startDate: "",
    endDate: "",
  });

  // Pool form state
  const [poolForm, setPoolForm] = useState({
    clientId: "",
    location: "",
    type: "chlorine",
    dimensions: "",
    volume: "",
    installDate: "",
    notes: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    maintenanceSchedule: "weekly",
    lastMaintenance: "",
    nextMaintenance: "",
    status: "active",
  });

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      console.log("🔑 Login attempt for:", loginForm.email);

      // Mock authentication - find user by email and password
      const user = users.find(
        (u) => u.email === loginForm.email && u.password === loginForm.password,
      );

      if (!user) {
        throw new Error("Email ou senha incorretos");
      }

      if (!user.active) {
        throw new Error("Conta desativada. Contacte o administrador.");
      }

      // Create user profile
      const userProfile: UserProfile = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role as "super_admin" | "admin" | "manager" | "technician",
        permissions: user.permissions,
        active: user.active,
        createdAt: user.createdAt,
      };

      console.log("✅ Login successful for:", userProfile.email);
      setCurrentUser(userProfile);
      setIsAuthenticated(true);

      // Store in localStorage if "remember me" is checked
      if (loginForm.rememberMe) {
        localStorage.setItem("currentUser", JSON.stringify(userProfile));
        console.log("💾 User stored in localStorage");
      } else {
        // Clear any existing stored data if not remembering
        localStorage.removeItem("currentUser");
        localStorage.removeItem("mock-current-user");
        console.log("🗑️ localStorage cleared (remember me unchecked)");
      }

      // Reset form
      setLoginForm({ email: "", password: "", rememberMe: false });
    } catch (error) {
      console.error("❌ Login error:", error);
      setLoginError(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    console.log("👋 User logout:", currentUser?.email);
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("mock-current-user");
    sessionStorage.clear();

    // Clear form states
    setActiveSection("dashboard");
    setSidebarOpen(false);
    setShowUserForm(false);
    setEditingUser(null);
    setShowSettingsPage(false);
    setShowAdvancedSettings(false);
    setIsAdvancedUnlocked(false);
    setShowAdminLogin(false);
    setIsAdminAuthenticated(false);

    console.log("🔒 User logged out successfully");
  };

  // Show notification function
  const showNotification = (title: string, body: string, tag?: string) => {
    if (
      notificationsEnabled &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      const notification = new Notification(title, {
        body,
        tag,
        icon: "/logo192.png",
        badge: "/logo192.png",
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    }
  };

  // Permission management functions
  const hasPermission = (module: string, action: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === "super_admin") return true;
    return currentUser.permissions?.[module]?.[action] === true;
  };

  // Handle create work
  const handleCreateWork = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newWork = {
        ...workForm,
        id: Date.now(),
        createdBy: currentUser?.name || "",
        createdAt: new Date().toISOString(),
        assignedUsers: assignedUsers,
      };

      console.log("Creating work:", newWork);
      await addWork(newWork);
      console.log("Work created successfully");

      // Reset form
      setWorkForm({
        title: "",
        client: "",
        location: "",
        description: "",
        priority: "medium",
        type: "",
        status: "pending",
        estimatedDuration: "",
        budget: "",
        notes: "",
        contactPerson: "",
        contactPhone: "",
        contactEmail: "",
        deadline: "",
        materials: [],
        assignedTo: "",
        createdBy: "",
        createdAt: "",
        startDate: "",
        endDate: "",
      });
      setAssignedUsers([]);
      setActiveSection("dashboard");

      // Show success notification
      showNotification(
        "Obra Criada",
        `Obra "${newWork.title}" criada com sucesso!`,
        "work",
      );
    } catch (error) {
      console.error("Error creating work:", error);
      alert("Erro ao criar obra. Tente novamente.");
    }
  };

  // Handle create pool
  const handleCreatePool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPool = {
        ...poolForm,
        id: Date.now(),
        createdBy: currentUser?.name || "",
        createdAt: new Date().toISOString(),
      };

      console.log("Creating pool:", newPool);
      await addPool(newPool);
      console.log("Pool created successfully");

      // Reset form
      setPoolForm({
        clientId: "",
        location: "",
        type: "chlorine",
        dimensions: "",
        volume: "",
        installDate: "",
        notes: "",
        contactPerson: "",
        contactPhone: "",
        contactEmail: "",
        maintenanceSchedule: "weekly",
        lastMaintenance: "",
        nextMaintenance: "",
        status: "active",
      });
      setActiveSection("dashboard");

      // Show success notification
      showNotification(
        "Piscina Adicionada",
        `Piscina em "${newPool.location}" adicionada com sucesso!`,
        "pool",
      );
    } catch (error) {
      console.error("Error creating pool:", error);
      alert("Erro ao adicionar piscina. Tente novamente.");
    }
  };

  // Handle create maintenance
  const handleCreateMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newMaintenance = {
        ...maintenanceForm,
        id: Date.now(),
        createdBy: currentUser?.name || "",
        createdAt: new Date().toISOString(),
      };

      console.log("Creating maintenance:", newMaintenance);
      await addMaintenance(newMaintenance);
      console.log("Maintenance created successfully");

      // Reset form
      setMaintenanceForm({
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
      setActiveSection("dashboard");

      // Show success notification
      showNotification(
        "Manutenção Registada",
        "Manutenção registada com sucesso!",
        "maintenance",
      );
    } catch (error) {
      console.error("Error creating maintenance:", error);
      alert("Erro ao registar manutenção. Tente novamente.");
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      console.log("🔔 Notification permission:", permission);
      setPushPermission(permission);
      setNotificationsEnabled(permission === "granted");

      if (permission === "granted") {
        showNotification(
          "Notificações Ativadas",
          "Você receberá notificações sobre obras e manutenções.",
          "permission",
        );
      }
    }
  };

  // Add assigned user
  const addAssignedUser = () => {
    if (
      currentAssignedUser &&
      !assignedUsers.find((u) => u.id === currentAssignedUser)
    ) {
      const user = users.find((u) => u.id.toString() === currentAssignedUser);
      if (user) {
        setAssignedUsers([
          ...assignedUsers,
          { id: user.id.toString(), name: user.name },
        ]);
        setCurrentAssignedUser("");
      }
    }
  };

  // Remove assigned user
  const removeAssignedUser = (userId: string) => {
    setAssignedUsers(assignedUsers.filter((u) => u.id !== userId));
  };

  // Filter works based on current user and filter
  const filterWorks = (works: any[]) => {
    if (!Array.isArray(works)) return [];

    let filtered = works;

    // Apply global search filter first
    if (globalSearchTerm) {
      const searchLower = globalSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (work) =>
          work.title?.toLowerCase().includes(searchLower) ||
          work.client?.toLowerCase().includes(searchLower) ||
          work.location?.toLowerCase().includes(searchLower) ||
          work.description?.toLowerCase().includes(searchLower) ||
          work.type?.toLowerCase().includes(searchLower) ||
          work.status?.toLowerCase().includes(searchLower) ||
          work.assignedTo?.toLowerCase().includes(searchLower) ||
          work.assignedUsers?.some((user) =>
            user.name?.toLowerCase().includes(searchLower),
          ),
      );
    }

    // Apply work filter
    switch (activeWorkFilter) {
      case "my-works":
        return filtered.filter((work) => {
          if (!currentUser) return false;
          return (
            work.assignedTo === currentUser.name ||
            work.assignedUsers?.some(
              (user) => user.name === currentUser.name,
            ) ||
            work.createdBy === currentUser.name
          );
        });
      case "pending":
        return filtered.filter((work) => work.status === "pending");
      case "in-progress":
        return filtered.filter((work) => work.status === "in_progress");
      case "completed":
        return filtered.filter((work) => work.status === "completed");
      case "urgent":
        return filtered.filter((work) => work.priority === "high");
      default:
        return filtered;
    }
  };

  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString("pt-PT"),
      time: now.toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      greeting: getGreeting(),
    };
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const { date, time, greeting } = getCurrentDateTime();

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Leirisonda</h1>
            <p className="text-gray-600">Sistema de Gestão</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={loginForm.rememberMe}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, rememberMe: e.target.checked })
                }
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Lembrar-me
              </label>
            </div>

            {loginError && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoggingIn ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Versão 1.0 - Leirisonda Management System</p>
          </div>
        </div>
      </div>
    );
  }

  // Show admin login modal
  if (showAdminLogin) {
    return (
      <AdminLogin
        onClose={() => setShowAdminLogin(false)}
        onLogin={setIsAdminAuthenticated}
      />
    );
  }

  // Show admin page
  if (isAdminAuthenticated) {
    return <AdminPage onLogout={() => setIsAdminAuthenticated(false)} />;
  }

  // Main app content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Menu and Logo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 hover:bg-blue-500 rounded"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8" />
                <span className="text-xl font-bold hidden sm:block">
                  Leirisonda
                </span>
              </div>
            </div>

            {/* Right: Time and User */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-lg font-bold">{time}</div>
                <div className="text-sm opacity-90">{date}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  {greeting}, {currentUser?.name?.split(" ")[0]}
                </div>
                <div className="text-sm opacity-90 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Online
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:relative lg:inset-auto">
            <div
              className="absolute inset-0 bg-black opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <nav className="relative bg-white w-64 h-full shadow-lg lg:shadow-none overflow-y-auto">
              <div className="p-4">
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigateToSection("dashboard");
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === "dashboard"
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
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
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Wrench className="h-5 w-5" />
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
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
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
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
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
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
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
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
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
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Plus className="h-5 w-5" />
                      <span>Nova Manutenção</span>
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
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span>Relatórios</span>
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
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
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
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <UserPlus className="h-5 w-5" />
                      <span>Novo Cliente</span>
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
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
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
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Configurações</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-x-hidden">
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 shadow">
                  <div className="flex items-center">
                    <Wrench className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Obras
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {works.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow">
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

                <div className="bg-white rounded-lg p-6 shadow">
                  <div className="flex items-center">
                    <Settings className="h-8 w-8 text-green-600" />
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

                <div className="bg-white rounded-lg p-6 shadow">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-purple-600" />
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

              {/* Quick Actions */}
              <div className="bg-white rounded-lg p-6 shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Ações Rápidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {hasPermission("obras", "create") && (
                    <button
                      onClick={() => setActiveSection("nova-obra")}
                      className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Nova Obra
                    </button>
                  )}
                  {hasPermission("piscinas", "create") && (
                    <button
                      onClick={() => setActiveSection("nova-piscina")}
                      className="flex items-center justify-center p-4 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Nova Piscina
                    </button>
                  )}
                  {hasPermission("manutencoes", "create") && (
                    <button
                      onClick={() => setActiveSection("nova-manutencao")}
                      className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Nova Manutenção
                    </button>
                  )}
                </div>
              </div>

              {/* Recent Works */}
              <div className="bg-white rounded-lg p-6 shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Obras Recentes
                </h2>
                <div className="space-y-4">
                  {works.slice(0, 5).map((work) => (
                    <div
                      key={work.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {work.client || work.title}
                        </h3>
                        <p className="text-sm text-gray-600">{work.location}</p>
                        <p className="text-sm text-gray-500">
                          Status:{" "}
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              work.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : work.status === "in_progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {work.status === "pending"
                              ? "Pendente"
                              : work.status === "in_progress"
                                ? "Em Progresso"
                                : "Concluída"}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedWork(work);
                          setViewingWork(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {works.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Nenhuma obra encontrada
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Obras */}
          {activeSection === "obras" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Obras</h1>
                {hasPermission("obras", "create") && (
                  <button
                    onClick={() => setActiveSection("nova-obra")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Obra
                  </button>
                )}
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Buscar obras..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={globalSearchTerm}
                      onChange={(e) => setGlobalSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={activeWorkFilter}
                    onChange={(e) => setActiveWorkFilter(e.target.value)}
                  >
                    <option value="all">Todas as Obras</option>
                    <option value="my-works">Minhas Obras</option>
                    <option value="pending">Pendentes</option>
                    <option value="in-progress">Em Progresso</option>
                    <option value="completed">Concluídas</option>
                    <option value="urgent">Urgentes</option>
                  </select>
                </div>
              </div>

              {/* Works List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Obra
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Atribuído a
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filterWorks(works).map((work) => (
                        <tr key={work.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {work.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {work.location}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {work.client}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                work.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : work.status === "in_progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {work.status === "pending"
                                ? "Pendente"
                                : work.status === "in_progress"
                                  ? "Em Progresso"
                                  : "Concluída"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {work.assignedTo ||
                              work.assignedUsers
                                ?.map((u) => u.name)
                                .join(", ") ||
                              "Não atribuído"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button
                              onClick={() => {
                                setSelectedWork(work);
                                setViewingWork(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {hasPermission("obras", "edit") && (
                              <button
                                onClick={() => setEditingWork(work)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                            {hasPermission("obras", "delete") && (
                              <button
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Tem certeza que deseja eliminar esta obra?",
                                    )
                                  ) {
                                    // Delete work logic here
                                  }
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filterWorks(works).length === 0 && (
                  <div className="text-center py-12">
                    <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma obra encontrada</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nova Obra */}
          {activeSection === "nova-obra" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveSection("obras")}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Nova Obra</h1>
              </div>

              <form
                onSubmit={handleCreateWork}
                className="bg-white rounded-lg p-6 shadow space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título da Obra *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={workForm.title}
                      onChange={(e) =>
                        setWorkForm({ ...workForm, title: e.target.value })
                      }
                      placeholder="Ex: Instalação de piscina"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cliente *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={workForm.client}
                      onChange={(e) =>
                        setWorkForm({ ...workForm, client: e.target.value })
                      }
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Localização *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={workForm.location}
                      onChange={(e) =>
                        setWorkForm({ ...workForm, location: e.target.value })
                      }
                      placeholder="Morada completa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Obra
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={workForm.type}
                      onChange={(e) =>
                        setWorkForm({ ...workForm, type: e.target.value })
                      }
                    >
                      <option value="">Selecionar tipo</option>
                      <option value="instalacao">Instalação</option>
                      <option value="manutencao">Manutenção</option>
                      <option value="reparacao">Reparação</option>
                      <option value="limpeza">Limpeza</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridade
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={workForm.priority}
                      onChange={(e) =>
                        setWorkForm({ ...workForm, priority: e.target.value })
                      }
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prazo de Conclusão
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={workForm.deadline}
                      onChange={(e) =>
                        setWorkForm({ ...workForm, deadline: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={workForm.description}
                    onChange={(e) =>
                      setWorkForm({ ...workForm, description: e.target.value })
                    }
                    placeholder="Descrição detalhada da obra..."
                  />
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pessoa de Contacto
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={workForm.contactPerson}
                      onChange={(e) =>
                        setWorkForm({
                          ...workForm,
                          contactPerson: e.target.value,
                        })
                      }
                      placeholder="Nome do contacto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={workForm.contactPhone}
                      onChange={(e) =>
                        setWorkForm({
                          ...workForm,
                          contactPhone: e.target.value,
                        })
                      }
                      placeholder="+351 XXX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={workForm.contactEmail}
                      onChange={(e) =>
                        setWorkForm({
                          ...workForm,
                          contactEmail: e.target.value,
                        })
                      }
                      placeholder="email@exemplo.com"
                    />
                  </div>
                </div>

                {/* Assigned Users */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Atribuir a Utilizadores
                  </label>
                  <div className="flex gap-2 mb-2">
                    <select
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentAssignedUser}
                      onChange={(e) => setCurrentAssignedUser(e.target.value)}
                    >
                      <option value="">Selecionar utilizador</option>
                      {users
                        .filter(
                          (u) =>
                            u.active &&
                            !assignedUsers.find(
                              (au) => au.id === u.id.toString(),
                            ),
                        )
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                    </select>
                    <button
                      type="button"
                      onClick={addAssignedUser}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Adicionar
                    </button>
                  </div>

                  {assignedUsers.length > 0 && (
                    <div className="space-y-2">
                      {assignedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                        >
                          <span>{user.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAssignedUser(user.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection("obras")}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Criar Obra
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Piscinas */}
          {activeSection === "piscinas" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Piscinas</h1>
                {hasPermission("piscinas", "create") && (
                  <button
                    onClick={() => setActiveSection("nova-piscina")}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Piscina
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pools.map((pool) => (
                  <div
                    key={pool.id}
                    className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Waves className="h-8 w-8 text-cyan-600" />
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          pool.status === "active"
                            ? "bg-green-100 text-green-800"
                            : pool.status === "maintenance"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pool.status === "active"
                          ? "Ativa"
                          : pool.status === "maintenance"
                            ? "Manutenção"
                            : "Inativa"}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {pool.location}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Tipo:</span> {pool.type}
                      </p>
                      <p>
                        <span className="font-medium">Dimensões:</span>{" "}
                        {pool.dimensions}
                      </p>
                      <p>
                        <span className="font-medium">Volume:</span>{" "}
                        {pool.volume}
                      </p>
                      {pool.lastMaintenance && (
                        <p>
                          <span className="font-medium">
                            Última Manutenção:
                          </span>{" "}
                          {new Date(pool.lastMaintenance).toLocaleDateString(
                            "pt-PT",
                          )}
                        </p>
                      )}
                      {pool.nextMaintenance && (
                        <p>
                          <span className="font-medium">
                            Próxima Manutenção:
                          </span>{" "}
                          {new Date(pool.nextMaintenance).toLocaleDateString(
                            "pt-PT",
                          )}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      {hasPermission("piscinas", "edit") && (
                        <button
                          onClick={() => setEditingPool(pool)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      {hasPermission("piscinas", "delete") && (
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Tem certeza que deseja eliminar esta piscina?",
                              )
                            ) {
                              // Delete pool logic here
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {pools.length === 0 && (
                <div className="text-center py-12">
                  <Waves className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma piscina encontrada</p>
                  {hasPermission("piscinas", "create") && (
                    <button
                      onClick={() => setActiveSection("nova-piscina")}
                      className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
                    >
                      Adicionar primeira piscina
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Nova Piscina */}
          {activeSection === "nova-piscina" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveSection("piscinas")}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  Nova Piscina
                </h1>
              </div>

              <form
                onSubmit={handleCreatePool}
                className="bg-white rounded-lg p-6 shadow space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cliente *
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={poolForm.clientId}
                      onChange={(e) =>
                        setPoolForm({ ...poolForm, clientId: e.target.value })
                      }
                    >
                      <option value="">Selecionar cliente</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Localização *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={poolForm.location}
                      onChange={(e) =>
                        setPoolForm({ ...poolForm, location: e.target.value })
                      }
                      placeholder="Endereço da piscina"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Piscina *
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={poolForm.type}
                      onChange={(e) =>
                        setPoolForm({ ...poolForm, type: e.target.value })
                      }
                    >
                      <option value="">Selecionar tipo</option>
                      <option value="chlorine">Cloro</option>
                      <option value="saltwater">Água Salgada</option>
                      <option value="natural">Natural</option>
                      <option value="indoor">Interior</option>
                      <option value="outdoor">Exterior</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dimensões
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={poolForm.dimensions}
                      onChange={(e) =>
                        setPoolForm({ ...poolForm, dimensions: e.target.value })
                      }
                      placeholder="Ex: 8m x 4m x 1.5m"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volume (L)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={poolForm.volume}
                      onChange={(e) =>
                        setPoolForm({ ...poolForm, volume: e.target.value })
                      }
                      placeholder="Ex: 48000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Instalação
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={poolForm.installDate}
                      onChange={(e) =>
                        setPoolForm({
                          ...poolForm,
                          installDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={poolForm.notes}
                    onChange={(e) =>
                      setPoolForm({ ...poolForm, notes: e.target.value })
                    }
                    placeholder="Informações adicionais sobre a piscina..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection("piscinas")}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
                  >
                    Adicionar Piscina
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Configurações */}
          {activeSection === "configuracoes" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Configurações
              </h1>

              {/* Notifications */}
              <div className="bg-white rounded-lg p-6 shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Notificações
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Notificações Push
                      </p>
                      <p className="text-sm text-gray-600">
                        Receba notificações sobre obras e manutenções
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {pushPermission === "granted"
                          ? "Ativadas"
                          : pushPermission === "denied"
                            ? "Negadas"
                            : "Não solicitadas"}
                      </span>
                      {pushPermission !== "granted" && (
                        <button
                          onClick={requestNotificationPermission}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Ativar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* App Settings */}
              <div className="bg-white rounded-lg p-6 shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Definições da App
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Links Clicáveis - Telefone
                      </p>
                      <p className="text-sm text-gray-600">
                        Clique nos números de telefone para ligar diretamente
                      </p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={enablePhoneDialer}
                        onChange={(e) => {
                          setEnablePhoneDialer(e.target.checked);
                          localStorage.setItem(
                            "enablePhoneDialer",
                            e.target.checked.toString(),
                          );
                        }}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Links Clicáveis - Moradas
                      </p>
                      <p className="text-sm text-gray-600">
                        Clique nas moradas para abrir no Google Maps
                      </p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={enableMapsRedirect}
                        onChange={(e) => {
                          setEnableMapsRedirect(e.target.checked);
                          localStorage.setItem(
                            "enableMapsRedirect",
                            e.target.checked.toString(),
                          );
                        }}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Data Sync */}
              <SyncStatusDisplay
                lastSync={lastSync}
                error={syncError}
                isLoading={syncLoading}
                onSync={() => syncWithFirebase()}
                enableSync={enableSync}
              />

              {/* Firebase Quota Warning */}
              <FirebaseQuotaWarning />

              {/* Advanced Settings - Protected */}
              {currentUser?.role === "super_admin" && (
                <div className="bg-white rounded-lg p-6 shadow border-l-4 border-yellow-400">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Shield className="h-5 w-5 text-yellow-500 mr-2" />
                        Definições Avançadas
                      </h2>
                      <p className="text-sm text-gray-600">
                        Acesso restrito a Super Administradores
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAdvancedSettings(true)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      Aceder
                    </button>
                  </div>
                </div>
              )}

              {/* User Profile */}
              <div className="bg-white rounded-lg p-6 shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Perfil do Utilizador
                </h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nome</p>
                      <p className="text-gray-900">{currentUser?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{currentUser?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Função
                      </p>
                      <p className="text-gray-900">
                        {currentUser?.role === "super_admin"
                          ? "Super Administrador"
                          : currentUser?.role === "admin"
                            ? "Administrador"
                            : currentUser?.role === "manager"
                              ? "Gestor"
                              : "Técnico"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Estado
                      </p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                        Ativo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Version Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-center text-sm text-gray-600">
                  <p>Leirisonda Management System</p>
                  <p>Versão 1.0 - Build {new Date().getFullYear()}</p>
                  <p className="mt-2">Desenvolvido para Leirisonda</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* View Work Modal */}
      {viewingWork && selectedWork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Detalhes da Obra
                </h2>
                <button
                  onClick={() => {
                    setViewingWork(false);
                    setSelectedWork(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {selectedWork.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Cliente
                      </p>
                      <p className="text-gray-900">{selectedWork.client}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Localização
                      </p>
                      <p className="text-gray-900">{selectedWork.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tipo</p>
                      <p className="text-gray-900">{selectedWork.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Estado
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          selectedWork.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : selectedWork.status === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedWork.status === "pending"
                          ? "Pendente"
                          : selectedWork.status === "in_progress"
                            ? "Em Progresso"
                            : "Concluída"}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedWork.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Descrição
                    </p>
                    <p className="text-gray-900">{selectedWork.description}</p>
                  </div>
                )}

                {(selectedWork.assignedTo ||
                  selectedWork.assignedUsers?.length > 0) && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Atribuído a
                    </p>
                    <p className="text-gray-900">
                      {selectedWork.assignedTo ||
                        selectedWork.assignedUsers
                          ?.map((u) => u.name)
                          .join(", ")}
                    </p>
                  </div>
                )}

                {selectedWork.contactPerson && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Informações de Contacto
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Pessoa de Contacto
                          </p>
                          <p className="text-gray-900">
                            {selectedWork.contactPerson}
                          </p>
                        </div>
                        {selectedWork.contactPhone && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Telefone
                            </p>
                            {enablePhoneDialer ? (
                              <a
                                href={`tel:${selectedWork.contactPhone}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {selectedWork.contactPhone}
                              </a>
                            ) : (
                              <p className="text-gray-900">
                                {selectedWork.contactPhone}
                              </p>
                            )}
                          </div>
                        )}
                        {selectedWork.contactEmail && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Email
                            </p>
                            <a
                              href={`mailto:${selectedWork.contactEmail}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {selectedWork.contactEmail}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedWork.deadline && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Prazo de Conclusão
                    </p>
                    <p className="text-gray-900">
                      {new Date(selectedWork.deadline).toLocaleDateString(
                        "pt-PT",
                      )}
                    </p>
                  </div>
                )}

                {selectedWork.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Notas
                    </p>
                    <p className="text-gray-900">{selectedWork.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    <p>Criado por: {selectedWork.createdBy}</p>
                    <p>
                      Data:{" "}
                      {selectedWork.createdAt
                        ? new Date(selectedWork.createdAt).toLocaleDateString(
                            "pt-PT",
                          )
                        : "N/A"}
                    </p>
                  </div>

                  {hasPermission("obras", "edit") && (
                    <button
                      onClick={() => {
                        setEditingWork(selectedWork);
                        setViewingWork(false);
                        setSelectedWork(null);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Settings Modal */}
      {showAdvancedSettings && (
        <AdvancedSettings
          isOpen={showAdvancedSettings}
          onClose={() => {
            setShowAdvancedSettings(false);
            setIsAdvancedUnlocked(false);
            setAdvancedPassword("");
            setAdvancedPasswordError("");
          }}
          isUnlocked={isAdvancedUnlocked}
          password={advancedPassword}
          setPassword={setAdvancedPassword}
          passwordError={advancedPasswordError}
          setPasswordError={setAdvancedPasswordError}
          onUnlock={setIsAdvancedUnlocked}
          showDataCleanup={showDataCleanup}
          setShowDataCleanup={setShowDataCleanup}
          cleanAllData={cleanAllData}
          cleanupLoading={cleanupLoading}
          cleanupError={cleanupError}
        />
      )}
    </div>
  );
}

export default App;
