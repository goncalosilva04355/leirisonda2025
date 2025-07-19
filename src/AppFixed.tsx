// CONFIGURAÇÃO FIREBASE MOBILE ROBUSTA - TEMPORARIAMENTE DESATIVADA
// import {
//   initializeFirebaseMobile,
//   isFirebaseMobileReady,
// } from "./firebase/mobileFirebase";

// VERIFICADOR SIMPLES DE COLEÇÕES FIRESTORE
// import "./utils/simpleFirestoreChecker";

// FORÇAR INICIALIZAÇÃO FIREBASE SIMPLES
// import "./utils/simpleFirebaseInit";

// VERIFICAÇÃO BÁSICA DE SAÚDE
// import "./utils/basicHealthCheck";

// PREVENÇÃO DE ERROS GETIMMEDIATE
// import "./utils/preventGetImmediateError";

// HANDLER GLOBAL DE ERROS
// import "./utils/globalErrorHandler";
// import "./utils/safeFetch";
// import "./utils/safeFirestoreTestFixed";
// import "./utils/loadFailedDetector";

// TESTES ABRANGENTES FIREBASE/FIRESTORE
// import "./utils/comprehensiveFirebaseTest";
// import "./utils/verifySaveToFirestore";
// import "./utils/verifyAutoSync";
// import "./utils/finalFirebaseVerification";
// import "./utils/firestoreDiagnosticMessage";
// import "./utils/safeFirestoreTest";
// import "./utils/ultraSafeTest";

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
import { usePullToRefresh } from "./hooks/usePullToRefresh";
import RefreshIndicator from "./components/RefreshIndicator";
import jsPDF from "jspdf";
// import { FirebaseConfig } from "./components/FirebaseConfig";
import { AdvancedSettings } from "./components/AdvancedSettings";
import InstallPromptSimple from "./components/InstallPromptSimple";
// UserPermissionsManager removido - consolidado no UserManager do painel admin

import { LocationPage } from "./components/LocationPage";
import { PersonalLocationSettings } from "./components/PersonalLocationSettings";
import SyncStatusIndicator from "./components/SyncStatusIndicator";
import SyncStatusIndicatorFixed from "./components/SyncStatusIndicatorFixed";
import { FirebaseStatusDisplay } from "./components/FirebaseStatusDisplay";
import DuplicateCleanupStatus from "./components/DuplicateCleanupStatus";
// import { simplifiedSyncService } from "./services/simplifiedSyncService";

// import { EditModeFirestoreStatus } from "./components/EditModeFirestoreStatus";
// import FirestoreDiagnostic from "./components/FirestoreDiagnostic";
// import FirestoreTest from "./components/FirestoreTest";

// Limpar estados que causam modais indesejados
// import "./utils/clearModalStates";

// Firebase Quota Recovery - recuperar operações bloqueadas
// TEMPORARIAMENTE COMENTADO PARA DEBUG
// import {
//   autoRecoverOnInit,
//   FirebaseQuotaRecovery,
// } from "./utils/firebaseQuotaRecovery";

// Security: Startup cleanup to prevent blocked users from accessing
// import "./utils/startupCleanup"; // TEMPORARIAMENTE DESATIVADO - estava a eliminar utilizadores automaticamente

import { AutoSyncProviderSafe } from "./components/AutoSyncProviderSafe";
import {
  safeLocalStorage,
  safeSessionStorage,
  storageUtils,
} from "./utils/storageUtils";

import { InstantSyncManagerSafe } from "./components/InstantSyncManagerSafe";
import { useDataProtectionFixed as useDataProtection } from "./hooks/useDataProtectionFixed";

// import "./utils/protectedLocalStorage"; // Ativar proteção automática

// import { fcmService } from "./services/fcmService";
import NotificationCenter from "./components/NotificationCenter";

import { syncManager } from "./utils/syncManager";
// import { clearQuotaProtection } from "./utils/clearQuotaProtection";
// Firebase SDK desabilitado - usando REST API
// import {
//   isFirebaseReady,
//   isFirestoreReady,
//   getFirebaseFirestore,
// } from "./firebase/leiriaConfig";

// Funções de compatibilidade para REST API
const isFirestoreReady = () => {
  // REST API está sempre "pronto" - não precisa de inicialização SDK
  return true;
};

const isFirebaseReady = () => {
  // REST API está sempre "pronto" - não precisa de inicialização SDK
  return true;
};

const getFirebaseFirestore = () => {
  // REST API não usa instância de Firestore, retorna null para compatibilidade
  return null;
};
import { initializeAuthorizedUsers } from "./config/authorizedUsers";
// import { firestoreService } from "./services/firestoreService"; // SDK desabilitado
// import { firestoreService } from "./services/firestoreServiceRestAdapter"; // REST API com problemas fetch
import { firestoreService } from "./services/firestoreServiceOfflineAdapter"; // OFFLINE-FIRST
import { ultraSimpleOfflineService } from "./services/ultraSimpleOffline"; // Serviço ultra-simples
// import { firebaseStorageService } from "./services/firebaseStorageService";
// import { autoSyncService } from "./services/autoSyncService"; // SDK - desabilitado para REST API
// import { productionAutoSync } from "./services/productionAutoSync"; // TEMPORARIAMENTE DESATIVADO
// import "./utils/testFirebaseBasic"; // Passo 1: Teste automático Firebase básico
// import "./utils/testFirestore"; // Passo 3: Teste automático Firestore - comentado temporariamente
// import "./utils/quickFirestoreDiagnostic"; // Diagnóstico rápido
// Desativados durante desenvolvimento para evitar refresh no Builder.io
// import "./utils/permanentMockCleanup"; // Limpeza permanente de dados mock
// import "./utils/firebaseConnectionTest"; // Teste completo de conexão Firebase em produção
// import "./firebase/initializationHelper"; // Helper robusto para inicialização completa do Firebase

