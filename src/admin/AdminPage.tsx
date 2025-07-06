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
} from "lucide-react";

// Import dos componentes de teste e configuração
import { AuthSyncDiagnostic } from "../components/AuthSyncDiagnostic";
import { FullSyncManager } from "../components/FullSyncManager";
import { FirebaseStatus } from "../components/FirebaseStatus";
import { UserDebugger } from "../components/UserDebugger";
import { DataCleanupManager } from "../components/DataCleanupManager";
import { DataManagementPanel } from "../components/DataManagementPanel";
import { FirebaseConfig } from "../components/FirebaseConfig";
import { CrossDeviceUserManager } from "../components/CrossDeviceUserManager";
import { AutoSyncDemo } from "../components/AutoSyncDemo";
import { PhoneSettings } from "../components/PhoneSettings";

interface AdminPageProps {
  onLogout: () => void;
}

type AdminSection =
  | "overview"
  | "auth-diagnostic"
  | "sync-manager"
  | "firebase-status"
  | "user-debugger"
  | "data-cleanup"
  | "data-management"
  | "firebase-config"
  | "cross-device-users"
  | "auto-sync-demo"
  | "phone-settings";

export const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const [currentSection, setCurrentSection] =
    useState<AdminSection>("overview");

  const adminSections = [
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
      id: "phone-settings" as AdminSection,
      title: "Configurações de Telefone",
      description: "Marcação automática e configurações de chamadas",
      icon: Settings,
      color: "bg-blue-500",
    },
  ];

  const renderCurrentSection = () => {
    switch (currentSection) {
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
      case "phone-settings":
        return <PhoneSettings />;
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
                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
                  >
                    <div className="flex items-center mb-3">
                      <div className={`${section.color} p-2 rounded-lg mr-3`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {section.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentSection()}
      </div>
    </div>
  );
};
