import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Cloud,
} from "lucide-react";
import { useGlobalSync } from "./InstantSyncManager";

export const SyncStatusIndicator: React.FC = () => {
  const { isFullySynced, loading, error, data, forceSync } = useGlobalSync();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDetails, setShowDetails] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Update last sync time when sync completes
  useEffect(() => {
    if (isFullySynced && !loading) {
      setLastSyncTime(new Date());
    }
  }, [isFullySynced, loading]);

  // Get sync status
  const getSyncStatus = () => {
    if (!isOnline)
      return { icon: WifiOff, color: "text-gray-500", text: "Offline" };
    if (loading)
      return {
        icon: RefreshCw,
        color: "text-blue-500",
        text: "Sincronizando...",
      };
    if (error)
      return {
        icon: AlertCircle,
        color: "text-red-500",
        text: "Erro na sincronização",
      };
    if (isFullySynced)
      return {
        icon: CheckCircle,
        color: "text-green-500",
        text: "Sincronizado",
      };
    return { icon: Cloud, color: "text-yellow-500", text: "Aguardando..." };
  };

  const status = getSyncStatus();
  const StatusIcon = status.icon;

  const handleManualSync = async () => {
    try {
      await forceSync("manual");
    } catch (error) {
      console.error("Erro ao forçar sincronização:", error);
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffSeconds < 60) return "agora";
    if (diffMinutes < 60) return `há ${diffMinutes}m`;
    if (diffHours < 24) return `há ${diffHours}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Main Status Indicator */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors hover:bg-gray-100 ${status.color}`}
        title={status.text}
      >
        <StatusIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        <span className="hidden sm:inline">{status.text}</span>
      </button>

      {/* Detailed Status Popup */}
      {showDetails && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border p-4 z-50">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                Status da Sincronização
              </h3>
              <button
                onClick={handleManualSync}
                disabled={loading}
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                title="Forçar sincronização"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">
                {isOnline ? "Conectado" : "Sem conexão"}
              </span>
            </div>

            {/* Last Sync Time */}
            {lastSyncTime && (
              <div className="text-xs text-gray-500">
                Última sincronização: {formatRelativeTime(lastSyncTime)}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            {/* Data Count */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Usuários</div>
                <div className="text-gray-600">{data.users.length}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Piscinas</div>
                <div className="text-gray-600">{data.pools.length}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Manutenções</div>
                <div className="text-gray-600">{data.maintenance.length}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Obras</div>
                <div className="text-gray-600">{data.works.length}</div>
              </div>
            </div>

            {/* Sync Features */}
            <div className="border-t pt-2 space-y-1">
              <div className="text-xs text-gray-600">
                Funcionalidades ativas:
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                  Tempo real
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  Entre dispositivos
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                  Auto-sync
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showDetails && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

// Compact version for mobile
export const SyncStatusCompact: React.FC = () => {
  const { isFullySynced, loading, error } = useGlobalSync();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getStatusColor = () => {
    if (!isOnline) return "bg-gray-400";
    if (loading) return "bg-blue-400";
    if (error) return "bg-red-400";
    if (isFullySynced) return "bg-green-400";
    return "bg-yellow-400";
  };

  return (
    <div className="flex items-center gap-1">
      <div
        className={`w-2 h-2 rounded-full ${getStatusColor()} ${loading ? "animate-pulse" : ""}`}
        title={
          !isOnline
            ? "Offline"
            : loading
              ? "Sincronizando..."
              : error
                ? "Erro na sincronização"
                : isFullySynced
                  ? "Sincronizado"
                  : "Aguardando..."
        }
      />
    </div>
  );
};