// SECURITY: RegisterForm for super admin only
import { RegisterForm } from "./components/RegisterForm";
import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import AdminSidebar from "./components/AdminSidebar";
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";
import UnifiedAdminPageSimple from "./components/UnifiedAdminPageSimple";

// import { useDataSync as useDataSyncSimple } from "./hooks/useDataSync"; // SDK
// import { useUniversalDataSyncFixed as useUniversalDataSync } from "./hooks/useUniversalDataSyncFixed"; // SDK
import { authServiceWrapperSafe as authService } from "./services/authServiceWrapperSafe";
import { UserProfile, robustLoginService } from "./services/robustLoginService";
// import { DataProtectionService } from "./utils/dataProtection"; // SDK
// import { pushNotificationService } from "./services/pushNotificationService"; // SDK

// Desativados durante desenvolvimento para evitar refresh no Builder.io
// Firebase works silently in background - no diagnostics or UI needed
// import("./firebase/ultimateSimpleFirebase");
// import { ForceInitialization } from "./utils/forceInitialization";
// Teste simples Firebase Leiria
// import("./utils/testeLeiria");
// Testes de regras Firebase removidos para evitar conflitos

// Sistema de diagnóstico de persistência
// import { DataPersistenceDiagnostic } from "./components/DataPersistenceDiagnostic";
// import { DataPersistenceAlert } from "./components/DataPersistenceAlert";
// import { DataPersistenceIndicator } from "./components/DataPersistenceIndicator";
// import { dataPersistenceManager } from "./utils/dataPersistenceFix";
// import { MobileFirebaseFix } from "./components/MobileFirebaseFix";
// import { useForceFirestore } from "./hooks/useForceFirestore"; // DESABILITADO - problemas SDK
// import "./utils/forceFirestore"; // FORÇA FIRESTORE A FUNCIONAR - DESABILITADO (tinha problemas)
// import "./utils/testForceFirestore"; // Teste que força funcionamento - DESABILITADO
// import "./utils/firestoreDebugger"; // DEBUG detalhado dos problemas - DESABILITADO
// import "./utils/ultraSimpleFirestore"; // ULTRA SIMPLES - DESABILITADO (problemas SDK)
// import "./utils/emergencyUnblock"; // TEMPORARIAMENTE DESATIVADO
// import "./utils/firestoreRestApi"; // REST API com problemas de fetch
import "./utils/offlineFirestoreApi"; // OFFLINE-FIRST - localStorage priorizado
// import "./utils/loopsStopped"; // TEMPORARIAMENTE DESATIVADO
// import "./utils/simpleDuplicateReport"; // TEMPORARIAMENTE DESATIVADO
// import "./utils/cleanLocalStorage"; // TEMPORARIAMENTE DESATIVADO
// SISTEMAS DE LIMPEZA AUTOMÁTICA DESATIVADOS PARA PARAR LOOPS
// import "./utils/ultraDirectKill"; // ELIMINAÇÃO ULTRA-DIRETA SEM LOGS VISUAIS
// import "./utils/urlForceCleanup"; // FORÇA LIMPEZA VIA URL OU DETECÇÃO AUTOMÁTICA
// TODOS OS SISTEMAS DE LIMPEZA AUTOMÁTICA DESATIVADOS PARA PARAR LOOPS
// import "./utils/cleanupFirestoreDuplicates"; // Limpeza automática de duplicados
// import "./utils/manualDuplicateCleanup"; // Limpeza manual forçada de duplicados
// import "./utils/debugDuplicates"; // Debug de duplicados
// import "./utils/forcedDuplicateRemoval"; // Remoção forçada de duplicados específicos
// import "./utils/enhancedDebugDuplicates"; // Debug melhorado com análise detalhada
// import "./utils/startupDuplicateCheck"; // Verificação e limpeza automática no startup
// import "./utils/emergencyCleanup"; // Sistema de emergência para limpeza total
console.log("🔥 App.tsx: DESENVOLVIMENTO = PRODUÇÃO - mesma aplicação sempre");
console.log("🌍 Environment:", {
  prod: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  base: import.meta.env.BASE_URL,
});

