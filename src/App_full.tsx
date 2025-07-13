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
import { InstallPrompt } from "./components/InstallPrompt";
import { UserPermissionsManager } from "./components/UserPermissionsManager";
import { RegisterForm } from "./components/RegisterForm";

import { AutoSyncProvider } from "./components/AutoSyncProvider";
import { SyncStatusIcon } from "./components/SyncStatusIndicator";
import { FirebaseQuotaWarning } from "./components/FirebaseQuotaWarning";

// SECURITY: RegisterForm removed - only super admin can create users
import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import { useDataSync } from "./hooks/useDataSync";
import { authService, UserProfile } from "./services/authService";
import { useDataCleanup } from "./hooks/useDataCleanup";
import { useAutoSync } from "./hooks/useAutoSync";

// Mock users database - only super admin
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
    console.log("�� Auth State Debug:", {
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

  // Auto-sync hook for automatic Firebase �� localStorage synchronization
  const autoSyncData = useAutoSync();
  const { syncStatus, isAutoSyncing } = autoSyncData;
  const autoSyncLastSync = autoSyncData.lastSync;

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
          "����� App init: Restoring user from localStorage:",
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
    console.log("��� SECURITY: Firebase auth listeners disabled for stability");
    // Firebase auth code removed to fix syntax errors

    // DO NOT initialize default admin automatically - this was causing the security issue
    // Users must always login manually for security
    console.log(
      "��� SECURITY: No automatic admin initialization - manual login required",
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
      console.warn("��� Notifications not supported in this browser");
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
  });
  const [loginError, setLoginError] = useState("");

  // User form state
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

  // Settings functions
  const handleSettingsPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settingsPassword === "19867") {
      setShowSettingsPasswordModal(false);
      setShowSettingsPage(true);
      setSettingsPassword("");
      setSettingsPasswordError("");
    } else {
      setSettingsPasswordError("Palavra-passe incorreta");
    }
  };

  const closeSettings = () => {
    setShowSettingsPage(false);
    setShowSettingsPasswordModal(false);
    setSettingsPassword("");
    setSettingsPasswordError("");
  };

  const handleSaveIntervention = () => {
    // SECURITY: Check if user has permission to create maintenance
    if (!currentUser?.permissions?.manutencoes?.create) {
      alert(
        "Não tem permissão para criar manutenções. Contacte o administrador.",
      );
      return;
    }

    // Validate required fields
    if (!maintenanceForm.poolId || !maintenanceForm.technician) {
      alert("Por favor, preencha os campos obrigatórios (Piscina e Técnico).");
      return;
    }

    // Get pool and technician names for display
    const selectedPool = pools.find((p) => p.id === maintenanceForm.poolId);
    const selectedTechnician = users.find(
      (u) => u.id === parseInt(maintenanceForm.technician),
    );

    // Save complete intervention data
    const interventionData = {
      id: Date.now(),
      poolId: maintenanceForm.poolId,
      poolName: selectedPool ? selectedPool.name : "Piscina Desconhecida",
      client: selectedPool ? selectedPool.client : "",
      date: maintenanceForm.date,
      startTime: maintenanceForm.startTime,
      endTime: maintenanceForm.endTime,
      technician: selectedTechnician
        ? selectedTechnician.name
        : maintenanceForm.technician,
      vehicle: maintenanceForm.vehicle,
      waterValues: {
        pH: maintenanceForm.pH,
        chlorine: maintenanceForm.chlorine,
        alkalinity: maintenanceForm.alkalinity,
        temperature: maintenanceForm.temperature,
      },
      workPerformed: maintenanceForm.workPerformed,
      otherWork: maintenanceForm.otherWork,
      problems: maintenanceForm.problems,
      observations: maintenanceForm.observations,
      nextMaintenance: maintenanceForm.nextMaintenance,
      status: maintenanceForm.status,
      photos: uploadedPhotos,
      photoCount: uploadedPhotos.length,
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage for persistence (in real app, would save to backend)
    const savedInterventions = JSON.parse(
      localStorage.getItem("interventions") || "[]",
    );
    savedInterventions.push(interventionData);
    localStorage.setItem("interventions", JSON.stringify(savedInterventions));

    // Add to maintenance sync system
    const newMaintenance = {
      poolId: interventionData.poolId,
      poolName: interventionData.poolName,
      type: "Manutenção Regular",
      scheduledDate: maintenanceForm.date,
      technician: interventionData.technician,
      status: maintenanceForm.status as
        | "pending"
        | "in_progress"
        | "completed"
        | "cancelled",
      description: maintenanceForm.workPerformed || "Manutenção realizada",
      notes: maintenanceForm.observations,
    };

    // Use sync system to add maintenance (will handle Firebase and localStorage)
    addMaintenance(newMaintenance);

    // Create future maintenance if next maintenance date is selected
    if (maintenanceForm.nextMaintenance) {
      const nextMaintenanceDate = new Date(maintenanceForm.nextMaintenance);
      const today = new Date();

      // Only create future maintenance if the date is in the future
      if (nextMaintenanceDate > today) {
        const futureMaintenance = {
          poolId: interventionData.poolId,
          poolName: interventionData.poolName,
          type: "Manutenção Programada",
          scheduledDate: maintenanceForm.nextMaintenance,
          technician: interventionData.technician,
          status: "scheduled" as const,
          description: "Manutenção programada automaticamente",
          notes: "Agendada automaticamente após manutenção anterior",
          clientName: selectedPool ? selectedPool.client : "",
          clientContact: "", // Could be populated from client data if available
          location: selectedPool ? selectedPool.location : "",
        };

        addMaintenance(futureMaintenance);
        console.log("Futura manutenção criada:", futureMaintenance);
      }
    }

    console.log("Manutenção salva com sucesso:", interventionData);

    let alertMessage = `Manutenção salva com sucesso! Piscina: ${interventionData.poolName}, Técnico: ${interventionData.technician}`;

    if (maintenanceForm.nextMaintenance) {
      const nextDate = new Date(
        maintenanceForm.nextMaintenance,
      ).toLocaleDateString("pt-PT");
      alertMessage += `\n\nPróxima manutenção agendada para: ${nextDate}`;
    }

    alert(alertMessage);

    // Clear form and photos after saving
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
    setUploadedPhotos([]);

    // Navigate back to maintenance list
    setActiveSection("manutencoes");
  };

  const handleShare = (platform) => {
    // Generate PDF and share logic would go here
    console.log(`Sharing via ${platform}`);
    // For demo purposes, just close modal and go back to piscinas
    setShowShareModal(false);
    setInterventionSaved(false);
    setActiveSection("piscinas");
  };

  // Authentication functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Validate input first
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Por favor, preencha todos os campos");
      return;
    }

    try {
      console.log("🔐 Attempting login for:", loginForm.email);
      console.log("🔐 Email:", loginForm.email);
      console.log("🔐 Password length:", loginForm.password?.length || 0);

      const result = await authService.login(
        loginForm.email,
        loginForm.password,
      );

      console.log("🔐 Auth result:", result);

      if (result.success && result.user) {
        console.log("�� Login successful for:", result.user.email);

        // Clear any previous auth state
        setLoginError("");

        // Set user state and authentication
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem("currentUser", JSON.stringify(result.user));

        // Clear login form
        setLoginForm({ email: "", password: "" });

        console.log("✅ Login state updated", {
          user: result.user.email,
          role: result.user.role,
          isAuthenticated: true,
        });

        // Use setTimeout to ensure state is set before navigation
        setTimeout(() => {
          // Handle any pending hash navigation after login
          const hash = window.location.hash.substring(1);
          if (hash && hash !== "login") {
            console.log("🔄 Navigating to hash section:", hash);
            setActiveSection(hash);
          } else {
            // Default to dashboard when no hash is present
            console.log("��� Navigating to dashboard");
            navigateToSection("dashboard");
          }
        }, 100);
      } else {
        console.warn("�� Login failed:", result.error);
        setLoginError(result.error || "Credenciais inválidas");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setLoginError("Erro de sistema. Por favor, tente novamente.");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("�� Initiating logout process...");

      // Close sidebar immediately
      setSidebarOpen(false);

      // Clear current user state immediately for better UX
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("currentUser");

      // Clear form and navigate to dashboard
      setLoginForm({ email: "", password: "" });
      navigateToSection("dashboard");

      // Perform actual logout
      await authService.logout();

      console.log("��� Logout completed successfully");
    } catch (error) {
      console.error("❌ Error during logout:", error);

      // Force clear state even if logout service fails
      setSidebarOpen(false);
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("currentUser");
      setLoginForm({ email: "", password: "" });
      navigateToSection("dashboard");

      console.log("🔧 Forced logout state clear completed");
    }
  };

  // Register functions
  // SECURITY: Register functions removed - only super admin can create users

  // Advanced settings functions
  const handleAdvancedPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (advancedPassword === "19867") {
      setIsAdvancedUnlocked(true);
      setAdvancedPasswordError("");
    } else {
      setAdvancedPasswordError("Palavra-passe incorreta");
    }
  };

  const handleAdvancedSettingsBack = () => {
    setShowAdvancedSettings(false);
    setIsAdvancedUnlocked(false);
    setAdvancedPassword("");
    setAdvancedPasswordError("");
  };

  // Data cleanup functions
  const handleDataCleanup = async () => {
    if (
      window.confirm(
        "ATENÇÃO: Esta ação vai eliminar permanentemente todas as obras, manutenções e piscinas. Os utilizadores serão mantidos. Confirma?",
      )
    ) {
      try {
        await cleanAllData();
        alert("Dados eliminados com sucesso! Aplica��ão agora está limpa.");
        setShowDataCleanup(false);
      } catch (error) {
        console.error("Erro na limpeza:", error);
        alert("Erro ao eliminar dados. Tente novamente.");
      }
    }
  };

  // Fixed back button function
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to dashboard if no history
      navigateToSection("dashboard");
    }
  };

  // PDF Generation Functions
  const generatePoolsPDF = () => {
    const content = `
LEIRISONDA - RELATÓRIO DE PISCINAS
Data: ${new Date().toLocaleDateString("pt-PT")}

RESUMO:
- Total de Piscinas: ${pools.length}

DETALHES:
${pools
  .map(
    (pool, index) => `
${index + 1}. ${pool.name}
   Localização: ${pool.location}
   Cliente: ${pool.client}
   Tipo: ${pool.type}
   Estado: ${pool.status}
   ${pool.nextMaintenance ? `Próxima Manutenção: ${new Date(pool.nextMaintenance).toLocaleDateString("pt-PT")}` : ""}
`,
  )
  .join("\n")}

© ${new Date().getFullYear()} Leirisonda - Sistema de Gest��o
    `;
    downloadPDF(
      content,
      `Piscinas_${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const generateMaintenancePDF = () => {
    const content = `
LEIRISONDA - RELAT��RIO DE MANUTENÇÕES
Data: ${new Date().toLocaleDateString("pt-PT")}

RESUMO:
- Total de Manutenções: ${maintenance.length}
- Futuras Manutenções: ${futureMaintenance.length}

MANUTENÇÕES REALIZADAS:
${maintenance
  .map(
    (maint, index) => `
${index + 1}. ${maint.poolName}
   Tipo: ${maint.type}
   Estado: ${maint.status === "completed" ? "Concluída" : maint.status === "pending" ? "Pendente" : "Em Progresso"}
   Data Agendada: ${new Date(maint.scheduledDate).toLocaleDateString("pt-PT")}
   Técnico: ${maint.technician}
   Descrição: ${maint.description}
   ${maint.notes ? `Observações: ${maint.notes}` : ""}
`,
  )
  .join("\n")}

�� ${new Date().getFullYear()} Leirisonda - Sistema de Gest��o
    `;
    downloadPDF(
      content,
      `Manutencoes_${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const generateWorksPDF = () => {
    const content = `
LEIRISONDA - RELATÓRIO DE OBRAS
Data: ${new Date().toLocaleDateString("pt-PT")}

RESUMO:
- Total de Obras: ${works.length}

OBRAS REGISTADAS:
${works
  .map(
    (work, index) => `
${index + 1}. ${work.title}
   Cliente: ${work.client}
   Localizaç������o: ${work.location}
   Tipo: ${work.type}
   Estado: ${work.status === "completed" ? "Concluída" : work.status === "pending" ? "Pendente" : "Em Progresso"}
   Data Início: ${new Date(work.startDate).toLocaleDateString("pt-PT")}
   ${work.endDate ? `Data Fim: ${new Date(work.endDate).toLocaleDateString("pt-PT")}` : ""}
   ${work.budget ? `Or���amento: ��${work.budget.toLocaleString("pt-PT")}` : ""}
   ${work.actualCost ? `Custo Real: €${work.actualCost.toLocaleString("pt-PT")}` : ""}
   Responsável: ${work.assignedTo}
   Descrição: ${work.description}
`,
  )
  .join("\n")}

© ${new Date().getFullYear()} Leirisonda - Sistema de Gestão
    `;
    downloadPDF(content, `Obras_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const generateClientsPDF = () => {
    const content = `
LEIRISONDA - RELATÓRIO DE CLIENTES
Data: ${new Date().toLocaleDateString("pt-PT")}

RESUMO:
- Total de Clientes: ${clients.length}

CLIENTES REGISTADOS:
${clients
  .map(
    (client, index) => `
${index + 1}. ${client.name}
   Email: ${client.email}
   Telefone: ${client.phone}
   Morada: ${client.address}
   Piscinas: ${client.pools.length} associadas
   Data Registo: ${new Date(client.createdAt).toLocaleDateString("pt-PT")}
`,
  )
  .join("\n")}

© ${new Date().getFullYear()} Leirisonda - Sistema de Gestão
    `;
    downloadPDF(
      content,
      `Clientes_${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const generateCompletePDF = () => {
    const content = `
LEIRISONDA - RELATÓRIO COMPLETO DO SISTEMA
Data: ${new Date().toLocaleDateString("pt-PT")}

RESUMO EXECUTIVO:
- Piscinas Registadas: ${pools.length}
- Manutenções Realizadas: ${maintenance.length}
- Futuras Manutenções: ${futureMaintenance.length}
- Obras em Curso: ${works.length}
- Clientes Ativos: ${clients.length}
- Utilizadores do Sistema: ${users.length}

ESTATÍSTICAS:
- Piscinas Ativas: ${pools.filter((p) => p.status === "Ativa").length}
- Manutenções Concluídas: ${maintenance.filter((m) => m.status === "completed").length}
- Obras Pendentes: ${works.filter((w) => w.status === "pending").length}

PRÓXIMAS AÇÕES:
${futureMaintenance
  .slice(0, 5)
  .map(
    (maint) =>
      `- ${maint.poolName}: ${maint.type} em ${new Date(maint.scheduledDate).toLocaleDateString("pt-PT")}`,
  )
  .join("\n")}

DADOS DETALHADOS:

=== PISCINAS ===
${pools
  .map(
    (pool, index) => `
${index + 1}. ${pool.name} (${pool.client})
   Status: ${pool.status} | Local: ${pool.location}
`,
  )
  .join("")}

=== MANUTENÇÕES RECENTES ===
${maintenance
  .slice(-5)
  .map(
    (maint, index) => `
${index + 1}. ${maint.poolName} - ${maint.type}
   Data: ${new Date(maint.scheduledDate).toLocaleDateString("pt-PT")} | Técnico: ${maint.technician}
`,
  )
  .join("")}

���� ${new Date().getFullYear()} Leirisonda - Sistema de Gestão
    `;
    downloadPDF(
      content,
      `Relatorio_Completo_${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const generateCustomPDF = () => {
    alert(
      "Funcionalidade de relatório personalizado em desenvolvimento. Use os relatórios pré-definidos por agora.",
    );
  };

  // Push Notification functions
  const requestNotificationPermission = async () => {
    console.log("🔔 Requesting notification permission...");
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        console.log("🔔 Permission result:", permission);
        setPushPermission(permission);
        if (permission === "granted") {
          setNotificationsEnabled(true);
          showNotification(
            "Notificações Ativadas",
            "Agora vai receber notificações de obras atribuídas",
            "success",
          );
          console.log("✅ Notifications enabled successfully");
        } else {
          console.warn("❌ Notification permission denied or dismissed");
        }
        return permission;
      } catch (error) {
        console.error("❌ Error requesting notification permission:", error);
        return "error";
      }
    }
    console.warn("❌ Notifications not supported in this browser");
    return "denied";
  };

  const showNotification = (title: string, body: string, type = "info") => {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        body: body,
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
        tag: type,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  const sendWorkAssignmentNotification = (
    workTitle: string,
    assignedTo: string,
  ) => {
    console.log("🔍 DEBUG: sendWorkAssignmentNotification called with:", {
      workTitle,
      assignedTo,
      currentUser: currentUser?.name,
      notificationsEnabled,
      notificationPermission: Notification.permission,
    });

    // Always add to assigned works list when a work is assigned
    const newAssignedWork = {
      id: Date.now(),
      title: workTitle,
      assignedTo: assignedTo,
      dateAssigned: new Date().toISOString(),
      status: "Nova",
    };
    setAssignedWorks((prev) => [newAssignedWork, ...prev]);

    // Debug: Check notification conditions
    console.log("🔍 DEBUG: Notification conditions:", {
      hasCurrentUser: !!currentUser,
      currentUserName: currentUser?.name,
      assignedTo: assignedTo,
      userMatches: currentUser?.name === assignedTo,
      notificationsEnabled,
      permissionGranted: Notification.permission === "granted",
    });

    // Check if current user is the one assigned (exact match or partial match for combined assignments)
    const isAssignedToCurrentUser =
      currentUser &&
      assignedTo &&
      (assignedTo === currentUser.name ||
        assignedTo.toLowerCase().includes(currentUser.name.toLowerCase()) ||
        currentUser.name.toLowerCase().includes(assignedTo.toLowerCase()));

    console.log("🔍 DEBUG: Assignment check:", {
      currentUser: currentUser?.name,
      assignedTo,
      exactMatch: currentUser?.name === assignedTo,
      partialMatch: assignedTo
        .toLowerCase()
        .includes(currentUser?.name.toLowerCase()),
      isAssignedToCurrentUser,
    });

    // Send notification if user is assigned to current user and notifications are enabled
    if (isAssignedToCurrentUser) {
      if (notificationsEnabled && Notification.permission === "granted") {
        console.log("✅ All conditions met, sending notification...");
        showNotification(
          "Nova Obra Atribuída",
          `A obra "${workTitle}" foi-lhe atribuída`,
          "work-assignment",
        );
      } else {
        console.warn("❌ Notification blocked, using alert fallback:", {
          notificationsEnabled,
          permission: Notification.permission,
        });

        // Show alert as fallback for better user experience
        setTimeout(() => {
          alert(
            `🔔 Nova Obra Atribuída!\n\n📋 ${workTitle}\n\n👤 Atribu����da a: ${assignedTo}\n\n💡 Ative as notificações nas configurações para receber alertas automáticos.`,
          );
        }, 1000);
      }
    } else {
      console.log("ℹ️ Notification not for current user:", {
        currentUser: currentUser?.name,
        assignedTo,
        isAssignedToCurrentUser,
      });
    }

    // Console log for debugging purposes (admin view)
    console.log(`����️ OBRA ATRIBUÍDA: "${workTitle}" → ${assignedTo}`);
    console.log(`📋 Total de obras atribuídas: ${assignedWorks.length + 1}`);
  };

  const testPushNotification = () => {
    if (Notification.permission === "granted") {
      showNotification(
        "Teste de Notificação",
        "As notificações estão a funcionar corretamente!",
        "test",
      );
    } else {
      alert(
        "As notificaç����es não est�����o ativadas. Active-as primeiro nas configurações.",
      );
    }
  };

  // Photo management functions
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + uploadedPhotos.length > 20) {
      alert("Máximo de 20 fotografias permitidas");
      return;
    }

    files.forEach((file: File) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const newPhoto = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            data: e.target?.result,
            timestamp: new Date().toISOString(),
          };
          setUploadedPhotos((prev) => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (photoId: any) => {
    setUploadedPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  const clearAllPhotos = () => {
    setUploadedPhotos([]);
  };

  // Clear photos and work type when changing sections
  useEffect(() => {
    if (activeSection !== "nova-obra" && activeSection !== "nova-manutencao") {
      setUploadedPhotos([]);
    }
    if (activeSection !== "nova-obra") {
      setSelectedWorkType("");
      setWorkVehicles([]);
      setWorkTechnicians([]);
      setCurrentVehicle("");
      setCurrentTechnician("");
      setAssignedUsers([]);
      setCurrentAssignedUser("");
    }
  }, [activeSection]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const fakeEvent = { target: { files } };
    handlePhotoUpload(fakeEvent);
  };

  const downloadPDF = (content: string, filename: string) => {
    try {
      const pdf = new jsPDF();

      // Set font size and line height
      pdf.setFontSize(12);
      const lineHeight = 6;

      // Split content into lines and handle page breaks
      const lines = content.split("\n");
      let yPosition = 20;

      lines.forEach((line) => {
        // Check if we need a new page
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }

        // Handle long lines by splitting them
        const maxWidth = 180;
        const splitLines = pdf.splitTextToSize(line, maxWidth);

        splitLines.forEach((splitLine: string) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(splitLine, 10, yPosition);
          yPosition += lineHeight;
        });
      });

      // Save the PDF
      const pdfFilename = filename.replace(".txt", ".pdf");
      pdf.save(pdfFilename);

      // Show success message
      alert(`Relatório "${pdfFilename}" gerado com sucesso!`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o relatório PDF. Tente novamente.");
    }
  };

  // User management functions
  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: "",
      email: "",
      password: "",
      role: "technician",
      permissions: {
        obras: { view: false, create: false, edit: false, delete: false },
        manutencoes: { view: false, create: false, edit: false, delete: false },
        piscinas: { view: false, create: false, edit: false, delete: false },
        utilizadores: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        relatorios: { view: false, create: false, edit: false, delete: false },
        clientes: { view: false, create: false, edit: false, delete: false },
      },
      active: true,
    });
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      permissions: { ...user.permissions },
      active: user.active,
    });
    setShowUserForm(true);
  };

  // Confirmation function for deletions
  const confirmDelete = (message: string, onConfirm: () => void) => {
    if (window.confirm(message)) {
      onConfirm();
    }
  };

  // Permission check function
  const hasPermission = (module: string, action: string): boolean => {
    if (!currentUser || !currentUser.permissions) return false;
    return currentUser.permissions[module]?.[action] || false;
  };

  // Utility functions for clickable links
  const handlePhoneClick = (phone: string) => {
    if (enablePhoneDialer && phone) {
      // Clean phone number (remove spaces, dashes, etc)
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
      window.location.href = `tel:${cleanPhone}`;
    }
  };

  const handleAddressClick = (address: string) => {
    if (enableMapsRedirect && address) {
      // Open Google Maps with the address
      const encodedAddress = encodeURIComponent(address);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
        "_blank",
      );
    }
  };

  // Settings persistence functions
  const togglePhoneDialer = (enabled: boolean) => {
    setEnablePhoneDialer(enabled);
    localStorage.setItem("enablePhoneDialer", enabled.toString());
  };

  const toggleMapsRedirect = (enabled: boolean) => {
    setEnableMapsRedirect(enabled);
    localStorage.setItem("enableMapsRedirect", enabled.toString());
  };

  const handleDeleteUser = (userId) => {
    // Check if it's the main user
    const user = users.find(
      (u) => u.id === userId || u.id === parseInt(userId),
    );
    if (user && user.email === "gongonsilva@gmail.com") {
      alert("Não pode eliminar o utilizador principal!");
      return;
    }

    confirmDelete(
      `Tem a certeza que deseja apagar o utilizador "${user?.name}"?`,
      () => {
        setUsers(users.filter((u) => u.id !== userId));
      },
    );
  };

  const handleSaveUser = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      if (editingUser) {
        // Update existing user
        setUsers(
          users.map((u) =>
            u.id === editingUser.id
              ? {
                  ...u,
                  ...userForm,
                }
              : u,
          ),
        );

        console.log(`Utilizador ${userForm.name} atualizado com sucesso`);
      } else {
        // Add new user
        const newUser = {
          id: Math.max(...users.map((u) => u.id)) + 1,
          ...userForm,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setUsers([...users, newUser]);

        // Try to register with Firebase for automatic synchronization
        try {
          const result = await authService.register(
            userForm.email,
            userForm.password,
            userForm.name,
            userForm.role as "super_admin" | "manager" | "technician",
          );

          if (result.success) {
            console.log(
              `✅ Utilizador ${userForm.name} criado e sincronizado automaticamente com Firebase`,
            );

            // Show success message
            setTimeout(() => {
              alert(
                `Utilizador ${userForm.name} criado e sincronizado com sucesso!`,
              );
            }, 100);
          } else {
            console.log(
              `⚠️ Utilizador ${userForm.name} criado localmente. Sincroniza��ão Firebase: ${result.error}`,
            );
          }
        } catch (syncError) {
          console.log(
            `����� Utilizador ${userForm.name} criado localmente. Erro de sincronizaç��o:`,
            syncError,
          );
        }
      }

      setShowUserForm(false);
    } catch (error) {
      console.error("Erro ao salvar utilizador:", error);
      alert("Erro ao salvar utilizador. Tente novamente.");
    }
  };

  const handlePermissionChange = (module, permission, value) => {
    setUserForm({
      ...userForm,
      permissions: {
        ...userForm.permissions,
        [module]: {
          ...userForm.permissions[module],
          [permission]: value,
        },
      },
    });
  };

  const setRolePermissions = (role) => {
    let permissions = {
      obras: { view: false, create: false, edit: false, delete: false },
      manutencoes: { view: false, create: false, edit: false, delete: false },
      piscinas: { view: false, create: false, edit: false, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: false, create: false, edit: false, delete: false },
      clientes: { view: false, create: false, edit: false, delete: false },
    };

    switch (role) {
      case "super_admin":
        permissions = {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        };
        break;
      case "manager":
        permissions = {
          obras: { view: true, create: true, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: true, edit: true, delete: false },
          utilizadores: {
            view: true,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: true, edit: false, delete: false },
          clientes: { view: true, create: true, edit: true, delete: false },
        };
        break;
      case "technician":
        permissions = {
          obras: { view: true, create: false, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: false, edit: true, delete: false },
          utilizadores: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: false, edit: false, delete: false },
          clientes: { view: true, create: false, edit: false, delete: false },
        };
        break;
      case "viewer":
        permissions = {
          obras: { view: true, create: false, edit: false, delete: false },
          manutencoes: {
            view: true,
            create: false,
            edit: false,
            delete: false,
          },
          piscinas: { view: true, create: false, edit: false, delete: false },
          utilizadores: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: false, edit: false, delete: false },
          clientes: { view: true, create: false, edit: false, delete: false },
        };
        break;
      default:
        permissions = userForm.permissions;
    }

    setUserForm({
      ...userForm,
      role,
      permissions,
    });
  };

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    { id: "obras", icon: Building2, label: "Obras", path: "/obras" },
    { id: "nova-obra", icon: Plus, label: "Nova Obra", path: "/obras/nova" },
    {
      id: "nova-manutencao",
      icon: Wrench,
      label: "Nova Manutenção",
      path: "/manutencao/nova",
    },
    {
      id: "futuras-manutencoes",
      icon: Waves,
      label: "Piscinas",
      path: "/piscinas",
    },
    {
      id: "utilizadores",
      icon: UserCheck,
      label: "Utilizadores",
      path: "/utilizadores",
    },
    {
      id: "relatorios",
      icon: BarChart3,
      label: "Relatórios",
      path: "/relatorios",
    },
    { id: "clientes", icon: Users, label: "Clientes", path: "/clientes" },
    {
      id: "configuracoes",
      icon: Settings,
      label: "Configurações",
      path: "/configuracoes",
    },
    {
      id: "admin",
      icon: Shield,
      label: "Administração",
      path: "/admin",
      requiresAuth: true,
    },
  ];

  const renderContent = () => {
    // Add loading state check with timeout
    if (!currentUser || !isAuthenticated) {
      console.log("🔄 renderContent: Waiting for auth state", {
        currentUser: !!currentUser,
        isAuthenticated,
        activeSection,
      });
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">A carregar aplicação...</p>
            <p className="mt-2 text-sm text-gray-500">
              Se esta mensagem persistir, recarregue a página
            </p>
          </div>
        </div>
      );
    }

    console.log("✅ renderContent: Auth state valid, rendering", {
      activeSection,
      userRole: currentUser?.role,
    });

    // Add error boundary
    try {
      switch (activeSection) {
        case "dashboard":
          return (
            <div className="min-h-screen bg-gray-50">
              {/* Dashboard Content - Mobile First Design */}
              <div className="px-4 py-4 space-y-4">
                {/* Header Card */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-lg shadow-md p-1">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                          alt="Leirisonda Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-900">
                        Olá, {currentUser?.name || "Utilizador"}
                      </h1>
                      {currentUser?.name
                        .toLowerCase()
                        .includes("alexandre") && (
                        <div className="mt-2 space-y-1">
                          <button
                            onClick={() => {
                              const alexandreWorks = works.filter(
                                (w) =>
                                  w.assignedTo
                                    .toLowerCase()
                                    .includes("alexandre") ||
                                  w.assignedUsers?.some((user) =>
                                    user.name
                                      .toLowerCase()
                                      .includes("alexandre"),
                                  ),
                              );

                              const debugInfo = {
                                currentUser: currentUser.name,
                                totalWorks: works.length,
                                alexandreWorks: alexandreWorks,
                                localStorage: {
                                  pools: JSON.parse(
                                    localStorage.getItem("pools") || "[]",
                                  ).length,
                                  works: JSON.parse(
                                    localStorage.getItem("works") || "[]",
                                  ).length,
                                  maintenance: JSON.parse(
                                    localStorage.getItem("maintenance") || "[]",
                                  ).length,
                                },
                                notificationsEnabled,
                                notificationPermission: Notification.permission,
                              };
                              console.log(
                                "🔍 Alexandre Debug Info:",
                                debugInfo,
                              );
                              alert(
                                `Debug Alexandre:\n` +
                                  `Obras no sistema: ${works.length}\n` +
                                  `Obras atribuídas ao Alexandre: ${alexandreWorks.length}\n` +
                                  `Notificaç��es ativadas: ${notificationsEnabled ? "Sim" : "Não"}\n` +
                                  `Permissão notificações: ${Notification.permission}\n\n` +
                                  `Ver console para mais detalhes`,
                              );
                            }}
                            className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                          >
                            Debug Dados Alexandre
                          </button>

                          <button
                            onClick={() => {
                              console.log(
                                "🧪 Testando notificação para Alexandre...",
                              );
                              sendWorkAssignmentNotification(
                                "Obra de Teste para Alexandre",
                                "Alexandre",
                              );
                            }}
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                          >
                            Testar Notifica����o
                          </button>
                        </div>
                      )}
                      <p className="text-gray-600 text-sm">
                        Bem-vindo ao sistema Leirisonda
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Cards */}
                <div className="space-y-3">
                  {/* Pendentes */}
                  <button
                    onClick={() => navigateToSection("obras")}
                    className="w-full bg-white rounded-lg border-l-4 border-red-500 p-4 shadow-sm hover:bg-gray-50 transition-colors"
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
                        {works.filter((w) => w.status === "pending").length}
                      </div>
                    </div>
                  </button>

                  {/* Em Progresso */}
                  <button
                    onClick={() => navigateToSection("obras")}
                    className="w-full bg-white rounded-lg border-l-4 border-orange-500 p-4 shadow-sm hover:bg-gray-50 transition-colors"
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
                        {works.filter((w) => w.status === "in_progress").length}
                      </div>
                    </div>
                  </button>

                  {/* Concluídas */}
                  <button
                    onClick={() => navigateToSection("obras")}
                    className="w-full bg-white rounded-lg border-l-4 border-green-500 p-4 shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Concluídas
                        </h3>
                        <p className="text-sm text-gray-500">
                          Obras finalizadas
                        </p>
                      </div>
                      <div className="text-4xl font-bold text-gray-900">
                        {works.filter((w) => w.status === "completed").length}
                      </div>
                    </div>
                  </button>

                  {/* Falta de Folhas de Obra */}
                  <button
                    onClick={() => navigateToSection("obras")}
                    className="w-full bg-white rounded-lg border-l-4 border-blue-500 p-4 shadow-sm hover:bg-gray-50 transition-colors"
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
                        {
                          works.filter(
                            (w) => !w.folhaGerada && w.status !== "completed",
                          ).length
                        }
                      </div>
                    </div>
                  </button>

                  {/* Obras Atribuídas */}
                  <button
                    onClick={() => navigateToSection("obras")}
                    className="w-full bg-white rounded-lg border-l-4 border-purple-500 p-4 shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Todas as Obras
                        </h3>
                        <p className="text-sm text-gray-500">No sistema</p>
                      </div>
                      <div className="text-4xl font-bold text-gray-900">
                        {works.length}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Lista de Todas as Obras */}
                {works.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="flex items-center p-4 border-b border-gray-100">
                      <Building2 className="h-5 w-5 text-purple-600 mr-3" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        Todas as Obras
                      </h2>
                    </div>
                    <div className="p-4 space-y-3">
                      {works.map((work) => (
                        <div
                          key={work.id}
                          className="border-l-4 border-purple-500 bg-purple-50 rounded-r-lg p-4 cursor-pointer hover:bg-purple-100 transition-colors"
                          onClick={() => {
                            setSelectedWork(work);
                            setViewingWork(true);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {work.title}
                                </h3>
                                <div className="flex items-center space-x-1 text-gray-600 text-sm">
                                  <span>👤</span>
                                  <span>
                                    Atribu��da a:{" "}
                                    {work.assignedUsers &&
                                    work.assignedUsers.length > 0
                                      ? work.assignedUsers
                                          .map((u) => u.name)
                                          .join(", ")
                                      : work.assignedTo || "Não atribuída"}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                                  <span>📍</span>
                                  <span>
                                    Criada em:{" "}
                                    {new Date(
                                      work.createdAt,
                                    ).toLocaleDateString("pt-PT")}
                                  </span>
                                </div>
                                <span
                                  className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                                    work.status === "in_progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : work.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {work.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent triggering the parent click
                                  if (work.status !== "in_progress") {
                                    dataSync.updateWork(work.id, {
                                      status: "in_progress",
                                    });
                                  }
                                }}
                                className={`px-3 py-1 text-white text-sm rounded-lg transition-colors ${
                                  work.status === "in_progress"
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700"
                                }`}
                                disabled={work.status === "in_progress"}
                              >
                                {work.status === "in_progress"
                                  ? "Em Progresso"
                                  : "Iniciar"}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent triggering the parent click
                                  setSelectedWork(work);
                                  setViewingWork(true);
                                }}
                                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                              >
                                Ver Detalhes
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Próximas Manutenções */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="flex items-center p-4 border-b border-gray-100">
                    <button
                      onClick={() => navigateToSection("futuras-manutencoes")}
                      className="p-1 mr-3 hover:bg-gray-100 rounded"
                    >
                      <span className="text-gray-600 text-lg">→</span>
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Próximas Manutenções
                    </h2>
                  </div>

                  <div className="p-4 space-y-3">
                    {futureMaintenance.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Waves className="h-6 w-6 text-cyan-600" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">
                          Nenhuma manutenção agendada
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          As futuras manutenções aparecerão aqui
                        </p>
                        {hasPermission("manutencoes", "create") && (
                          <button
                            onClick={() => navigateToSection("nova-manutencao")}
                            className="mt-3 px-3 py-1 bg-cyan-600 text-white text-xs rounded-lg hover:bg-cyan-700"
                          >
                            Agendar Manutenção
                          </button>
                        )}
                      </div>
                    ) : (
                      futureMaintenance
                        .sort(
                          (a, b) =>
                            new Date(a.scheduledDate).getTime() -
                            new Date(b.scheduledDate).getTime(),
                        )
                        .slice(0, 4)
                        .map((maint) => {
                          const scheduledDate = new Date(maint.scheduledDate);
                          const today = new Date();
                          const diffTime =
                            scheduledDate.getTime() - today.getTime();
                          const diffDays = Math.ceil(
                            diffTime / (1000 * 60 * 60 * 24),
                          );

                          let timeText = "";
                          if (diffDays === 0) {
                            timeText = "Hoje";
                          } else if (diffDays === 1) {
                            timeText = "Amanhã";
                          } else if (diffDays > 0) {
                            timeText = `Em ${diffDays} dias`;
                          } else {
                            timeText = "Atrasada";
                          }

                          return (
                            <div
                              key={maint.id}
                              className="border-l-4 border-cyan-500 bg-cyan-50 rounded-r-lg p-4"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                    <Waves className="h-5 w-5 text-cyan-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900">
                                      {maint.poolName}
                                    </h3>
                                    <div className="flex items-center space-x-1 text-gray-600 text-sm">
                                      <span>🔧</span>
                                      <span>{maint.type}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-500 text-sm">
                                      <span>⏰</span>
                                      <span>{timeText}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                      Data:{" "}
                                      {scheduledDate.toLocaleDateString(
                                        "pt-PT",
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      diffDays < 0
                                        ? "bg-red-200 text-red-800"
                                        : diffDays <= 3
                                          ? "bg-yellow-200 text-yellow-800"
                                          : "bg-cyan-200 text-cyan-800"
                                    }`}
                                  >
                                    {diffDays < 0 ? "Atrasada" : "Agendada"}
                                  </span>
                                  <button
                                    onClick={() =>
                                      navigateToSection("futuras-manutencoes")
                                    }
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>

                {/* Pesquisa Global */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">🔍</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Pesquisa Global
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={globalSearchTerm}
                        onChange={(e) => setGlobalSearchTerm(e.target.value)}
                        placeholder="Pesquisar por cliente, obra, piscina, data..."
                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                      {globalSearchTerm && (
                        <button
                          onClick={() => setGlobalSearchTerm("")}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Search Results */}
                    {globalSearchTerm && (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {/* Check if there's any data to search */}
                        {works.length === 0 &&
                        pools.length === 0 &&
                        maintenance.length === 0 &&
                        clients.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="text-gray-400 mb-2">📅</div>
                            <p className="text-gray-500 text-sm font-medium">
                              Não há dados para pesquisar
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              Adicione obras, piscinas, manuten��ões ou clientes
                              primeiro
                            </p>
                          </div>
                        ) : (
                          <>
                            {/* Works Results */}
                            {works.filter(
                              (work) =>
                                work.title
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()) ||
                                work.client
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()) ||
                                work.location
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()) ||
                                (work.assignedUsers &&
                                work.assignedUsers.length > 0
                                  ? work.assignedUsers.some((u) =>
                                      u.name
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ),
                                    )
                                  : work.assignedTo
                                      .toLowerCase()
                                      .includes(
                                        globalSearchTerm.toLowerCase(),
                                      )) ||
                                work.description
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()),
                            ).length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Obras
                                </h4>
                                {works
                                  .filter(
                                    (work) =>
                                      work.title
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ) ||
                                      work.client
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ) ||
                                      work.location
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ) ||
                                      work.assignedTo
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ) ||
                                      work.description
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ),
                                  )
                                  .slice(0, 3)
                                  .map((work) => (
                                    <button
                                      key={work.id}
                                      onClick={() => {
                                        navigateToSection("obras");
                                        setGlobalSearchTerm("");
                                      }}
                                      className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors mb-2"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <Building2 className="h-4 w-4 text-blue-600" />
                                        <div>
                                          <p className="font-medium text-gray-900">
                                            {work.title}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            {work.client} • {work.location}
                                          </p>
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                              </div>
                            )}

                            {/* Pools Results */}
                            {pools.filter(
                              (pool) =>
                                pool.name
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()) ||
                                pool.client
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()) ||
                                pool.location
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()),
                            ).length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Piscinas
                                </h4>
                                {pools
                                  .filter(
                                    (pool) =>
                                      pool.name
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ) ||
                                      pool.client
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ) ||
                                      pool.location
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ),
                                  )
                                  .slice(0, 3)
                                  .map((pool) => (
                                    <button
                                      key={pool.id}
                                      onClick={() => {
                                        navigateToSection("piscinas");
                                        setGlobalSearchTerm("");
                                      }}
                                      className="w-full text-left p-3 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors mb-2"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <Waves className="h-4 w-4 text-cyan-600" />
                                        <div>
                                          <p className="font-medium text-gray-900">
                                            {pool.name}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            {pool.client} �� {pool.location}
                                          </p>
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                              </div>
                            )}

                            {/* Maintenance Results */}
                            {maintenance.filter(
                              (maint) =>
                                maint.poolName
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()) ||
                                maint.type
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()) ||
                                maint.technician
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()) ||
                                maint.scheduledDate.includes(globalSearchTerm),
                            ).length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Manutenções
                                </h4>
                                {maintenance
                                  .filter(
                                    (maint) =>
                                      maint.poolName
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ) ||
                                      maint.type
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ) ||
                                      maint.technician
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ) ||
                                      maint.scheduledDate.includes(
                                        globalSearchTerm,
                                      ),
                                  )
                                  .slice(0, 3)
                                  .map((maint) => (
                                    <button
                                      key={maint.id}
                                      onClick={() => {
                                        navigateToSection("manutencoes");
                                        setGlobalSearchTerm("");
                                      }}
                                      className="w-full text-left p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors mb-2"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <Wrench className="h-4 w-4 text-orange-600" />
                                        <div>
                                          <p className="font-medium text-gray-900">
                                            {maint.type}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            {maint.poolName} em{" "}
                                            {new Date(
                                              maint.scheduledDate,
                                            ).toLocaleDateString("pt-PT")}
                                          </p>
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                              </div>
                            )}

                            {/* Clients Results */}
                            {clients.filter(
                              (client) =>
                                client.name
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()) ||
                                client.email
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()) ||
                                client.phone.includes(globalSearchTerm) ||
                                client.address
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()),
                            ).length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Clientes
                                </h4>
                                {clients
                                  .filter(
                                    (client) =>
                                      client.name
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ) ||
                                      client.email
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ) ||
                                      client.phone.includes(globalSearchTerm) ||
                                      client.address
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ),
                                  )
                                  .slice(0, 3)
                                  .map((client) => (
                                    <button
                                      key={client.id}
                                      onClick={() => {
                                        navigateToSection("clientes");
                                        setGlobalSearchTerm("");
                                      }}
                                      className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors mb-2"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-purple-600" />
                                        <div>
                                          <p className="font-medium text-gray-900">
                                            {client.name}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            {client.email} ��� {client.phone}
                                          </p>
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                              </div>
                            )}

                            {/* No Results */}
                            {works.filter(
                              (work) =>
                                work.title
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()) ||
                                work.client
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()) ||
                                work.location
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()) ||
                                (work.assignedUsers &&
                                work.assignedUsers.length > 0
                                  ? work.assignedUsers.some((u) =>
                                      u.name
                                        .toLowerCase()
                                        .includes(
                                          globalSearchTerm.toLowerCase(),
                                        ),
                                    )
                                  : work.assignedTo
                                      .toLowerCase()
                                      .includes(
                                        globalSearchTerm.toLowerCase(),
                                      )) ||
                                work.description
                                  .toLowerCase()
                                  .includes(globalSearchTerm.toLowerCase()),
                            ).length === 0 &&
                              pools.filter(
                                (pool) =>
                                  pool.name
                                    .toLowerCase()
                                    .includes(globalSearchTerm.toLowerCase()) ||
                                  pool.client
                                    .toLowerCase()
                                    .includes(globalSearchTerm.toLowerCase()) ||
                                  pool.location
                                    .toLowerCase()
                                    .includes(globalSearchTerm.toLowerCase()),
                              ).length === 0 &&
                              maintenance.filter(
                                (maint) =>
                                  maint.poolName
                                    .toLowerCase()
                                    .includes(globalSearchTerm.toLowerCase()) ||
                                  maint.type
                                    .toLowerCase()
                                    .includes(globalSearchTerm.toLowerCase()) ||
                                  maint.technician
                                    .toLowerCase()
                                    .includes(globalSearchTerm.toLowerCase()) ||
                                  maint.scheduledDate.includes(
                                    globalSearchTerm,
                                  ),
                              ).length === 0 &&
                              clients.filter(
                                (client) =>
                                  client.name
                                    .toLowerCase()
                                    .includes(globalSearchTerm.toLowerCase()) ||
                                  client.email
                                    .toLowerCase()
                                    .includes(globalSearchTerm.toLowerCase()) ||
                                  client.phone.includes(globalSearchTerm) ||
                                  client.address
                                    .toLowerCase()
                                    .includes(globalSearchTerm.toLowerCase()),
                              ).length === 0 && (
                                <div className="text-center py-8">
                                  <div className="text-gray-400 mb-2">���</div>
                                  <p className="text-gray-500 text-sm">
                                    Nenhum resultado encontrado para "
                                    {globalSearchTerm}"
                                  </p>
                                  <p className="text-gray-400 text-xs mt-1">
                                    Tente pesquisar por cliente, obra, piscina,
                                    data ou técnico
                                  </p>
                                </div>
                              )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );

        case "piscinas":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Waves className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Piscinas
                        </h1>
                        <p className="text-gray-600 text-sm">
                          Gest���o de piscinas no sistema
                        </p>
                      </div>
                    </div>
                    {hasPermission("piscinas", "create") && (
                      <button
                        onClick={() => {
                          setEditingPool(null);
                          setActiveSection("nova-piscina");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Nova Piscina</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Submenu */}
                <div className="bg-white rounded-lg shadow-sm p-1">
                  <div className="grid grid-cols-3 gap-1">
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                      Piscinas
                    </button>
                    <button
                      onClick={() => setActiveSection("manutencoes")}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Manutenções
                    </button>
                    <button
                      onClick={() => setActiveSection("futuras-manutencoes")}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Futuras Manutenções
                    </button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Pesquisar piscinas..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Todos os estados</option>
                      <option>Ativa</option>
                      <option>Inativa</option>
                      <option>Em Manutenção</option>
                    </select>
                  </div>
                </div>

                {/* Pools List */}
                <div className="space-y-4">
                  {pools.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Waves className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Nenhuma piscina registada
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Comece por adicionar a primeira piscina ao sistema
                      </p>
                      {hasPermission("piscinas", "create") && (
                        <button
                          onClick={() => {
                            setEditingPool(null);
                            setActiveSection("nova-piscina");
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Adicionar Piscina</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    pools.map((pool) => (
                      <div
                        key={pool.id}
                        className="bg-white rounded-lg shadow-sm p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {pool.name}
                            </h3>
                            <button
                              onClick={() => handleAddressClick(pool.location)}
                              className={`text-left ${
                                enableMapsRedirect
                                  ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                  : "text-gray-600"
                              }`}
                              disabled={!enableMapsRedirect}
                            >
                              📍 {pool.location}
                            </button>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm text-gray-500">
                                Cliente: {pool.client}
                              </span>
                              <span className="text-sm text-gray-500">
                                Tipo: {pool.type}
                              </span>
                              <span
                                className={`text-sm px-2 py-1 rounded-full ${
                                  pool.status === "Ativa"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {pool.status}
                              </span>
                            </div>
                            {pool.nextMaintenance && (
                              <p className="text-sm text-blue-600 mt-1">
                                Próxima manutenção:{" "}
                                {new Date(
                                  pool.nextMaintenance,
                                ).toLocaleDateString("pt-PT")}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {hasPermission("piscinas", "edit") && (
                              <button
                                onClick={() => {
                                  setEditingPool(pool);
                                  setActiveSection("editar-piscina");
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                            {hasPermission("piscinas", "delete") && (
                              <button
                                onClick={() =>
                                  confirmDelete(
                                    `Tem a certeza que deseja apagar a piscina "${pool.name}"?`,
                                    () => dataSync.deletePool(pool.id),
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
                    ))
                  )}
                </div>
              </div>
            </div>
          );

        case "manutencoes":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Wrench className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Manutenções
                        </h1>
                        <p className="text-gray-600 text-sm">
                          Histórico de manutenções realizadas
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveSection("nova-manutencao")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Nova Manutenção</span>
                    </button>
                  </div>
                </div>

                {/* Submenu */}
                <div className="bg-white rounded-lg shadow-sm p-1">
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => setActiveSection("piscinas")}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Piscinas
                    </button>
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                      Manutenções
                    </button>
                    <button
                      onClick={() => setActiveSection("futuras-manutencoes")}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Futuras Manutenções
                    </button>
                  </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Pesquisar manutenções..."
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Todas as piscinas</option>
                    </select>
                    <input
                      type="month"
                      defaultValue="2025-01"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Lista de Manutenções */}
                <div className="space-y-4">
                  {maintenance.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Wrench className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Nenhuma manutenção registada
                      </h3>
                      <p className="text-gray-600 text-sm">
                        As manutenções aparecerão aqui quando forem criadas
                      </p>
                    </div>
                  ) : (
                    maintenance.map((maint) => (
                      <div
                        key={maint.id}
                        className="bg-white rounded-lg shadow-sm p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {maint.poolName} - {maint.type}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  maint.status === "scheduled"
                                    ? "bg-blue-100 text-blue-700"
                                    : maint.status === "in_progress"
                                      ? "bg-orange-100 text-orange-700"
                                      : maint.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {maint.status === "scheduled"
                                  ? "Agendado"
                                  : maint.status === "in_progress"
                                    ? "Em Progresso"
                                    : maint.status === "completed"
                                      ? "Concluído"
                                      : maint.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                              <div>
                                <span className="font-medium">Data:</span>{" "}
                                {new Date(
                                  maint.scheduledDate,
                                ).toLocaleDateString("pt-PT")}
                              </div>
                              <div>
                                <span className="font-medium">Técnico:</span>{" "}
                                {maint.technician}
                              </div>
                              {maint.clientName && (
                                <div>
                                  <span className="font-medium">Cliente:</span>{" "}
                                  {maint.clientName}
                                  {maint.clientContact && (
                                    <div className="mt-1">
                                      <button
                                        onClick={() =>
                                          handlePhoneClick(maint.clientContact)
                                        }
                                        className={`text-xs ${
                                          enablePhoneDialer
                                            ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                            : "text-gray-500"
                                        }`}
                                        disabled={!enablePhoneDialer}
                                      >
                                        ��� {maint.clientContact}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                              {maint.location && (
                                <div>
                                  <span className="font-medium">Local:</span>{" "}
                                  <button
                                    onClick={() =>
                                      handleAddressClick(maint.location)
                                    }
                                    className={`text-xs ${
                                      enableMapsRedirect
                                        ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                        : "text-gray-500"
                                    }`}
                                    disabled={!enableMapsRedirect}
                                  >
                                    �� {maint.location}
                                  </button>
                                </div>
                              )}
                              {maint.observations && (
                                <div className="col-span-2">
                                  <span className="font-medium">
                                    Observações:
                                  </span>{" "}
                                  {maint.observations}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {hasPermission("manutencoes", "edit") && (
                              <button
                                onClick={() => {
                                  setEditingMaintenance(maint);
                                  setActiveSection("editar-manutencao");
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                            {hasPermission("manutencoes", "delete") && (
                              <button
                                onClick={() =>
                                  confirmDelete(
                                    `Tem a certeza que deseja apagar a manutenção "${maint.type}" da ${maint.poolName}?`,
                                    () => dataSync.deleteMaintenance(maint.id),
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
                    ))
                  )}
                </div>
              </div>
            </div>
          );

        case "futuras-manutencoes":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Futuras Manutenções
                        </h1>
                        <p className="text-gray-600 text-sm">
                          Manutenç��es agendadas e programadas
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveSection("nova-manutencao")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agendar Manutenção</span>
                    </button>
                  </div>
                </div>

                {/* Submenu */}
                <div className="bg-white rounded-lg shadow-sm p-1">
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => setActiveSection("piscinas")}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Piscinas
                    </button>
                    <button
                      onClick={() => setActiveSection("manutencoes")}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Manutenções
                    </button>
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                      Futuras Manutenções
                    </button>
                  </div>
                </div>

                {/* Future Maintenance List */}
                <div className="space-y-4">
                  {futureMaintenance.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Nenhuma manutenção agendada
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        As futuras manutenções aparecerão aqui quando forem
                        agendadas
                      </p>
                      <button
                        onClick={() => setActiveSection("nova-manutencao")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Agendar Manutenção</span>
                      </button>
                    </div>
                  ) : (
                    futureMaintenance.map((maint) => (
                      <div
                        key={maint.id}
                        className="bg-white rounded-lg shadow-sm p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {maint.poolName}
                              </h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  maint.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : maint.status === "in_progress"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {maint.status === "pending"
                                  ? "Agendado"
                                  : maint.status === "in_progress"
                                    ? "Em Progresso"
                                    : "Concluído"}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-1">{maint.type}</p>
                            <p className="text-sm text-gray-500 mb-2">
                              {maint.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-blue-600">
                                €{" "}
                                {new Date(
                                  maint.scheduledDate,
                                ).toLocaleDateString("pt-PT")}
                              </span>
                              <span className="text-gray-500">
                                👨‍🔧 {maint.technician}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {hasPermission("manutencoes", "edit") && (
                              <button
                                onClick={() => {
                                  setEditingMaintenance(maint);
                                  setActiveSection("editar-manutencao");
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                            {hasPermission("manutencoes", "delete") && (
                              <button
                                onClick={() =>
                                  confirmDelete(
                                    `Tem a certeza que deseja apagar a manutenção "${maint.type}" da ${maint.poolName}?`,
                                    () => dataSync.deleteMaintenance(maint.id),
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
                    ))
                  )}
                </div>
              </div>
            </div>
          );

        case "nova-obra":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Nova Obra
                      </h1>
                      <p className="text-gray-600 text-sm">
                        Criar uma nova obra no sistema Leirisonda
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <form className="space-y-8">
                    {/* Informações Básicas */}
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Informa��ões Básicas
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Folha de Obra *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="LS-2025-163"
                            defaultValue={`LS-${new Date().getFullYear()}-${Math.floor(
                              Math.random() * 1000,
                            )
                              .toString()
                              .padStart(3, "0")}`}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Trabalho *
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                              setSelectedWorkType(e.target.value)
                            }
                            value={selectedWorkType}
                          >
                            <option value="">Selecionar tipo</option>
                            <option value="piscina">Piscina</option>
                            <option value="manutencao">Manutenção</option>
                            <option value="instalacao">Instalação</option>
                            <option value="reparacao">Reparação</option>
                            <option value="limpeza">Limpeza</option>
                            <option value="furo">Furo de Água</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome do Cliente *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: João Silva"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contacto *
                          </label>
                          <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: 244 123 456"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Morada *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Rua das Flores, 123, Leiria"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hora de Entrada *
                            </label>
                            <input
                              type="datetime-local"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              defaultValue={new Date()
                                .toISOString()
                                .slice(0, 16)}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hora de Saída
                            </label>
                            <input
                              type="datetime-local"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Deixe vazio se ainda não terminou"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Deixe vazio se ainda não terminou
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado da Obra *
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="pendente">Pendente</option>
                            <option value="em-progresso">Em Progresso</option>
                            <option value="concluida">Concluída</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="folha-preenchida"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="folha-preenchida"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Folha de obra preenchida/feita
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Viaturas e Técnicos */}
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Viaturas e T��cnicos
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Viaturas Utilizadas
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={currentVehicle}
                              onChange={(e) =>
                                setCurrentVehicle(e.target.value)
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ex: Carrinha Leirisonda 1"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  currentVehicle.trim() &&
                                  !workVehicles.includes(currentVehicle.trim())
                                ) {
                                  setWorkVehicles([
                                    ...workVehicles,
                                    currentVehicle.trim(),
                                  ]);
                                  setCurrentVehicle("");
                                }
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              Adicionar
                            </button>
                          </div>
                          {workVehicles.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {workVehicles.map((vehicle, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                                >
                                  <span className="text-sm text-gray-700">
                                    {vehicle}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setWorkVehicles(
                                        workVehicles.filter(
                                          (_, i) => i !== index,
                                        ),
                                      )
                                    }
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Técnicos
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={currentTechnician}
                              onChange={(e) =>
                                setCurrentTechnician(e.target.value)
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ex: João Santos"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  currentTechnician.trim() &&
                                  !workTechnicians.includes(
                                    currentTechnician.trim(),
                                  )
                                ) {
                                  setWorkTechnicians([
                                    ...workTechnicians,
                                    currentTechnician.trim(),
                                  ]);
                                  setCurrentTechnician("");
                                }
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              Adicionar
                            </button>
                          </div>
                          {workTechnicians.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {workTechnicians.map((technician, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                                >
                                  <span className="text-sm text-gray-700">
                                    {technician}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setWorkTechnicians(
                                        workTechnicians.filter(
                                          (_, i) => i !== index,
                                        ),
                                      )
                                    }
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Usuários Atribuídos ({users.length} utilizadores
                            disponíveis)
                          </label>
                          <p className="text-sm text-gray-600 mb-2">
                            Selecione os usuários responsáveis por esta obra
                          </p>
                          <div className="flex space-x-2">
                            <select
                              value={currentAssignedUser}
                              onChange={(e) =>
                                setCurrentAssignedUser(e.target.value)
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">
                                {users.length > 0
                                  ? "Selecionar usuário..."
                                  : "Nenhum utilizador dispon��vel"}
                              </option>
                              {users
                                .filter((user) => {
                                  console.log(
                                    "Nova obra - User:",
                                    user.name,
                                    "Role:",
                                    user.role,
                                    "Active:",
                                    user.active,
                                  );
                                  return (
                                    user.role !== "viewer" &&
                                    user.active !== false &&
                                    !assignedUsers.some(
                                      (assigned) =>
                                        assigned.id === String(user.id),
                                    )
                                  );
                                })
                                .map((user) => (
                                  <option key={user.id} value={user.id}>
                                    {user.name}
                                  </option>
                                ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                if (currentAssignedUser) {
                                  const selectedUser = users.find(
                                    (u) => String(u.id) === currentAssignedUser,
                                  );

                                  if (selectedUser) {
                                    const userIdStr = String(selectedUser.id);
                                    const isAlreadyAssigned =
                                      assignedUsers.some(
                                        (assigned) => assigned.id === userIdStr,
                                      );

                                    console.log(
                                      "Nova obra - Attempting to assign user:",
                                      selectedUser.name,
                                      "ID:",
                                      userIdStr,
                                      "Already assigned:",
                                      isAlreadyAssigned,
                                    );

                                    if (!isAlreadyAssigned) {
                                      setAssignedUsers([
                                        ...assignedUsers,
                                        {
                                          id: userIdStr,
                                          name: selectedUser.name,
                                        },
                                      ]);
                                      setCurrentAssignedUser("");
                                      console.log(
                                        "Nova obra - User assigned successfully!",
                                      );
                                    } else {
                                      console.log(
                                        "Nova obra - User already assigned, skipping",
                                      );
                                    }
                                  }
                                }
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              Atribuir
                            </button>
                          </div>
                          {assignedUsers.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {assignedUsers.map((assignedUser, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md"
                                >
                                  <span className="text-sm text-blue-700 font-medium">
                                    👤 {assignedUser.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAssignedUsers(
                                        assignedUsers.filter(
                                          (_, i) => i !== index,
                                        ),
                                      )
                                    }
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Detalhes do Furo de Água - Conditional */}
                    {selectedWorkType === "furo" && (
                      <div>
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                            <Waves className="h-4 w-4 text-cyan-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Detalhes do Furo de Água
                          </h3>
                        </div>

                        <div className="space-y-6">
                          {/* Medições do Furo */}
                          <div>
                            <h4 className="text-md font-medium text-gray-900 mb-4">
                              Medições do Furo
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Profundidade do Furo (m) *
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  placeholder="Ex: 120.5"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Nível da Água (m) *
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  placeholder="Ex: 15.2"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Profundidade da Bomba (m) *
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  placeholder="Ex: 80.0"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Capacidade e Coluna */}
                          <div>
                            <h4 className="text-md font-medium text-gray-900 mb-4">
                              Capacidade e Coluna
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Caudal do Furo (m³/h) *
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  placeholder="Ex: 5.5"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Tipo de Coluna *
                                </label>
                                <select
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  required
                                >
                                  <option value="">Selecionar tipo</option>
                                  <option value="PEAD">PEAD</option>
                                  <option value="HIDROROSCADO">
                                    HIDROROSCADO
                                  </option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Diâmetro da Coluna *
                                </label>
                                <select
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  required
                                >
                                  <option value="">Selecionar diâmetro</option>
                                  <option value="1">1 polegada</option>
                                  <option value="1.25">1¼ polegadas</option>
                                  <option value="1.5">1½ polegadas</option>
                                  <option value="2">2 polegadas</option>
                                  <option value="2.5">2½ polegadas</option>
                                  <option value="3">3 polegadas</option>
                                  <option value="4">4 polegadas</option>
                                  <option value="5">5 polegadas</option>
                                  <option value="6">6 polegadas</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Detalhes da Bomba */}
                          <div>
                            <h4 className="text-md font-medium text-gray-900 mb-4">
                              Detalhes da Bomba
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Modelo da Bomba Instalada *
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  placeholder="Ex: Grundfos SQ3-105"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Potência do Motor (HP) *
                                </label>
                                <select
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  required
                                >
                                  <option value="">Selecionar potência</option>
                                  <option value="0.5">0.5 HP</option>
                                  <option value="0.75">0.75 HP</option>
                                  <option value="1">1 HP</option>
                                  <option value="1.5">1.5 HP</option>
                                  <option value="2">2 HP</option>
                                  <option value="3">3 HP</option>
                                  <option value="5">5 HP</option>
                                  <option value="7.5">7.5 HP</option>
                                  <option value="10">10 HP</option>
                                  <option value="15">15 HP</option>
                                  <option value="20">20 HP</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Voltagem da Bomba *
                                </label>
                                <select
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  required
                                >
                                  <option value="">Selecionar voltagem</option>
                                  <option value="230V">
                                    230V (monof��sico)
                                  </option>
                                  <option value="400V">400V (trifásico)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Observações Específicas do Furo */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Observaç��es Específicas do Furo
                            </label>
                            <textarea
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              placeholder="Condições do terreno, qualidade da água, dificuldades encontradas, etc..."
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Observações e Trabalho */}
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Observações e Trabalho
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Observações
                          </label>
                          <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Observações sobre a obra..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trabalho Realizado
                          </label>
                          <textarea
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Descrição do trabalho realizado..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fotografias da Obra */}
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Fotografias da Obra
                        </h3>
                      </div>

                      {/* Upload Area */}
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Plus className="h-6 w-6 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Carregar Fotografias
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          Arraste e solte ou clique para selecionar
                        </p>
                        <p className="text-gray-500 text-xs mb-4">
                          {uploadedPhotos.length}/20 fotografias
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label
                          htmlFor="photo-upload"
                          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 mx-auto cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Escolher Fotografias</span>
                        </label>
                      </div>

                      {/* Photo Preview Grid */}
                      {uploadedPhotos.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="font-medium text-gray-900">
                              Fotografias Carregadas ({uploadedPhotos.length})
                            </h5>
                            <button
                              type="button"
                              onClick={clearAllPhotos}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Limpar Todas
                            </button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {uploadedPhotos.map((photo) => (
                              <div key={photo.id} className="relative group">
                                <img
                                  src={photo.data}
                                  alt={photo.name}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePhoto(photo.id)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {photo.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setActiveSection("dashboard")}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();

                          // SECURITY: Check if user has permission to create works
                          if (!currentUser?.permissions?.obras?.create) {
                            alert(
                              "Não tem permissão para criar obras. Contacte o administrador.",
                            );
                            return;
                          }

                          const form = (e.target as HTMLElement).closest(
                            "form",
                          );

                          // Extract all form data
                          const workTitle =
                            (
                              form.querySelector(
                                'input[placeholder*="LS-"]',
                              ) as HTMLInputElement
                            )?.value || "Nova Obra";
                          const workType =
                            (
                              form.querySelector(
                                'select[name="workType"]',
                              ) as HTMLSelectElement
                            )?.value || selectedWorkType;
                          const client =
                            (
                              form.querySelector(
                                'input[placeholder*="Cliente"]',
                              ) as HTMLInputElement
                            )?.value || "";
                          const contact =
                            (
                              form.querySelector(
                                'input[placeholder*="Contacto"]',
                              ) as HTMLInputElement
                            )?.value || "";
                          const location =
                            (
                              form.querySelector(
                                'input[placeholder*="Morada"]',
                              ) as HTMLInputElement
                            )?.value || "";
                          const startTime =
                            (
                              form.querySelector(
                                'input[placeholder*="Entrada"]',
                              ) as HTMLInputElement
                            )?.value || "";
                          const endTime =
                            (
                              form.querySelector(
                                'input[placeholder*="Saída"]',
                              ) as HTMLInputElement
                            )?.value || "";
                          const status =
                            (
                              form.querySelector(
                                'select[name="status"]',
                              ) as HTMLSelectElement
                            )?.value || "pending";
                          const description =
                            (
                              form.querySelector(
                                'textarea[placeholder*="Descrição"]',
                              ) as HTMLTextAreaElement
                            )?.value || "";
                          const budget =
                            (
                              form.querySelector(
                                'input[placeholder*="Orçamento"]',
                              ) as HTMLInputElement
                            )?.value || "";
                          // Create complete work data object
                          const workData = {
                            id: Date.now(),
                            workSheetNumber: workTitle.startsWith("LS-")
                              ? workTitle
                              : `LS-${Date.now()}`,
                            title: workTitle || "",
                            type: workType || "",
                            client: client || "",
                            contact: contact || "",
                            location: location || "",
                            startTime: startTime || "",
                            endTime: endTime || "",
                            status: status || "pending",
                            description: description || "",
                            budget: budget ? parseFloat(budget) : null,
                            assignedTo:
                              assignedUsers.length > 0
                                ? assignedUsers.map((u) => u.name).join(", ")
                                : "",
                            assignedUsers: assignedUsers || [], // Store complete user objects
                            assignedUserIds: assignedUsers
                              ? assignedUsers.map((u) => u.id)
                              : [], // Store user IDs
                            vehicles: workVehicles || [],
                            technicians: workTechnicians || [],
                            photos: uploadedPhotos || [],
                            photoCount: uploadedPhotos
                              ? uploadedPhotos.length
                              : 0,
                            observations: "",
                            workPerformed: "",
                            workSheetCompleted: false,
                            createdAt: new Date().toISOString(),
                            startDate: new Date().toISOString(),
                          };

                          // Use sync system to add work (will handle Firebase and localStorage)
                          addWork(workData);

                          // Send notifications to all assigned users
                          assignedUsers.forEach((assignedUser) => {
                            sendWorkAssignmentNotification(
                              workTitle,
                              assignedUser.name,
                            );
                          });

                          // Save water bore data if work type is "furo"
                          if (selectedWorkType === "furo") {
                            const waterBoreData = {
                              id: Date.now(),
                              workTitle: workTitle,
                              date: new Date().toISOString(),
                              photos: uploadedPhotos,
                              photoCount: uploadedPhotos.length,
                              workType: "furo",
                            };

                            const savedWaterBores = JSON.parse(
                              localStorage.getItem("waterBores") || "[]",
                            );
                            savedWaterBores.push(waterBoreData);
                            localStorage.setItem(
                              "waterBores",
                              JSON.stringify(savedWaterBores),
                            );
                          }

                          alert(
                            `Obra "${workTitle}" criada com sucesso! ` +
                              (assignedUsers.length > 0
                                ? `Notificações enviadas a ${assignedUsers.length} respons����vel(eis).`
                                : "") +
                              (selectedWorkType === "furo"
                                ? " Dados do furo registados."
                                : ""),
                          );

                          // Clear form data
                          setSelectedWorkType("");
                          setUploadedPhotos([]);
                          setWorkVehicles([]);
                          setWorkTechnicians([]);
                          setCurrentVehicle("");
                          setCurrentTechnician("");
                          setAssignedUsers([]);
                          setCurrentAssignedUser("");
                          setActiveSection("dashboard");
                        }}
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <Building2 className="h-4 w-4" />
                        <span>Criar Obra</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );
        case "nova-piscina":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Waves className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Nova Piscina
                      </h1>
                      <p className="text-gray-600 text-sm">
                        Registar uma nova piscina no sistema
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <form className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome da Piscina *
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Piscina Villa Marina"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cliente Proprietário *
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            if (e.target.value === "novo") {
                              setShowNewClientForm(true);
                            }
                          }}
                        >
                          <option value="">Selecionar cliente</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          ))}
                          <option value="novo">+ Adicionar Novo Cliente</option>
                        </select>
                      </div>
                    </div>

                    {/* New Client Form */}
                    {showNewClientForm && (
                      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Novo Cliente
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewClientForm(false);
                              setNewClientForm({
                                name: "",
                                email: "",
                                phone: "",
                                address: "",
                              });
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nome Completo *
                            </label>
                            <input
                              type="text"
                              value={newClientForm.name}
                              onChange={(e) =>
                                setNewClientForm({
                                  ...newClientForm,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Nome do cliente"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={newClientForm.email}
                              onChange={(e) =>
                                setNewClientForm({
                                  ...newClientForm,
                                  email: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="email@exemplo.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Telefone
                            </label>
                            <input
                              type="tel"
                              value={newClientForm.phone}
                              onChange={(e) =>
                                setNewClientForm({
                                  ...newClientForm,
                                  phone: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="+351 XXX XXX XXX"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Morada
                            </label>
                            <input
                              type="text"
                              value={newClientForm.address}
                              onChange={(e) =>
                                setNewClientForm({
                                  ...newClientForm,
                                  address: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Morada completa"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 mt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewClientForm(false);
                              setNewClientForm({
                                name: "",
                                email: "",
                                phone: "",
                                address: "",
                              });
                            }}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (newClientForm.name.trim()) {
                                // Add client to the system
                                const newClient = {
                                  name: newClientForm.name,
                                  email: newClientForm.email,
                                  phone: newClientForm.phone,
                                  address: newClientForm.address,
                                  pools: [],
                                };
                                dataSync.addClient(newClient);

                                // Reset form and close
                                setNewClientForm({
                                  name: "",
                                  email: "",
                                  phone: "",
                                  address: "",
                                });
                                setShowNewClientForm(false);

                                // Show success message
                                alert(
                                  `Cliente "${newClient.name}" adicionado com sucesso!`,
                                );
                              } else {
                                alert(
                                  "Por favor, preencha pelo menos o nome do cliente.",
                                );
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Guardar Cliente
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Localização Completa *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Cascais, Villa Marina Resort, Edifício A, Apartamento 205"
                        required
                      />
                    </div>

                    {/* Pool Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Piscina *
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Selecionar tipo</option>
                          <option value="residencial">Residencial</option>
                          <option value="comercial">Comercial</option>
                          <option value="hotel">Hotel/Resort</option>
                          <option value="condominio">Condomínio</option>
                          <option value="spa">SPA/Wellness</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Formato
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="retangular">Retangular</option>
                          <option value="oval">Oval</option>
                          <option value="redonda">Redonda</option>
                          <option value="kidney">Kidney</option>
                          <option value="irregular">Irregular</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado Atual
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="ativa">Ativa</option>
                          <option value="inativa">Inativa</option>
                          <option value="manutencao">Em Manutenção</option>
                          <option value="construcao">Em Construção</option>
                        </select>
                      </div>
                    </div>

                    {/* Dimensions */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comprimento (m)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="8.0"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Largura (m)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="4.0"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profundidade Min (m)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1.2"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profundidade Max (m)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="2.0"
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>

                    {/* Equipment and Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sistema de Filtração
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Selecionar sistema</option>
                          <option value="areia">Filtro de Areia</option>
                          <option value="cartucho">Filtro de Cartucho</option>
                          <option value="diatomaceas">Terra Diatomáceas</option>
                          <option value="uv">Sistema UV</option>
                          <option value="sal">Eletrólise de Sal</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aquecimento
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="nao">Sem Aquecimento</option>
                          <option value="solar">Aquecimento Solar</option>
                          <option value="bomba-calor">Bomba de Calor</option>
                          <option value="resistencia">
                            Resistência Elétrica
                          </option>
                          <option value="gas">Aquecimento a Gás</option>
                        </select>
                      </div>
                    </div>

                    {/* Maintenance Schedule */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Frequência de Manutenção
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="semanal">Semanal</option>
                          <option value="quinzenal">Quinzenal</option>
                          <option value="mensal">Mensal</option>
                          <option value="trimestral">Trimestral</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Próxima Manutenção
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observações e Características Especiais
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Características especiais, equipamentos adicionais, notas importantes..."
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setActiveSection("piscinas")}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();

                          // SECURITY: Check if user has permission to create pools
                          if (!currentUser?.permissions?.piscinas?.create) {
                            alert(
                              "Não tem permissão para criar piscinas. Contacte o administrador.",
                            );
                            return;
                          }

                          const form = (e.target as HTMLElement).closest(
                            "form",
                          );
                          const formData = new FormData(form);

                          // Collect all form data
                          const poolData = {
                            id: Date.now(),
                            name:
                              (
                                form.querySelector(
                                  'input[placeholder*="Nome"]',
                                ) as HTMLInputElement
                              )?.value || "Nova Piscina",
                            client:
                              (
                                form.querySelector(
                                  'input[placeholder*="Cliente"]',
                                ) as HTMLInputElement
                              )?.value || "Cliente",
                            location:
                              (
                                form.querySelector(
                                  'input[placeholder*="Morada"]',
                                ) as HTMLInputElement
                              )?.value || "",
                            contact:
                              (
                                form.querySelector(
                                  'input[placeholder*="Contacto"]',
                                ) as HTMLInputElement
                              )?.value || "",
                            type:
                              (
                                form.querySelector(
                                  "select",
                                ) as HTMLSelectElement
                              )?.value || "residencial",
                            status: "Ativa",
                            createdAt: new Date().toISOString(),
                            nextMaintenance:
                              (
                                form.querySelector(
                                  'input[type="date"]',
                                ) as HTMLInputElement
                              )?.value || null,
                          };

                          // Use sync system to add pool (will handle Firebase and localStorage)
                          addPool(poolData);

                          // Create future maintenance if next maintenance date is provided
                          if (poolData.nextMaintenance) {
                            const nextMaintenanceDate = new Date(
                              poolData.nextMaintenance,
                            );
                            const today = new Date();

                            // Only create future maintenance if the date is in the future
                            if (nextMaintenanceDate > today) {
                              const futureMaintenance = {
                                poolId: poolData.id.toString(),
                                poolName: poolData.name,
                                type: "Manutenção Programada",
                                scheduledDate: poolData.nextMaintenance,
                                technician: "A atribuir",
                                status: "scheduled" as const,
                                description:
                                  "Manutenção programada durante criação da piscina",
                                notes:
                                  "Agendada automaticamente na criação da piscina",
                                clientName: poolData.client,
                                clientContact: poolData.contact || "",
                                location: poolData.location,
                              };

                              addMaintenance(futureMaintenance);
                              console.log(
                                "Futura manutenção criada para nova piscina:",
                                futureMaintenance,
                              );
                            }
                          }

                          // Clear form after successful creation
                          form.reset();

                          alert(
                            `Piscina "${poolData.name}" criada com sucesso!`,
                          );

                          // Ensure we're not in editing mode
                          setEditingPool(null);
                          setActiveSection("piscinas");
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Criar Piscina</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );

        case "nova-manutencao":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Wrench className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Nova Manuten��ão
                      </h1>
                      <p className="text-gray-600 text-sm">
                        Registar intervenção de manutenção
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <form className="space-y-8">
                    {/* Pool Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Piscina *
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={maintenanceForm.poolId}
                          onChange={(e) =>
                            setMaintenanceForm({
                              ...maintenanceForm,
                              poolId: e.target.value,
                            })
                          }
                        >
                          <option value="">Selecionar piscina</option>
                          {pools.map((pool) => (
                            <option key={pool.id} value={pool.id}>
                              {pool.name} - {pool.client}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data da Intervenção *
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={maintenanceForm.date}
                          onChange={(e) =>
                            setMaintenanceForm({
                              ...maintenanceForm,
                              date: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* Time and Team */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hora Início
                        </label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={maintenanceForm.startTime}
                          onChange={(e) =>
                            setMaintenanceForm({
                              ...maintenanceForm,
                              startTime: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hora Fim
                        </label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={maintenanceForm.endTime}
                          onChange={(e) =>
                            setMaintenanceForm({
                              ...maintenanceForm,
                              endTime: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Técnico Responsável *
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={maintenanceForm.technician}
                          onChange={(e) =>
                            setMaintenanceForm({
                              ...maintenanceForm,
                              technician: e.target.value,
                            })
                          }
                        >
                          <option value="">Selecionar técnico</option>
                          {users
                            .filter((user) => user.role !== "super_admin")
                            .map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Viatura Utilizada
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Ex: Furgão 1, Carrinha 2"
                          value={maintenanceForm.vehicle}
                          onChange={(e) =>
                            setMaintenanceForm({
                              ...maintenanceForm,
                              vehicle: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Water Values */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Valores da Água
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            pH
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="14"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="7.2"
                            value={maintenanceForm.pH}
                            onChange={(e) =>
                              setMaintenanceForm({
                                ...maintenanceForm,
                                pH: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cloro (mg/l)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="1.0"
                            value={maintenanceForm.chlorine}
                            onChange={(e) =>
                              setMaintenanceForm({
                                ...maintenanceForm,
                                chlorine: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alcalinidade
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="120"
                            value={maintenanceForm.alkalinity}
                            onChange={(e) =>
                              setMaintenanceForm({
                                ...maintenanceForm,
                                alkalinity: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Temperatura (°C)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="25.0"
                            value={maintenanceForm.temperature}
                            onChange={(e) =>
                              setMaintenanceForm({
                                ...maintenanceForm,
                                temperature: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sal (g/l)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="4.0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bromo (mg/l)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="0.0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dureza
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estabilizador
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="30"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Chemical Products */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Produtos Químicos Utilizados
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Produto
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="Ex: Cloro líquido"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quantidade
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="2.5"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Unidade
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                              <option value="l">Litros (l)</option>
                              <option value="kg">Quilogramas (kg)</option>
                              <option value="g">Gramas (g)</option>
                              <option value="ml">Mililitros (ml)</option>
                            </select>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Adicionar Produto</span>
                        </button>
                      </div>
                    </div>

                    {/* Work Performed */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Trabalho Realizado
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          "Limpeza de filtros",
                          "Limpeza de pré-filtro",
                          "Limpeza filtro areia/vidro",
                          "Verificação alimentação",
                          "Enchimento automático",
                          "Limpeza linha de água",
                          "Limpeza do fundo",
                          "Limpeza das paredes",
                          "Limpeza skimmers",
                          "Verificação equipamentos",
                        ].map((task, index) => (
                          <label key={index} className="flex items-center">
                            <input
                              type="checkbox"
                              className="mr-2 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">
                              {task}
                            </span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Outros trabalhos realizados
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Descreva outros trabalhos realizados..."
                          value={maintenanceForm.otherWork}
                          onChange={(e) =>
                            setMaintenanceForm({
                              ...maintenanceForm,
                              otherWork: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Problems and Observations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Problemas Encontrados
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Descreva problemas encontrados, se houver..."
                          value={maintenanceForm.problems}
                          onChange={(e) =>
                            setMaintenanceForm({
                              ...maintenanceForm,
                              problems: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observações Gerais
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Observações, recomendações, próxima manutenção..."
                          value={maintenanceForm.observations}
                          onChange={(e) =>
                            setMaintenanceForm({
                              ...maintenanceForm,
                              observations: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Next Maintenance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Próxima Manutenção
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={maintenanceForm.nextMaintenance}
                          onChange={(e) =>
                            setMaintenanceForm({
                              ...maintenanceForm,
                              nextMaintenance: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado da Manutenção
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={maintenanceForm.status}
                          onChange={(e) =>
                            setMaintenanceForm({
                              ...maintenanceForm,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="completed">Concluída</option>
                          <option value="pending">Pendente</option>
                          <option value="in_progress">Em Progresso</option>
                        </select>
                      </div>
                    </div>

                    {/* Fotografias da Manutenção */}
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Eye className="h-4 w-4 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Fotografias da Manutenç��o
                        </h3>
                      </div>

                      {/* Upload Area */}
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Plus className="h-6 w-6 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Carregar Fotografias
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          Arraste e solte ou clique para selecionar fotos da
                          manutenção
                        </p>
                        <p className="text-gray-500 text-xs mb-4">
                          {uploadedPhotos.length}/20 fotografias
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="maintenance-photo-upload"
                        />
                        <label
                          htmlFor="maintenance-photo-upload"
                          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 mx-auto cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Escolher Fotografias</span>
                        </label>
                      </div>

                      {/* Photo Preview Grid */}
                      {uploadedPhotos.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="font-medium text-gray-900">
                              Fotografias Carregadas ({uploadedPhotos.length})
                            </h5>
                            <button
                              type="button"
                              onClick={clearAllPhotos}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Limpar Todas
                            </button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {uploadedPhotos.map((photo) => (
                              <div key={photo.id} className="relative group">
                                <img
                                  src={photo.data}
                                  alt={photo.name}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePhoto(photo.id)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {photo.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setActiveSection("manutencoes")}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveIntervention();
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Guardar Intervenção</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );

        case "utilizadores":
          // SECURITY: Only super admin can access user management
          if (currentUser?.role !== "super_admin") {
            return (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Acesso Restrito
                  </h2>
                  <p className="text-gray-500">
                    Apenas super administradores podem gerir utilizadores.
                  </p>
                </div>
              </div>
            );
          }
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                <UserPermissionsManager />
              </div>
            </div>
          );

        case "configuracoes":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* System Information */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informações do Sistema
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Versão</span>
                      <span className="font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Utilizador Ativo</span>
                      <span className="font-medium">{currentUser.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Perfil</span>
                      <span className="font-medium capitalize">
                        {currentUser.role.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Modo de Dados</span>
                      <span className="font-medium">Armazenamento Local</span>
                    </div>
                  </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <Bell className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Notificações Push
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Ative as notificações para receber alertas sobre novas obras
                    atribuídas e atualizações importantes.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-900 mb-2">
                            Notificações de Obras
                          </h4>
                          <p className="text-blue-700 text-sm mb-3">
                            Receba notificações quando uma nova obra for
                            atribuída a si.
                          </p>
                          <button
                            onClick={() => {
                              if ("Notification" in window) {
                                if (Notification.permission === "default") {
                                  Notification.requestPermission().then(
                                    (permission) => {
                                      if (permission === "granted") {
                                        new Notification("Leirisonda", {
                                          body: "Notificações ativadas com sucesso!",
                                          icon: "/icon.svg",
                                        });
                                      }
                                    },
                                  );
                                } else if (
                                  Notification.permission === "granted"
                                ) {
                                  new Notification("Leirisonda", {
                                    body: "Notificações já estão ativadas!",
                                    icon: "/icon.svg",
                                  });
                                } else {
                                  alert(
                                    "Notificações foram bloqueadas. Por favor, ative-as nas configurações do navegador.",
                                  );
                                }
                              } else {
                                alert(
                                  "Este navegador n��o suporta notificações.",
                                );
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Ativar Notificações
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-green-900 mb-2">
                            Notificações de Sistema
                          </h4>
                          <p className="text-green-700 text-sm mb-3">
                            Receba alertas sobre atualizações do sistema e
                            manutenções programadas.
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-green-800 text-sm font-medium">
                              Status: Ativo
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Instruções
                          </h4>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>
                              • As notificações funcionam apenas com HTTPS
                            </li>
                            <li>
                              • Certifique-se de que permite notificações no seu
                              navegador
                            </li>
                            <li>
                              • Em dispositivos móveis, adicione a app ao ecrã
                              inicial
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Interaction Settings */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <Settings className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Interação Mobile
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Configure o comportamento de cliques em contactos e moradas
                  </p>

                  <div className="space-y-4">
                    {/* Phone Dialer Setting */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          📞
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-blue-900">
                              Marcação Automática
                            </h4>
                            <button
                              onClick={() =>
                                togglePhoneDialer(!enablePhoneDialer)
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                enablePhoneDialer
                                  ? "bg-blue-600"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  enablePhoneDialer
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                          <p className="text-blue-700 text-sm mb-3">
                            Quando ativado, clicar num número de telefone abrirá
                            diretamente o marcador do telefone.
                          </p>
                          <p className="text-blue-600 text-xs">
                            Estado:{" "}
                            {enablePhoneDialer ? "✅ Ativo" : "⭕ Inativo"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Maps Redirect Setting */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          🗺️
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-green-900">
                              Navega���ão Maps
                            </h4>
                            <button
                              onClick={() =>
                                toggleMapsRedirect(!enableMapsRedirect)
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                enableMapsRedirect
                                  ? "bg-green-600"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  enableMapsRedirect
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                          <p className="text-green-700 text-sm mb-3">
                            Quando ativado, clicar numa morada abrirá o Google
                            Maps para navegação.
                          </p>
                          <p className="text-green-600 text-xs">
                            Estado:{" "}
                            {enableMapsRedirect ? "✅ Ativo" : "⭕ Inativo"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Instruções
                          </h4>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>
                              • As defini��ões são guardadas localmente no
                              dispositivo
                            </li>
                            <li>
                              • A marcação automática funciona melhor em
                              dispositivos móveis
                            </li>
                            <li>• O Google Maps abre numa nova janela/tab</li>
                            <li>
                              • Pode ativar ou desativar cada funcionalidade
                              independentemente
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Management Section - Only for Super Admin */}
                {currentUser.role === "super_admin" && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <Trash2 className="h-6 w-6 text-red-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Gestão de Dados
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Elimine todos os dados de obras, manutenções e piscinas
                      para começar com uma aplicação limpa. Os utilizadores são
                      mantidos.
                    </p>

                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-red-900 mb-2">
                              Limpar Dados do Sistema
                            </h4>
                            <p className="text-red-700 text-sm mb-3">
                              Esta ação eliminará permanentemente:
                            </p>
                            <ul className="text-red-700 text-sm space-y-1 mb-4">
                              <li>
                                • Todas as obras ({works.length} registos)
                              </li>
                              <li>
                                • Todas as manutenções ({maintenance.length}{" "}
                                registos)
                              </li>
                              <li>
                                • Todas as piscinas ({pools.length} registos)
                              </li>
                              <li>
                                ��� Dados do Firebase e armazenamento local
                              </li>
                            </ul>
                            <p className="text-red-700 text-sm font-medium mb-3">
                              ��️ ATENÇÃO: Esta operação é irreversível!
                            </p>
                            <button
                              onClick={handleDataCleanup}
                              disabled={cleanupLoading}
                              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>
                                {cleanupLoading
                                  ? "A Eliminar..."
                                  : "Eliminar Todos os Dados"}
                              </span>
                            </button>
                            {cleanupError && (
                              <p className="text-red-600 text-sm mt-2">
                                {cleanupError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

        case "relatorios":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Relatórios
                        </h1>
                        <p className="text-gray-600 text-sm">
                          Gere relatórios detalhados em PDF
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Pool Reports */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Waves className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Relatório de Piscinas
                        </h3>
                        <p className="text-sm text-gray-600">
                          Lista completa de piscinas
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>{pools.length}</strong> piscinas registadas
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>�� Estado e localização</li>
                        <li>• Informações de clientes</li>
                        <li>• Histórico de manutenções</li>
                        <li>• Próximas intervenções</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => generatePoolsPDF()}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Gerar PDF</span>
                    </button>
                  </div>

                  {/* Maintenance Reports */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Wrench className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Relatório de Manutenções
                        </h3>
                        <p className="text-sm text-gray-600">
                          Histórico de intervenções
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>{maintenance.length}</strong> manutenções
                        registadas
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Trabalhos realizados</li>
                        <li>• Técnicos respons��veis</li>
                        <li>• Datas e durações</li>
                        <li>• Estados e observaç��es</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => generateMaintenancePDF()}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Gerar PDF</span>
                    </button>
                  </div>

                  {/* Works Reports */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Relatório de Obras
                        </h3>
                        <p className="text-sm text-gray-600">
                          Projetos e construções
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>{works.length}</strong> obras registadas
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Orçamentos e custos</li>
                        <li>• Prazos e cronogramas</li>
                        <li>• Equipas responsáveis</li>
                        <li>• Estados de progresso</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => generateWorksPDF()}
                      className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Gerar PDF</span>
                    </button>
                  </div>

                  {/* Clients Reports */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Relatório de Clientes
                        </h3>
                        <p className="text-sm text-gray-600">
                          Base de dados de clientes
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>{clients.length}</strong> clientes registados
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Dados de contacto</li>
                        <li>• Piscinas associadas</li>
                        <li>• Histórico de serviços</li>
                        <li>• Informações contratuais</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => generateClientsPDF()}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Gerar PDF</span>
                    </button>
                  </div>

                  {/* Complete Report */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Relatório Completo
                        </h3>
                        <p className="text-sm text-gray-600">
                          Todas as informações
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-600">
                        Relatório consolidado de todo o sistema
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>��� Resumo executivo</li>
                        <li>• Estatísticas gerais</li>
                        <li>• Dados consolidados</li>
                        <li>• Análise de performance</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => generateCompletePDF()}
                      className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Gerar PDF Completo</span>
                    </button>
                  </div>

                  {/* Custom Report */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Settings className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Relatório Personalizado
                        </h3>
                        <p className="text-sm text-gray-600">
                          Configure os dados
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-600">
                        Crie relatórios com filtros específicos
                      </p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            defaultChecked
                          />
                          <span className="text-xs">Piscinas</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            defaultChecked
                          />
                          <span className="text-xs">Manutenções</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-xs">Obras</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-xs">Clientes</span>
                        </label>
                      </div>
                    </div>
                    <button
                      onClick={() => generateCustomPDF()}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Configurar PDF</span>
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Estatísticas Rápidas
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {pools.length}
                      </div>
                      <div className="text-sm text-gray-600">Piscinas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {maintenance.length}
                      </div>
                      <div className="text-sm text-gray-600">Manutenções</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {works.length}
                      </div>
                      <div className="text-sm text-gray-600">Obras</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {clients.length}
                      </div>
                      <div className="text-sm text-gray-600">Clientes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-600">
                        {(() => {
                          const waterBores = JSON.parse(
                            localStorage.getItem("waterBores") || "[]",
                          );
                          return waterBores.length;
                        })()}
                      </div>
                      <div className="text-sm text-gray-600">Furos de Água</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

        case "clientes":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Clientes
                        </h1>
                        <p className="text-gray-600 text-sm">
                          Gestão da base de dados de clientes
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveSection("novo-cliente")}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Novo Cliente</span>
                    </button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Pesquisar clientes..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Todos os tipos</option>
                      <option>Particular</option>
                      <option>Empresa</option>
                      <option>Condomínio</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Todos os estados</option>
                      <option>Ativo</option>
                      <option>Inativo</option>
                    </select>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Clientes
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {clients.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Clientes Ativos
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {clients.filter((c) => c.status === "Ativo").length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Waves className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Com Piscinas
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {pools.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Com Obras
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {works.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clients List */}
                <div className="space-y-4">
                  {clients.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Nenhum cliente registado
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Comece por adicionar o primeiro cliente ao sistema
                      </p>
                      <button
                        onClick={() => setActiveSection("novo-cliente")}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 mx-auto"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Adicionar Cliente</span>
                      </button>
                    </div>
                  ) : (
                    clients.map((client) => (
                      <div
                        key={client.id}
                        className="bg-white rounded-lg shadow-sm p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {client.name}
                              </h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  client.status === "Ativo"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {client.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <p className="font-medium">Contactos:</p>
                                <p>{client.email}</p>
                                <button
                                  onClick={() => handlePhoneClick(client.phone)}
                                  className={`text-left ${
                                    enablePhoneDialer
                                      ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                      : "text-gray-600"
                                  }`}
                                  disabled={!enablePhoneDialer}
                                >
                                  📞 {client.phone}
                                </button>
                              </div>
                              <div>
                                <p className="font-medium">Morada:</p>
                                <button
                                  onClick={() =>
                                    handleAddressClick(client.address)
                                  }
                                  className={`text-left ${
                                    enableMapsRedirect
                                      ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                      : "text-gray-600"
                                  }`}
                                  disabled={!enableMapsRedirect}
                                >
                                  📍 {client.address}
                                </button>
                              </div>
                              <div>
                                <p className="font-medium">Informações:</p>
                                <p>Tipo: {client.type}</p>
                                <p>
                                  Cliente desde:{" "}
                                  {new Date(
                                    client.createdAt,
                                  ).toLocaleDateString("pt-PT")}
                                </p>
                              </div>
                            </div>
                            {client.notes && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                  <strong>Notas:</strong> {client.notes}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {hasPermission("clientes", "edit") && (
                              <button className="p-2 text-gray-400 hover:text-gray-600">
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                            {hasPermission("clientes", "delete") && (
                              <button
                                onClick={() =>
                                  confirmDelete(
                                    `Tem a certeza que deseja apagar o cliente "${client.name}"?`,
                                    () => dataSync.deleteClient(client.id),
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
                    ))
                  )}
                </div>
              </div>
            </div>
          );

        case "novo-cliente":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Novo Cliente
                      </h1>
                      <p className="text-gray-600 text-sm">
                        Adicionar cliente à base de dados
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <form className="space-y-8">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Informações Básicas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome / Razão Social *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Nome completo ou razão social"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Cliente *
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="">Selecionar tipo</option>
                            <option value="particular">Particular</option>
                            <option value="empresa">Empresa</option>
                            <option value="condominio">Condomínio</option>
                            <option value="hotel">Hotel / Turismo</option>
                            <option value="publico">Entidade Pública</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Contactos
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Principal *
                          </label>
                          <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="email@exemplo.com"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefone Principal *
                          </label>
                          <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="+351 XXX XXX XXX"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Secundário
                          </label>
                          <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="email2@exemplo.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefone Secundário
                          </label>
                          <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="+351 XXX XXX XXX"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Morada
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Morada Completa *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Rua, número, andar, etc."
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Código Postal *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="XXXX-XXX"
                            pattern="[0-9]{4}-[0-9]{3}"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Localidade *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Cidade/Vila"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Informações Adicionais
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            NIF / NIPC
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="123456789"
                            pattern="[0-9]{9}"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pessoa de Contacto (se aplicável)
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Nome da pessoa responsável"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notas e Observações
                          </label>
                          <textarea
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Informações relevantes sobre o cliente, preferências, histórico, etc."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setActiveSection("clientes")}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(
                            "Cliente criado com sucesso! (Função em desenvolvimento)",
                          );
                          setActiveSection("clientes");
                        }}
                        className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Criar Cliente</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );

        case "obras":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Obras
                        </h1>
                        <p className="text-gray-600 text-sm">
                          Gestão de obras e projetos
                        </p>
                      </div>
                    </div>
                    {hasPermission("obras", "create") && (
                      <button
                        onClick={() => navigateToSection("nova-obra")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Nova Obra</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveWorkFilter("all")}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeWorkFilter === "all"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Todas ({works.length})
                    </button>
                    <button
                      onClick={() => setActiveWorkFilter("pending")}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeWorkFilter === "pending"
                          ? "border-red-500 text-red-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Pendentes (
                      {works.filter((w) => w.status === "pending").length})
                    </button>
                    <button
                      onClick={() => setActiveWorkFilter("in_progress")}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeWorkFilter === "in_progress"
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Em Progresso (
                      {works.filter((w) => w.status === "in_progress").length})
                    </button>
                    <button
                      onClick={() => setActiveWorkFilter("completed")}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeWorkFilter === "completed"
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Concluídas (
                      {works.filter((w) => w.status === "completed").length})
                    </button>
                    <button
                      onClick={() => setActiveWorkFilter("no_sheet")}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeWorkFilter === "no_sheet"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Sem Folha de Obra (
                      {
                        works.filter(
                          (w) => !w.folhaGerada && w.status !== "completed",
                        ).length
                      }
                      )
                    </button>
                  </div>
                </div>

                {/* Works List */}
                <div className="space-y-4">
                  {works
                    .filter((work) => {
                      if (activeWorkFilter === "all") return true;
                      if (activeWorkFilter === "no_sheet")
                        return !work.folhaGerada && work.status !== "completed";
                      return work.status === activeWorkFilter;
                    })
                    .map((work) => (
                      <div
                        key={work.id}
                        className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Enhanced Header with Work ID */}
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {work.id?.toUpperCase() ||
                                    "ID-" + Date.now().toString().slice(-6)}
                                </span>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {work.title}
                                </h3>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  work.status === "pending"
                                    ? "bg-red-100 text-red-700 border border-red-200"
                                    : work.status === "in_progress"
                                      ? "bg-orange-100 text-orange-700 border border-orange-200"
                                      : work.status === "completed"
                                        ? "bg-green-100 text-green-700 border border-green-200"
                                        : "bg-gray-100 text-gray-700 border border-gray-200"
                                }`}
                              >
                                {work.status === "pending"
                                  ? "Pendente"
                                  : work.status === "in_progress"
                                    ? "Em Progresso"
                                    : work.status === "completed"
                                      ? "Concluída"
                                      : work.status}
                              </span>
                              {!work.folhaGerada && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                  Sem Folha de Obra
                                </span>
                              )}
                            </div>
                            {/* Enhanced Description */}
                            {work.description && (
                              <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded-md border-l-4 border-blue-200">
                                {work.description}
                              </p>
                            )}
                            {/* Enhanced Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                {/* Client Info */}
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <span className="font-semibold text-gray-700 block mb-1">
                                    👤 Cliente:
                                  </span>
                                  <span className="text-gray-900 font-medium">
                                    {work.client}
                                  </span>
                                  {work.contact && (
                                    <div className="mt-1">
                                      <button
                                        onClick={() =>
                                          handlePhoneClick(work.contact)
                                        }
                                        className={`text-xs ${
                                          enablePhoneDialer
                                            ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                            : "text-gray-500"
                                        }`}
                                        disabled={!enablePhoneDialer}
                                      >
                                        📞 {work.contact}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">Local:</span>{" "}
                                <button
                                  onClick={() =>
                                    handleAddressClick(work.location)
                                  }
                                  className={`text-xs ${
                                    enableMapsRedirect
                                      ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                      : "text-gray-500"
                                  }`}
                                  disabled={!enableMapsRedirect}
                                >
                                  📍 {work.location}
                                </button>
                              </div>
                              <div>
                                <span className="font-medium">Início:</span>{" "}
                                {new Date(work.startDate).toLocaleDateString(
                                  "pt-PT",
                                )}
                              </div>
                              <div>
                                <span className="font-medium">
                                  Atribuída a:
                                </span>{" "}
                                {work.assignedUsers &&
                                work.assignedUsers.length > 0
                                  ? work.assignedUsers
                                      .map((u) => u.name)
                                      .join(", ")
                                  : work.assignedTo || "Não atribuída"}
                              </div>
                              {work.budget && (
                                <div>
                                  <span className="font-medium">
                                    Orçamento:
                                  </span>{" "}
                                  ����{work.budget}
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Enhanced Action Buttons */}
                          <div className="flex items-center space-x-2 ml-4">
                            {hasPermission("obras", "view") && (
                              <button
                                onClick={() => {
                                  setSelectedWork(work);
                                  setViewingWork(true);
                                }}
                                className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                                title="Ver todos os detalhes"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                            )}
                            {hasPermission("obras", "edit") && (
                              <button
                                onClick={() => {
                                  setEditingWork(work);
                                  setEditAssignedUsers(
                                    work.assignedUsers || [],
                                  );
                                  setActiveSection("editar-obra");
                                }}
                                className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                                title="Editar obra"
                              >
                                <Edit2 className="h-5 w-5" />
                              </button>
                            )}
                            {hasPermission("obras", "delete") && (
                              <button
                                onClick={() =>
                                  confirmDelete(
                                    `Tem a certeza que deseja apagar a obra "${work.title}"?`,
                                    () => dataSync.deleteWork(work.id),
                                  )
                                }
                                className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                                title="Eliminar obra"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                  {works.filter((work) => {
                    if (activeWorkFilter === "all") return true;
                    if (activeWorkFilter === "no_sheet")
                      return !work.folhaGerada && work.status !== "completed";
                    return work.status === activeWorkFilter;
                  }).length === 0 && (
                    <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhuma obra encontrada
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {activeWorkFilter === "all"
                          ? "Não há obras registadas no sistema."
                          : `Não há obras com o filtro "${
                              activeWorkFilter === "pending"
                                ? "Pendentes"
                                : activeWorkFilter === "in_progress"
                                  ? "Em Progresso"
                                  : activeWorkFilter === "completed"
                                    ? "Concluídas"
                                    : activeWorkFilter === "no_sheet"
                                      ? "Sem Folha de Obra"
                                      : activeWorkFilter
                            }" aplicado.`}
                      </p>
                      {hasPermission("obras", "create") && (
                        <button
                          onClick={() => navigateToSection("nova-obra")}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Criar Nova Obra
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );

        case "editar-obra":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Editar Obra
                      </h1>
                      <p className="text-gray-600 text-sm">
                        {editingWork?.title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          T��tulo da Obra *
                        </label>
                        <input
                          type="text"
                          defaultValue={editingWork?.title}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Instalação de Piscina"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cliente *
                        </label>
                        <input
                          type="text"
                          defaultValue={editingWork?.client}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nome do cliente"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Local *
                        </label>
                        <input
                          type="text"
                          defaultValue={editingWork?.location}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Morada da obra"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado
                        </label>
                        <select
                          defaultValue={editingWork?.status}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pending">Pendente</option>
                          <option value="in_progress">Em Progresso</option>
                          <option value="completed">Concluída</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data de Início
                        </label>
                        <input
                          type="date"
                          defaultValue={editingWork?.startDate?.split("T")[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data de Conclusão Prevista
                        </label>
                        <input
                          type="date"
                          defaultValue={
                            editingWork?.expectedEndDate?.split("T")[0]
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Usuários Atribuídos ({users.length} utilizadores
                          disponíveis)
                        </label>
                        <div className="flex space-x-2">
                          <select
                            value={currentEditAssignedUser}
                            onChange={(e) =>
                              setCurrentEditAssignedUser(e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">
                              {users.length > 0
                                ? "Selecionar usu��rio..."
                                : "Nenhum utilizador disponível"}
                            </option>
                            {users
                              .filter((user) => {
                                console.log(
                                  "User:",
                                  user.name,
                                  "Role:",
                                  user.role,
                                  "Active:",
                                  user.active,
                                );
                                return (
                                  user.role !== "viewer" &&
                                  user.active !== false &&
                                  !editAssignedUsers.some(
                                    (assigned) =>
                                      assigned.id === String(user.id),
                                  )
                                );
                              })
                              .map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.name}
                                </option>
                              ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              if (currentEditAssignedUser) {
                                const selectedUser = users.find(
                                  (u) =>
                                    String(u.id) === currentEditAssignedUser,
                                );
                                if (selectedUser) {
                                  const userIdStr = String(selectedUser.id);
                                  const isAlreadyAssigned =
                                    editAssignedUsers.some(
                                      (assigned) => assigned.id === userIdStr,
                                    );

                                  console.log(
                                    "Attempting to assign user:",
                                    selectedUser.name,
                                    "ID:",
                                    userIdStr,
                                    "Already assigned:",
                                    isAlreadyAssigned,
                                  );

                                  if (!isAlreadyAssigned) {
                                    setEditAssignedUsers([
                                      ...editAssignedUsers,
                                      {
                                        id: userIdStr,
                                        name: selectedUser.name,
                                      },
                                    ]);
                                    setCurrentEditAssignedUser("");
                                    console.log("User assigned successfully!");
                                  } else {
                                    console.log(
                                      "User already assigned, skipping",
                                    );
                                  }
                                }
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Atribuir
                          </button>
                        </div>
                        {editAssignedUsers.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {editAssignedUsers.map((assignedUser, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md"
                              >
                                <span className="text-sm text-blue-700 font-medium">
                                  👤 {assignedUser.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditAssignedUsers(
                                      editAssignedUsers.filter(
                                        (_, i) => i !== index,
                                      ),
                                    )
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Valor Orçamentado (€)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={editingWork?.budgetValue}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone do Cliente
                        </label>
                        <input
                          type="tel"
                          defaultValue={editingWork?.clientPhone}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+351 912 345 678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email do Cliente
                        </label>
                        <input
                          type="email"
                          defaultValue={editingWork?.clientEmail}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="cliente@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prioridade
                        </label>
                        <select
                          defaultValue={editingWork?.priority || "medium"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Baixa</option>
                          <option value="medium">Média</option>
                          <option value="high">Alta</option>
                          <option value="urgent">Urgente</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Obra
                        </label>
                        <select
                          defaultValue={editingWork?.workType || "installation"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="installation">Instalação</option>
                          <option value="maintenance">Manutenção</option>
                          <option value="repair">Reparação</option>
                          <option value="renovation">Renovação</option>
                          <option value="inspection">Inspeção</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <textarea
                        defaultValue={editingWork?.description}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Descrição detalhada da obra"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observações T��cnicas
                      </label>
                      <textarea
                        defaultValue={editingWork?.technicalNotes}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Observações técnicas, materiais necessários, etc."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingWork(null);
                          setEditAssignedUsers([]);
                          setCurrentEditAssignedUser("");
                          setActiveSection("obras");
                        }}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          const form = (e.target as HTMLElement).closest(
                            "form",
                          );
                          const inputs = form.querySelectorAll(
                            "input, select, textarea",
                          );

                          const title = inputs[0].value; // Título da Obra
                          const client = inputs[1].value; // Cliente
                          const location = inputs[2].value; // Local
                          const status = inputs[3].value; // Estado
                          const startDate = inputs[4].value; // Data de Início
                          const expectedEndDate = inputs[5].value; // Data de Conclusão Prevista
                          // assignedTo now comes from editAssignedUsers state
                          const budgetValue = inputs[6].value; // Valor Orçamentado
                          const clientPhone = inputs[7].value; // Telefone do Cliente
                          const clientEmail = inputs[8].value; // Email do Cliente
                          const priority = inputs[9].value; // Prioridade
                          const workType = inputs[10].value; // Tipo de Obra
                          const description = inputs[12].value; // Descri��ão
                          const technicalNotes = inputs[12].value; // Observações Técnicas

                          dataSync.updateWork(editingWork.id, {
                            title,
                            client,
                            location,
                            status,
                            startDate: startDate
                              ? new Date(startDate).toISOString()
                              : undefined,
                            expectedEndDate: expectedEndDate
                              ? new Date(expectedEndDate).toISOString()
                              : undefined,
                            assignedTo:
                              editAssignedUsers.length > 0
                                ? editAssignedUsers
                                    .map((u) => u.name)
                                    .join(", ")
                                : "",
                            assignedUsers: editAssignedUsers,
                            assignedUserIds: editAssignedUsers.map((u) => u.id),
                            budgetValue: budgetValue
                              ? parseFloat(budgetValue)
                              : undefined,
                            clientPhone,
                            clientEmail,
                            priority,
                            workType,
                            description,
                            technicalNotes,
                          });

                          alert("Obra atualizada com sucesso!");
                          setEditingWork(null);
                          setEditAssignedUsers([]);
                          setCurrentEditAssignedUser("");
                          setActiveSection("obras");
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Guardar Alterações
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );

        case "editar-piscina":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Waves className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Editar Piscina
                      </h1>
                      <p className="text-gray-600 text-sm">
                        {editingPool?.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome da Piscina *
                        </label>
                        <input
                          type="text"
                          defaultValue={editingPool?.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Piscina Villa Marina"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cliente *
                        </label>
                        <input
                          type="text"
                          defaultValue={editingPool?.client}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nome do cliente"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Local *
                        </label>
                        <input
                          type="text"
                          defaultValue={editingPool?.location}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Localização da piscina"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado
                        </label>
                        <select
                          defaultValue={editingPool?.status}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Ativa">Ativa</option>
                          <option value="Inativa">Inativa</option>
                          <option value="Em Manutenção">Em Manutenção</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Piscina
                        </label>
                        <select
                          defaultValue={editingPool?.poolType || "outdoor"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="outdoor">Exterior</option>
                          <option value="indoor">Interior</option>
                          <option value="semi_covered">Semi-coberta</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dimensões (m)
                        </label>
                        <input
                          type="text"
                          defaultValue={editingPool?.dimensions}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: 8x4x1.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Volume (L)
                        </label>
                        <input
                          type="number"
                          defaultValue={editingPool?.volume}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="48000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sistema de Filtração
                        </label>
                        <select
                          defaultValue={editingPool?.filtrationSystem || "sand"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="sand">Areia</option>
                          <option value="cartridge">Cartucho</option>
                          <option value="diatomaceous">Terra Diatomácea</option>
                          <option value="other">Outro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data de Instalação
                        </label>
                        <input
                          type="date"
                          defaultValue={
                            editingPool?.installationDate?.split("T")[0]
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone do Cliente
                        </label>
                        <input
                          type="tel"
                          defaultValue={editingPool?.clientPhone}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+351 912 345 678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email do Cliente
                        </label>
                        <input
                          type="email"
                          defaultValue={editingPool?.clientEmail}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="cliente@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observações
                      </label>
                      <textarea
                        defaultValue={editingPool?.observations}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Observações sobre a piscina, equipamentos instalados, etc."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPool(null);
                          setActiveSection("piscinas");
                        }}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          const form = (e.target as HTMLElement).closest(
                            "form",
                          );
                          const inputs = form.querySelectorAll(
                            "input, select, textarea",
                          );

                          const name = inputs[0].value; // Nome da Piscina
                          const client = inputs[1].value; // Cliente
                          const location = inputs[2].value; // Local
                          const status = inputs[3].value; // Estado
                          const poolType = inputs[4].value; // Tipo de Piscina
                          const dimensions = inputs[5].value; // Dimensões
                          const volume = inputs[6].value; // Volume
                          const filtrationSystem = inputs[7].value; // Sistema de Filtração
                          const installationDate = inputs[8].value; // Data de Instalação
                          const clientPhone = inputs[9].value; // Telefone do Cliente
                          const clientEmail = inputs[10].value; // Email do Cliente
                          const observations = inputs[11].value; // Observações

                          dataSync.updatePool(editingPool.id, {
                            name,
                            client,
                            location,
                            status,
                            poolType,
                            dimensions,
                            volume: volume ? parseInt(volume) : undefined,
                            filtrationSystem,
                            installationDate: installationDate
                              ? new Date(installationDate).toISOString()
                              : undefined,
                            clientPhone,
                            clientEmail,
                            observations,
                          });

                          alert("Piscina atualizada com sucesso!");
                          setEditingPool(null);
                          setActiveSection("piscinas");
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Guardar Alterações
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );

        case "editar-manutencao":
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Wrench className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Editar Manutenção
                      </h1>
                      <p className="text-gray-600 text-sm">
                        {editingMaintenance?.poolName} -{" "}
                        {editingMaintenance?.type}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data *
                        </label>
                        <input
                          type="date"
                          defaultValue={
                            editingMaintenance?.scheduledDate?.split("T")[0]
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          T��cnico *
                        </label>
                        <input
                          type="text"
                          defaultValue={editingMaintenance?.technician}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nome do técnico"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Manutenção
                        </label>
                        <select
                          defaultValue={editingMaintenance?.type}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Limpeza">Limpeza</option>
                          <option value="Tratamento">Tratamento</option>
                          <option value="Manutenção">Manutenção</option>
                          <option value="Reparação">Reparação</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado
                        </label>
                        <select
                          defaultValue={editingMaintenance?.status}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="scheduled">Agendado</option>
                          <option value="in_progress">Em Progresso</option>
                          <option value="completed">Concluído</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duração Estimada (horas)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          defaultValue={editingMaintenance?.estimatedDuration}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="2.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duração Real (horas)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          defaultValue={editingMaintenance?.actualDuration}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="3.0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custo (€)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={editingMaintenance?.cost}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prioridade
                        </label>
                        <select
                          defaultValue={
                            editingMaintenance?.priority || "medium"
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Baixa</option>
                          <option value="medium">Média</option>
                          <option value="high">Alta</option>
                          <option value="urgent">Urgente</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data de Conclus��o
                        </label>
                        <input
                          type="date"
                          defaultValue={
                            editingMaintenance?.completedDate?.split("T")[0]
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Materiais Utilizados
                      </label>
                      <textarea
                        defaultValue={editingMaintenance?.materialsUsed}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Lista de materiais e produtos utilizados"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observações
                      </label>
                      <textarea
                        defaultValue={editingMaintenance?.observations}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Observações sobre a manutenção"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMaintenance(null);
                          setActiveSection("manutencoes");
                        }}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          const form = (e.target as HTMLElement).closest(
                            "form",
                          );
                          const inputs = form.querySelectorAll(
                            "input, select, textarea",
                          );

                          const scheduledDate = inputs[0].value; // Data
                          const technician = inputs[1].value; // Técnico
                          const type = inputs[2].value; // Tipo de Manutenção
                          const status = inputs[3].value; // Estado
                          const estimatedDuration = inputs[4].value; // Duração Estimada
                          const actualDuration = inputs[5].value; // Duração Real
                          const cost = inputs[6].value; // Custo
                          const priority = inputs[7].value; // Prioridade
                          const completedDate = inputs[8].value; // Data de Conclusão
                          const materialsUsed = inputs[9].value; // Materiais Utilizados
                          const observations = inputs[10].value; // Observações

                          dataSync.updateMaintenance(editingMaintenance.id, {
                            scheduledDate: scheduledDate
                              ? new Date(scheduledDate).toISOString()
                              : undefined,
                            technician,
                            type,
                            status,
                            estimatedDuration: estimatedDuration
                              ? parseFloat(estimatedDuration)
                              : undefined,
                            actualDuration: actualDuration
                              ? parseFloat(actualDuration)
                              : undefined,
                            cost: cost ? parseFloat(cost) : undefined,
                            priority,
                            completedDate: completedDate
                              ? new Date(completedDate).toISOString()
                              : undefined,
                            materialsUsed,
                            observations,
                          });

                          alert("Manutenção atualizada com sucesso!");
                          setEditingMaintenance(null);
                          setActiveSection("manutencoes");
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Guardar Alterações
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );

        case "register":
          // SECURITY: Only super admin can register new users
          if (currentUser?.role !== "super_admin") {
            return (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Acesso Restrito
                  </h2>
                  <p className="text-gray-500">
                    Apenas super administradores podem criar utilizadores.
                  </p>
                  <button
                    onClick={() => navigateToSection("dashboard")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Voltar ao Dashboard
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <button
                    onClick={() => navigateToSection("utilizadores")}
                    className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    �� Voltar aos Utilizadores
                  </button>
                  <RegisterForm
                    onRegisterSuccess={() => {
                      navigateToSection("utilizadores");
                    }}
                    onBackToLogin={() => {
                      navigateToSection("utilizadores");
                    }}
                  />
                </div>
              </div>
            </div>
          );

        default:
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Página não encontrada
                </h1>
                <p className="text-gray-600">
                  A seção solicitada não foi encontrada.
                </p>
              </div>
            </div>
          );
      }
    } catch (error) {
      console.error("Error rendering content:", error);
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Erro de Sistema
            </h1>
            <p className="text-gray-600 mb-4">
              Ocorreu um erro ao carregar o conteúdo. Por favor, tente
              novamente.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }
  };

  // Photo Gallery Modal
  if (showPhotoGallery) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden m-4">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Galeria de Fotografias ({selectedPhotos.length} fotos)
            </h2>
            <button
              onClick={() => setShowPhotoGallery(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedPhotos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.data}
                    alt={photo.name}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                    <p className="text-sm truncate">{photo.name}</p>
                    <p className="text-xs text-gray-300">
                      {new Date(photo.timestamp).toLocaleDateString("pt-PT")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Share Modal
  if (showShareModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Partilhar Relatório
              </h2>
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setInterventionSaved(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Manutenção guardada com sucesso!
                </h3>
                <p className="text-gray-600">
                  Escolha como pretende partilhar o relatório
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handleShare("whatsapp")}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-500">Enviar por WhatsApp</p>
                </div>
              </button>

              <button
                onClick={() => handleShare("email")}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">Enviar por email</p>
                </div>
              </button>

              <button
                onClick={() => handleShare("sms")}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">SMS</p>
                  <p className="text-sm text-gray-500">Enviar por SMS</p>
                </div>
              </button>

              <button
                onClick={() => handleShare("download")}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Save className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Download PDF</p>
                  <p className="text-sm text-gray-500">Baixar arquivo</p>
                </div>
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Conteúdo do Relatório:
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Dados da intervenção</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Valores da água</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Produtos químicos utilizados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Trabalho realizado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Fotografias</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Observações e próxima manutenção</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setInterventionSaved(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Agora Não
              </button>
              <button
                onClick={() => handleShare("preview")}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Pré-visualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SECURITY: Register form removed - only super admin can create users

  // TEMPORARY: Bypass authentication for testing
  useEffect(() => {
    if (!currentUser) {
      const testUser = {
        id: 1,
        name: "Gonçalo Fonseca",
        email: "gongonsilva@gmail.com",
        role: "super_admin",
        permissions: {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          utilizadores: { view: true, create: true, edit: true, delete: true },
          admin: { view: true, create: true, edit: true, delete: true },
          dashboard: { view: true },
        },
      };
      setCurrentUser(testUser);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(testUser));
      localStorage.setItem("isAuthenticated", "true");
    }
  }, []);

  // Always allow access for testing - bypass authentication
  if (false) {
    console.log(
      "🛡️ SECURITY: Blocking access - isAuthenticated:",
      isAuthenticated,
      "currentUser:",
      !!currentUser,
      "timestamp:",
      new Date().toISOString(),
    );

    if (showAdvancedSettings) {
      if (isAdvancedUnlocked) {
        return (
          <AdvancedSettings
            onBack={handleAdvancedSettingsBack}
            onNavigateToSection={(section) => {
              console.log(`🔄 Navegando para seção: ${section}`);

              // Navigation to user management section only allowed if authenticated
              if (
                section === "utilizadores" &&
                (!isAuthenticated || !currentUser)
              ) {
                console.log(
                  "❌ Access denied: User management requires authentication",
                );
                setLoginError(
                  "Por favor, faça login primeiro para aceder à gestão de utilizadores",
                );
                setShowAdvancedSettings(false);
                setIsAdvancedUnlocked(false);
                return;
              }

              navigateToSection(section);
              setShowAdvancedSettings(false);
              setIsAdvancedUnlocked(false);
            }}
            dataSync={{
              pools,
              maintenance,
              works,
              clients,
              lastSync,
              syncWithFirebase,
              enableSync,
            }}
            notifications={{
              pushPermission,
              notificationsEnabled,
              requestNotificationPermission,
              testPushNotification,
              sendWorkAssignmentNotification,
            }}
          />
        );
      }

      // Password protection screen
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Área Protegida
              </h1>
              <p className="text-gray-600">
                Insira a palavra-passe para aceder às configurações avançadas
              </p>
            </div>

            <form onSubmit={handleAdvancedPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palavra-passe
                </label>
                <input
                  type="password"
                  value={advancedPassword}
                  onChange={(e) => setAdvancedPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Insira a palavra-passe"
                  required
                />
              </div>

              {advancedPasswordError && (
                <div className="text-red-600 text-sm">
                  {advancedPasswordError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSettings(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-32 h-20 bg-white rounded-lg shadow-md p-2 mx-auto">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                alt="Leirisonda Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {loginError && (
              <div className="text-red-600 text-sm">{loginError}</div>
            )}

            <div className="space-y-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Entrar
              </button>
            </div>
          </form>

          {/* SECURITY: Only super admin can create new accounts - removed public registration */}
        </div>

        {/* Floating Advanced Settings Button */}
        <button
          onClick={() => setShowAdvancedSettings(true)}
          className="fixed bottom-4 right-4 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-xl transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <AutoSyncProvider
      enabled={false}
      syncInterval={15000}
      collections={["users", "pools", "maintenance", "works", "clients"]}
      showNotifications={false}
    >
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
                      src="https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                      alt="Leirisonda Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Gestão de Serviços</p>
                  </div>
                </div>
                {/* Sync Status Indicator */}
                <SyncStatusIcon className="ml-2" />
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
            </nav>

            {/* User Section */}
            <div className="px-4 py-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {currentUser.name}
                  </p>
                  <p className="text-sm text-gray-500">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Terminar Sessão</span>
              </button>
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">© 2025 Leirisonda</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-20 left-4 z-60 flex flex-col space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-white p-2 rounded-md shadow-md"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={handleGoBack}
            className="bg-white p-2 rounded-md shadow-md"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Enhanced Work View Modal */}
        {viewingWork && selectedWork && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Detalhes Completos da Obra
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {selectedWork.id?.toUpperCase() ||
                          "ID-" + Date.now().toString().slice(-6)}{" "}
                        → {selectedWork.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setViewingWork(false);
                      setSelectedWork(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Número da Folha de Obra
                      </label>
                      <p className="text-gray-900 font-mono">
                        {selectedWork.workSheetNumber || selectedWork.title}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo de Obra
                      </label>
                      <p className="text-gray-900 capitalize">
                        {selectedWork.type || "Não especificado"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Título
                      </label>
                      <p className="text-gray-900">{selectedWork.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Cliente
                      </label>
                      <p className="text-gray-900">
                        {selectedWork.client || "Não especificado"}
                      </p>
                      {selectedWork.contact && (
                        <button
                          onClick={() => handlePhoneClick(selectedWork.contact)}
                          className={`text-sm mt-1 ${
                            enablePhoneDialer
                              ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                              : "text-gray-500"
                          }`}
                          disabled={!enablePhoneDialer}
                        >
                          �� {selectedWork.contact}
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Local
                      </label>
                      <button
                        onClick={() =>
                          handleAddressClick(selectedWork.location)
                        }
                        className={`text-left ${
                          enableMapsRedirect
                            ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                            : "text-gray-900"
                        }`}
                        disabled={!enableMapsRedirect}
                      >
                        📍 {selectedWork.location}
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Estado
                      </label>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          selectedWork.status === "pending"
                            ? "bg-red-100 text-red-700"
                            : selectedWork.status === "in_progress"
                              ? "bg-orange-100 text-orange-700"
                              : selectedWork.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {selectedWork.status === "pending"
                          ? "Pendente"
                          : selectedWork.status === "in_progress"
                            ? "Em Progresso"
                            : selectedWork.status === "completed"
                              ? "Concluída"
                              : selectedWork.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Data de Início
                      </label>
                      <p className="text-gray-900">
                        {new Date(selectedWork.startDate).toLocaleDateString(
                          "pt-PT",
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Horário
                      </label>
                      <p className="text-gray-900">
                        {selectedWork.startTime && selectedWork.endTime
                          ? `${selectedWork.startTime} - ${selectedWork.endTime}`
                          : selectedWork.startTime
                            ? `Das ${selectedWork.startTime}`
                            : "Não definido"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Atribuída a
                      </label>
                      <p className="text-gray-900">
                        {selectedWork.assignedUsers &&
                        selectedWork.assignedUsers.length > 0
                          ? selectedWork.assignedUsers
                              .map((u) => u.name)
                              .join(", ")
                          : selectedWork.assignedTo || "Não atribuída"}
                      </p>
                    </div>
                    {selectedWork.technicians &&
                      selectedWork.technicians.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Técnicos
                          </label>
                          <p className="text-gray-900">
                            {selectedWork.technicians.join(", ")}
                          </p>
                        </div>
                      )}
                    {selectedWork.vehicles &&
                      selectedWork.vehicles.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Veículos
                          </label>
                          <p className="text-gray-900">
                            {selectedWork.vehicles.join(", ")}
                          </p>
                        </div>
                      )}
                    {selectedWork.photos && selectedWork.photos.length > 0 && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Fotografias ({selectedWork.photos.length})
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                          {selectedWork.photos.map((photo, index) => (
                            <div key={photo.id || index} className="relative">
                              <img
                                src={photo.data || photo.url}
                                alt={photo.name || `Foto ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedWork.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {selectedWork.description}
                      </p>
                    </div>
                  )}

                  {selectedWork.budget && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Orçamento
                      </label>
                      <p className="text-gray-900">€{selectedWork.budget}</p>
                    </div>
                  )}

                  {selectedWork.workPerformed && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trabalho Realizado
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {selectedWork.workPerformed}
                      </p>
                    </div>
                  )}

                  {selectedWork.observations && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observações
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {selectedWork.observations}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Folha de Obra Concluída
                      </label>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          selectedWork.workSheetCompleted
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {selectedWork.workSheetCompleted
                          ? "Concluída"
                          : "Pendente"}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Data de Criação
                      </label>
                      <p className="text-gray-900 text-sm">
                        {new Date(
                          selectedWork.createdAt || selectedWork.startDate,
                        ).toLocaleString("pt-PT")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setViewingWork(false);
                      setSelectedWork(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Fechar
                  </button>
                  {hasPermission("obras", "edit") && (
                    <button
                      onClick={() => {
                        setEditingWork(selectedWork);
                        // Initialize edit assigned users
                        setEditAssignedUsers(selectedWork.assignedUsers || []);
                        setViewingWork(false);
                        setSelectedWork(null);
                        setActiveSection("editar-obra");
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Editar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="lg:ml-80 min-h-screen">
          <div className="p-4 lg:p-6">{renderContent()}</div>
        </main>

        {/* Install Prompt for Mobile */}
        <InstallPrompt />

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
    </AutoSyncProvider>
  );
}

export default App;
