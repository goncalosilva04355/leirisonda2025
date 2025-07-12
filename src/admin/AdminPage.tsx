import React, { useState } from "react";
import {
  Settings,
  TestTube,
  Database,
  Shield,
  Users,
  Monitor,
  ArrowLeft,
  AlertTriangle,
  Wifi,
  RefreshCw,
  Smartphone,
  Zap,
} from "lucide-react";

// Import dos componentes de teste e configuraç��o
import { AuthSyncDiagnostic } from "../components/AuthSyncDiagnostic";
import { FullSyncManager } from "../components/FullSyncManager";
import { FirebaseStatus } from "../components/FirebaseStatus";
import { DataCleanupManager } from "../components/DataCleanupManager";
import { DataManagementPanel } from "../components/DataManagementPanel";
import { FirebaseConfig } from "../components/FirebaseConfig";
import { CrossDeviceUserManager } from "../components/CrossDeviceUserManager";
import { AutoSyncDemo } from "../components/AutoSyncDemo";
import { DataSharingStatus } from "../components/DataSharingStatus";
import { PhoneSettings } from "../components/PhoneSettings";
import { DataRecovery } from "../components/DataRecovery";
import UserManager from "../components/UserManager";
import MigrationTester from "../components/MigrationTester";
import { UserDiagnostic } from "../components/UserDiagnostic";

import { WorksDataDiagnostic } from "../components/WorksDataDiagnostic";
import { LoginFixer } from "../components/LoginFixer";
import { DataBackupManager } from "../components/DataBackupManager";

import { DangerousUserDeletion } from "../components/DangerousUserDeletion";
import { NotificationDemo } from "../components/NotificationDemo";
import NuclearUserCleanup from "../components/NuclearUserCleanup";
import CompleteDeviceActivation from "../components/CompleteDeviceActivation";
import { DataPersistenceDiagnostic } from "../components/DataPersistenceDiagnostic";

interface AdminPageProps {
  onLogout: () => void;
  currentUser?: any;
}

type AdminSection =
  | "overview"
  | "complete-activation"
  | "user-diagnostic"
  | "user-management"
  | "data-migration"
  | "work-assignment-fix"
  | "works-data-diagnostic"
  | "auth-diagnostic"
  | "sync-manager"
  | "firebase-status"
  | "user-debugger"
  | "data-cleanup"
  | "data-management"
  | "firebase-config"
  | "cross-device-users"
  | "auto-sync-demo"
  | "phone-settings"
  | "mobile-settings"
  | "data-recovery"
  | "data-backup"
  | "firebase-quota"
  | "login-fix"
  | "user-deletion"
  | "notification-demo"
  | "nuclear-cleanup"
  | "data-sharing-status"
  | "data-persistence-diagnostic";

