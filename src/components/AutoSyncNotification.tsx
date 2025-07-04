import React from "react";
import { CheckCircle, RefreshCw, AlertCircle, X } from "lucide-react";

interface AutoSyncNotificationProps {
  syncStatus: "idle" | "syncing" | "completed" | "error";
  lastSync: Date | null;
  onDismiss?: () => void;
}

export const AutoSyncNotification: React.FC<AutoSyncNotificationProps> = ({
  syncStatus,
  lastSync,
  onDismiss,
}) => {
  if (syncStatus === "idle") return null;

  const getStatusIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (syncStatus) {
      case "syncing":
        return "Sincronizando dados com Firebase...";
      case "completed":
        return `Sincronização completa${lastSync ? ` - ${lastSync.toLocaleTimeString("pt-PT")}` : ""}`;
      case "error":
        return "Erro na sincronização - usando modo local";
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case "syncing":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "completed":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg border shadow-lg z-50 flex items-center space-x-2 ${getStatusColor()}`}
    >
      {getStatusIcon()}
      <span className="text-sm font-medium">{getStatusMessage()}</span>
      {syncStatus === "completed" && onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
