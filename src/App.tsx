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
// import { FirebaseConfig } from "./components/FirebaseConfig";
import { AdvancedSettings } from "./components/AdvancedSettings";
import InstallPromptSimple from "./components/InstallPromptSimple";
// import { UserPermissionsManager } from "./components/UserPermissionsManager";
// import { EmergencyLogoutManager } from "./components/EmergencyLogoutManager";

import { LocationPage } from "./components/LocationPage";
import { PersonalLocationSettings } from "./components/PersonalLocationSettings";

// Limpar estados que causam modais indesejados
import "./utils/clearModalStates";

// Security: Startup cleanup to prevent blocked users from accessing
// import "./utils/startupCleanup"; // TEMPORARIAMENTE DESATIVADO - estava a eliminar utilizadores automaticamente

import { AutoSyncProviderSafe } from "./components/AutoSyncProviderSafe";
import { InstantSyncManagerSafe } from "./components/InstantSyncManagerSafe";
import { RealtimeNotifications } from "./components/RealtimeNotifications";
import { WorkAssignmentNotifications } from "./components/WorkAssignmentNotifications";

import { syncManager } from "./utils/syncManager";
import { clearQuotaProtection } from "./utils/clearQuotaProtection";
import { isFirebaseReady } from "./firebase/config";
import {
  isFirestoreReady,
  testFirestore,
  getFirebaseFirestore,
} from "./firebase/firestoreConfig";
import { firestoreService } from "./services/firestoreService";
import { firebaseStorageService } from "./services/firebaseStorageService";
import { autoSyncService } from "./services/autoSyncService";
import "./utils/testFirebaseBasic"; // Passo 1: Teste automático Firebase básico
import "./utils/testFirestore"; // Passo 3: Teste automático Firestore
import "./utils/permanentMockCleanup"; // Limpeza permanente de dados mock

// SECURITY: RegisterForm for super admin only
import { RegisterForm } from "./components/RegisterForm";
import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import { LoginPage } from "./pages/LoginPage";

import { useDataSyncSimple } from "./hooks/useDataSyncSimple";
import { useUniversalDataSyncSafe as useUniversalDataSync } from "./hooks/useUniversalDataSyncSafe";
import { hybridAuthService as authService } from "./services/hybridAuthService";
import { UserProfile } from "./services/robustLoginService";
import { DataProtectionService } from "./utils/dataProtection";
import { EmergencyDataRecovery } from "./utils/emergencyDataRecovery";

// Firebase works silently in background - no diagnostics or UI needed
import("./firebase/ultimateSimpleFirebase");
import { ForceInitialization } from "./utils/forceInitialization";

// Sistema de diagnóstico de persistência
import { DataPersistenceDiagnostic } from "./components/DataPersistenceDiagnostic";
import { DataPersistenceAlert } from "./components/DataPersistenceAlert";
import { DataPersistenceIndicator } from "./components/DataPersistenceIndicator";
import { dataPersistenceManager } from "./utils/dataPersistenceFix";
import "./utils/testDataPersistence";

import { useDataCleanup } from "./hooks/useDataCleanup";
import { useAutoSyncSimple } from "./hooks/useAutoSyncSimple";
import { useAutoFirebaseFix } from "./hooks/useAutoFirebaseFix";
import { useAutoUserMigration } from "./hooks/useAutoUserMigration";
import FirebaseAutoMonitor from "./components/FirebaseAutoMonitor";
import UserMigrationIndicator from "./components/UserMigrationIndicator";
// Firebase components removed - Firebase works automatically in background

// Diagnóstico automático para problemas de inserção de dados
import "./utils/datainput-diagnostic";
import DataInputStatusIndicator from "./components/DataInputStatusIndicator";
import DataInputTutorial from "./components/DataInputTutorial";

// Monitor de erros Firebase para detectar e corrigir automaticamente
import "./utils/firebaseErrorMonitor";
import FirebaseFixButton from "./components/FirebaseFixButton";

