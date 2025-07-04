import React from "react";
import {
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAutoSync } from "./AutoSyncProvider";
import { SyncErrorBoundary } from "./SyncErrorBoundary";

interface SyncStatusIndicatorProps {
  position?: "fixed" | "relative";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  position = "fixed",
  size = "sm",
  showText = false,
  className = "",
}) => {
  let syncData;
  try {
    syncData = useAutoSync();
  } catch (error) {
    console.warn("SyncStatusIndicator: useAutoSync error", error);
    syncData = {
      isActive: false,
      syncing: false,
      lastSync: null,
      error: "Sync unavailable",
    };
  }

  const { isActive, syncing, lastSync, error: syncError } = syncData;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "md":
        return "w-5 h-5";
      case "lg":
        return "w-6 h-6";
      default:
        return "w-4 h-4";
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "md":
        return "text-sm";
      case "lg":
        return "text-base";
      default:
        return "text-xs";
    }
  };

  const getPositionClasses = () => {
    if (position === "fixed") {
      return "fixed top-4 right-4 z-50";
    }
    return "";
  };

  const getStatusInfo = () => {
    if (!isActive) {
      return {
        icon: WifiOff,
        color: "text-gray-400",
        bgColor: "bg-gray-100",
        text: "Sync desativado",
        pulse: false,
      };
    }

    if (syncError) {
      const isQuotaError =
        syncError.includes("quota") || syncError.includes("resource-exhausted");
      return {
        icon: AlertCircle,
        color: isQuotaError ? "text-orange-500" : "text-red-500",
        bgColor: isQuotaError ? "bg-orange-50" : "bg-red-50",
        text: isQuotaError ? "Limite atingido" : "Erro na sincronização",
        pulse: false,
      };
    }

    if (syncing) {
      return {
        icon: RefreshCw,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        text: "Sincronizando...",
        pulse: true,
      };
    }

    if (lastSync) {
      const timeDiff = Date.now() - lastSync.getTime();
      const isRecent = timeDiff < 10000; // 10 segundos

      return {
        icon: isRecent ? CheckCircle : Wifi,
        color: isRecent ? "text-green-500" : "text-blue-500",
        bgColor: isRecent ? "bg-green-50" : "bg-blue-50",
        text: isRecent ? "Sincronizado" : "Conectado",
        pulse: false,
      };
    }

    return {
      icon: Wifi,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      text: "Conectado",
      pulse: false,
    };
  };

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo.icon;

  return (
    <SyncErrorBoundary
      fallback={
        <div className={`${getPositionClasses()} ${className}`}>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg shadow-sm border bg-orange-50 border-orange-200">
            <AlertCircle className={`${getSizeClasses()} text-orange-500`} />
            {showText && (
              <span
                className={`${getTextSizeClasses()} text-orange-500 font-medium`}
              >
                Limite atingido
              </span>
            )}
          </div>
        </div>
      }
    >
      <div className={`${getPositionClasses()} ${className}`}>
        <div
          className={`
            flex items-center gap-2 px-2 py-1 rounded-lg shadow-sm border
            ${statusInfo.bgColor} border-gray-200
            ${showText ? "pr-3" : ""}
          `}
          title={syncError || statusInfo.text}
        >
          <IconComponent
            className={`
              ${getSizeClasses()} ${statusInfo.color}
              ${statusInfo.pulse ? "animate-spin" : ""}
            `}
          />

          {showText && (
            <span
              className={`${getTextSizeClasses()} ${statusInfo.color} font-medium`}
            >
              {statusInfo.text}
            </span>
          )}
        </div>

        {/* Detalhes no hover para versão sem texto */}
        {!showText && lastSync && (
          <div className="absolute top-full right-0 mt-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Última sync: {lastSync.toLocaleTimeString()}
          </div>
        )}
      </div>
    </SyncErrorBoundary>
  );
};

// Versão minimalista apenas com ícone
export const SyncStatusIcon: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <SyncStatusIndicator
      position="relative"
      size="sm"
      showText={false}
      className={className}
    />
  );
};

// Versão com texto para usar em dashboards
export const SyncStatusBadge: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <SyncStatusIndicator
      position="relative"
      size="md"
      showText={true}
      className={className}
    />
  );
};

// Hook para informações detalhadas de sincronização
export const useSyncStatusInfo = () => {
  let syncData;
  try {
    syncData = useAutoSync();
  } catch (error) {
    console.warn("useSyncStatusInfo: useAutoSync error", error);
    syncData = {
      isActive: false,
      syncing: false,
      lastSync: null,
      error: "Sync unavailable",
      config: { enabled: false, syncInterval: 30000, collections: [] },
    };
  }

  const { isActive, syncing, lastSync, error, config } = syncData;

  const getStatusText = () => {
    if (!isActive) return "Sincronização desativada";
    if (error) return `Erro: ${error}`;
    if (syncing) return "Sincronizando dados...";
    if (lastSync) {
      const timeDiff = Date.now() - lastSync.getTime();
      if (timeDiff < 10000) return "Dados sincronizados";
      if (timeDiff < 60000)
        return `Sincronizado há ${Math.floor(timeDiff / 1000)}s`;
      return `Sincronizado há ${Math.floor(timeDiff / 60000)}min`;
    }
    return "Aguardando sincronização";
  };

  const getHealthStatus = (): "healthy" | "warning" | "error" | "inactive" => {
    if (!isActive) return "inactive";
    if (error) return "error";
    if (syncing) return "healthy";
    if (lastSync) {
      const timeDiff = Date.now() - lastSync.getTime();
      if (timeDiff < 30000) return "healthy"; // 30 segundos
      if (timeDiff < 300000) return "warning"; // 5 minutos
      return "error";
    }
    return "warning";
  };

  return {
    isActive,
    syncing,
    lastSync,
    error,
    config,
    statusText: getStatusText(),
    healthStatus: getHealthStatus(),
  };
};
