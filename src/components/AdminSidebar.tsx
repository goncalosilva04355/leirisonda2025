import React, { useState } from "react";
import {
  Settings,
  TestTube,
  Database,
  Shield,
  Users,
  Monitor,
  AlertTriangle,
  Wifi,
  RefreshCw,
  Smartphone,
  Zap,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// Import dos componentes principais do AdminPage
import { AuthSyncDiagnostic } from "./AuthSyncDiagnostic";
import { FirebaseStatus } from "./FirebaseStatus";
import { UserDiagnostic } from "./UserDiagnostic";
import UserManager from "./UserManager";
import { DataPersistenceDiagnostic } from "./DataPersistenceDiagnostic";
import FirebaseWriteDiagnosticComponent from "./FirebaseWriteDiagnostic";

interface AdminSidebarProps {
  currentUser?: any;
  onClose?: () => void;
}

type AdminTool =
  | "user-diagnostic"
  | "firebase-write-diagnostic"
  | "user-management"
  | "data-persistence-diagnostic"
  | "auth-diagnostic"
  | "firebase-status";

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentUser,
  onClose,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTool, setActiveTool] = useState<AdminTool | null>(null);

  const adminTools = [
    {
      id: "firebase-write-diagnostic" as AdminTool,
      title: "🔍 Diagnóstico Escrita Firebase",
      description: "Firebase não grava dados",
      icon: Database,
      color: "text-red-600",
      urgent: true,
    },
    {
      id: "user-diagnostic" as AdminTool,
      title: "👥 Diagnóstico Utilizadores",
      description: "Utilizadores não aparecem",
      icon: Users,
      color: "text-orange-600",
      urgent: true,
    },
    {
      id: "data-persistence-diagnostic" as AdminTool,
      title: "💾 Diagnóstico Persistência",
      description: "Problemas de guardado",
      icon: Database,
      color: "text-purple-600",
      urgent: true,
    },
    {
      id: "user-management" as AdminTool,
      title: "⚙️ Gestão de Utilizadores",
      description: "Criar e gerir utilizadores",
      icon: Users,
      color: "text-blue-600",
      urgent: false,
    },
    {
      id: "auth-diagnostic" as AdminTool,
      title: "🔐 Diagnóstico Auth",
      description: "Problemas de autenticação",
      icon: Shield,
      color: "text-green-600",
      urgent: false,
    },
    {
      id: "firebase-status" as AdminTool,
      title: "📡 Estado Firebase",
      description: "Monitorização ligação",
      icon: Wifi,
      color: "text-cyan-600",
      urgent: false,
    },
  ];

  const renderActiveTool = () => {
    if (!activeTool) return null;

    const closeToolPanel = () => setActiveTool(null);

    switch (activeTool) {
      case "firebase-write-diagnostic":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                Diagnóstico Firebase
              </h3>
              <button
                onClick={closeToolPanel}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <FirebaseWriteDiagnosticComponent />
          </div>
        );

      case "user-diagnostic":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                Diagnóstico Utilizadores
              </h3>
              <button
                onClick={closeToolPanel}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <UserDiagnostic />
          </div>
        );

      case "data-persistence-diagnostic":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                Diagnóstico Persistência
              </h3>
              <button
                onClick={closeToolPanel}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <DataPersistenceDiagnostic autoCheck={true} />
          </div>
        );

      case "user-management":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                Gestão Utilizadores
              </h3>
              <button
                onClick={closeToolPanel}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <UserManager currentUser={currentUser} />
          </div>
        );

      case "auth-diagnostic":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Diagnóstico Auth</h3>
              <button
                onClick={closeToolPanel}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <AuthSyncDiagnostic />
          </div>
        );

      case "firebase-status":
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Estado Firebase</h3>
              <button
                onClick={closeToolPanel}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <FirebaseStatus isConnected={true} />
          </div>
        );

      default:
        return null;
    }
  };

  if (activeTool) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        {renderActiveTool()}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header da Administração */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-orange-600" />
          <span>Ferramentas Admin</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Lista de Ferramentas */}
      {isExpanded && (
        <div className="ml-4 space-y-1">
          {adminTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`w-full flex items-start space-x-3 px-3 py-2 text-left text-xs rounded-lg hover:bg-gray-50 transition-colors ${
                  tool.urgent ? "bg-red-50 border-l-2 border-red-300" : ""
                }`}
              >
                <IconComponent
                  className={`w-4 h-4 mt-0.5 ${tool.color} ${tool.urgent ? "animate-pulse" : ""}`}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium ${tool.urgent ? "text-red-700" : "text-gray-700"}`}
                  >
                    {tool.title}
                  </div>
                  <div
                    className={`text-xs ${tool.urgent ? "text-red-600" : "text-gray-500"} truncate`}
                  >
                    {tool.description}
                  </div>
                  {tool.urgent && (
                    <div className="text-xs text-red-600 font-bold mt-1">
                      🚨 URGENTE
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Acesso Rápido - Problemas Urgentes */}
      {!isExpanded && (
        <div className="space-y-1">
          {adminTools
            .filter((tool) => tool.urgent)
            .map((tool) => {
              const IconComponent = tool.icon;
              return (
                <button
                  key={`urgent-${tool.id}`}
                  onClick={() => setActiveTool(tool.id)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-xs bg-red-50 border-l-2 border-red-300 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <IconComponent
                    className={`w-3 h-3 ${tool.color} animate-pulse`}
                  />
                  <span className="text-red-700 font-medium truncate">
                    {tool.title.replace(/🔍|👥|💾|⚙️|🔐|📡/, "").trim()}
                  </span>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