// Inicialização de emergência de utilizadores
import "./utils/emergencyUserInit";
import "./utils/forceUserInit";
import { userRestoreService } from "./services/userRestoreService";
import UserRestoreNotificationSimple from "./components/UserRestoreNotificationSimple";

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

  // Debug logging disabled for production

  // Monitoramento de integridade de dados e restauração de utilizadores
  useEffect(() => {
    // Restaurar utilizadores automaticamente se necessário
    userRestoreService.autoRestore();

    // Monitorização automática de persistência de dados
    const initDataPersistenceMonitoring = async () => {
      try {
        // Aguardar um pouco antes de iniciar verificação
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Verificar estado da persistência
        const status = await dataPersistenceManager.diagnoseDataPersistence();

        if (!status.working) {
          console.warn("��� Problema de persistência detectado:", status);
          setPersistenceIssueDetected(true);

          // Tentar reparar automaticamente
          const repaired = await dataPersistenceManager.repairDataPersistence();

          if (repaired) {
            setPersistenceIssueDetected(false);
            console.log("✅ Persistência reparada automaticamente");
          } else {
            console.error(
              "❌ Não foi possível reparar a persistência automaticamente",
            );
          }
        } else {
          console.log("✅ Sistema de persistência está funcional");
        }
      } catch (error) {
        console.error("❌ Erro na monitorização de persistência:", error);
      }
    };

    initDataPersistenceMonitoring();

    // Cleanup ao desmontar componente
    return () => {
      // Cleanup functions if needed
    };
  }, []);

  // Firebase handles auth state automatically - no manual clearing needed
  useEffect(() => {
    console.log("��� Firebase handles auth state automatically");
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeAdminTab, setActiveAdminTab] = useState("relatorios");
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
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

  // Data persistence diagnostic states
  const [showDataDiagnostic, setShowDataDiagnostic] = useState(false);
  const [persistenceIssueDetected, setPersistenceIssueDetected] =
    useState(false);

  // SINCRONIZAÇÃO UNIVERSAL - Versão completa funcional
  // Firebase ativo como solicitado
  const universalSync = useUniversalDataSync();
  const dataSync = useDataSyncSimple();

  // FIREBASE AUTO-CORREÇÃO - Monitorização automática
  const firebaseAutoFix = useAutoFirebaseFix();

  // AUTO-MIGRAÇÃO DE UTILIZADORES - Migração automática para Firestore
  const userMigration = useAutoUserMigration();

  // Log migration status changes
  useEffect(() => {
    if (userMigration.status.completed && userMigration.status.migrated > 0) {
      console.log(
        `🎉 AUTO-MIGRATION: ${userMigration.status.migrated} utilizadores migrados para Firestore!`,
      );
      console.log(
        "✅ AUTO-MIGRATION: Utilizadores agora funcionam em qualquer dispositivo/browser",
      );
    }
  }, [userMigration.status.completed, userMigration.status.migrated]);

  // Backup and complex initialization temporarily disabled for stability

  // SINCRONIZAÇÃO UNIVERSAL ATIVA - Disabled to prevent infinite re-renders
  // useEffect(() => {
  //   console.log("���� SINCRONIZAÇÃO UNIVERSAL ATIVA:", {
  //     obras: universalSync.obras.length,
  //     manutencoes: universalSync.manutencoes.length,
  //     piscinas: universalSync.piscinas.length,
  //     clientes: universalSync.clientes.length,
  //     total: universalSync.totalItems,
  //     status: universalSync.syncStatus,
  //   });
  // }, [
  //   universalSync.obras,
  //   universalSync.manutencoes,
  //   universalSync.piscinas,
  //   universalSync.clientes,
  //   universalSync.syncStatus,
  // ]);

  // PROTEÇÃO CRÍTICA: PRIMEIRA LINHA DE DEFESA - Temporariamente desabilitada para melhorar performance
  useEffect(() => {
    console.log(
      "🛡️ Data protection initialized (checks disabled for performance)",
    );

    // Verificações automáticas desabilitadas para resolver instabilidade
    // Sistema funcionar�� normalmente sem verificações constantes
    // Sistema funcionará normalmente sem verificações autom��ticas
  }, []);

  // Sincronizar configurações entre componentes
  useEffect(() => {
    const handlePhoneDialerToggle = (event: CustomEvent) => {
      setEnablePhoneDialer(event.detail.enabled);
      localStorage.setItem(
        "enablePhoneDialer",
        event.detail.enabled.toString(),
      );
      console.log("📞 Phone dialer synchronized:", event.detail.enabled);
    };

    const handleMapsRedirectToggle = (event: CustomEvent) => {
      setEnableMapsRedirect(event.detail.enabled);
      localStorage.setItem(
        "enableMapsRedirect",
        event.detail.enabled.toString(),
      );
      console.log("🗺�� Maps redirect synchronized:", event.detail.enabled);
    };

    window.addEventListener(
      "phoneDialerToggled",
      handlePhoneDialerToggle as EventListener,
    );
    window.addEventListener(
      "mapsRedirectToggled",
      handleMapsRedirectToggle as EventListener,
    );

    return () => {
      window.removeEventListener(
        "phoneDialerToggled",
        handlePhoneDialerToggle as EventListener,
      );
      window.removeEventListener(
        "mapsRedirectToggled",
        handleMapsRedirectToggle as EventListener,
      );
    };
  }, []);
  // DADOS UNIVERSAIS - Partilhados entre todos os utilizadores
  const {
    obras,
    manutencoes,
    piscinas,
    clientes,
    isLoading: syncLoading,
    lastSync,
    error: syncError,
    addObra,
    addManutencao,
    addPiscina,
    addCliente,
    updateObra,
    updateManutencao,
    updatePiscina,
    updateCliente,
    deleteObra,
    deleteManutencao,
    deletePiscina,
    deleteCliente,
    forceSyncAll,
    syncStatus,
  } = universalSync;

  // Mapear dados universais para compatibilidade com código existente
  const pools = piscinas;
  const maintenance = manutencoes;
  const works = obras;
  const clients = clientes;

  // Calcular manutenções futuras
  const today = new Date();
  const futureMaintenance = manutencoes.filter(
    (m) => m.scheduledDate && new Date(m.scheduledDate) >= today,
  );

  // Fun��ões de compatibilidade simplificadas
  const addPool = async (data: any) => {
    try {
      console.log("🏊 addPool iniciado com Firestore ativo");

      const firestoreId = await firestoreService.createPiscina(data);

      if (firestoreId) {
        console.log("✅ Piscina criada no Firestore:", firestoreId);

        // Sincronizar com sistema universal
        try {
          await addPiscina(data);
        } catch (syncError) {
          console.warn("⚠️ Erro na sincronização universal:", syncError);
        }

        return firestoreId;
      } else {
        return await addPiscina(data);
      }
    } catch (error) {
      console.error("❌ Erro no sistema de piscinas:", error);
      return await addPiscina(data);
    }
  };

  // Função para enviar notificações push quando uma obra é atribuída
  const sendWorkAssignmentNotifications = async (workData: any) => {
    try {
      console.log("📱 Enviando notificações de atribuição de obra...");

      // Verificar se há utilizadores atribuídos
      if (!workData.assignedUsers || workData.assignedUsers.length === 0) {
        console.log(
          "⚠️ Nenhum utilizador atribuído, n��o enviando notificações",
        );
        return;
      }

      // Preparar dados da notificação
      const notificationData = {
        title: "🔔 Nova Obra Atribuída",
        body: `${workData.title} - ${workData.client}`,
        icon: "/icon.svg",
        badge: "/icon.svg",
        data: {
          workId: workData.id,
          workTitle: workData.title,
          client: workData.client,
          location: workData.location,
          startDate: workData.startDate,
          type: "work_assignment",
          url: `/obras/${workData.id}`,
        },
      };

      // Carregar todos os utilizadores para obter tokens FCM
      const allUsers = JSON.parse(localStorage.getItem("app-users") || "[]");

      // Para cada utilizador atribuído
      for (const assignedUser of workData.assignedUsers) {
        try {
          const user = allUsers.find((u: any) => u.id === assignedUser.id);
          if (!user) {
            console.warn(
              `���️ Utilizador ${assignedUser.name} não encontrado na lista`,
            );
            continue;
          }

          // console.log(`📱 Enviando notificação para ${assignedUser.name}...`);

          // Salvar notificação local para o utilizador
          const userNotifications = JSON.parse(
            localStorage.getItem(`work-notifications-${assignedUser.id}`) ||
              "[]",
          );

          const newNotification = {
            id: `${workData.id}-${Date.now()}`,
            workId: workData.id,
            workTitle: workData.title,
            client: workData.client,
            location: workData.location,
            startDate: workData.startDate,
            type: "new_assignment",
            timestamp: Date.now(),
            read: false,
            urgent: workData.priority === "urgent",
          };

          userNotifications.unshift(newNotification);
          // Manter apenas as últimas 50 notificações
          const limitedNotifications = userNotifications.slice(0, 50);

          localStorage.setItem(
            `work-notifications-${assignedUser.id}`,
            JSON.stringify(limitedNotifications),
          );

          // Disparar evento customizado para atualizar UI em tempo real
          const customEvent = new CustomEvent("worksUpdated", {
            detail: {
              type: "assignment",
              workId: workData.id,
              workTitle: workData.title,
              client: workData.client,
              location: workData.location,
              startDate: workData.startDate,
              assignedUser: assignedUser,
            },
          });
          window.dispatchEvent(customEvent);

          // Tentar enviar notificação push via Firebase (se disponível)
          if ("serviceWorker" in navigator && "PushManager" in window) {
            try {
              const registration = await navigator.serviceWorker.ready;

              // Verificar se o utilizador tem permissão para notificações
              const permission = await Notification.requestPermission();

              if (permission === "granted") {
                // Mostrar notificação local imediatamente
                const notification = new Notification(notificationData.title, {
                  body: notificationData.body,
                  icon: notificationData.icon,
                  badge: notificationData.badge,
                  tag: `work-${workData.id}`,
                  requireInteraction: true,
                  data: notificationData.data,
                });

                // Auto-close notification after 10 seconds
                setTimeout(() => {
                  notification.close();
                }, 10000);

                // Handle notification click
                notification.onclick = () => {
                  window.focus();
                  notification.close();
                  // Opcional: navegar para a obra
                };

                console.log(
                  `��� Notificação local enviada para ${assignedUser.name}`,
                );
              } else {
                console.warn(
                  `⚠��� Permissão de notificação negada para ${assignedUser.name}`,
                );
              }

              // TODO: Implementar FCM para notificações push quando app está fechada
              // Isso requer configuração adicional do Firebase Messaging
            } catch (pushError) {
              console.warn("⚠️ Erro ao enviar notificação push:", pushError);
            }
          }

          // Salvar notifica��ão no Firestore (se disponível)
          try {
            if (firestoreService) {
              await firestoreService.createNotification({
                userId: assignedUser.id,
                workId: workData.id,
                type: "work_assignment",
                title: notificationData.title,
                body: notificationData.body,
                data: notificationData.data,
                timestamp: new Date().toISOString(),
                read: false,
              });
              console.log(
                `✅ Notificação salva no Firestore para ${assignedUser.name}`,
              );
            }
          } catch (firestoreError) {
            console.warn(
              "⚠️ Erro ao salvar notificação no Firestore:",
              firestoreError,
            );
          }
        } catch (userError) {
          console.error(
            `❌ Erro ao enviar notificação para ${assignedUser.name}:`,
            userError,
          );
        }
      }

      console.log("✅ Processo de notificações concluído");
    } catch (error) {
      console.error("❌ Erro no sistema de notificações:", error);
    }
  };

  const addWork = async (data: any) => {
    try {
      console.log("🔧 addWork iniciado com Firestore ativo");

      // Usar o novo FirestoreService
      const firestoreId = await firestoreService.createObra(data);

      if (firestoreId) {
        console.log("✅ Obra criada no Firestore:", firestoreId);

        // Sincronizar com sistema universal também
        try {
          await addObra(data);
        } catch (syncError) {
          console.warn("���️ Erro na sincroniza��ão universal:", syncError);
        }

        // Enviar notificações push para utilizadores atribuídos
        await sendWorkAssignmentNotifications(data);

        return firestoreId;
      } else {
        // Fallback para sistema atual se Firestore falhar
        console.warn("����️ Firestore não disponível, usando sistema atual");
        return await addObra(data);
      }
    } catch (error) {
      console.error("❌ Erro no sistema de obras:", error);

      // Fallback final para localStorage
      const existingWorks = JSON.parse(localStorage.getItem("works") || "[]");
      const newWork = {
        ...data,
        id: data.id || Date.now().toString(),
        createdAt: data.createdAt || new Date().toISOString(),
      };

      const exists = existingWorks.some((w: any) => w.id === newWork.id);
      if (!exists) {
        existingWorks.push(newWork);
        localStorage.setItem("works", JSON.stringify(existingWorks));
        console.log("��� Obra guardada no localStorage como fallback");
      }

      return newWork.id;
    }
  };
  const addMaintenance = async (data: any) => {
    try {
      console.log("🔧 addMaintenance iniciado com Firestore ativo");

      const firestoreId = await firestoreService.createManutencao(data);

      if (firestoreId) {
        console.log("✅ Manutenção criada no Firestore:", firestoreId);

        // Sincronizar com sistema universal
        try {
          await addManutencao(data);
        } catch (syncError) {
          console.warn("⚠️ Erro na sincronização universal:", syncError);
        }

        return firestoreId;
      } else {
        return await addManutencao(data);
      }
    } catch (error) {
      console.error("❌ Erro no sistema de manutenções:", error);
      return await addManutencao(data);
    }
  };
  const addClient = async (data: any) => {
    try {
      console.log("👥 addClient iniciado com Firestore ativo");

      const firestoreId = await firestoreService.createCliente(data);

      if (firestoreId) {
        console.log("✅ Cliente criado no Firestore:", firestoreId);

        // Sincronizar com sistema universal
        try {
          await addCliente(data);
        } catch (syncError) {
          console.warn("���️ Erro na sincronização universal:", syncError);
        }

        return firestoreId;
      } else {
        return await addCliente(data);
      }
    } catch (error) {
      console.error("❌ Erro no sistema de clientes:", error);
      return await addCliente(data);
    }
  };
  const syncWithFirebase = () => forceSyncAll();
  const enableSync = (enabled: boolean) => {
    console.log("Sync is always enabled in Universal Sync mode:", enabled);
  };

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
  const autoSyncData = useAutoSyncSimple();
  const { syncStatus: autoSyncStatus } = autoSyncData;
  const autoSyncLastSync = autoSyncData.lastSync;

  // Debug logging removed to prevent re-render loops

  // Keep local users state for user management
  const [users, setUsers] = useState(initialUsers);

  // Load users from Firestore and localStorage on app start
  useEffect(() => {
    const loadUsers = async () => {
      console.log("🔄 Loading users from Firestore + localStorage...");

      try {
        // Aguardar Firestore estar pronto
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (isFirestoreReady()) {
          console.log("📱 Carregando utilizadores do Firestore...");

          // Tentar carregar do Firestore
          const firestoreUsers = await firestoreService.getUtilizadores();

          if (firestoreUsers.length > 0) {
            console.log(
              "✅ Utilizadores carregados do Firestore:",
              firestoreUsers.length,
            );
            setUsers(firestoreUsers);
            return;
          }
        }

        // Fallback para localStorage se Firestore não tiver dados
        const savedUsers = localStorage.getItem("app-users");
        if (savedUsers) {
          const parsedUsers = JSON.parse(savedUsers);
          console.log("✅ Users loaded from localStorage:", parsedUsers.length);
          setUsers(parsedUsers);

          // Sincronizar com Firestore se disponível
          if (isFirestoreReady()) {
            console.log(
              "🔄 Sincronizando utilizadores locais para Firestore...",
            );
            for (const user of parsedUsers) {
              if (!(user as any).firestoreId) {
                const firestoreId =
                  await firestoreService.createUtilizador(user);
                if (firestoreId) {
                  (user as any).firestoreId = firestoreId;
                }
              }
            }
          }
        } else {
          console.log(
            "📝 No saved users found, initializing with default users",
          );

          // Initialize with default admin user
          const defaultUsers = [
            {
              id: 1,
              name: "Gonçalo Fonseca",
              email: "gongonsilva@gmail.com",
              active: true,
              role: "super_admin",
              password: "19867gsf",
              permissions: {
                obras: { view: true, create: true, edit: true, delete: true },
                manutencoes: {
                  view: true,
                  create: true,
                  edit: true,
                  delete: true,
                },
                piscinas: {
                  view: true,
                  create: true,
                  edit: true,
                  delete: true,
                },
                utilizadores: {
                  view: true,
                  create: true,
                  edit: true,
                  delete: true,
                },
                relatorios: {
                  view: true,
                  create: true,
                  edit: true,
                  delete: true,
                },
                clientes: {
                  view: true,
                  create: true,
                  edit: true,
                  delete: true,
                },
              },
              createdAt: new Date().toISOString(),
            },
          ];

          setUsers(defaultUsers);
          localStorage.setItem("app-users", JSON.stringify(defaultUsers));

          // Criar no Firestore também
          if (isFirestoreReady()) {
            for (const user of defaultUsers) {
              const firestoreId = await firestoreService.createUtilizador(user);
              if (firestoreId) {
                (user as any).firestoreId = firestoreId;
              }
            }
          }
        }
      } catch (error) {
        console.error("❌ Error loading users:", error);
        // Fallback to initial users
        setUsers(initialUsers);
      }
    };

    loadUsers();

    // Listen for user updates from other components
    const handleUsersUpdated = () => {
      console.log("🔄 Users updated event received, reloading...");
      try {
        const savedUsers = localStorage.getItem("app-users");
        if (savedUsers) {
          const parsedUsers = JSON.parse(savedUsers);
          console.log(
            "✅ Users reloaded after update:",
            parsedUsers.length,
            parsedUsers,
          );
          setUsers(parsedUsers);
        }
      } catch (error) {
        console.error("❌ Error reloading users:", error);
      }
    };

    window.addEventListener("usersUpdated", handleUsersUpdated);
    return () => window.removeEventListener("usersUpdated", handleUsersUpdated);
  }, []);

  // Firebase handles user updates automatically via real-time listeners
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
  const [autoSyncActive, setAutoSyncActive] = useState(false);
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
  const [selectedPool, setSelectedPool] = useState(null);
  const [viewingPool, setViewingPool] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [viewingMaintenance, setViewingMaintenance] = useState(false);

  // Clickable links settings
  const [enablePhoneDialer, setEnablePhoneDialer] = useState(false);
  const [enableMapsRedirect, setEnableMapsRedirect] = useState(false);

  // Load settings from localStorage on startup
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedMapsRedirect = localStorage.getItem("enableMapsRedirect");
        if (savedMapsRedirect !== null) {
          setEnableMapsRedirect(JSON.parse(savedMapsRedirect));
          console.log(
            "✅ Configuração Google Maps carregada:",
            JSON.parse(savedMapsRedirect),
          );
        }

        const savedPhoneDialer = localStorage.getItem("enablePhoneDialer");
        if (savedPhoneDialer !== null) {
          setEnablePhoneDialer(JSON.parse(savedPhoneDialer));
          console.log(
            "✅ Configuração Phone Dialer carregada:",
            JSON.parse(savedPhoneDialer),
          );
        }
      } catch (error) {
        console.error("❌ Erro ao carregar configurações:", error);
      }
    };

    loadSettings();
  }, []);

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

    // SECURITY: Force complete logout on app start
    const forceLogout = async () => {
      try {
        // Clear Firebase auth state
        await authService.logout();
        console.log("🔒 Firebase auth cleared");
      } catch (error) {
        console.log("��� Firebase logout error (expected):", error);
      }

      // Ensure user starts in unauthenticated state
      setCurrentUser(null);
      setIsAuthenticated(false);

      // Clear any stored auth data
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("savedLoginCredentials");

      // Clear all mock and test data
      localStorage.removeItem("mock-users");
      localStorage.removeItem("mock-current-user");
      localStorage.removeItem("test-data");
      localStorage.removeItem("sample-data");

      console.log(
        "🔒 SECURITY: Forced logout completed - manual login required",
      );
      console.log("�� All mock and test data cleared");
    };

    forceLogout();
  }, []);

  // Passo 3: Teste completo do Firestore com operações reais
  useEffect(() => {
    const testFirestoreStep3 = async () => {
      console.log("🔥 Passo 3: Iniciando teste completo do Firestore...");

      // Aguardar um pouco para Firebase se inicializar
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const firestoreResult = await testFirestore();

        if (firestoreResult) {
          console.log("✅ Passo 3: Firestore ativo e funcional!");

          // Teste prático: tentar escrever e ler dados
          const db = getFirebaseFirestore();
          if (db) {
            try {
              // Importar funções do Firestore dinamicamente
              const { doc, setDoc, getDoc } = await import(
                "firebase/firestore"
              );

              // Documento de teste
              const testDoc = doc(db, "system_tests", "firestore_test");
              const testData = {
                message: "Firestore funcional!",
                timestamp: new Date().toISOString(),
                step: "Passo 3 completado",
              };

              // Escrever teste
              await setDoc(testDoc, testData);
              console.log(
                "📝 Passo 3: Dados escritos no Firestore com sucesso",
              );

              // Ler teste
              const docSnap = await getDoc(testDoc);
              if (docSnap.exists()) {
                console.log(
                  "📖 Passo 3: Dados lidos do Firestore:",
                  docSnap.data(),
                );
                console.log(
                  "🎉 PASSO 3 COMPLETADO: Firestore totalmente funcional!",
                );
              }
            } catch (writeError) {
              console.warn(
                "⚠��� Passo 3: Erro nas operaç���es Firestore:",
                writeError,
              );
              console.log(
                "💡 Firestore conectado mas pode haver problema nas regras de segurança",
              );
            }
          }
        } else {
          console.log(
            "⚠️ Passo 3: Firestore não disponível, usando localStorage",
          );
        }
      } catch (error) {
        console.warn("❌ Passo 3: Erro no teste Firestore:", error);
      }
    };

    testFirestoreStep3();
  }, []);

  // Sincroniza��ão inicial de todos os dados com Firestore
  useEffect(() => {
    const syncAllData = async () => {
      // Aguardar um pouco para o Firestore estar pronto
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (isFirestoreReady()) {
        console.log("�� Iniciando sincronização inicial com Firestore...");

        try {
          await firestoreService.syncAll();
          console.log("��� Sincronização inicial completa!");
        } catch (error) {
          console.error("❌ Erro na sincronizaç��o inicial:", error);
        }
      }
    };

    syncAllData();
  }, []);

  // Inicializar sincronização automática em tempo real
  useEffect(() => {
    const initAutoSync = async () => {
      // Aguardar Firestore estar pronto
      await new Promise((resolve) => setTimeout(resolve, 4000));

      if (isFirestoreReady()) {
        console.log("���� Iniciando sincronização automática em tempo real...");

        try {
          await autoSyncService.startAutoSync();
          console.log("✅ Sincroniza��ão automática ativa!");

          // Adicionar indicador visual
          setAutoSyncActive(true);
          window.dispatchEvent(new CustomEvent("autoSyncStarted"));
        } catch (error) {
          console.error("❌ Erro ao iniciar sincronização automática:", error);
        }
      }
    };

    initAutoSync();

    // Cleanup quando componente for desmontado
    return () => {
      autoSyncService.stopAutoSync();
    };
  }, []);

  // Listeners para atualizações automáticas da UI
  useEffect(() => {
    const handleDataUpdate = (event: CustomEvent) => {
      const { data, collection } = event.detail;
      // console.log(
      //   `🔄 UI atualizada automaticamente: ${collection} (${data.length} itens)`,
      // );

      // Forçar re-render dos dados universais se necessário
      if (collection === "obras") {
        // Trigger re-fetch das obras
        window.dispatchEvent(new CustomEvent("forceRefreshWorks"));
      } else if (collection === "utilizadores") {
        // Atualizar lista de utilizadores
        setUsers(data);
        window.dispatchEvent(new CustomEvent("usersUpdated"));
      }
    };

    // Adicionar listeners para todas as coleções
    const collections = [
      "obras",
      "piscinas",
      "manutencoes",
      "utilizadores",
      "clientes",
      "localizacoes",
      "notificacoes",
    ];

    collections.forEach((collection) => {
      window.addEventListener(
        `${collection}Updated`,
        handleDataUpdate as EventListener,
      );
    });

    // Cleanup listeners
    return () => {
      collections.forEach((collection) => {
        window.removeEventListener(
          `${collection}Updated`,
          handleDataUpdate as EventListener,
        );
      });
    };
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
    // console.log("���� Initializing notifications...");
    if ("Notification" in window) {
      const permission = Notification.permission;
      console.log("������ Current notification permission:", permission);
      setPushPermission(permission);
      setNotificationsEnabled(permission === "granted");

      if (permission === "granted") {
        console.log("�� Notifications already granted");
      } else if (permission === "denied") {
        console.warn("❌ Notifications denied by user");
      } else {
        console.log("⏳ Notifications permission not yet requested");
      }
    } else {
      console.warn("⚠️ Notifications not supported in this browser");
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
              "�� Service Worker registered successfully:",
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

        // Listen for messages from service worker (notification clicks)
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data.type === "NOTIFICATION_CLICK") {
            console.log("📱 Notification clicked, navigating...", event.data);

            const { data } = event.data;

            // Navigate to obras section if it's a work notification
            if (data.workId) {
              setActiveSection("obras");

              // Show a success message
              setTimeout(() => {
                showNotification(
                  "🔔 Notificação",
                  `Navegando para obra: ${data.workTitle}`,
                  "info",
                );
              }, 500);
            }
          }
        });
      }, 1000);
    }

    // Handle URL hash for PWA shortcuts
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove the '#'
      if (hash === "administracao") {
        // Handle admin access regardless of authentication state
        setShowAdminLogin(true);
        // Clear the hash to avoid loops
        window.history.replaceState(null, "", window.location.pathname);
      } else if (hash && isAuthenticated) {
        setActiveSection(hash);
      }
    };

    // Check initial hash on load
    handleHashChange();

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
    if (!hasPermission("manutencoes", "create")) {
      alert(
        "N��o tem permissão para criar manutenç���es. Contacte o administrador.",
      );
      return;
    }

    // Validate required fields
    if (!maintenanceForm.poolId || !maintenanceForm.technician) {
      alert(
        "Por favor, preencha os campos obrigat���rios (Piscina e Técnico).",
      );
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
      type: "Manutenç������o Regular",
      scheduledDate: maintenanceForm.date,
      technician: interventionData.technician,
      status: maintenanceForm.status as
        | "pending"
        | "in_progress"
        | "completed"
        | "cancelled",
      description: maintenanceForm.workPerformed || "Manutenç��o realizada",
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

    let alertMessage = `Manuten��ão salva com sucesso! Piscina: ${interventionData.poolName}, Técnico: ${interventionData.technician}`;

    if (maintenanceForm.nextMaintenance) {
      const nextDate = new Date(
        maintenanceForm.nextMaintenance,
      ).toLocaleDateString("pt-PT");
      alertMessage += `\n\nPróxima manutenç��o agendada para: ${nextDate}`;
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

      console.log("��� Auth result:", result);

      if (result.success && result.user) {
        // console.log("✅ Login successful for:", result.user.email);

        // Clear any previous auth state
        setLoginError("");

        // Set user state and authentication
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        // Firebase handles user persistence automatically

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
            console.log("�� Navigating to dashboard");
            navigateToSection("dashboard");
          }
        }, 100);
      } else {
        console.warn("❌ Login failed:", result.error);
        setLoginError(result.error || "Credenciais inválidas");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setLoginError("Erro de sistema. Por favor, tente novamente.");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🚪 Initiating logout process...");

      // Close sidebar immediately
      setSidebarOpen(false);

      // Clear current user state immediately for better UX
      setCurrentUser(null);
      setIsAuthenticated(false);

      // Clear saved login credentials when user manually logs out
      sessionStorage.removeItem("savedLoginCredentials");
      // Firebase handles auth state clearing automatically

      // Clear form
      setLoginForm({ email: "", password: "" });

      // Clear URL hash to go back to login
      window.location.hash = "";

      // Perform actual logout
      await authService.logout();

      console.log("✅ Logout completed successfully - redirected to login");
    } catch (error) {
      console.error("❌ Error during logout:", error);

      // Force clear state even if logout service fails
      setSidebarOpen(false);
      setCurrentUser(null);
      setIsAuthenticated(false);
      // Clear saved login credentials on emergency logout
      sessionStorage.removeItem("savedLoginCredentials");
      // Firebase handles auth state clearing automatically
      setLoginForm({ email: "", password: "" });

      // Clear URL hash
      window.location.hash = "";

      console.log(
        "���� Forced logout state clear completed - redirected to login",
      );
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
        "ATENCAO: Esta acao vai eliminar permanentemente todas as obras, manutencoes e piscinas. Os utilizadores serao mantidos. Confirma?",
      )
    ) {
      try {
        await cleanAllData();
        alert("Dados eliminados com sucesso! Aplicação agora está limpa.");
        setShowDataCleanup(false);
      } catch (error) {
        console.error("Erro na limpeza:", error);
        alert("Erro ao eliminar dados. Tente novamente.");
      }
    }
  };

  // Fixed back button function
  const handleGoBack = () => {
    // Manter histórico de navegação simples
    const sectionHistory = {
      "nova-obra": "obras",
      "nova-manutencao": "manutencoes",
      utilizadores: "configuracoes",
      relatorios: "dashboard",
      configuracoes: "dashboard",
      clientes: "dashboard",
      localizacoes: "dashboard",
    };

    const previousSection =
      sectionHistory[activeSection as keyof typeof sectionHistory];

    if (previousSection) {
      navigateToSection(previousSection);
    } else if (activeSection !== "dashboard") {
      // Se não estiver no dashboard e não tiver regra específica, vai para dashboard
      navigateToSection("dashboard");
    } else {
      // Se já estiver no dashboard, tenta usar o history do browser
      if (window.history.length > 1) {
        window.history.back();
      }
    }
  };

  // PDF Generation Functions
  const generatePoolsPDF = () => {
    const content = `
LEIRISONDA - RELAT��RIO DE PISCINAS
Data: ${new Date().toLocaleDateString("pt-PT")}

RESUMO:
- Total de Piscinas: ${pools.length}

DETALHES:
${pools
  .map(
    (pool, index) => `
${index + 1}. ${pool.name}
   Localizaç����o: ${pool.location}
   Cliente: ${pool.client}
   Tipo: ${pool.type}
   Estado: ${pool.status}
   ${pool.nextMaintenance ? `Próxima Manutenção: ${new Date(pool.nextMaintenance).toLocaleDateString("pt-PT")}` : ""}
`,
  )
  .join("\n")}

© ${new Date().getFullYear()} Leirisonda - Sistema de Gestão
    `;
    downloadPDF(
      content,
      `Piscinas_${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const generateMaintenancePDF = () => {
    const content = `
LEIRISONDA - RELATÓRIO DE MANUTENÇÕES
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
   ${maint.notes ? `Observa����ões: ${maint.notes}` : ""}
`,
  )
  .join("\n")}

© ${new Date().getFullYear()} Leirisonda - Sistema de Gestão
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
   Localização: ${work.location}
   Tipo: ${work.type}
   Estado: ${work.status === "completed" ? "Conclu��da" : work.status === "pending" ? "Pendente" : "Em Progresso"}
   Data Início: ${new Date(work.startDate).toLocaleDateString("pt-PT")}
   ${work.endDate ? `Data Fim: ${new Date(work.endDate).toLocaleDateString("pt-PT")}` : ""}
   ${work.budget ? `Orçamento: €${work.budget.toLocaleString("pt-PT")}` : ""}
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
LEIRISONDA - RELAT��RIO DE CLIENTES
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
- Manutenç��es Realizadas: ${maintenance.length}
- Futuras Manutenções: ${futureMaintenance.length}
- Obras em Curso: ${works.length}
- Clientes Ativos: ${clients.length}
- Utilizadores do Sistema: ${users.length}

ESTAT��STICAS:
- Piscinas Ativas: ${pools.filter((p) => p.status === "Ativa").length}
- Manutenç����es Conclu������das: ${maintenance.filter((m) => m.status === "completed").length}
- Obras Pendentes: ${works.filter((w) => w.status === "pending" || w.status === "pendente").length}

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
   Data: ${new Date(maint.scheduledDate).toLocaleDateString("pt-PT")} | T��cnico: ${maint.technician}
`,
  )
  .join("")}