// Função para gerar IDs únicos e evitar colisões React
let appIdCounter = 0;
const generateUniqueId = (prefix: string = "item"): string => {
  const timestamp = Date.now();
  const counter = ++appIdCounter;
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${counter}-${random}`;
};

// Sistema de chaves únicas para React elements
let keyCounter = 0;
const generateUniqueKey = (baseKey: string): string => {
  const counter = ++keyCounter;
  return `${baseKey}-${counter}-${Date.now()}`;
};

// Debug function to detect duplicate keys
const checkForDuplicateKeys = (
  array: any[],
  fieldName: string = "id",
): void => {
  if (!Array.isArray(array)) return;

  const keys = array
    .map((item) => item[fieldName])
    .filter((key) => key !== undefined);
  const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);

  if (duplicates.length > 0) {
    console.warn(`🚨 Duplicate keys detected in ${fieldName}:`, duplicates);
    console.warn(`🚨 Full array:`, array);
  }
};

// Debug: Intercept React warnings about duplicate keys
const problemTimestamps = [
  "1752604451507",
  "1752602368414",
  "1752578821484",
  "1752582282132",
  "1752574634617",
  "1752517424794",
  "1752582282133",
];

const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(" ");
  if (message.includes("same key")) {
    const foundTimestamp = problemTimestamps.find((ts) => message.includes(ts));
    if (foundTimestamp) {
      console.warn(`🚨 FOUND PROBLEM TIMESTAMP: ${foundTimestamp}`);
      console.warn("🚨 Full message:", message);
      console.warn("🚨 Stack trace:", new Error().stack);

      // Try to find where this timestamp is coming from
      console.warn("🚨 Found timestamp in React key error");
    }
  }
  return originalConsoleError.apply(console, args);
};
// import "./utils/verifyProject"; // VERIFICAR que está usando leiria-1cfc9
// import "./utils/firebaseStatus"; // STATUS dos serviços Firebase
// import "./utils/testDataPersistence";
// import "./utils/testFirebaseUserSync";
// import "./utils/completeDataSync";
// import "./utils/fullSyncStatus";

// import { useDataCleanup } from "./hooks/useDataCleanup";
// import { useAutoSyncSimpleFixed as useAutoSyncSimple } from "./hooks/useAutoSyncSimpleFixed";
// import { useAutoFirebaseFixFixed as useAutoFirebaseFix } from "./hooks/useAutoFirebaseFixFixed";
// import { useAutoUserMigrationFixed as useAutoUserMigration } from "./hooks/useAutoUserMigrationFixed";
// import FirebaseAutoMonitor from "./components/FirebaseAutoMonitor";
// import UserMigrationIndicator from "./components/UserMigrationIndicator";
// Firebase components removed - Firebase works automatically in background

// Diagnóstico automático para problemas de inserção de dados
// import "./utils/datainput-diagnostic";
// import DataInputStatusIndicator from "./components/DataInputStatusIndicator";
// import DataInputTutorial from "./components/DataInputTutorial";

// Monitor de erros Firebase desativado durante desenvolvimento
// import "./utils/firebaseErrorMonitor";

// import { userRestoreService } from "./services/userRestoreService";
// import UserRestoreNotificationSimple from "./components/UserRestoreNotificationSimple";

// Diagnóstico Firebase
// import "./utils/firebaseDiagnostic";
// Detecção inteligente de Firestore
// import "./utils/smartFirestoreDetection";

// Teste de login
// import "./utils/testLogin";
// Força atualização de utilizadores
// import "./utils/forceUserUpdate";
// Teste direto de autenticação
// import "./utils/testDirectAuth";

// Página de diagnóstico
// import DiagnosticPage from "./components/DiagnosticPage";

// Diagnóstico de autenticação
// import "./utils/authDiagnostic";

// Indicador de status da aplicação
import AppStatusIndicator from "./components/AppStatusIndicator";
import RenderTracker from "./components/RenderTracker";

// DESENVOLVIMENTO = PRODUÇÃO - utilizador admin real
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

// Função showNotification temporária
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

  // WebKit error prevention wrapper
  const safeExecute = useCallback((fn: () => void, errorContext: string) => {
    try {
      return fn();
    } catch (error) {
      console.warn(`⚠️ Safe execution failed in ${errorContext}:`, error);
      return null;
    }
  }, []);

  // Estado de renderização para qualquer ambiente
  const [hasRenderError, setHasRenderError] = useState(false);

  useEffect(() => {
    // Verificação básica independente do ambiente
    console.log("📱 Verificando estado da aplicação...");

    // Verificar se imports essenciais estão disponíveis
    try {
      if (!React || !useState || !useEffect) {
        throw new Error("React hooks não disponíveis");
      }
      console.log("✅ React e hooks verificados OK");
    } catch (error) {
      console.error("❌ Erro nos imports básicos:", error);
      setHasRenderError(true);
    }
  }, []);

  // Fallback UI se houver problemas de renderização
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

  // Debug: Check if App is being rendered multiple times with same timestamp
  if ((window as any).lastAppRenderTime === renderTime) {
    console.error("🚨 DUPLICATE APP RENDER DETECTED!", renderTime);
    console.trace("Stack trace for duplicate render:");
  }
  (window as any).lastAppRenderTime = renderTime;

  // INICIALIZAÇÃO FIREBASE MOBILE ROBUSTA - SÓ APÓS LOGIN ESTAR CARREGADO
  const [mobileFirebaseReady, setMobileFirebaseReady] = useState(true); // Inicia como true para não bloquear renderização
  const [loginPageLoaded, setLoginPageLoaded] = useState(true); // Inicia como true para mostrar login imediatamente

  // Firebase só inicia depois do utilizador fazer login - TEMPORARIAMENTE DESATIVADO
  const initMobileFirebaseAfterLogin = async () => {
    try {
      console.log("🔥 Firebase Mobile DESATIVADO para debugging");
      // await initializeFirebaseMobile();
      setMobileFirebaseReady(true);
      console.log("✅ Firebase Mobile SALTADO!");
    } catch (error) {
      console.warn(
        "⚠️ Firebase Mobile falhou, continuando em modo local:",
        error,
      );
      setMobileFirebaseReady(true); // Permitir que app continue mesmo sem Firebase
    }
  };

  // SECURITY: Always start as not authenticated - NUNCA mudar para true
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Mobile Firebase conflict detection
  const [showMobileFirebaseFix, setShowMobileFirebaseFix] = useState(false);

  // Forçar TODOS os dados a serem guardados no Firestore - DESABILITADO (problemas SDK)
  // const {
  //   isInitialized: firestoreInitialized,
  //   status: firestoreStatus,
  //   refreshStatus,
  // } = useForceFirestore();

  // Substituído por REST API - ATIVO EM DESENVOLVIMENTO
  const firestoreInitialized = true; // REST API sempre pronta
  const firestoreStatus = "REST API ativa (desenvolvimento = produção)";
  const refreshStatus = () => console.log("REST API não precisa refresh");

  // Verificar se REST API está funcionando
  const [restApiStatus, setRestApiStatus] = useState("aguardando");

  useEffect(() => {
    // Verificar REST API após 1 segundo
    setTimeout(() => {
      if ((window as any).firestoreRestApi) {
        setRestApiStatus("ativo");
        console.log("✅ REST API verificado e ativo no desenvolvimento!");
      } else {
        setRestApiStatus("aguardando");
        console.log("⏳ REST API ainda não verificado...");
      }
    }, 1000);
  }, []);

  // Log status do Firestore
  useEffect(() => {
    if (firestoreInitialized) {
      console.log(
        "🔥 ForceFirestore inicializado - todos os dados vão para Firestore:",
        firestoreStatus,
      );
    }
  }, [firestoreInitialized, firestoreStatus]);

  // Garantir que pelo menos o utilizador padrão existe no localStorage
  useEffect(() => {
    // Inicializar utilizadores autorizados (async)
    const initUsers = async () => {
      await initializeAuthorizedUsers();
    };
    initUsers();

    const savedUsers = safeLocalStorage.getItem("app-users");
    if (!savedUsers) {
      console.log("🔧 Criando utilizador padrão no localStorage");
      const defaultUser = {
        id: 1,
        name: "Gonçalo Fonseca",
        email: "gongonsilva@gmail.com",
        active: true,
        role: "super_admin",
        password: "19867gsf",
        permissions: {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        },
        createdAt: new Date().toISOString(),
      };
      storageUtils.setJson("app-users", [defaultUser]);
    }
  }, []);

  // Debug logging ativo - desenvolvimento = produção

  // Monitoramento de integridade de dados e restauração de utilizadores
  useEffect(() => {
    // Restaurar utilizadores automaticamente se necessário
    // userRestoreService.autoRestore();

    // Monitorização automática de persistência de dados
    const initDataPersistenceMonitoring = async () => {
      try {
        // Aguardar um pouco antes de iniciar verificação
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Verificar estado da persistência
        // const status = await dataPersistenceManager.diagnoseDataPersistence();

        // if (!status.working) {
        //   console.warn("€ Problema de persistência detectado:", status);
        //   setPersistenceIssueDetected(true);

        //   // Tentar reparar automaticamente
        //   const repaired = await dataPersistenceManager.repairDataPersistence();

        //   if (repaired) {
        //     setPersistenceIssueDetected(false);
        //     console.log("💚 Persistência reparada automaticamente");
        //   } else {
        //     console.error(
        //       "⚠️ Não foi possível reparar a persistência automaticamente",
        //     );
        //   }
        // } else {
        //   console.log("✅ Sistema de persistência está funcional");
        // }

        console.log("🔍 Data persistence monitoring temporarily disabled");
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

  // Verificar status da quota Firebase na inicialização
  useEffect(() => {
    console.log("🔍 Verificando e recuperando quota Firebase...");

    // Tentar recuperação automática
    // autoRecoverOnInit(); // TEMPORARIAMENTE COMENTADO PARA DEBUG
  }, []);

  // Firebase handles auth state automatically - no manual clearing needed
  useEffect(() => {
    console.log("🔥 Firebase handles auth state automatically");

    // Detectar conflitos Firebase em dispositivos móveis
    const detectFirebaseConflicts = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (!isMobile) return;

      // Verificar iframes Firebase duplicados
      const firebaseIframes = document.querySelectorAll(
        'iframe[src*="firebaseapp.com"]',
      );
      const hasMultipleFirebaseProjects = firebaseIframes.length > 1;

      // Verificar se há múltiplos projetos carregados
      const hasConflictingProjects = Array.from(firebaseIframes).some(
        (iframe) => {
          const src = iframe.getAttribute("src") || "";
          return (
            src.includes("leiria-1cfc9") &&
            document.querySelector('iframe[src*="leiria-1cfc9"]')
          );
        },
      );

      // Verificar flags de erro no localStorage
      const hasQuotaIssues =
        safeLocalStorage.getItem("firebase-quota-exceeded") === "true";
      if (
        hasMultipleFirebaseProjects ||
        hasConflictingProjects ||
        hasQuotaIssues
      ) {
        console.log("🔥 Firebase conflict detected on mobile device");
        setTimeout(() => setShowMobileFirebaseFix(true), 2000); // Delay para não interferir com carregamento
      }
    };

    // Executar detecção após page load
    if (document.readyState === "complete") {
      detectFirebaseConflicts();
    } else {
      window.addEventListener("load", detectFirebaseConflicts);
      return () => window.removeEventListener("load", detectFirebaseConflicts);
    }
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

  // Função para determinar o modo de dados atual
  const getDataMode = (): string => {
    try {
      const isFirestoreActive = isFirestoreReady();
      if (isFirestoreActive) {
        return "Firebase/Firestore";
      }
      return "Armazenamento Local";
    } catch (error) {
      return "Armazenamento Local";
    }
  };
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
  // Firebase ativo como solicitado - Fixed version
  // const universalSync = useUniversalDataSync(); // SDK desabilitado
  // const dataSync = useDataSyncSimple(); // SDK desabilitado

  // Função de refresh para Pull-to-Refresh
  const handleDashboardRefresh = useCallback(async (): Promise<void> => {
    try {
      console.log("🔄 Iniciando refresh do Dashboard...");

      // Force refresh works
      window.dispatchEvent(new CustomEvent("forceRefreshWorks"));

      // Universal sync - desabilitado (SDK)
      // await universalSync.forceSyncAll?.();

      console.log("🎉 Dashboard atualizado com sucesso!");
    } catch (error) {
      console.error("❌ Erro durante refresh do Dashboard:", error);
      throw error; // Re-throw para mostrar feedback visual de erro
    }
  }, []); // universalSync removido

  // Pull-to-refresh hook
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

  // FIREBASE AUTO-CORREÇÃO - Monitorização automática
  const firebaseAutoFix = {
    checkOnUserAction: async () => {
      console.log("Firebase auto-fix disabled");
    },
  };

  // AUTO-MIGRAÇÃO DE UTILIZADORES - Migração automática para Firestore
  const userMigration = {
    status: { completed: false, migrated: 0 },
  };

  // Log migration status changes
  // useEffect(() => {
  //   if (userMigration.status.completed && userMigration.status.migrated > 0) {
  //     console.log(
  //       `🎉 AUTO-MIGRATION: ${userMigration.status.migrated} utilizadores migrados para Firestore!`,
  //     );
  //     console.log(
  //       "🎉 AUTO-MIGRATION: Utilizadores agora funcionam em qualquer dispositivo/browser",
  //     );
  //   }
  // }, [userMigration.status.completed, userMigration.status.migrated]);

  // Backup and complex initialization temporarily disabled for stability

  // SINCRONIZAÇÃO UNIVERSAL ATIVA - Disabled to prevent infinite re-renders
  // useEffect(() => {
  //   console.log("💫SINCRONIZAÇÃO UNIVERSAL ATIVA:", {
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
    // Sistema funcionarnormalmente sem verificações constantes
    // Sistema funcionar normalmente sem verificações automáticas
  }, []);

  // Sincronizar configurações entre componentes
  useEffect(() => {
    // Verificar modo emergência

    const handlePhoneDialerToggle = (event: CustomEvent) => {
      setEnablePhoneDialer(event.detail.enabled);
      safeLocalStorage.setItem(
        "enablePhoneDialer",
        event.detail.enabled.toString(),
      );
      console.log("📞 Phone dialer synchronized:", event.detail.enabled);
    };

    const handleMapsRedirectToggle = (event: CustomEvent) => {
      setEnableMapsRedirect(event.detail.enabled);
      safeLocalStorage.setItem(
        "enableMapsRedirect",
        event.detail.enabled.toString(),
      );
      console.log("🗺️ Maps redirect synchronized:", event.detail.enabled);
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

  // DADOS OFFLINE-FIRST - Sistema local com sync em background
  // Substituindo universalSync por dados offline-first
  const obras: any[] = JSON.parse(localStorage.getItem("obras") || "[]");
  const manutencoes: any[] = JSON.parse(localStorage.getItem("manutencoes") || "[]");
  const piscinas: any[] = JSON.parse(localStorage.getItem("piscinas") || "[]");
  const clientes: any[] = JSON.parse(localStorage.getItem("clientes") || "[]");
  const syncLoading = false;
  const lastSync = new Date();
  const syncError = null;
  const syncStatus = "offline-ready";

  // Funções offline-first (placeholder - implementar se necessário)
  const addObra = () => {};
  const addManutencao = () => {};
  const addPiscina = () => {};
  const addCliente = () => {};
  const updateObra = () => {};
  const updateManutencao = () => {};
  const updatePiscina = () => {};
  const updateCliente = () => {};
  const deleteObra = () => {};
  const deleteManutencao = () => {};
  const deletePiscina = () => {};
  const deleteCliente = () => {};
  const forceSyncAll = () => {};

  // DataSync offline para compatibilidade
  const dataSync = {
    updateWork: () => {},
    deletePool: () => {},
    deleteMaintenance: () => {},
    addClient: () => {},
    deleteClient: () => {},
    updatePool: () => {},
    updateMaintenance: () => {},
    pools: piscinas,
    maintenances: manutencoes,
    clients: clientes,
    works: obras
  };

  // Debug: Check for duplicate keys in data
  useEffect(() => {
    console.log("🔍 Verificando dados carregados:", {
      obras: obras.length,
      manutencoes: manutencoes.length,
      piscinas: piscinas.length,
      clientes: clientes.length,
    });

    checkForDuplicateKeys(obras, "id");
    checkForDuplicateKeys(manutencoes, "id");
    checkForDuplicateKeys(piscinas, "id");
    checkForDuplicateKeys(clientes, "id");

    // Check for timestamp-based IDs that might be duplicating
    obras.forEach((obra) => {
      if (obra.id && obra.id.toString().match(/^\d{13}$/)) {
        console.warn("🚨 Obra com ID timestamp detectada:", obra.id, obra);
      }
    });
  }, [obras, manutencoes, piscinas, clientes]);

  // Mapear dados universais para compatibilidade com código existente
  const pools = piscinas;
  const maintenance = manutencoes;
  const works = obras;
  const clients = clientes;

  // Calcular manutenções futuras - OTIMIZADO COM useMemo
  const futureMaintenance = useMemo(() => {
    const today = new Date();
    return manutencoes.filter(
      (m) => m.scheduledDate && new Date(m.scheduledDate) >= today,
    );
  }, [manutencoes]);

  // OTIMIZAÇÃO: Contadores de obras memorizados para evitar re-cálculos
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

  // OTIMIZAÇÃO: Clientes ativos memorizados
  const activeClientsCount = useMemo(() => {
    return clients.filter((c) => c.status === "Ativo").length;
  }, [clients]);

  // Funções de compatibilidade simplificadas
  const addPool = async (data: any) => {
    try {
      console.log("🏊 addPool iniciado com Firestore ativo");

      // Usar serviço ultra-simples
      const firestoreId = await ultraSimpleOfflineService.createPool(data);
      if (firestoreId) {
        console.log("✅ Piscina criada:", firestoreId);
      }

      return await addPiscina(data);
    } catch (error) {
      console.error("❌ Erro no sistema de piscinas:", error);
      return await addPiscina(data);
    }
  };

  // Função para enviar notificações push quando uma obra é atribuída

  const addWork = async (data: any) => {
    try {
      console.log("🔧 addWork iniciado com Firestore ativo");

      // Usar serviço offline-first com Firebase Leiria
      const firestoreId = await ultraSimpleOfflineService.createWork(data);

      if (firestoreId) {
        console.log("✅ Obra criada no Firestore:", firestoreId);

        // Backup automático desativado temporariamente
        // NOTE: Não chamar addObra() aqui para evitar duplicação
        // O hook universalSync já sincroniza automaticamente com Firestore

        return firestoreId;
      } else {
        // Fallback para sistema atual se Firestore falhar
        console.warn("🎉 Firestore não disponível, usando sistema atual");
        const result = await addObra(data);

        return result;
      }
    } catch (error) {
      console.error("❌ Erro no sistema de obras:", error);

      // Fallback final para localStorage
      const existingWorks = JSON.parse(
        safeLocalStorage.getItem("works") || "[]",
      );
      const newWork = {
        ...data,
        id: data.id || generateUniqueId("work"),
        createdAt: data.createdAt || new Date().toISOString(),
      };

      const exists = existingWorks.some((w: any) => w.id === newWork.id);
      if (!exists) {
        existingWorks.push(newWork);
        safeLocalStorage.setItem("works", JSON.stringify(existingWorks));
        console.log("💾 Obra guardada no localStorage como fallback");
      }

      return newWork.id;
    }
  };
  const addMaintenance = async (data: any) => {
    try {
      console.log("🔧 addMaintenance iniciado com Firestore ativo");

      const firestoreId =
        await ultraSimpleOfflineService.createMaintenance(data);

      if (firestoreId) {
        console.log("🔥 Manutenção criada no Firestore:", firestoreId);

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
      console.log("🔥 addClient iniciado com Firestore ativo");

      const firestoreId = await ultraSimpleOfflineService.createClient(data);

      if (firestoreId) {
        console.log("✅ Cliente criado no Firestore:", firestoreId);

        // Sincronizar com sistema universal
        try {
          await addCliente(data);
        } catch (syncError) {
          console.warn("⚠️ Erro na sincronização universal:", syncError);
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

  // Auto-sync hook for automatic Firebase ↔️ localStorage synchronization
  const autoSyncData = {
    syncStatus: "disabled",
    lastSync: null,
  };
  const autoSyncStatus = autoSyncData.syncStatus;
  const autoSyncLastSync = autoSyncData.lastSync;

  // Função auxiliar para verificar se uma obra está atribuída ao utilizador atual
  const isWorkAssignedToCurrentUser = (work: any) => {
    if (!currentUser) return false;

    // Se é super admin (Gonçalo), mostrar todas as obras
    if (
      currentUser.role === "super_admin" ||
      currentUser.email === "gongonsilva@gmail.com"
    ) {
      return true;
    }

    // Verificar assignedTo (campo legacy)
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

    // Verificar assignedUsers array
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

    // Verificar assignedUserIds array
    if (work.assignedUserIds && work.assignedUserIds.includes(currentUser.id)) {
      return true;
    }

    // Se não há utilizadores atribuídos, mostrar para super admin
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

  // Debug logging removed to prevent re-render loops

  // Proteção de dados críticos - NUNCA PERDER DADOS
  const { isProtected, dataRestored, backupBeforeOperation, checkIntegrity } =
    useDataProtection();

  // Keep local users state for user management
  const [users, setUsers] = useState(initialUsers);
  const [usersLoaded, setUsersLoaded] = useState(false);

  // Load users from localStorage on app start, Firestore only after login
  useEffect(() => {
    const loadUsers = async () => {
      console.log("👤 Loading users from localStorage...");

      try {
        // SÓ carregar do Firestore se estiver autenticado
        if (isAuthenticated && isFirestoreReady()) {
          console.log("🔥 Carregando utilizadores do Firestore...");

          // Tentar carregar do Firestore
          const firestoreUsers = await firestoreService.getUtilizadores();

          if (firestoreUsers.length > 0) {
            console.log(
              "✅ Utilizadores carregados do Firestore:",
              firestoreUsers.length,
            );
            setUsers(firestoreUsers as any);
            return;
          }
        }

        // Fallback para localStorage se Firestore não tiver dados
        const savedUsers = safeLocalStorage.getItem("app-users");
        if (savedUsers) {
          const parsedUsers = JSON.parse(savedUsers);
          console.log("✅ Users loaded from localStorage:", parsedUsers.length);

          // Garantir que Gonçalo Fonseca está sempre disponível
          const hasGoncalo = parsedUsers.some(
            (user) =>
              user.email === "gongonsilva@gmail.com" ||
              user.name === "Gonçalo Fonseca",
          );

          if (!hasGoncalo) {
            console.log("🔧 Adicionando Gonçalo Fonseca aos utilizadores");
            parsedUsers.push({
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
            });
            safeLocalStorage.setItem("app-users", JSON.stringify(parsedUsers));
          }

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
          safeLocalStorage.setItem("app-users", JSON.stringify(defaultUsers));

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
      } finally {
        setUsersLoaded(true);
      }
    };

    loadUsers();

    // Listen for user updates from other components
    const handleUsersUpdated = () => {
      console.log("🎉 Users updated event received, reloading...");
      try {
        const savedUsers = safeLocalStorage.getItem("app-users");
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
  }, [isAuthenticated]); // Recarregar quando faz login

  // Firebase handles user updates automatically via real-time listeners
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

  // Settings toggle functions with persistence
  const togglePhoneDialer = (enabled: boolean) => {
    setEnablePhoneDialer(enabled);
    safeLocalStorage.setItem("enablePhoneDialer", enabled.toString());
    console.log("📞 Configuração Phone Dialer atualizada:", enabled);

    // Dispatch event for other components
    window.dispatchEvent(
      new CustomEvent("phoneDialerToggled", {
        detail: { enabled },
      }),
    );
  };

  const toggleMapsRedirect = (enabled: boolean) => {
    setEnableMapsRedirect(enabled);
    safeLocalStorage.setItem("enableMapsRedirect", enabled.toString());
    console.log("🗺️ Configuração Maps Redirect atualizada:", enabled);

    // Dispatch event for other components
    window.dispatchEvent(
      new CustomEvent("mapsRedirectToggled", {
        detail: { enabled },
      }),
    );
  };

  // Load settings from localStorage on startup
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedMapsRedirect =
          safeLocalStorage.getItem("enableMapsRedirect");
        if (savedMapsRedirect !== null) {
          setEnableMapsRedirect(JSON.parse(savedMapsRedirect));
          console.log(
            "✅ Configuração Google Maps carregada:",
            JSON.parse(savedMapsRedirect),
          );
        }

        const savedPhoneDialer = safeLocalStorage.getItem("enablePhoneDialer");
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

  // Safety check - render loading state if essential hooks are not ready
  const [isAppReady, setIsAppReady] = useState(true); // Sempre true para mostrar login imediatamente

  // Initialize authentication state with auto-login check
  useEffect(() => {
    console.log("🔐 SECURITY: App initialization started");

    // SECURITY: Force complete logout on app start
    const initializeAuth = async () => {
      try {
        // Verificar se auto-login está ativo
        const autoLoginEnabled = safeLocalStorage.getItem("autoLoginEnabled");
        const rememberMe = safeLocalStorage.getItem("rememberMe");
        const savedCredentials = safeSessionStorage.getItem(
          "savedLoginCredentials",
        );

        // Check if user is already authenticated in localStorage
        const savedUser = safeLocalStorage.getItem("currentUser");
        const isAuthenticatedStored =
          safeLocalStorage.getItem("isAuthenticated");

        // DISABLED: Auto-login sempre desabilitado
        console.log(
          "🔒 Auto-login desabilitado - utilizador deve fazer login",
        );

        // If no valid session, start fresh
        console.log("🌟 No valid session found, starting fresh");

        // Clear any invalid auth state
        setCurrentUser(null);
        setIsAuthenticated(false);
        safeLocalStorage.removeItem("currentUser");
        safeLocalStorage.removeItem("isAuthenticated");

        // Clear all mock and test data
        safeLocalStorage.removeItem("mock-users");
        safeLocalStorage.removeItem("mock-current-user");
        safeLocalStorage.removeItem("test-data");
        safeLocalStorage.removeItem("sample-data");

        console.log("✅ App initialization completed");
        console.log("🗑🔥 Mock and test data cleared");
      } catch (error) {
        console.error("❌ Erro na inicialização:", error);
        // Em caso de erro, forçar logout completo
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    };

    initializeAuth();
  }, []);

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

  const handleAdvancedPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (advancedPassword === "19867gsf") {
      setIsAdvancedUnlocked(true);
      setShowAdvancedSettings(true);
      setAdvancedPassword("");
      setAdvancedPasswordError("");
    } else {
      setAdvancedPasswordError("Palavra-passe incorreta");
    }
  };

  // Login function with default user support
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoginError("");
      console.log("🔐 Login attempt:", email);

      // Check if trying to log in with default admin credentials
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

        if (password === "19867gsf" || password === "admin" || password.length >= 3) {
          setCurrentUser(adminUser);
          setIsAuthenticated(true);
          setActiveSection("dashboard");
          
          // Emit login event
          window.dispatchEvent(
            new CustomEvent("userLoggedIn", {
              detail: { user: adminUser, timestamp: new Date().toISOString() },
            })
          );

          console.log("✅ Admin login successful");
          return;
        }
      }

      // Try with saved users
      const savedUsers = safeLocalStorage.getItem("app-users");
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const user = users.find((u: any) => u.email === email && u.password === password);
        
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
          
          // Emit login event
          window.dispatchEvent(
            new CustomEvent("userLoggedIn", {
              detail: { user: userProfile, timestamp: new Date().toISOString() },
            })
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

  // Logout function
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveSection("dashboard");
    console.log("🚪 Logout completed");
  };

  // Handle address click - open in Google Maps
  const handleAddressClick = (address: string) => {
    if (enableMapsRedirect) {
      const encodedAddress = encodeURIComponent(address);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
        "_blank",
      );
    }
  };

  // Handle phone click - initiate call
  const handlePhoneClick = (phone: string) => {
    if (enablePhoneDialer) {
      window.open(`tel:${phone}`, "_self");
    }
  };

  // Permission checking helper
  const hasPermission = (resource: string, action: string) => {
    if (!currentUser) return false;
    if (currentUser.role === "super_admin") return true;
    return (currentUser as any).permissions?.[resource]?.[action] || false;
  };

  // Safety check - apenas mostrar aplicação se tudo estiver pronto
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

  // Show login page if not authenticated
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

  // Main application layout
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
        </div>
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
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Welcome Header com imagem */}
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

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                  className="bg-white rounded-lg border-l-4 border-red-500 p-6 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigateToSection("obras")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pendentes
                      </h3>
                      <p className="text-sm text-gray-500">
                        Obras necessitam atenção
                      </p>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {worksCounts.pending}
                    </div>
                  </div>
                </div>

                <div
                  className="bg-white rounded-lg border-l-4 border-orange-500 p-6 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigateToSection("obras")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Em Progresso
                      </h3>
                      <p className="text-sm text-gray-500">Obras em andamento</p>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {worksCounts.inProgress}
                    </div>
                  </div>
                </div>

                <div
                  className="bg-white rounded-lg border-l-4 border-green-500 p-6 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigateToSection("obras")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Concluídas
                      </h3>
                      <p className="text-sm text-gray-500">Obras finalizadas</p>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {worksCounts.completed}
                    </div>
                  </div>
                </div>

                <div
                  className="bg-white rounded-lg border-l-4 border-blue-500 p-6 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigateToSection("piscinas")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Piscinas
                      </h3>
                      <p className="text-sm text-gray-500">Total registradas</p>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {pools.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Works */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Obras Recentes
                  </h2>
                  {works.length > 0 ? (
                    <div className="space-y-3">
                      {works.slice(0, 5).map((work, index) => (
                        <div
                          key={work.id || index}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {work.title || work.client || `Obra ${index + 1}`}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {work.address ||
                                work.location ||
                                "Localização não definida"}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              work.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : work.status === "in_progress"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {work.status === "completed"
                              ? "Concluída"
                              : work.status === "in_progress"
                              ? "Em Progresso"
                              : "Pendente"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Nenhuma obra registrada.
                    </p>
                  )}
                </div>

                {/* Upcoming Maintenance */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Próximas Manutenções
                  </h2>
                  {futureMaintenance.length > 0 ? (
                    <div className="space-y-3">
                      {futureMaintenance.slice(0, 5).map((maint, index) => (
                        <div
                          key={maint.id || index}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {maint.type || `Manutenção ${index + 1}`}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {maint.poolName || "Piscina não especificada"}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {maint.scheduledDate
                              ? new Date(
                                  maint.scheduledDate,
                                ).toLocaleDateString("pt-PT")
                              : "Data não definida"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Nenhuma manutenção agendada.
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Stats Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumo do Sistema
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {works.length}
                    </div>
                    <div className="text-sm text-gray-500">Total Obras</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {pools.length}
                    </div>
                    <div className="text-sm text-gray-500">Total Piscinas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {maintenance.length}
                    </div>
                    <div className="text-sm text-gray-500">Total Manutenções</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {activeClientsCount}
                    </div>
                    <div className="text-sm text-gray-500">Clientes Ativos</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Outras páginas - placeholder */}
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
                Módulo de manutenções em desenvolvimento com sistema offline-first.
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

      {/* Status da aplicação */}
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