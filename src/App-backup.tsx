// VERIFICADOR SIMPLES DE COLEÇÕES FIRESTORE
// import "./utils/simpleFirestoreChecker";

// FORÇAR INICIALIZAÇÃO FIREBASE SIMPLES
// import "./utils/simpleFirebaseInit";

// VERIFICAÇÃO BÁSICA DE SAÚDE
// import "./utils/basicHealthCheck";

// PREVENÇÃO DE ERROS GETIMMEDIATE
import "./utils/preventGetImmediateError";

// HANDLER GLOBAL DE ERROS
import "./utils/globalErrorHandler";
import "./utils/safeFetch";
import "./utils/safeFirestoreTestFixed";
import "./utils/loadFailedDetector";

// TESTES ABRANGENTES FIREBASE/FIRESTORE
import "./utils/comprehensiveFirebaseTest";
import "./utils/verifySaveToFirestore";
import "./utils/verifyAutoSync";
import "./utils/finalFirebaseVerification";
import "./utils/firestoreDiagnosticMessage";
import "./utils/safeFirestoreTest";
import "./utils/ultraSafeTest";

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
  FileText,
  MapPin,
  Share,
  Database,
} from "lucide-react";
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
import { simplifiedSyncService } from "./services/simplifiedSyncService";

import { EditModeFirestoreStatus } from "./components/EditModeFirestoreStatus";
import FirestoreDiagnostic from "./components/FirestoreDiagnostic";
import FirestoreTest from "./components/FirestoreTest";

// Limpar estados que causam modais indesejados
// import "./utils/clearModalStates";

// Firebase Quota Recovery - recuperar operações bloqueadas
import {
  autoRecoverOnInit,
  FirebaseQuotaRecovery,
} from "./utils/firebaseQuotaRecovery";

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
import { StableModeIndicator } from "./components/StableModeIndicator";
import { SimpleFirestoreStatus } from "./components/SimpleFirestoreStatus";

// import "./utils/protectedLocalStorage"; // Ativar proteção automática

import { fcmService } from "./services/fcmService";
import NotificationCenter from "./components/NotificationCenter";

import { syncManager } from "./utils/syncManager";
import { clearQuotaProtection } from "./utils/clearQuotaProtection";
import {
  isFirebaseReady,
  isFirestoreReady,
  getFirebaseFirestore,
} from "./firebase/leiriaConfig";
import { initializeAuthorizedUsers } from "./config/authorizedUsers";
import { firestoreService } from "./services/firestoreService";
import { ultraSimpleOfflineService } from "./services/ultraSimpleOffline"; // Serviço ultra-simples
// import { firebaseStorageService } from "./services/firebaseStorageService";
import { autoSyncService } from "./services/autoSyncService";
import { productionAutoSync } from "./services/productionAutoSync"; // Sincronização automática para produção
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

import { useDataSync as useDataSyncSimple } from "./hooks/useDataSync";
import { useUniversalDataSyncFixed as useUniversalDataSync } from "./hooks/useUniversalDataSyncFixed";
import { authServiceWrapperSafe as authService } from "./services/authServiceWrapperSafe";
import { UserProfile } from "./services/robustLoginService";
import { DataProtectionService } from "./utils/dataProtection";

// Desativados durante desenvolvimento para evitar refresh no Builder.io
// Firebase works silently in background - no diagnostics or UI needed
// import("./firebase/ultimateSimpleFirebase");
// import { ForceInitialization } from "./utils/forceInitialization";
// Teste simples Firebase Leiria
// import("./utils/testeLeiria");
// Testes de regras Firebase removidos para evitar conflitos

// Sistema de diagnóstico de persistência
import { DataPersistenceDiagnostic } from "./components/DataPersistenceDiagnostic";
import { DataPersistenceAlert } from "./components/DataPersistenceAlert";
import { DataPersistenceIndicator } from "./components/DataPersistenceIndicator";
import { dataPersistenceManager } from "./utils/dataPersistenceFix";
import { MobileFirebaseFix } from "./components/MobileFirebaseFix";
// import { useForceFirestore } from "./hooks/useForceFirestore"; // DESABILITADO - problemas SDK
// import "./utils/forceFirestore"; // FORÇA FIRESTORE A FUNCIONAR - DESABILITADO (tinha problemas)
// import "./utils/testForceFirestore"; // Teste que força funcionamento - DESABILITADO
// import "./utils/firestoreDebugger"; // DEBUG detalhado dos problemas - DESABILITADO
// import "./utils/ultraSimpleFirestore"; // ULTRA SIMPLES - DESABILITADO (problemas SDK)
import "./utils/firestoreRestApi"; // REST API - FUNCIONA VIA HTTP (BYPASS SDK)
import "./utils/verifyProject"; // VERIFICAR que está usando leiria-1cfc9
import "./utils/firebaseStatus"; // STATUS dos serviços Firebase
// import "./utils/testDataPersistence";
// import "./utils/testFirebaseUserSync";
// import "./utils/completeDataSync";
// import "./utils/fullSyncStatus";

// import { useDataCleanup } from "./hooks/useDataCleanup";
// import { useAutoSyncSimpleFixed as useAutoSyncSimple } from "./hooks/useAutoSyncSimpleFixed";
// import { useAutoFirebaseFixFixed as useAutoFirebaseFix } from "./hooks/useAutoFirebaseFixFixed";
// import { useAutoUserMigrationFixed as useAutoUserMigration } from "./hooks/useAutoUserMigrationFixed";
import FirebaseAutoMonitor from "./components/FirebaseAutoMonitor";
import UserMigrationIndicator from "./components/UserMigrationIndicator";
// Firebase components removed - Firebase works automatically in background

// Diagnóstico automático para problemas de inserção de dados
// import "./utils/datainput-diagnostic";
import DataInputStatusIndicator from "./components/DataInputStatusIndicator";
import DataInputTutorial from "./components/DataInputTutorial";

// Monitor de erros Firebase desativado durante desenvolvimento
// import "./utils/firebaseErrorMonitor";

import { userRestoreService } from "./services/userRestoreService";
import UserRestoreNotificationSimple from "./components/UserRestoreNotificationSimple";

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
import DiagnosticPage from "./components/DiagnosticPage";

// Diagnóstico de autenticação
// import "./utils/authDiagnostic";

// Indicador de status da aplicação
import AppStatusIndicator from "./components/AppStatusIndicator";

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

// Função showNotification temporária
const showNotification = (
  title: string,
  message: string,
  type: string = "info",
) => {
  console.log(`${type.toUpperCase()}: ${title} - ${message}`);
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Leirisonda</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sistema de Gestão de Piscinas
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <p className="text-gray-700">A aplicação está a ser carregada...</p>
        </div>
      </div>
    </div>
  );
}

export default App;