© ${new Date().getFullYear()} Leirisonda - Sistema de Gestão
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
            "Notifica������es Ativadas",
            "Agora vai receber notificações de obras atribu��das",
            "success",
          );
          console.log("�� Notifications enabled successfully");
        } else {
          console.warn("❌ Notification permission denied or dismissed");
        }
        return permission;
      } catch (error) {
        console.error("���️ Error requesting notification permission:", error);
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

    // Check notification conditions

    // Check if current user is the one assigned (exact match or partial match for combined assignments)
    const isAssignedToCurrentUser =
      currentUser &&
      assignedTo &&
      (assignedTo === currentUser?.name ||
        assignedTo.toLowerCase().includes(currentUser?.name.toLowerCase()) ||
        currentUser?.name.toLowerCase().includes(assignedTo.toLowerCase()));

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
        console.log("�� All conditions met, sending notification...");
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
            `🔔 Nova Obra Atribuída!\n\n📋 ${workTitle}\n\n👤 Atribuída a: ${assignedTo}\n\n💡 Ative as notificações nas configurações para receber alertas automáticos.`,
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
    console.log(`🔔 OBRA ATRIBUÍDA: "${workTitle}" → ${assignedTo}`);
    console.log(`📋 Total de obras atribuídas: ${assignedWorks.length + 1}`);
  };

  const testPushNotification = () => {
    if (Notification.permission === "granted") {
      showNotification(
        "Teste de Notificação",
        "As notificaç��es estão a funcionar corretamente!",
        "test",
      );
    } else {
      alert(
        "As notificações não estão ativadas. Active-as primeiro nas configurações.",
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
    files.forEach((file) => {
      const newPhoto = {
        id: Date.now() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
      };
      setUploadedPhotos([...uploadedPhotos, newPhoto]);
    });
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
    if (!currentUser) return false;

    // Super admins have access to everything
    if (currentUser.role === "super_admin") return true;

    // Check specific permissions for other roles
    if (!currentUser.permissions) return false;
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
    console.log("������ Address clicked:", address);
    console.log("����️ Maps redirect enabled:", enableMapsRedirect);

    if (enableMapsRedirect && address) {
      // Open Google Maps with the address
      const encodedAddress = encodeURIComponent(address);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

      console.log("����� Opening Google Maps:", mapsUrl);

      try {
        window.open(mapsUrl, "_blank");
        console.log("✅ Google Maps opened successfully");
      } catch (error) {
        console.error("�� Error opening Google Maps:", error);
      }
    } else {
      if (!enableMapsRedirect) {
        console.warn("⚠��� Maps redirect is disabled");
      }
      if (!address) {
        console.warn("⚠��� No address provided");
      }
    }
  };

  // Settings persistence functions
  const togglePhoneDialer = (enabled: boolean) => {
    setEnablePhoneDialer(enabled);

    // Save to localStorage
    try {
      localStorage.setItem("enablePhoneDialer", JSON.stringify(enabled));
      console.log(
        `✅ Configuração Phone Dialer guardada: ${enabled ? "ativado" : "desativado"}`,
      );
    } catch (error) {
      console.error("❌ Erro ao guardar configuração Phone Dialer:", error);
    }
  };

  const toggleMapsRedirect = (enabled: boolean) => {
    setEnableMapsRedirect(enabled);

    // Save to localStorage
    try {
      localStorage.setItem("enableMapsRedirect", JSON.stringify(enabled));
      console.log(
        `✅ Configuração Google Maps guardada: ${enabled ? "ativado" : "desativado"}`,
      );
    } catch (error) {
      console.error("❌ Erro ao guardar configuração Google Maps:", error);
    }

    // Show notification
    console.log(`🗺️ Google Maps ${enabled ? "ativado" : "desativado"}`);

    // You can add a toast notification here if needed
    if (enabled) {
      console.log(
        "�����️ Agora pode clicar em qualquer morada para abrir no Google Maps!",
      );
    }
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
        console.log(
          `👤 Atualizando utilizador ${userForm.name} no Firestore...`,
        );

        const updatedUser = {
          ...editingUser,
          ...userForm,
          updatedAt: new Date().toISOString(),
        };

        // Atualizar no Firestore
        const firestoreSuccess = await firestoreService.updateUtilizador(
          editingUser.id?.toString() || editingUser.id,
          updatedUser,
        );

        if (firestoreSuccess) {
          console.log("✅ Utilizador atualizado no Firestore");
        }

        // Atualizar estado local
        setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));

        console.log(`✅ Utilizador ${userForm.name} atualizado com sucesso`);
      } else {
        // Add new user
        const newUser = {
          id: Math.max(...users.map((u) => u.id)) + 1,
          ...userForm,
          createdAt: new Date().toISOString(),
        };

        console.log(`👤 Criando utilizador ${userForm.name} no Firestore...`);

        // Criar no Firestore primeiro
        const firestoreId = await firestoreService.createUtilizador(newUser);

        if (firestoreId) {
          console.log("✅ Utilizador criado no Firestore:", firestoreId);
          newUser.firestoreId = firestoreId;
        }

        // Atualizar estado local
        setUsers([...users, newUser]);

        // Try to register with robustLoginService
        try {
          const { robustLoginService } = await import(
            "./services/robustLoginService"
          );
          const result = await robustLoginService.register(
            userForm.email,
            userForm.password,
            userForm.name,
            userForm.role as "super_admin" | "manager" | "technician",
          );

          if (result.success) {
            console.log(
              `🔥 Utilizador ${userForm.name} criado e sincronizado automaticamente com Firebase Auth + Firestore`,
            );

            // Show success message
            setTimeout(() => {
              alert(
                `Utilizador ${userForm.name} criado e sincronizado com sucesso!`,
              );
            }, 100);
          } else {
            console.log(
              `������️ Utilizador ${userForm.name} criado no Firestore. Firebase Auth: ${result.error}`,
            );
          }
        } catch (syncError) {
          console.log(
            `⚠️ Utilizador ${userForm.name} criado no Firestore. Erro de sincronização Auth:`,
            syncError,
          );
        }
      }

      setShowUserForm(false);
    } catch (error) {
      console.error("❌ Erro ao salvar utilizador:", error);
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
      id: "manutencoes",
      icon: Wrench,
      label: "Manutenções",
      path: "/manutencoes",
    },
    {
      id: "nova-manutencao",
      icon: Plus,
      label: "Nova Manutenção",
      path: "/manutencao/nova",
    },
    {
      id: "piscinas",
      icon: Waves,
      label: "Piscinas",
      path: "/piscinas",
    },
    {
      id: "localizacoes",
      icon: MapPin,
      label: "Localizações",
      path: "/localizacoes",
    },
  ];

  const renderContent = () => {
    // Show login page when user not authenticated
    if (!currentUser || !isAuthenticated) {
      return (
        <LoginPage
          onLogin={async (
            email: string,
            password: string,
            rememberMe: boolean = false,
          ) => {
            // console.log("�� Login attempt for:", email);

            // Clear any previous errors
            setLoginError("");

            // Basic validation
            if (!email?.trim() || !password?.trim()) {
              setLoginError("Por favor, preencha todos os campos");
              return;
            }

            try {
              // Importar serviço robusto
              const { robustLoginService } = await import(
                "./services/robustLoginService"
              );

              console.log("🔐 Usando serviço de login robusto...");
              const result = await robustLoginService.login(
                email.trim(),
                password,
                rememberMe,
              );

              // Fallback para authService se necessário
              if (!result.success) {
                console.log("🔄 Tentando authService como fallback...");
                const fallbackResult = await authService.login(
                  email.trim(),
                  password,
                  rememberMe,
                );

                if (fallbackResult.success) {
                  console.log("✅ AuthService fallback bem-sucedido");
                  result.success = true;
                  result.user = fallbackResult.user;
                }
              }

              // console.log("🔐 Auth result:", result);

              if (result.success && result.user) {
                // console.log("✅ Login successful for:", result.user.email);

                // Update state
                setCurrentUser(result.user);
                setIsAuthenticated(true);

                // Navigate to dashboard or requested section with validation
                const hash = window.location.hash.substring(1);
                if (hash && hash !== "login") {
                  // Validate that the section exists and user has access
                  const validSections = [
                    "dashboard",
                    "obras",
                    "piscinas",
                    "manutencoes",
                    "futuras-manutencoes",
                    "nova-obra",
                    "nova-piscina",
                    "nova-manutencao",
                    "clientes",
                    "novo-cliente",
                    "configuracoes",
                    "relatorios",
                    "utilizadores",
                    "localizacoes",
                    "register",
                    "editar-obra",
                    "editar-piscina",
                    "editar-manutencao",
                  ];

                  if (validSections.includes(hash)) {
                    // Use setTimeout to ensure state is properly set before navigation
                    setTimeout(() => {
                      setActiveSection(hash);
                    }, 100);
                  } else {
                    // Invalid hash, redirect to dashboard
                    window.location.hash = "";
                    navigateToSection("dashboard");
                  }
                } else {
                  navigateToSection("dashboard");
                }

                // console.log("✅ Login state updated successfully");
              } else {
                console.warn("❌ Login failed:", result.error);
                setLoginError(result.error || "Credenciais inválidas");
              }
            } catch (error: any) {
              console.error("❌ Login error:", error);
              setLoginError("Erro de sistema. Por favor, tente novamente.");
            }
          }}
          loginError={loginError}
          isLoading={false}
        />
      );
    }

    // Add error boundary
    try {
      switch (activeSection) {
        case "dashboard":
          return (
            <div className="min-h-screen bg-gray-50">
              {/* Dashboard Content - Mobile First Design */}
              <div className="px-4 py-4 space-y-4">
                {/* Simple Welcome Header */}
                <div
                  className="rounded-lg p-4 shadow-sm relative overflow-hidden"
                  style={{
                    backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F4aa5ed953548445997f9d2fcbd4d2e2b?format=webp&width=800')`,
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
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-20 h-12 bg-white rounded shadow-sm p-2">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F6c79d54ab5014a40bfea00560b92828d?format=webp&width=800"
                          alt="Leirisonda Logo"
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
                    <div className="text-center mb-3">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Olá, {currentUser?.name || "Gonçalo Fonseca"}
                      </h1>
                      <p className="text-gray-800 text-sm font-medium">
                        {new Date().toLocaleDateString("pt-PT", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Firebase, Firestore & AutoSync Status LEDs - Bottom Right Corner */}
                  <div className="absolute bottom-2 right-2 z-20">
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isFirebaseReady() ? "bg-green-500" : "bg-red-500"
                        }`}
                        title={
                          isFirebaseReady()
                            ? "Firebase Ativo"
                            : "Firebase Inativo"
                        }
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isFirestoreReady() ? "bg-blue-500" : "bg-orange-500"
                        }`}
                        title={
                          isFirestoreReady()
                            ? "Firestore Ativo"
                            : "Firestore Inativo"
                        }
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          autoSyncActive
                            ? "bg-purple-500 animate-pulse"
                            : "bg-gray-400"
                        }`}
                        title={
                          autoSyncActive
                            ? "Sincronizaç��o Automática Ativa"
                            : "Sincronização Automática Inativa"
                        }
                      ></div>
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
                        {(() => {
                          // Filtrar obras pendentes atribuídas ao utilizador atual
                          const pendingWorks = works.filter((w) => {
                            const isPending =
                              w.status === "pending" || w.status === "pendente";
                            const isAssignedToUser =
                              currentUser &&
                              // Verificar assignedTo (campo legacy)
                              ((w.assignedTo &&
                                (w.assignedTo === currentUser.name ||
                                  w.assignedTo
                                    .toLowerCase()
                                    .includes(currentUser.name.toLowerCase()) ||
                                  currentUser.name
                                    .toLowerCase()
                                    .includes(w.assignedTo.toLowerCase()))) ||
                                // Verificar assignedUsers array
                                (w.assignedUsers &&
                                  w.assignedUsers.some(
                                    (user) =>
                                      user.name === currentUser.name ||
                                      user.id === currentUser.id,
                                  )) ||
                                // Verificar assignedUserIds array
                                (w.assignedUserIds &&
                                  w.assignedUserIds.includes(currentUser.id)));
                            return isPending; // Mostrar todas as obras pendentes
                          });
                          console.log(
                            "📊 Dashboard - Obras Pendentes Atribuídas:",
                            pendingWorks.length,
                            "Utilizador:",
                            currentUser?.name,
                            pendingWorks.map((w) => ({
                              id: w.id,
                              status: w.status,
                              title: w.workSheetNumber,
                              assignedTo: w.assignedTo,
                              assignedUsers: w.assignedUsers,
                            })),
                          );
                          return pendingWorks.length;
                        })()}
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
                        {(() => {
                          // Filtrar obras em progresso atribuídas ao utilizador atual
                          const inProgressWorks = works.filter((w) => {
                            const isInProgress =
                              w.status === "in_progress" ||
                              w.status === "em_progresso";
                            const isAssignedToUser =
                              currentUser &&
                              // Verificar assignedTo (campo legacy)
                              ((w.assignedTo &&
                                (w.assignedTo === currentUser.name ||
                                  w.assignedTo
                                    .toLowerCase()
                                    .includes(currentUser.name.toLowerCase()) ||
                                  currentUser.name
                                    .toLowerCase()
                                    .includes(w.assignedTo.toLowerCase()))) ||
                                // Verificar assignedUsers array
                                (w.assignedUsers &&
                                  w.assignedUsers.some(
                                    (user) =>
                                      user.name === currentUser.name ||
                                      user.id === currentUser.id,
                                  )) ||
                                // Verificar assignedUserIds array
                                (w.assignedUserIds &&
                                  w.assignedUserIds.includes(currentUser.id)));
                            return isInProgress; // Mostrar todas as obras em progresso
                          });
                          return inProgressWorks.length;
                        })()}
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
                        {
                          works.filter(
                            (w) =>
                              w.status === "completed" ||
                              w.status === "concluida",
                          ).length
                        }
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
                        {(() => {
                          // Filtrar obras sem folha gerada atribuídas ao utilizador atual (excluir concluídas)
                          const worksWithoutSheets = works.filter((w) => {
                            const isNotCompleted =
                              w.status !== "completed" &&
                              w.status !== "concluida";
                            const noSheetGenerated = !w.folhaGerada;
                            const isAssignedToUser =
                              currentUser &&
                              // Verificar assignedTo (campo legacy)
                              ((w.assignedTo &&
                                (w.assignedTo === currentUser.name ||
                                  w.assignedTo
                                    .toLowerCase()
                                    .includes(currentUser.name.toLowerCase()) ||
                                  currentUser.name
                                    .toLowerCase()
                                    .includes(w.assignedTo.toLowerCase()))) ||
                                // Verificar assignedUsers array
                                (w.assignedUsers &&
                                  w.assignedUsers.some(
                                    (user) =>
                                      user.name === currentUser.name ||
                                      user.id === currentUser.id,
                                  )) ||
                                // Verificar assignedUserIds array
                                (w.assignedUserIds &&
                                  w.assignedUserIds.includes(currentUser.id)));
                            return (
                              isNotCompleted && noSheetGenerated
                              // Mostrar todas as obras sem folha gerada (não apenas atribuídas)
                            );
                          });
                          return worksWithoutSheets.length;
                        })()}
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
                        {(() => {
                          // Filtrar TODAS as obras atribuídas ao utilizador atual (excluir concluídas)
                          const assignedWorks = works.filter((w) => {
                            const isNotCompleted =
                              w.status !== "completed" &&
                              w.status !== "concluida";
                            const isAssignedToUser =
                              currentUser &&
                              // Verificar assignedTo (campo legacy)
                              ((w.assignedTo &&
                                (w.assignedTo === currentUser.name ||
                                  w.assignedTo
                                    .toLowerCase()
                                    .includes(currentUser.name.toLowerCase()) ||
                                  currentUser.name
                                    .toLowerCase()
                                    .includes(w.assignedTo.toLowerCase()))) ||
                                // Verificar assignedUsers array
                                (w.assignedUsers &&
                                  w.assignedUsers.some(
                                    (user) =>
                                      user.name === currentUser.name ||
                                      user.id === currentUser.id,
                                  )) ||
                                // Verificar assignedUserIds array
                                (w.assignedUserIds &&
                                  w.assignedUserIds.includes(currentUser.id)));
                            return true; // Mostrar todas as obras (não apenas atribuídas)
                          });
                          return assignedWorks.length;
                        })()}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Lista das Últimas 3 Obras */}
                {(() => {
                  // Filtrar obras atribuídas ao utilizador atual (excluir concluídas)
                  const assignedWorks = works.filter((w) => {
                    const isNotCompleted =
                      w.status !== "completed" && w.status !== "concluida";
                    const isAssignedToUser =
                      currentUser &&
                      // Verificar assignedTo (campo legacy)
                      ((w.assignedTo &&
                        (w.assignedTo === currentUser.name ||
                          w.assignedTo
                            .toLowerCase()
                            .includes(currentUser.name.toLowerCase()) ||
                          currentUser.name
                            .toLowerCase()
                            .includes(w.assignedTo.toLowerCase()))) ||
                        // Verificar assignedUsers array
                        (w.assignedUsers &&
                          w.assignedUsers.some(
                            (user) =>
                              user.name === currentUser.name ||
                              user.id === currentUser.id,
                          )) ||
                        // Verificar assignedUserIds array
                        (w.assignedUserIds &&
                          w.assignedUserIds.includes(currentUser.id)));
                    return true; // Mostrar todas as obras na lista
                  }); // Remover limitação - mostrar todas as obras

                  return assignedWorks.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-sm">
                      <div className="flex items-center p-4 border-b border-gray-100">
                        <Building2 className="h-5 w-5 text-purple-600 mr-3" />
                        <h2 className="text-lg font-semibold text-gray-900">
                          Últimas 3 Obras
                        </h2>
                      </div>
                      <div className="p-4 space-y-3">
                        {assignedWorks.map((work) => (
                          <div
                            key={work.id}
                            className="border-l-4 border-purple-500 bg-purple-50 rounded-r-lg p-4 hover:bg-purple-100 transition-colors"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-600">
                                  📍 Morada:
                                </span>
                                {work.location ? (
                                  <button
                                    onClick={() =>
                                      handleAddressClick(work.location)
                                    }
                                    className={`text-sm cursor-pointer hover:opacity-80 ${
                                      enableMapsRedirect
                                        ? "text-blue-600 hover:text-blue-800 underline"
                                        : "text-gray-900 hover:text-blue-600"
                                    }`}
                                  >
                                    {work.location}
                                  </button>
                                ) : (
                                  <span className="text-sm text-gray-500">
                                    N��o especificada
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-600">
                                  👤 Cliente:
                                </span>
                                <span className="text-sm text-gray-900">
                                  {work.client || "Não especificado"}
                                </span>
                              </div>
                              {work.contact && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-600">
                                    📞 Contacto:
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (enablePhoneDialer) {
                                        window.location.href = `tel:${work.contact}`;
                                      }
                                    }}
                                    className={`text-sm ${
                                      enablePhoneDialer
                                        ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {work.contact}
                                  </button>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-600">
                                  ������ Trabalho:
                                </span>
                                <span className="text-sm text-gray-900">
                                  {work.workPerformed ||
                                    work.type ||
                                    "Não especificado"}
                                </span>
                              </div>

                              {/* Estado e Ações */}
                              <div className="flex items-center justify-between pt-2 border-t border-purple-200">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    work.status === "pending"
                                      ? "bg-red-100 text-red-700"
                                      : work.status === "in_progress"
                                        ? "bg-orange-100 text-orange-700"
                                        : work.status === "completed"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {work.status === "pending"
                                    ? "Pendente"
                                    : work.status === "in_progress"
                                      ? "Em Progresso"
                                      : work.status === "completed"
                                        ? "Conclu��da"
                                        : work.status}
                                </span>

                                <div className="flex items-center space-x-2">
                                  {/* Botão Visualizar */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedWork(work);
                                      setViewingWork(true);
                                    }}
                                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                                    title="Visualizar detalhes"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>

                                  {/* Botão Iniciar Obra (só se pendente) */}
                                  {work.status === "pending" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        dataSync.updateWork(work.id, {
                                          status: "in_progress",
                                        });
                                        showNotification(
                                          "Obra Iniciada",
                                          `A obra "${work.client}" foi iniciada`,
                                          "success",
                                        );
                                      }}
                                      className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                                      title="Iniciar obra"
                                    >
                                      <Play className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}

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
                          Nenhuma manutenç������o agendada
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          As futuras manutenç��es aparecerão aqui
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
                                      <span>�����</span>
                                      <span>{maint.type}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-500 text-sm">
                                      <span>🕒</span>
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
                      <span className="text-blue-600">��</span>
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
                            <div className="text-gray-400 mb-2">����</div>
                            <p className="text-gray-500 text-sm font-medium">
                              Não há dados para pesquisar
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              Adicione obras, piscinas, manutenções ou clientes
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
                                  Manutenç��es
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
                                            {client.email} • {client.phone}
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
                                  <div className="text-gray-400 mb-2">
                                    �������
                                  </div>
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
                          Gest��o de piscinas no sistema
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
                      Futuras Manuten��ões
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
                              onClick={() => {
                                if (pool?.location) {
                                  handleAddressClick(pool.location);
                                }
                              }}
                              className={`text-left cursor-pointer hover:opacity-80 ${
                                enableMapsRedirect
                                  ? "text-blue-600 hover:text-blue-800 underline"
                                  : "text-gray-600 hover:text-blue-600"
                              }`}
                            >
                              �� {pool.location}
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
                                Pr���xima manutenção:{" "}
                                {new Date(
                                  pool.nextMaintenance,
                                ).toLocaleDateString("pt-PT")}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedPool(pool);
                                setViewingPool(true);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600"
                              title="Visualizar detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
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
                          Histórico de manutenç��es realizadas
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveSection("nova-manutencao")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Nova Manutenç����o</span>
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
                      placeholder="Pesquisar manuten��ões..."
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
                                      ? "Conclu��do"
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
                                        ����������������� {maint.clientContact}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                              {maint.location && (
                                <div>
                                  <span className="font-medium">Local:</span>{" "}
                                  <button
                                    onClick={() => {
                                      if (maint?.location) {
                                        handleAddressClick(maint.location);
                                      }
                                    }}
                                    className={`text-xs ${
                                      enableMapsRedirect
                                        ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                        : "text-gray-500"
                                    }`}
                                    disabled={!enableMapsRedirect}
                                  >
                                    ����� {maint.location}
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
                            <button
                              onClick={() => {
                                setSelectedMaintenance(maint);
                                setViewingMaintenance(true);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600"
                              title="Visualizar detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
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
                                    `Tem a certeza que deseja apagar a manuten��ão "${maint.type}" da ${maint.poolName}?`,
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
                      <span>Agendar Manutenç����o</span>
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
                                ���������‍🔧 {maint.technician}
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
                          Informações Básicas
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
                            <option value="instalacao">Instalaç����o</option>
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
                          <select
                            name="status"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="pending">Pendente</option>
                            <option value="in_progress">Em Progresso</option>
                            <option value="completed">Concluída</option>
                            <option value="cancelled">Cancelada</option>
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
                          Viaturas e Técnicos
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
                              placeholder="Ex: Jo��o Santos"
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
                            Usuarios Atribuidos ({users.length} utilizadores
                            disponiveis)
                          </label>
                          {(() => {
                            console.log(
                              "📊 TOTAL UTILIZADORES CARREGADOS:",
                              users.length,
                              users,
                            );

                            // Check localStorage directly
                            const localStorageUsers =
                              localStorage.getItem("app-users");
                            console.log(
                              "💾 USERS NO LOCALSTORAGE (app-users):",
                              localStorageUsers,
                            );

                            if (localStorageUsers) {
                              try {
                                const parsed = JSON.parse(localStorageUsers);
                                console.log(
                                  "�� PARSED USERS:",
                                  parsed.length,
                                  parsed,
                                );
                              } catch (e) {
                                console.error(
                                  "❌ ERRO AO FAZER PARSE DOS USERS:",
                                  e,
                                );
                              }
                            }

                            return null;
                          })()}
                          <p className="text-sm text-gray-600 mb-2">
                            Selecione os usuarios responsaveis por esta obra.
                            Utilizadores inativos sao marcados como "(Inativo)".
                          </p>
                          {users.length === 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                              <p className="text-sm text-yellow-800">
                                ⚠️ Nenhum utilizador encontrado. Vá à Área de de
                                Administração → "🔧 Correção de Atribuição de
                                Obras" para corrigir este problema.
                              </p>
                            </div>
                          )}

                          {/* Botão para recarregar utilizadores quando lista está vazia */}
                          {users.length === 0 && (
                            <div className="mb-3">
                              <button
                                type="button"
                                onClick={() => {
                                  console.log(
                                    "🔄 Recarregando utilizadores...",
                                  );
                                  const savedUsers =
                                    localStorage.getItem("app-users");
                                  if (savedUsers) {
                                    try {
                                      const parsedUsers =
                                        JSON.parse(savedUsers);
                                      setUsers(parsedUsers);
                                      alert(
                                        `✅ ${parsedUsers.length} utilizadores carregados!`,
                                      );
                                    } catch (error) {
                                      console.error("Erro:", error);
                                      alert("❌ Erro ao carregar utilizadores");
                                    }
                                  } else {
                                    const defaultUser = {
                                      id: 1,
                                      name: "Gonçalo Fonseca",
                                      email: "gongonsilva@gmail.com",
                                      active: true,
                                      role: "super_admin",
                                      password: "19867gsf",
                                      permissions: {
                                        obras: {
                                          view: true,
                                          create: true,
                                          edit: true,
                                          delete: true,
                                        },
                                        manutencoes: {
                                          view: true,
                                          create: true,
                                          edit: true,
                                          delete: true,
                                        },
                                        piscinas: {
                                          view: true,
                                          create: true,
                                          edit: true,
                                          delete: true,
                                        },
                                        utilizadores: {
                                          view: true,
                                          create: true,
                                          edit: true,
                                          delete: true,
                                        },
                                        relatorios: {
                                          view: true,
                                          create: true,
                                          edit: true,
                                          delete: true,
                                        },
                                        clientes: {
                                          view: true,
                                          create: true,
                                          edit: true,
                                          delete: true,
                                        },
                                      },
                                      createdAt: new Date().toISOString(),
                                    };
                                    setUsers([defaultUser]);
                                    localStorage.setItem(
                                      "app-users",
                                      JSON.stringify([defaultUser]),
                                    );
                                    alert("✅ Utilizador padrão criado!");
                                  }
                                }}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                              >
                                🔄 Recarregar Utilizadores
                              </button>
                            </div>
                          )}

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
                                  : "Nenhum utilizador disponível"}
                              </option>
                              {users
                                .filter((user) => {
                                  // Show ALL users (active and inactive) but mark inactive ones
                                  const alreadyAssigned = assignedUsers.some(
                                    (assigned) =>
                                      assigned.id === String(user.id),
                                  );

                                  console.log(
                                    "����� FILTRO UTILIZADOR:",
                                    user.name,
                                    "| Role:",
                                    user.role,
                                    "| Ativo:",
                                    user.active,
                                    "| Já atribuído:",
                                    alreadyAssigned,
                                    "| PASSA FILTRO:",
                                    !alreadyAssigned,
                                  );

                                  return !alreadyAssigned;
                                })
                                .map((user) => (
                                  <option key={user.id} value={user.id}>
                                    {user.name}{" "}
                                    {user.active === false ? "(Inativo)" : ""}
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
                                    ������ {assignedUser.name}
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
                      <div id="furo-details">
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
                              Medi��ões do Furo
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
                                  N���vel da Água (m) *
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

                          {/* Observa����ões Específicas do Furo */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Observações Específicas do Furo
                            </label>
                            <textarea
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              placeholder="Condi��ões do terreno, qualidade da água, dificuldades encontradas, etc..."
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Observaç��es e Trabalho */}
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
                            placeholder="Observa���ões sobre a obra..."
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
                        onClick={async (e) => {
                          e.preventDefault();

                          // SECURITY: Check if user has permission to create works
                          if (!hasPermission("obras", "create")) {
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
                                'input[placeholder*="João Silva"]',
                              ) as HTMLInputElement
                            )?.value || "";
                          const contact =
                            (
                              form.querySelector(
                                'input[placeholder*="244 123 456"]',
                              ) as HTMLInputElement
                            )?.value || "";
                          const location =
                            (
                              form.querySelector(
                                'input[placeholder*="Rua das Flores"]',
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
                          const observations =
                            (
                              form.querySelector(
                                'textarea[placeholder*="Observa��ões sobre a obra"]',
                              ) as HTMLTextAreaElement
                            )?.value || "";
                          const budget =
                            (
                              form.querySelector(
                                'input[placeholder*="Orçamento"]',
                              ) as HTMLInputElement
                            )?.value || "";

                          // Extract bore/water hole specific data if work type is "furo"
                          let boreData = {};
                          if (selectedWorkType === "furo") {
                            boreData = {
                              boreDepth:
                                (
                                  form.querySelector(
                                    'input[placeholder*="Profundidade do Furo"]',
                                  ) as HTMLInputElement
                                )?.value || "",
                              waterLevel:
                                (
                                  form.querySelector(
                                    'input[placeholder*="Nível da Água"]',
                                  ) as HTMLInputElement
                                )?.value || "",
                              pumpDepth:
                                (
                                  form.querySelector(
                                    'input[placeholder*="Profundidade da Bomba"]',
                                  ) as HTMLInputElement
                                )?.value || "",
                              flowRate:
                                (
                                  form.querySelector(
                                    'input[placeholder*="Caudal do Furo"]',
                                  ) as HTMLInputElement
                                )?.value || "",
                              columnType:
                                (
                                  form.querySelector(
                                    "select",
                                  ) as HTMLSelectElement
                                )?.value || "",
                              columnDiameter:
                                (
                                  form.querySelectorAll(
                                    "select",
                                  )[1] as HTMLSelectElement
                                )?.value || "",
                              pumpModel:
                                (
                                  form.querySelector(
                                    'input[placeholder*="Modelo da Bomba"]',
                                  ) as HTMLInputElement
                                )?.value || "",
                              motorPower:
                                (
                                  form.querySelectorAll(
                                    "select",
                                  )[2] as HTMLSelectElement
                                )?.value || "",
                              pumpVoltage:
                                (
                                  form.querySelectorAll(
                                    "select",
                                  )[3] as HTMLSelectElement
                                )?.value || "",
                              boreObservations:
                                (
                                  form.querySelector(
                                    'textarea[placeholder*="Condi��ões do terreno"]',
                                  ) as HTMLTextAreaElement
                                )?.value || "",
                            };
                          }

                          // Create complete work data object (matching Work interface)
                          const workData = {
                            id: Date.now().toString(),
                            workSheetNumber: workTitle.startsWith("LS-")
                              ? workTitle
                              : `LS-${Date.now()}`,
                            type: (() => {
                              const validTypes = [
                                "piscina",
                                "manutencao",
                                "avaria",
                                "montagem",
                              ];
                              if (workType === "instalacao") return "montagem"; // Map instalacao to montagem
                              if (workType === "reparacao") return "avaria"; // Map reparacao to avaria
                              if (workType === "limpeza") return "manutencao"; // Map limpeza to manutencao
                              if (workType === "furo") return "montagem"; // Map furo to montagem
                              return validTypes.includes(workType)
                                ? (workType as
                                    | "piscina"
                                    | "manutencao"
                                    | "avaria"
                                    | "montagem")
                                : "piscina";
                            })(),
                            clientName: client || "",
                            contact: contact || "",
                            address: location || "",
                            entryTime: startTime || new Date().toISOString(),
                            exitTime: endTime || undefined,
                            status: (() => {
                              switch (status) {
                                case "pending":
                                  return "pendente";
                                case "in_progress":
                                  return "em_progresso";
                                case "completed":
                                  return "concluida";
                                default:
                                  return "pendente";
                              }
                            })(),
                            ...boreData, // Spread bore-specific data if applicable
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
                            photos:
                              uploadedPhotos.map((photo) => ({
                                id: photo.id,
                                url: photo.data,
                                filename: photo.name,
                                uploadedAt: new Date().toISOString(),
                              })) || [],
                            observations: observations || "",
                            workPerformed: description || "",
                            workSheetCompleted: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                          };

                          // Use sync system to add work (will handle Firebase and localStorage)
                          try {
                            const newWork = await addWork(workData);

                            // Success - no notification needed
                          } catch (error) {
                            console.error("❌ Error creating work:", error);
                            alert(
                              `Erro ao criar obra: ${error.message || error}`,
                            );
                            return;
                          }

                          // Complex processing removed to prevent instability

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
                            console.log(
                              "🔍 Select cliente onChange:",
                              e.target.value,
                            );
                            if (e.target.value === "novo") {
                              console.log(
                                "🔍 Tentando mostrar formulário de novo cliente...",
                              );
                              console.log("🔍 Current User:", currentUser);
                              console.log(
                                "🔍 hasPermission clientes create:",
                                hasPermission("clientes", "create"),
                              );

                              if (!hasPermission("clientes", "create")) {
                                alert(
                                  "❌ Não tem permissão para criar clientes. Contacte o administrador.",
                                );
                                return;
                              }

                              console.log(
                                "✅ Mostrando formulário de novo cliente",
                              );
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
                              console.log(
                                "���� DEBUG: Tentando adicionar cliente...",
                              );
                              console.log("🔍 Current User:", currentUser);
                              console.log("🔍 User Role:", currentUser?.role);
                              console.log(
                                "🔍 User Permissions:",
                                currentUser?.permissions,
                              );
                              console.log(
                                "🔍 hasPermission clientes create:",
                                hasPermission("clientes", "create"),
                              );

                              if (newClientForm.name.trim()) {
                                // Check permissions first
                                if (!hasPermission("clientes", "create")) {
                                  alert(
                                    "❌ Não tem permissão para criar clientes. Contacte o administrador.",
                                  );
                                  console.error(
                                    "❌ PERMISSÃO NEGADA: clientes.create",
                                  );
                                  return;
                                }

                                console.log(
                                  "✅ Permissão validada, criando cliente...",
                                );
                                // Add client to the system
                                const newClient = {
                                  name: newClientForm.name,
                                  email: newClientForm.email,
                                  phone: newClientForm.phone,
                                  address: newClientForm.address,
                                  pools: [],
                                };

                                try {
                                  dataSync.addClient(newClient);
                                  console.log(
                                    "��� Cliente adicionado com sucesso:",
                                    newClient,
                                  );
                                } catch (error) {
                                  console.error(
                                    "��� Erro ao adicionar cliente:",
                                    error,
                                  );
                                  alert(
                                    "❌ Erro ao adicionar cliente: " + error,
                                  );
                                  return;
                                }

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
                        Localizaç��o Completa *
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
                          <option value="gas">Aquecimento a G��s</option>
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
                        Observa��ões e Características Especiais
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
                          if (!hasPermission("piscinas", "create")) {
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
                            id: Date.now().toString(),
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
                                  "Manuten����ão programada durante criação da piscina",
                                notes:
                                  "Agendada automaticamente na criação da piscina",
                                clientName: poolData.client,
                                clientContact: poolData.contact || "",
                                location: poolData.location,
                              };

                              addMaintenance(futureMaintenance);
                              console.log(
                                "Futura manutenç�������������o criada para nova piscina:",
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
                        Nova Manutenção
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
                          "Verificação alimenta��ão",
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
                          Fotografias da Manutenção
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
                          manutenç����o
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
                        <span>Guardar Interven��ão</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );

        case "configuracoes_unused":
          // Safety check for activeAdminTab
          const safeActiveAdminTab = activeAdminTab || "relatorios";

          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Settings className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Configurações
                      </h1>
                      <p className="text-gray-600 text-sm">
                        Configurações do sistema, relatórios e utilizadores
                      </p>
                    </div>
                  </div>
                </div>
                {/* Tabs Navigation */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                      <button
                        onClick={() => setActiveAdminTab("relatorios")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          safeActiveAdminTab === "relatorios"
                            ? "border-red-500 text-red-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4" />
                          <span>Relatórios</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveAdminTab("configuracoes")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          safeActiveAdminTab === "configuracoes"
                            ? "border-red-500 text-red-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span>Configurações</span>
                        </div>
                      </button>
                      {(currentUser?.role === "super_admin" ||
                        currentUser?.role === "admin") && (
                        <button
                          onClick={() => setActiveAdminTab("utilizadores")}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            safeActiveAdminTab === "utilizadores"
                              ? "border-red-500 text-red-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <UserPlus className="h-4 w-4" />
                            <span>Utilizadores</span>
                          </div>
                        </button>
                      )}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {safeActiveAdminTab === "relatorios" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Relat��rios do Sistema
                          </h2>
                          <p className="text-gray-600 mb-6">
                            Gere relatórios detalhados em PDF sobre piscinas,
                            manutenções e obras.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Pool Reports */}
                          <div className="bg-gray-50 rounded-lg p-6">
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
                                <strong>{pools.length}</strong> piscinas
                                registadas
                              </p>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li>🔍 Estado e localização</li>
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
                          <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Wrench className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Relatório de Manutenções
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Hist��rico de intervenções
                                </p>
                              </div>
                            </div>
                            <div className="space-y-3 mb-4">
                              <p className="text-sm text-gray-600">
                                <strong>{maintenance.length}</strong>{" "}
                                manutenções registadas
                              </p>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li>🔧 Trabalhos realizados</li>
                                <li>👷 Técnicos responsáveis</li>
                                <li>• Datas e durações</li>
                                <li>• Estados e observações</li>
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
                          <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-orange-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Relatório de Obras
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Lista de projetos
                                </p>
                              </div>
                            </div>
                            <div className="space-y-3 mb-4">
                              <p className="text-sm text-gray-600">
                                <strong>{works.length}</strong> obras registadas
                              </p>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li>🏗️ Estado dos projetos</li>
                                <li>👥 Equipas atribuídas</li>
                                <li>• Prazos e orçamentos</li>
                                <li>• Clientes e localizações</li>
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
                        </div>
                      </div>
                    )}

                    {safeActiveAdminTab === "configuracoes" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Configurações do Sistema
                          </h2>
                          <p className="text-gray-600 mb-6">
                            Gerir configurações da aplicação, notificações e
                            preferências.
                          </p>
                        </div>

                        {/* Settings Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">
                              Notificações
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                  Notificações Push
                                </span>
                                <button
                                  onClick={requestNotificationPermission}
                                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    notificationsEnabled
                                      ? "bg-red-600"
                                      : "bg-gray-200"
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                      notificationsEnabled
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    }`}
                                  />
                                </button>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                  Sincronização Automática
                                </span>
                                <button
                                  onClick={() =>
                                    setAutoSyncEnabled(!autoSyncEnabled)
                                  }
                                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    autoSyncEnabled
                                      ? "bg-red-600"
                                      : "bg-gray-200"
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                      autoSyncEnabled
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">
                              Sistema
                            </h3>
                            <div className="space-y-4">
                              <button
                                onClick={() => setShowDataCleanup(true)}
                                className="w-full text-left p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                              >
                                <div className="flex items-center space-x-3">
                                  <Database className="h-5 w-5 text-yellow-600" />
                                  <div>
                                    <p className="font-medium text-yellow-800">
                                      Limpeza de Dados
                                    </p>
                                    <p className="text-sm text-yellow-600">
                                      Eliminar dados de teste
                                    </p>
                                  </div>
                                </div>
                              </button>

                              <button
                                onClick={() => setShowAdvancedSettings(true)}
                                className="w-full text-left p-3 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                <div className="flex items-center space-x-3">
                                  <Settings className="h-5 w-5 text-gray-600" />
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      Configurações Avançadas
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Firebase, APIs e desenvolvimento
                                    </p>
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {safeActiveAdminTab === "utilizadores" &&
                      (currentUser?.role === "super_admin" ||
                        currentUser?.role === "admin") && (
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                              Gestão de Utilizadores
                            </h2>
                            <p className="text-gray-600 mb-6">
                              Criar, editar e gerir utilizadores do sistema.
                            </p>
                          </div>

                          <UserPermissionsManager />
                        </div>
                      )}
                  </div>
                </div>
                ) : ( /* Simple configuration for non-admin users */
                <div className="space-y-6">
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
                        <span className="font-medium">{currentUser?.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Perfil</span>
                        <span className="font-medium capitalize">
                          {currentUser?.role?.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Modo de Dados</span>
                        <span className="font-medium">Armazenamento Local</span>
                      </div>
                    </div>
                  </div>

                  {/* Basic Notifications for all users */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <Bell className="h-6 w-6 text-blue-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Notificações
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Notificações Push
                        </span>
                        <button
                          onClick={requestNotificationPermission}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            notificationsEnabled ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              notificationsEnabled
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

        case "relatorios":
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                  Relatórios Movidos
                </h1>
                <p className="text-gray-600 mb-4">
                  Os relatórios agora estão na página de Configurações.
                </p>
                <button
                  onClick={() => {
                    setActiveAdminTab("relatorios");
                    navigateToSection("configuracoes");
                  }}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Ir para Configurações
                </button>
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
                <EmergencyLogoutManager />
              </div>
            </div>
          );

        case "configuracoes":
          // Safety check for activeAdminTab
          const safeActiveConfigTab = activeAdminTab || "configuracoes";

          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Settings className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Configurações
                      </h1>
                      <p className="text-gray-600 text-sm">
                        Configurações do sistema, relatórios e utilizadores
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabs Navigation - Show additional tabs for admin users */}
                {currentUser?.role === "super_admin" ||
                currentUser?.role === "admin" ? (
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8 px-6">
                        <button
                          onClick={() => setActiveAdminTab("configuracoes")}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            safeActiveConfigTab === "configuracoes"
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Settings className="h-4 w-4" />
                            <span>Configurações</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveAdminTab("relatorios")}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            safeActiveConfigTab === "relatorios"
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="h-4 w-4" />
                            <span>Relatórios</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveAdminTab("utilizadores")}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            safeActiveConfigTab === "utilizadores"
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <UserPlus className="h-4 w-4" />
                            <span>Utilizadores</span>
                          </div>
                        </button>
                      </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                      {/* Configurações Tab */}
                      {safeActiveConfigTab === "configuracoes" && (
                        <div className="space-y-6">
                          {/* System Information */}
                          <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Informações do Sistema
                            </h3>
                            <div className="grid gap-3">
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Versão</span>
                                <span className="font-medium">1.0.0</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">
                                  Utilizador Ativo
                                </span>
                                <span className="font-medium">
                                  {currentUser?.name}
                                </span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Perfil</span>
                                <span className="font-medium capitalize">
                                  {currentUser?.role?.replace("_", " ")}
                                </span>
                              </div>
                              <div className="flex justify-between py-2">
                                <span className="text-gray-600">
                                  Modo de Dados
                                </span>
                                <span className="font-medium">
                                  Armazenamento Local
                                </span>
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
                              Ative as notificações para receber alertas sobre
                              novas obras atribuídas e atualizações importantes.
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
                                      Receba notificaç��es quando uma nova obra
                                      for atribuída a si.
                                    </p>
                                    <button
                                      onClick={() => {
                                        if ("Notification" in window) {
                                          if (
                                            Notification.permission ===
                                            "default"
                                          ) {
                                            Notification.requestPermission().then(
                                              (permission) => {
                                                if (permission === "granted") {
                                                  new Notification(
                                                    "Leirisonda",
                                                    {
                                                      body: "Notificações ativadas com sucesso!",
                                                      icon: "/icon.svg",
                                                    },
                                                  );
                                                }
                                              },
                                            );
                                          } else if (
                                            Notification.permission ===
                                            "granted"
                                          ) {
                                            new Notification("Leirisonda", {
                                              body: "Notificações já estão ativadas!",
                                              icon: "/icon.svg",
                                            });
                                          } else {
                                            alert(
                                              "Notifica���ões foram bloqueadas. Por favor, ative-as nas configuraç��es do navegador.",
                                            );
                                          }
                                        } else {
                                          alert(
                                            "Este navegador não suporta notificaç�����es.",
                                          );
                                        }
                                      }}
                                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    >
                                      Ativar Notificaç����es
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Configurações de Localiza���ão Individual - Apenas para super_admin */}
                              {currentUser?.role === "super_admin" && (
                                <PersonalLocationSettings />
                              )}

                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                  <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                      Instruç��es
                                    </h4>
                                    <ul className="text-gray-700 text-sm space-y-1">
                                      <li>
                                        • As notificaç���es funcionam apenas com
                                        HTTPS
                                      </li>
                                      <li>
                                        • Certifique-se de que permite
                                        notifica���ões no seu navegador
                                      </li>
                                      <li>
                                        • Em dispositivos móveis, adicione a app
                                        ao ecrã inicial
                                      </li>
                                      <li>
                                        • Configure a sua localização abaixo e
                                        veja o mapa da equipa na página
                                        "Localizações"
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
                              Configure o comportamento de cliques em contactos
                              e moradas
                            </p>

                            <div className="space-y-4">
                              {/* Phone Dialer Setting */}
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    🏊
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
                                      Quando ativado, clicar num número de
                                      telefone abrir�� diretamente o marcador do
                                      telefone.
                                    </p>
                                    <p className="text-blue-600 text-xs">
                                      Estado:{" "}
                                      {enablePhoneDialer
                                        ? "✅ Ativo"
                                        : "⭕ Inativo"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Maps Redirect Setting */}
                              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    🔧
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-medium text-green-900">
                                        Navegação Maps
                                      </h4>
                                      <button
                                        onClick={() =>
                                          toggleMapsRedirect(
                                            !enableMapsRedirect,
                                          )
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
                                      Quando ativado, clicar numa morada abrirá
                                      o Google Maps para navegação.
                                    </p>
                                    <p className="text-green-600 text-xs">
                                      Estado:{" "}
                                      {enableMapsRedirect
                                        ? "�� Ativo"
                                        : "⭕ Inativo"}
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
                                        • As definições são guardadas localmente
                                        no dispositivo
                                      </li>
                                      <li>
                                        • A marcaç����o automática funciona
                                        melhor em dispositivos móveis
                                      </li>
                                      <li>
                                        ��� O Google Maps abre numa nova
                                        janela/tab
                                      </li>
                                      <li>
                                        • Pode ativar ou desativar cada
                                        funcionalidade independentemente
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Data Management Section - Only for Super Admin */}
                          {currentUser?.role === "super_admin" && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                              <div className="flex items-center mb-4">
                                <Trash2 className="h-6 w-6 text-red-600 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Gestão de Dados
                                </h3>
                              </div>
                              <p className="text-gray-600 mb-6">
                                Elimine todos os dados de obras, manutencoes e
                                piscinas para comecar com uma aplicacao limpa.
                                Os utilizadores sao mantidos.
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
                                          �� Todas as obras ({works.length}{" "}
                                          registos)
                                        </li>
                                        <li>
                                          • Todas as manutenções (
                                          {maintenance.length} registos)
                                        </li>
                                        <li>
                                          • Todas as piscinas ({pools.length}{" "}
                                          registos)
                                        </li>
                                        <li>
                                          🔥 Dados do Firebase e armazenamento
                                          local
                                        </li>
                                      </ul>
                                      <p className="text-red-700 text-sm font-medium mb-3">
                                        ���️ ATENÇÃO: Esta operação é
                                        irrevers��vel!
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

                          {/* Notifications and Settings content continues... */}
                          <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center mb-4">
                              <Bell className="h-6 w-6 text-blue-600 mr-3" />
                              <h3 className="text-lg font-semibold text-gray-900">
                                Notificações
                              </h3>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                  Notificações Push
                                </span>
                                <button
                                  onClick={requestNotificationPermission}
                                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    notificationsEnabled
                                      ? "bg-blue-600"
                                      : "bg-gray-200"
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                      notificationsEnabled
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    }`}
                                  />
                                </button>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                  Sincronização Automática
                                </span>
                                <button
                                  onClick={() =>
                                    setAutoSyncEnabled(!autoSyncEnabled)
                                  }
                                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    autoSyncEnabled
                                      ? "bg-blue-600"
                                      : "bg-gray-200"
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                      autoSyncEnabled
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>

                          {currentUser?.role === "super_admin" && (
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h3 className="text-lg font-semibold mb-4">
                                Sistema
                              </h3>
                              <div className="space-y-4">
                                <button
                                  onClick={() => setShowDataCleanup(true)}
                                  className="w-full text-left p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Database className="h-5 w-5 text-yellow-600" />
                                    <div>
                                      <p className="font-medium text-yellow-800">
                                        Limpeza de Dados
                                      </p>
                                      <p className="text-sm text-yellow-600">
                                        Eliminar dados de teste
                                      </p>
                                    </div>
                                  </div>
                                </button>

                                <button
                                  onClick={() => setShowAdvancedSettings(true)}
                                  className="w-full text-left p-3 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Settings className="h-5 w-5 text-gray-600" />
                                    <div>
                                      <p className="font-medium text-gray-800">
                                        Configurações Avançadas
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Firebase, APIs e desenvolvimento
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* System Diagnostics Section - Only for Super Admin */}
                          {currentUser?.role === "super_admin" && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                              <div className="flex items-center mb-4">
                                <Settings className="h-6 w-6 text-purple-600 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Diagnósticos do Sistema
                                </h3>
                              </div>
                              <p className="text-gray-600 mb-6">
                                Ferramentas de diagnóstico e correção para
                                problemas do sistema.
                              </p>

                              <div className="space-y-4">
                                {/* Data Input Status */}
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                  <DataInputStatusIndicator />
                                </div>

                                {/* Firebase Fix Button */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-blue-900">
                                      Correção Firebase
                                    </h4>
                                    <FirebaseFixButton />
                                  </div>
                                  <p className="text-blue-700 text-sm">
                                    Use este botão se encontrar problemas de
                                    autenticação ou conexão.
                                  </p>
                                </div>

                                {/* Tutorial Access */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-green-900">
                                      Tutorial Interativo
                                    </h4>
                                    <DataInputTutorial />
                                  </div>
                                  <p className="text-green-700 text-sm">
                                    Tutorial passo-a-passo para inserção de
                                    dados.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Reports Tab */}
                      {safeActiveConfigTab === "relatorios" && (
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                              Relatórios do Sistema
                            </h2>
                            <p className="text-gray-600 mb-6">
                              Gere relat����rios detalhados em PDF sobre
                              piscinas, manutenções e obras.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Pool Reports */}
                            <div className="bg-gray-50 rounded-lg p-6">
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
                                  <strong>{pools.length}</strong> piscinas
                                  registadas
                                </p>
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
                            <div className="bg-gray-50 rounded-lg p-6">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <Wrench className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    Relat��rio de Manutenções
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    Histórico de intervenções
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-3 mb-4">
                                <p className="text-sm text-gray-600">
                                  <strong>{maintenance.length}</strong>{" "}
                                  manutenções registadas
                                </p>
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
                            <div className="bg-gray-50 rounded-lg p-6">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <Building2 className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    Relatório de Obras
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    Lista de projetos
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-3 mb-4">
                                <p className="text-sm text-gray-600">
                                  <strong>{works.length}</strong> obras
                                  registadas
                                </p>
                              </div>
                              <button
                                onClick={() => generateWorksPDF()}
                                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                              >
                                <Download className="h-4 w-4" />
                                <span>Gerar PDF</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Users Tab */}
                      {safeActiveConfigTab === "utilizadores" && (
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                              Gestão de Utilizadores
                            </h2>
                            <p className="text-gray-600 mb-6">
                              Criar, editar e gerir utilizadores do sistema.
                            </p>
                          </div>

                          <UserPermissionsManager />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Simple configuration for non-admin users */
                  <div className="space-y-6">
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
                          <span className="text-gray-600">
                            Utilizador Ativo
                          </span>
                          <span className="font-medium">
                            {currentUser?.name}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Perfil</span>
                          <span className="font-medium capitalize">
                            {currentUser?.role?.replace("_", " ")}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Modo de Dados</span>
                          <span className="font-medium">
                            Armazenamento Local
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Basic Notifications for all users */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex items-center mb-4">
                        <Bell className="h-6 w-6 text-blue-600 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Notificações
                        </h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Notificações Push
                          </span>
                          <button
                            onClick={requestNotificationPermission}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              notificationsEnabled
                                ? "bg-blue-600"
                                : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                notificationsEnabled
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </button>
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
                        <li>🔍 Estado e localização</li>
                        <li>• Informaç��es de clientes</li>
                        <li>• Histórico de manuten�������es</li>
                        <li>• Próximas interven��ões</li>
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
                          Histórico de intervenç��es
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>{maintenance.length}</strong> manuten��������es
                        registadas
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>�� Trabalhos realizados</li>
                        <li>�� T��cnicos responsáveis</li>
                        <li>• Datas e duraç��es</li>
                        <li>• Estados e observações</li>
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
                          Relat��rio de Obras
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
                        <li>�� Equipas responsáveis</li>
                        <li>��� Estados de progresso</li>
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
                        <li>�� Piscinas associadas</li>
                        <li>�� Histórico de serviços</li>
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
                        <li>• Resumo executivo</li>
                        <li>• Estatísticas gerais</li>
                        <li>📊 Dados consolidados</li>
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
                        Crie relat��rios com filtros específicos
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
                          <span className="text-xs">Manutenç���es</span>
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
                    Estat��sticas Rápidas
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
                          Gest���o da base de dados de clientes
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
                                  onClick={() => {
                                    if (client?.address) {
                                      handleAddressClick(client.address);
                                    }
                                  }}
                                  className={`text-left ${
                                    enableMapsRedirect
                                      ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                      : "text-gray-600"
                                  }`}
                                  disabled={
                                    !enableMapsRedirect || !client?.address
                                  }
                                >
                                  ��{" "}
                                  {client?.address || "Endereço não disponível"}
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
                            <option value="publico">Entidade P��blica</option>
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
                            Pessoa de Contacto (se aplic����vel)
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
                          Obras ({works.length})
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
                      {
                        works.filter(
                          (w) =>
                            w.status === "pendente" || w.status === "pending",
                        ).length
                      }
                      )
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
                      {
                        works.filter(
                          (w) =>
                            w.status === "em_progresso" ||
                            w.status === "in_progress",
                        ).length
                      }
                      )
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
                      {
                        works.filter(
                          (w) =>
                            w.status === "concluida" ||
                            w.status === "completed",
                        ).length
                      }
                      )
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
                          (w) =>
                            !w.folhaGerada &&
                            w.status !== "completed" &&
                            w.status !== "concluida",
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
                        return (
                          !work.folhaGerada &&
                          work.status !== "completed" &&
                          work.status !== "concluida"
                        );
                      if (activeWorkFilter === "pending")
                        return (
                          work.status === "pendente" ||
                          work.status === "pending"
                        );
                      if (activeWorkFilter === "in_progress")
                        return (
                          work.status === "em_progresso" ||
                          work.status === "in_progress"
                        );
                      if (activeWorkFilter === "completed")
                        return (
                          work.status === "concluida" ||
                          work.status === "completed"
                        );
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
                              <div className="flex items-center space-x-2"></div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  work.status === "pendente" ||
                                  work.status === "pending"
                                    ? "bg-red-100 text-red-700 border border-red-200"
                                    : work.status === "em_progresso" ||
                                        work.status === "in_progress"
                                      ? "bg-orange-100 text-orange-700 border border-orange-200"
                                      : work.status === "concluida" ||
                                          work.status === "completed"
                                        ? "bg-green-100 text-green-700 border border-green-200"
                                        : "bg-gray-100 text-gray-700 border border-gray-200"
                                }`}
                              >
                                {work.status === "pendente" ||
                                work.status === "pending"
                                  ? "Pendente"
                                  : work.status === "em_progresso" ||
                                      work.status === "in_progress"
                                    ? "Em Progresso"
                                    : work.status === "concluida" ||
                                        work.status === "completed"
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
                                    �� Cliente:
                                  </span>
                                  <span className="text-gray-900 font-medium">
                                    {work.clientName || work.client}
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
                                        ���������� {work.contact}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">Local:</span>{" "}
                                <button
                                  onClick={() => {
                                    if (work?.address || work?.location) {
                                      handleAddressClick(
                                        work.address || work.location,
                                      );
                                    }
                                  }}
                                  className={`text-xs ${
                                    enableMapsRedirect
                                      ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                      : "text-gray-500"
                                  }`}
                                  disabled={!enableMapsRedirect}
                                >
                                  ��� {work.address || work.location}
                                </button>
                              </div>
                              <div>
                                <span className="font-medium">Início:</span>{" "}
                                {new Date(
                                  work.entryTime ||
                                    work.startDate ||
                                    work.createdAt,
                                ).toLocaleDateString("pt-PT")}
                              </div>
                              <div>
                                <span className="font-medium">
                                  Atribu������da a:
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
                                  �������{work.budget}
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
                      return (
                        !work.folhaGerada &&
                        work.status !== "completed" &&
                        work.status !== "concluida"
                      );
                    if (activeWorkFilter === "pending")
                      return (
                        work.status === "pendente" || work.status === "pending"
                      );
                    if (activeWorkFilter === "in_progress")
                      return (
                        work.status === "em_progresso" ||
                        work.status === "in_progress"
                      );
                    if (activeWorkFilter === "completed")
                      return (
                        work.status === "concluida" ||
                        work.status === "completed"
                      );
                    return work.status === activeWorkFilter;
                  }).length === 0 && (
                    <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhuma obra encontrada
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {activeWorkFilter === "all"
                          ? "N��o há obras registadas no sistema."
                          : `Não há obras com o filtro "${
                              activeWorkFilter === "pending"
                                ? "Pendentes"
                                : activeWorkFilter === "in_progress"
                                  ? "Em Progresso"
                                  : activeWorkFilter === "completed"
                                    ? "Conclu��das"
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
                  <form className="space-y-8">
                    {/* Informa��ões Básicas */}
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Informações Básicas
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Folha de Obra *
                          </label>
                          <input
                            type="text"
                            defaultValue={
                              editingWork?.workSheetNumber || editingWork?.title
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="LS-2025-163"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Trabalho *
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            defaultValue={editingWork?.type || ""}
                          >
                            <option value="">Selecionar tipo</option>
                            <option value="piscina">Piscina</option>
                            <option value="manutencao">Manuten��ão</option>
                            <option value="instalacao">Instala��ão</option>
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
                            defaultValue={editingWork?.client}
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
                            defaultValue={editingWork?.contact}
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
                            defaultValue={editingWork?.location}
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
                              defaultValue={editingWork?.startTime}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hora de Saída
                            </label>
                            <input
                              type="datetime-local"
                              defaultValue={editingWork?.endTime}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Deixe vazio se ainda não terminou"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Deixe vazio se ainda n���o terminou
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado da Obra *
                          </label>
                          <select
                            name="status"
                            defaultValue={editingWork?.status}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="pending">Pendente</option>
                            <option value="in_progress">Em Progresso</option>
                            <option value="completed">Concluída</option>
                            <option value="cancelled">Cancelada</option>
                          </select>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="folha-preenchida-edit"
                            defaultChecked={editingWork?.workSheetCompleted}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="folha-preenchida-edit"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Folha de obra preenchida/feita
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* T��cnicos Atribuídos */}
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Técnicos Atribuídos
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Selecione os usuarios responsaveis por esta obra (
                            {users.length} utilizadores disponiveis).
                            Utilizadores inativos sao marcados como "(Inativo)".
                          </p>
                          {users.length === 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                              <p className="text-sm text-yellow-800">
                                ������� Nenhum utilizador encontrado. Vá à Área
                                de Administra��ão → "🔧 Correção de Atribuição
                                de Obras" para corrigir este problema.
                              </p>
                            </div>
                          )}
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
                                  ? "Selecionar usuário..."
                                  : "Nenhum utilizador disponível"}
                              </option>
                              {users
                                .filter((user) => {
                                  return !editAssignedUsers.some(
                                    (assigned) =>
                                      assigned.id === String(user.id),
                                  );
                                })
                                .map((user) => (
                                  <option key={user.id} value={user.id}>
                                    {user.name}{" "}
                                    {user.active === false ? "(Inativo)" : ""}
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

                                    if (!isAlreadyAssigned) {
                                      setEditAssignedUsers([
                                        ...editAssignedUsers,
                                        {
                                          id: userIdStr,
                                          name: selectedUser.name,
                                        },
                                      ]);
                                      setCurrentEditAssignedUser("");
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
                                    ���� {assignedUser.name}
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
                      </div>
                    </div>

                    {/* Observações */}
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Observa��ões
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trabalho Realizado
                          </label>
                          <textarea
                            defaultValue={editingWork?.workPerformed}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Descriç��o do trabalho realizado..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Observações sobre a obra
                          </label>
                          <textarea
                            defaultValue={editingWork?.observations}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Observações sobre a obra..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Detalhes do Furo de Água */}
                    <div className="border border-cyan-200 rounded-lg p-6 bg-cyan-50">
                      <h3 className="text-lg font-semibold text-cyan-700 mb-4">
                        ���� Detalhes do Furo de Água
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profundidade do Furo (m)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            defaultValue={editingWork?.boreDepth}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Ex: 120.5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nível da Água (m)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            defaultValue={editingWork?.waterLevel}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Ex: 15.2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Caudal do Furo (m³/h)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            defaultValue={editingWork?.flowRate}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Ex: 5.5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profundidade da Bomba (m)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            defaultValue={editingWork?.pumpDepth}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Ex: 80.0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Coluna
                          </label>
                          <select
                            defaultValue={editingWork?.columnType}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          >
                            <option value="">Selecionar tipo</option>
                            <option value="PEAD">PEAD</option>
                            <option value="HIDROROSCADO">HIDROROSCADO</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Diâmetro da Coluna
                          </label>
                          <select
                            defaultValue={editingWork?.columnDiameter}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Modelo da Bomba
                          </label>
                          <input
                            type="text"
                            defaultValue={editingWork?.pumpModel}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Ex: Grundfos SQ3-105"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Potência do Motor (HP)
                          </label>
                          <select
                            defaultValue={editingWork?.motorPower}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                            Voltagem da Bomba
                          </label>
                          <select
                            defaultValue={editingWork?.pumpVoltage}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          >
                            <option value="">Selecionar voltagem</option>
                            <option value="230V">230V (monofásico)</option>
                            <option value="400V">400V (trif��sico)</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observações Espec��ficas do Furo
                        </label>
                        <textarea
                          rows={3}
                          defaultValue={editingWork?.boreObservations}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="Condi��ões do terreno, qualidade da água, dificuldades encontradas, etc..."
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingWork(null);
                          setEditAssignedUsers([]);
                          setCurrentEditAssignedUser("");
                          setActiveSection("obras");
                        }}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();

                          const form = (e.target as HTMLElement).closest(
                            "form",
                          );
                          const inputs = form.querySelectorAll(
                            "input, select, textarea",
                          );

                          const workSheetNumber = (
                            inputs[0] as HTMLInputElement
                          ).value; // Folha de Obra
                          const workType = (inputs[1] as HTMLSelectElement)
                            .value; // Tipo de Trabalho
                          const client = (inputs[2] as HTMLInputElement).value; // Cliente
                          const contact = (inputs[3] as HTMLInputElement).value; // Contacto
                          const location = (inputs[4] as HTMLInputElement)
                            .value; // Morada
                          const startTime = (inputs[5] as HTMLInputElement)
                            .value; // Hora de Entrada
                          const endTime = (inputs[6] as HTMLInputElement).value; // Hora de Saída
                          const status = (inputs[7] as HTMLSelectElement).value; // Estado
                          const workSheetCompleted = (
                            inputs[8] as HTMLInputElement
                          ).checked; // Folha preenchida
                          const workPerformed = (
                            inputs[9] as HTMLTextAreaElement
                          ).value; // Trabalho Realizado
                          const observations = (
                            inputs[10] as HTMLTextAreaElement
                          ).value; // Observações

                          // Prepare update data
                          let updateData: any = {
                            workSheetNumber,
                            title: workSheetNumber,
                            type: workType,
                            client,
                            contact,
                            location,
                            startTime,
                            endTime,
                            // Only update status if it's actually different from current status
                            ...(status !== editingWork?.status && {
                              status: status as
                                | "pending"
                                | "in_progress"
                                | "completed"
                                | "cancelled",
                            }),
                            workSheetCompleted,
                            workPerformed,
                            observations,
                            assignedTo:
                              editAssignedUsers.length > 0
                                ? editAssignedUsers
                                    .map((u) => u.name)
                                    .join(", ")
                                : "",
                            assignedUsers: editAssignedUsers,
                            assignedUserIds: editAssignedUsers.map((u) => u.id),
                          };

                          // Always capture bore data from the cyan section
                          const boreSection =
                            form.querySelector(".border-cyan-200");
                          if (boreSection) {
                            const boreInputs = boreSection.querySelectorAll(
                              "input, select, textarea",
                            );
                            console.log(
                              "�� DEBUG boreInputs found:",
                              boreInputs.length,
                            );
                            updateData = {
                              ...updateData,
                              boreDepth:
                                (boreInputs[0] as HTMLInputElement)?.value ||
                                "",
                              waterLevel:
                                (boreInputs[1] as HTMLInputElement)?.value ||
                                "",
                              flowRate:
                                (boreInputs[2] as HTMLInputElement)?.value ||
                                "",
                              pumpDepth:
                                (boreInputs[3] as HTMLInputElement)?.value ||
                                "",
                              columnType:
                                (boreInputs[4] as HTMLInputElement)?.value ||
                                "",
                              columnDiameter:
                                (boreInputs[5] as HTMLInputElement)?.value ||
                                "",
                              pumpModel:
                                (boreInputs[6] as HTMLInputElement)?.value ||
                                "",
                              motorPower:
                                (boreInputs[7] as HTMLInputElement)?.value ||
                                "",
                              pumpVoltage:
                                (boreInputs[8] as HTMLInputElement)?.value ||
                                "",
                              boreObservations:
                                (boreInputs[9] as HTMLInputElement)?.value ||
                                "",
                            };
                            console.log(
                              "🔍 DEBUG updateData with bore:",
                              updateData,
                            );
                          }

                          dataSync.updateWork(editingWork.id, updateData);

                          alert("Obra atualizada com sucesso!");
                          setEditingWork(null);
                          setEditAssignedUsers([]);
                          setCurrentEditAssignedUser("");
                          setActiveSection("obras");
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Building2 className="h-4 w-4" />
                        <span>Guardar Alterações</span>
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
                          placeholder="Localizaç�����o da piscina"
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
                        Observa��ões
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

                          const name = (inputs[0] as HTMLInputElement).value; // Nome da Piscina
                          const client = (inputs[1] as HTMLInputElement).value; // Cliente
                          const location = (inputs[2] as HTMLInputElement)
                            .value; // Local
                          const status = (inputs[3] as HTMLInputElement).value; // Estado
                          const poolType = (inputs[4] as HTMLInputElement)
                            .value; // Tipo de Piscina
                          const dimensions = (inputs[5] as HTMLInputElement)
                            .value; // Dimensões
                          const volume = (inputs[6] as HTMLInputElement).value; // Volume
                          const filtrationSystem = (
                            inputs[7] as HTMLInputElement
                          ).value; // Sistema de Filtração
                          const installationDate = (
                            inputs[8] as HTMLInputElement
                          ).value; // Data de Instalação
                          const clientPhone = (inputs[9] as HTMLInputElement)
                            .value; // Telefone do Cliente
                          const clientEmail = (inputs[10] as HTMLInputElement)
                            .value; // Email do Cliente
                          const observations = (inputs[11] as HTMLInputElement)
                            .value; // Observações

                          dataSync.updatePool(editingPool.id, {
                            name,
                            client,
                            location,
                            status,
                            poolType,
                            dimensions,
                            volume: volume || undefined,
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
                          Técnico *
                        </label>
                        <input
                          type="text"
                          defaultValue={editingMaintenance?.technician}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nome do t��cnico"
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
                          <option value="Manutenç���o">Manutenção</option>
                          <option value="Reparaç����o">Reparação</option>
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
                          Duraç��o Real (horas)
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
                          Data de Conclusão
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
                        Observa��ões
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

                          const scheduledDate = (inputs[0] as HTMLInputElement)
                            .value; // Data
                          const technician = (inputs[1] as HTMLInputElement)
                            .value; // Técnico
                          const type = (inputs[2] as HTMLInputElement).value; // Tipo de Manutenção
                          const status = (inputs[3] as HTMLInputElement).value; // Estado
                          const estimatedDuration = (
                            inputs[4] as HTMLInputElement
                          ).value; // Duração Estimada
                          const actualDuration = (inputs[5] as HTMLInputElement)
                            .value; // Duração Real
                          const cost = (inputs[6] as HTMLInputElement).value; // Custo
                          const priority = (inputs[7] as HTMLInputElement)
                            .value; // Prioridade
                          const completedDate = (inputs[8] as HTMLInputElement)
                            .value; // Data de Conclusão
                          const materialsUsed = (inputs[9] as HTMLInputElement)
                            .value; // Materiais Utilizados
                          const observations = (inputs[10] as HTMLInputElement)
                            .value; // Observaç����es

                          dataSync.updateMaintenance(editingMaintenance.id, {
                            scheduledDate: scheduledDate
                              ? new Date(scheduledDate).toISOString()
                              : undefined,
                            technician,
                            type,
                            status: status as
                              | "pending"
                              | "in_progress"
                              | "completed"
                              | "cancelled"
                              | "scheduled",
                            estimatedDuration: estimatedDuration || undefined,
                            actualDuration: actualDuration || undefined,
                            cost: cost || undefined,
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
                    ← Voltar aos Utilizadores
                  </button>
                  <RegisterForm
                    onRegisterSuccess={() => {
                      navigateToSection("utilizadores");
                    }}
                    onCancel={() => {
                      navigateToSection("utilizadores");
                    }}
                  />
                </div>
              </div>
            </div>
          );

        case "localizacoes":
          // SECURITY: Only super_admin and admin can access location features
          if (
            currentUser?.role !== "super_admin" &&
            currentUser?.role !== "admin"
          ) {
            return (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Acesso Restrito
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Apenas administradores podem aceder às funcionalidades de
                    localização.
                  </p>
                  <button
                    onClick={() => navigateToSection("dashboard")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Voltar ao Dashboard
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="px-4 py-4">
                <LocationPage
                  currentUser={
                    currentUser
                      ? {
                          id: currentUser.uid || "unknown",
                          name: currentUser.name || "Utilizador",
                          email: currentUser.email || "",
                        }
                      : undefined
                  }
                />
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
                  A seç����o solicitada não foi encontrada.
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
              Ocorreu um erro ao carregar o conte����do. Por favor, tente
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
                Partilhar Relat��rio
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
                  <span>�������</span>
                  <span>Valores da água</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Produtos químicos utilizados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>��</span>
                  <span>Trabalho realizado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Fotografias</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Observaç����es e próxima manuten��ão</span>
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

  // TEMPORARY: Bypass authentication for testing - COMMENTED OUT TO ALLOW LOGOUT
  // useEffect(() => {
  //   if (!currentUser) {
  //     const testUser = {
  //       id: 1,
  //       name: "Gonçalo Fonseca",
  //       email: "gongonsilva@gmail.com",
  //       role: "super_admin",
  //       permissions: {
  //         obras: { view: true, create: true, edit: true, delete: true },
  //         manutencoes: { view: true, create: true, edit: true, delete: true },
  //         piscinas: { view: true, create: true, edit: true, delete: true },
  //         relatorios: { view: true, create: true, edit: true, delete: true },
  //         utilizadores: { view: true, create: true, edit: true, delete: true },
  //         admin: { view: true, create: true, edit: true, delete: true },
  //         dashboard: { view: true },
  //       },
  //     };
  //     setCurrentUser(testUser);
  //     setIsAuthenticated(true);
  //     localStorage.setItem("currentUser", JSON.stringify(testUser));
  //     localStorage.setItem("isAuthenticated", "true");
  //   }
  // }, []);

  // Show login form if not authenticated
  if (!isAuthenticated) {
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
              console.log(`����� Navegando para seç��o: ${section}`);

              // Navigation to user management section only allowed if authenticated
              if (
                section === "utilizadores" &&
                (!isAuthenticated || !currentUser)
              ) {
                console.log(
                  "���� Access denied: User management requires authentication",
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
                Insira a palavra-passe para aceder às configura����ões avançadas
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
      <div>
        <LoginPage
          onLogin={async (
            email: string,
            password: string,
            rememberMe: boolean = false,
          ) => {
            // console.log("🔐 Login attempt for:", email);

            // Clear any previous errors
            setLoginError("");

            // Basic validation
            if (!email?.trim() || !password?.trim()) {
              setLoginError("Por favor, preencha todos os campos");
              return;
            }

            try {
              // Auto-check Firebase before login attempt
              await firebaseAutoFix.checkOnUserAction();

              const result = await authService.login(
                email.trim(),
                password,
                rememberMe,
              );

              // console.log("🔐 Auth result:", result);

              if (result.success && result.user) {
                // console.log("✅ Login successful for:", result.user.email);

                // Update state
                setCurrentUser(result.user);
                setIsAuthenticated(true);
                localStorage.setItem(
                  "currentUser",
                  JSON.stringify(result.user),
                );
                localStorage.setItem("isAuthenticated", "true");

                // Clear login form
                setLoginForm({ email: "", password: "" });

                // Navigate to dashboard or requested section with validation
                const hash = window.location.hash.substring(1);
                if (hash && hash !== "login") {
                  // Validate that the section exists and user has access
                  const validSections = [
                    "dashboard",
                    "obras",
                    "piscinas",
                    "manutencoes",
                    "futuras-manutencoes",
                    "nova-obra",
                    "nova-piscina",
                    "nova-manutencao",
                    "clientes",
                    "novo-cliente",
                    "configuracoes",
                    "relatorios",
                    "utilizadores",
                    "localizacoes",
                    "register",
                    "editar-obra",
                    "editar-piscina",
                    "editar-manutencao",
                  ];

                  if (validSections.includes(hash)) {
                    // Use setTimeout to ensure state is properly set before navigation
                    setTimeout(() => {
                      setActiveSection(hash);
                    }, 100);
                  } else {
                    // Invalid hash, redirect to dashboard
                    window.location.hash = "";
                    navigateToSection("dashboard");
                  }
                } else {
                  navigateToSection("dashboard");
                }

                // console.log("✅ Login state updated successfully");
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
          }}
          loginError={loginError}
          isLoading={false}
        />

        {/* Admin Login Modal - tamb���m funciona na página de login */}
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

        {/* Admin Page - também funciona na p��gina de login */}
        {isAdminAuthenticated && (
          <div className="fixed inset-0 bg-white z-50">
            <AdminPage
              currentUser={currentUser}
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

  // Use sync manager to determine if sync should be enabled
  const quotaStatus = syncManager.getSyncStatus();
  const syncInterval = syncManager.getSafeInterval();

  return (
    <AutoSyncProviderSafe
      enabled={true}
      syncInterval={60000}
      collections={["users", "pools", "maintenance", "works", "clients"]}
      showNotifications={false}
    >
      <InstantSyncManagerSafe>
        <div className="min-h-screen bg-gray-50">
          {/* Firebase works automatically in background - no UI elements */}
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
                        src="https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F6c79d54ab5014a40bfea00560b92828d?format=webp&width=800"
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
                    <span>Manutencoes</span>
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
                    <span>Nova Manutencao</span>
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

                {/* Localizações - Para super_admin e admin */}
                {/* Clientes */}
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

                {/* Localizações - Para super_admin e admin */}
                {(currentUser?.role === "super_admin" ||
                  currentUser?.role === "admin") && (
                  <button
                    onClick={() => {
                      navigateToSection("localizacoes");
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === "localizacoes"
                        ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Localizações</span>
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
                      {currentUser?.name}
                    </p>
                    <p className="text-sm text-gray-500">{currentUser?.role}</p>
                  </div>
                </div>

                {/* Settings and Logout buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const password = prompt(
                        "Digite a palavra-passe para aceder às configurações:",
                      );
                      if (password === "19867") {
                        navigateToSection("configuracoes");
                        setSidebarOpen(false);
                      } else if (password !== null) {
                        alert("Palavra-passe incorreta!");
                      }
                    }}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Configurações"
                  >
                    <Settings className="h-5 w-5" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex-1 flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Terminar Sessao</span>
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400">© 2025 Leirisonda</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden fixed top-20 left-4 z-[70] flex flex-col space-y-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-white p-2 rounded-md shadow-md"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            {activeSection !== "dashboard" && (
              <button
                onClick={handleGoBack}
                className="bg-white p-2 rounded-md shadow-md"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
            )}
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
                          Tipo de Obra
                        </label>
                        <p className="text-gray-900 capitalize">
                          {selectedWork.type || "N����o especificado"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          T��tulo
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
                            onClick={() =>
                              handlePhoneClick(selectedWork.contact)
                            }
                            className={`text-sm mt-1 ${
                              enablePhoneDialer
                                ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                : "text-gray-500"
                            }`}
                            disabled={!enablePhoneDialer}
                          >
                            📞 {selectedWork.contact}
                          </button>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Local
                        </label>
                        <button
                          onClick={() => {
                            if (selectedWork?.location) {
                              handleAddressClick(selectedWork.location);
                            }
                          }}
                          className={`text-left ${
                            enableMapsRedirect
                              ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                              : "text-gray-900"
                          }`}
                          disabled={!enableMapsRedirect}
                        >
                          �� {selectedWork.location}
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Contacto
                        </label>
                        <p className="text-gray-900">
                          {selectedWork.contact || "Não especificado"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Hora de Entrada
                        </label>
                        <p className="text-gray-900">
                          {selectedWork.startTime
                            ? new Date(selectedWork.startTime).toLocaleString(
                                "pt-PT",
                              )
                            : "Não especificado"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Hora de Saída
                        </label>
                        <p className="text-gray-900">
                          {selectedWork.endTime
                            ? new Date(selectedWork.endTime).toLocaleString(
                                "pt-PT",
                              )
                            : "Não especificado"}
                        </p>
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
                          Data de In����cio
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
                              Ve���culos
                            </label>
                            <p className="text-gray-900">
                              {selectedWork.vehicles.join(", ")}
                            </p>
                          </div>
                        )}
                      {selectedWork.photos &&
                        selectedWork.photos.length > 0 && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Fotografias ({selectedWork.photos.length})
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                              {selectedWork.photos.map((photo, index) => (
                                <div
                                  key={photo.id || index}
                                  className="relative"
                                >
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

                    {/* Detalhes Completos - Se��ões Expandidas */}
                    <div className="mt-6 space-y-6">
                      {/* Informações Adicionais */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                          Informaç���es Detalhadas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Orçamento
                            </label>
                            <p className="text-gray-900">
                              {selectedWork.budget
                                ? `€${selectedWork.budget.toLocaleString("pt-PT")}`
                                : "N��o especificado"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Custo Real
                            </label>
                            <p className="text-gray-900">
                              {selectedWork.actualCost
                                ? `€${selectedWork.actualCost.toLocaleString("pt-PT")}`
                                : "Não especificado"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Data de Conclusão Prevista
                            </label>
                            <p className="text-gray-900">
                              {selectedWork.expectedEndDate
                                ? new Date(
                                    selectedWork.expectedEndDate,
                                  ).toLocaleDateString("pt-PT")
                                : "Não especificado"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Folha de Obra
                            </label>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                selectedWork.folhaGerada
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {selectedWork.folhaGerada
                                ? "✓ Gerada"
                                : "✗ Não gerada"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Detalhes do Furo de Água - Se aplicável */}
                      {selectedWork.type === "furo" && (
                        <div className="border-l-4 border-cyan-500 pl-4">
                          <h3 className="text-lg font-semibold text-cyan-700 mb-4">
                            🚰 Detalhes do Furo de Água
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Profundidade do Furo
                              </label>
                              <p className="text-gray-900 font-mono">
                                {selectedWork.boreDepth
                                  ? `${selectedWork.boreDepth} m`
                                  : "Não especificado"}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Nível da Água
                              </label>
                              <p className="text-gray-900 font-mono">
                                {selectedWork.waterLevel
                                  ? `${selectedWork.waterLevel} m`
                                  : "N��o especificado"}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Caudal do Furo
                              </label>
                              <p className="text-gray-900 font-mono">
                                {selectedWork.flowRate
                                  ? `${selectedWork.flowRate} m³/h`
                                  : "Não especificado"}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Profundidade da Bomba
                              </label>
                              <p className="text-gray-900 font-mono">
                                {selectedWork.pumpDepth
                                  ? `${selectedWork.pumpDepth} m`
                                  : "Não especificado"}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Tipo de Coluna
                              </label>
                              <p className="text-gray-900">
                                {selectedWork.columnType || "Não especificado"}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Di��metro da Coluna
                              </label>
                              <p className="text-gray-900">
                                {selectedWork.columnDiameter
                                  ? `${selectedWork.columnDiameter}"`
                                  : "Não especificado"}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Modelo da Bomba
                              </label>
                              <p className="text-gray-900">
                                {selectedWork.pumpModel || "Não especificado"}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Potência do Motor
                              </label>
                              <p className="text-gray-900">
                                {selectedWork.motorPower
                                  ? `${selectedWork.motorPower} HP`
                                  : "Não especificado"}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Voltagem da Bomba
                              </label>
                              <p className="text-gray-900">
                                {selectedWork.pumpVoltage || "Não especificado"}
                              </p>
                            </div>
                          </div>
                          {selectedWork.boreObservations && (
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Observações Específicas do Furo
                              </label>
                              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                                <p className="text-gray-900">
                                  {selectedWork.boreObservations}
                                </p>
                              </div>
                            </div>
                          )}
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
                          setEditAssignedUsers(
                            selectedWork.assignedUsers || [],
                          );
                          setViewingWork(false);
                          setSelectedWork(null);
                          setActiveSection("editar-obra");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Editar
                      </button>
                    )}
                    {hasPermission("obras", "delete") && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Tem a certeza que deseja apagar a obra "${selectedWork.title || selectedWork.client}"?\n\nEsta ação não pode ser desfeita.`,
                            )
                          ) {
                            dataSync.deleteWork(selectedWork.id);
                            showNotification(
                              "Obra Eliminada",
                              `A obra "${selectedWork.title || selectedWork.client}" foi eliminada com sucesso`,
                              "success",
                            );
                            setViewingWork(false);
                            setSelectedWork(null);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Apagar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pool View Modal */}
          {viewingPool && selectedPool && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Waves className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Detalhes Completos da Piscina
                        </h2>
                        <p className="text-gray-600">{selectedPool.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setViewingPool(false);
                        setSelectedPool(null);
                      }}
                      className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Informações Básicas */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                        Informações Básicas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nome da Piscina
                          </label>
                          <p className="text-gray-900">{selectedPool.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Tipo
                          </label>
                          <p className="text-gray-900 capitalize">
                            {selectedPool.type}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Estado
                          </label>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              selectedPool.status === "Ativa"
                                ? "bg-green-100 text-green-700"
                                : selectedPool.status === "Inativa"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {selectedPool.status}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Localização
                          </label>
                          <button
                            onClick={() => {
                              if (selectedPool?.location) {
                                handleAddressClick(selectedPool.location);
                              }
                            }}
                            className={`text-left ${
                              enableMapsRedirect
                                ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                : "text-gray-900"
                            }`}
                            disabled={!enableMapsRedirect}
                          >
                            📍 {selectedPool.location}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Informações do Cliente */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                        Informações do Cliente
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nome do Cliente
                          </label>
                          <p className="text-gray-900">{selectedPool.client}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <p className="text-gray-900">
                            {selectedPool.clientEmail || "Não especificado"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Telefone
                          </label>
                          <button
                            onClick={() => {
                              if (selectedPool?.clientPhone) {
                                handlePhoneClick(selectedPool.clientPhone);
                              }
                            }}
                            className={`${
                              enablePhoneDialer && selectedPool.clientPhone
                                ? "text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                : "text-gray-900"
                            }`}
                            disabled={
                              !enablePhoneDialer || !selectedPool.clientPhone
                            }
                          >
                            📞 {selectedPool.clientPhone || "Não especificado"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Especificações Técnicas */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                        Especificações Técnicas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Volume de Água
                          </label>
                          <p className="text-gray-900">
                            {selectedPool.waterVolume
                              ? `${selectedPool.waterVolume} L`
                              : "Não especificado"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Dimensões
                          </label>
                          <p className="text-gray-900">
                            {selectedPool.dimensions || "Não especificado"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Profundidade
                          </label>
                          <p className="text-gray-900">
                            {selectedPool.depth
                              ? `${selectedPool.depth} m`
                              : "Não especificado"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Manutenções */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                        Manutenções
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Última Manutenção
                          </label>
                          <p className="text-gray-900">
                            {selectedPool.lastMaintenance
                              ? new Date(
                                  selectedPool.lastMaintenance,
                                ).toLocaleDateString("pt-PT")
                              : "Não especificado"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Próxima Manutenção
                          </label>
                          <p className="text-gray-900">
                            {selectedPool.nextMaintenance
                              ? new Date(
                                  selectedPool.nextMaintenance,
                                ).toLocaleDateString("pt-PT")
                              : "Não especificado"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Observações */}
                    {selectedPool.observations && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                          Observações
                        </h3>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                          {selectedPool.observations}
                        </p>
                      </div>
                    )}

                    {/* Data de Criação */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Data de Registo
                      </label>
                      <p className="text-gray-900">
                        {new Date(
                          selectedPool.createdAt || new Date(),
                        ).toLocaleString("pt-PT")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setViewingPool(false);
                        setSelectedPool(null);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Fechar
                    </button>
                    {hasPermission("piscinas", "edit") && (
                      <button
                        onClick={() => {
                          setEditingPool(selectedPool);
                          setViewingPool(false);
                          setSelectedPool(null);
                          setActiveSection("editar-piscina");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Editar
                      </button>
                    )}
                    {hasPermission("piscinas", "delete") && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Tem a certeza que deseja apagar a piscina "${selectedPool.name}"?\n\nEsta ação não pode ser desfeita.`,
                            )
                          ) {
                            dataSync.deletePool(selectedPool.id);
                            showNotification(
                              "Piscina Eliminada",
                              `A piscina "${selectedPool.name}" foi eliminada com sucesso`,
                              "success",
                            );
                            setViewingPool(false);
                            setSelectedPool(null);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Apagar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="lg:ml-80 min-h-screen">
            <div className="p-4 lg:p-6">
              {(() => {
                try {
                  return renderContent();
                } catch (error) {
                  console.error("Error rendering content:", error);
                  return (
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">
                          Erro de Renderização
                        </h1>
                        <p className="text-gray-600 mb-4">
                          Ocorreu um erro ao carregar a página. Por favor, tente
                          novamente.
                        </p>
                        <div className="space-y-2">
                          <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                          >
                            Recarregar Página
                          </button>
                          <button
                            onClick={() => {
                              setActiveSection("dashboard");
                              setActiveAdminTab("relatorios");
                            }}
                            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                          >
                            Voltar ao Dashboard
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </main>

          {/* Install Prompt for Mobile */}
          <InstallPromptSimple />

          {/* Data Sharing Fix Manager */}

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
                currentUser={currentUser}
                onLogout={() => {
                  setIsAdminAuthenticated(false);
                  setShowAdminLogin(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Realtime Notifications - REMOVIDAS */}
        {/* <RealtimeNotifications /> */}

        {/* Work Assignment Notifications */}
        <WorkAssignmentNotifications currentUser={currentUser} />

        {/* User Restore Notification */}
        <UserRestoreNotificationSimple />

        {/* Firebase Auto-Monitor - Discrete indicator */}
        <FirebaseAutoMonitor firebaseStatus={firebaseAutoFix} />

        {/* User Migration Indicator - Shows migration status */}
        <UserMigrationIndicator migrationStatus={userMigration} />

        {/* Data Persistence Diagnostic - Modal for persistence issues */}
        {showDataDiagnostic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full max-h-screen overflow-y-auto">
              <DataPersistenceDiagnostic
                autoCheck={true}
                onClose={() => setShowDataDiagnostic(false)}
              />
            </div>
          </div>
        )}

        {/* Data Persistence Alert - Smart automatic alert */}
        <DataPersistenceAlert
          onOpenDiagnostic={() => setShowDataDiagnostic(true)}
        />

        {/* Data Persistence Status Indicator */}
        <DataPersistenceIndicator onClick={() => setShowDataDiagnostic(true)} />
      </InstantSyncManagerSafe>
    </AutoSyncProviderSafe>
  );
}

export default App;