export const AdminPage: React.FC<AdminPageProps> = ({
  onLogout,
  currentUser,
}) => {
  const [currentSection, setCurrentSection] =
    useState<AdminSection>("overview");

  const adminSections = [
    {
      id: "complete-activation" as AdminSection,
      title: "�� ATIVAÇÃO COMPLETA DO DISPOSITIVO",
      description:
        "ATIVA TUDO: Notificações, localização, sincronização, utilizadores, PWA - tudo num só botão!",
      icon: Zap,
      color: "bg-gradient-to-r from-green-600 to-blue-600",
    },
    {
      id: "data-persistence-diagnostic" as AdminSection,
      title: "💾 Diagnóstico de Persistência",
      description:
        "CRÍTICO: Verificar e reparar problemas com guardado de dados - especial para app publicada",
      icon: Database,
      color: "bg-gradient-to-r from-red-600 to-orange-600",
    },
    {
      id: "user-diagnostic" as AdminSection,
      title: "🔍 Diagnóstico de Utilizadores",
      description:
        "URGENTE: Verificar porque utilizadores guardados não aparecem",
      icon: Users,
      color: "bg-red-600",
    },
    {
      id: "user-management" as AdminSection,
      title: "Gestão de Utilizadores",
      description: "Criar, editar e gerir utilizadores do sistema",
      icon: Users,
      color: "bg-indigo-600",
    },
    {
      id: "data-migration" as AdminSection,
      title: "🔄 Migração de Dados",
      description: "Migrar dados do localStorage para Firestore e testar",
      icon: Database,
      color: "bg-purple-600",
    },
    {
      id: "work-assignment-fix" as AdminSection,
      title: "🔧 Correção de Atribuição de Obras",
      description: "Corrigir problemas na atribuição de utilizadores às obras",
      icon: Users,
      color: "bg-orange-600",
    },
    {
      id: "works-data-diagnostic" as AdminSection,
      title: "🏗️ Diagnóstico: 0 Obras",
      description: "URGENTE: Resolver problema de 0 obras aparecendo na app",
      icon: AlertTriangle,
      color: "bg-red-600",
    },
    {
      id: "nuclear-cleanup" as AdminSection,
      title: "🚨 LIMPEZA NUCLEAR (MELHORADA)",
      description:
        "ELIMINA completamente Firebase Auth persistence - resolve utilizadores antigos",
      icon: AlertTriangle,
      color: "bg-red-800",
    },
    {
      id: "login-fix" as AdminSection,
      title: "🔑 Correção de Login",
      description:
        "Resolver problemas de login (Alexandre, Yuri, tremor do ecrã)",
      icon: Shield,
      color: "bg-red-600",
    },
    {
      id: "auth-diagnostic" as AdminSection,
      title: "Diagnóstico de Autenticação",
      description: "Teste e debug do sistema de autenticação",
      icon: Shield,
      color: "bg-blue-500",
    },
    {
      id: "sync-manager" as AdminSection,
      title: "Gestor de Sincronização",
      description: "Sincronização completa de dados",
      icon: RefreshCw,
      color: "bg-green-500",
    },
    {
      id: "firebase-status" as AdminSection,
      title: "Estado do Firebase",
      description: "Monitorização da ligação Firebase",
      icon: Wifi,
      color: "bg-orange-500",
    },
    {
      id: "user-debugger" as AdminSection,
      title: "Debug de Utilizadores",
      description: "Debug e teste de utilizadores",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      id: "data-cleanup" as AdminSection,
      title: "Limpeza de Dados",
      description: "Limpeza e manutenção da base de dados",
      icon: Database,
      color: "bg-red-500",
    },
    {
      id: "data-management" as AdminSection,
      title: "Gestão de Dados",
      description: "Painel de gestão de dados do sistema",
      icon: Monitor,
      color: "bg-indigo-500",
    },
    {
      id: "firebase-config" as AdminSection,
      title: "Configuração Firebase",
      description: "Configurações do Firebase",
      icon: Settings,
      color: "bg-gray-500",
    },
    {
      id: "cross-device-users" as AdminSection,
      title: "Acesso Multi-Dispositivo",
      description: "Gestão de utilizadores para acesso universal",
      icon: Wifi,
      color: "bg-cyan-500",
    },
    {
      id: "auto-sync-demo" as AdminSection,
      title: "Sincronização Automática",
      description: "Sistema de sincronização em tempo real",
      icon: RefreshCw,
      color: "bg-emerald-500",
    },
    {
      id: "data-sharing-status" as AdminSection,
      title: "Diagnóstico de Partilha",
      description: "Verificar se todos os utilizadores veem os mesmos dados",
      icon: Users,
      color: "bg-blue-600",
    },
    {
      id: "phone-settings" as AdminSection,
      title: "Telefone & Navegação",
      description: "Marcação autom��tica e redirecionamento para Maps",
      icon: Settings,
      color: "bg-blue-500",
    },
    {
      id: "mobile-settings" as AdminSection,
      title: "📱 Configurações Mobile",
      description:
        "Notificações, localização e configurações para dispositivos móveis",
      icon: Smartphone,
      color: "bg-indigo-600",
    },
    {
      id: "data-recovery" as AdminSection,
      title: "🚨 Recuperação de Dados",
      description: "EMERGÊNCIA: Restaurar obras e dados perdidos",
      icon: AlertTriangle,
      color: "bg-red-500",
    },
    {
      id: "data-backup" as AdminSection,
      title: "💾 Backup de Dados e App",
      description: "Criar backups de segurança dos dados e da aplicação",
      icon: Database,
      color: "bg-indigo-600",
    },
    {
      id: "firebase-quota" as AdminSection,
      title: "🚨 Gest��o de Quota Firebase",
      description: "CRÍTICO: Monitorizar e gerir quota do Firebase",
      icon: AlertTriangle,
      color: "bg-red-600",
    },
    {
      id: "user-deletion" as AdminSection,
      title: "💀 ELIMINAR TODOS OS UTILIZADORES",
      description: "PERIGO: Eliminar todos os utilizadores exceto super admin",
      icon: Users,
      color: "bg-red-800",
    },
    {
      id: "notification-demo" as AdminSection,
      title: "🔔 Demo de Notificações",
      description: "Testar sistema de notificações em tempo real",
      icon: AlertTriangle,
      color: "bg-blue-600",
    },
  ];

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "complete-activation":
        return <CompleteDeviceActivation />;
      case "data-persistence-diagnostic":
        return <DataPersistenceDiagnostic autoCheck={true} />;
      case "user-diagnostic":
        return <UserDiagnostic />;
      case "user-management":
        return <UserManager currentUser={currentUser} />;
      case "data-migration":
        return <MigrationTester />;
      case "work-assignment-fix":
        return <WorkAssignmentFix />;
      case "works-data-diagnostic":
        return <WorksDataDiagnostic />;
      case "login-fix":
        return <LoginFixer />;
      case "auth-diagnostic":
        return <AuthSyncDiagnostic />;
      case "sync-manager":
        return <FullSyncManager />;
      case "firebase-status":
        return <FirebaseStatus />;
      case "user-debugger":
        return <UserDebugger />;
      case "data-cleanup":
        return <DataCleanupManager />;
      case "data-management":
        return <DataManagementPanel />;
      case "firebase-config":
        return <FirebaseConfig onConfigured={() => {}} />;
      case "cross-device-users":
        return <CrossDeviceUserManager />;
      case "auto-sync-demo":
        return <AutoSyncDemo />;
      case "data-sharing-status":
        return (
          <DataSharingStatus
            onFixApplied={() => {
              console.log("✅ Partilha de dados corrigida no painel admin");
            }}
          />
        );
      case "phone-settings":
        return <PhoneSettings />;
      case "mobile-settings":
        return <MobileSettings />;
      case "data-recovery":
        return <DataRecovery />;
      case "data-backup":
        return <DataBackupManager />;
      case "firebase-quota":
        return <FirebaseQuotaManager />;
      case "user-deletion":
        return <DangerousUserDeletion />;
      case "notification-demo":
        return <NotificationDemo />;
      case "nuclear-cleanup":
        return <NuclearUserCleanup />;
      case "overview":
      default:
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">
                    Área Restrita de Administração
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Esta área contém ferramentas de teste, debug e configuração
                    do sistema. Use com cuidado em ambiente de produção.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminSections.map((section) => {
                const IconComponent = section.icon;
                const isDangerous = section.id === "user-deletion";
                const isCompleteActivation =
                  section.id === "complete-activation";

                if (isCompleteActivation) {
                  return (
                    <div
                      key={section.id}
                      className="md:col-span-2 lg:col-span-3"
                    >
                      <button
                        onClick={() => setCurrentSection(section.id)}
                        className="w-full p-8 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white transition-all transform hover:scale-105"
                      >
                        <div className="flex items-center justify-center mb-4">
                          <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold">
                            {section.title}
                          </h3>
                        </div>
                        <p className="text-lg text-center text-green-100">
                          {section.description}
                        </p>
                        <div className="mt-4 text-center">
                          <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">
                            ⚡ Clique para ativar tudo instantaneamente
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                }

                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`p-6 rounded-lg shadow-sm border transition-shadow text-left ${
                      isDangerous
                        ? "bg-red-50 border-red-300 hover:bg-red-100 hover:shadow-lg"
                        : "bg-white border-gray-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className={`${section.color} p-2 rounded-lg mr-3 ${
                          isDangerous ? "animate-pulse" : ""
                        }`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3
                        className={`text-lg font-semibold ${
                          isDangerous ? "text-red-900" : "text-gray-900"
                        }`}
                      >
                        {section.title}
                      </h3>
                    </div>
                    <p
                      className={`text-sm ${
                        isDangerous
                          ? "text-red-700 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {section.description}
                    </p>
                    {isDangerous && (
                      <div className="mt-3 text-xs text-red-600 font-bold">
                        ⚠️ OPERAÇÃO IRREVERSÍVEL
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {currentSection !== "overview" && (
                <button
                  onClick={() => setCurrentSection("overview")}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Área de Administração
                </h1>
                <p className="text-sm text-gray-600">
                  {currentSection === "overview"
                    ? "Ferramentas de teste e configuração"
                    : adminSections.find((s) => s.id === currentSection)?.title}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300"
            >
              Sair da Administração
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderCurrentSection()}
        </div>
      </div>
    </div>
  );
};
