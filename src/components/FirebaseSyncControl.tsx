import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Cloud,
  CloudOff,
  Database,
  CheckCircle,
  AlertTriangle,
  Wifi,
} from "lucide-react";

interface SyncControlProps {
  onSyncComplete?: () => void;
}

export const FirebaseSyncControl: React.FC<SyncControlProps> = ({
  onSyncComplete,
}) => {
  const [syncStatus, setSyncStatus] = useState({
    isOnline: navigator.onLine,
    lastSync: "Nunca",
    pendingSync: 0,
    firebaseAvailable: false,
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    updateSyncStatus();

    const interval = setInterval(updateSyncStatus, 5000);

    // Listeners para mudanças de conectividade
    const handleOnline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: true }));
      setSyncMessage("Conexão restaurada - sincronizando...");
      performAutoSync();
    };

    const handleOffline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: false }));
      setSyncMessage("Modo offline - dados salvos localmente");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const updateSyncStatus = async () => {
    try {
      const { hybridDataSync } = await import("../services/hybridDataSync");
      const status = hybridDataSync.getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.warn("Erro ao obter status de sincronização:", error);
    }
  };

  const performAutoSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    setSyncMessage("Sincronizando dados...");

    try {
      const { hybridDataSync } = await import("../services/hybridDataSync");
      await hybridDataSync.forceSyncNow();

      setSyncMessage("✅ Sincronização concluída");
      await updateSyncStatus();

      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      console.error("Erro na sincronização:", error);
      setSyncMessage("❌ Erro na sincronização");
    } finally {
      setIsSyncing(false);

      // Limpar mensagem após 3 segundos
      setTimeout(() => setSyncMessage(""), 3000);
    }
  };

  const handleManualSync = () => {
    performAutoSync();
  };

  const getSyncStatusColor = () => {
    if (!syncStatus.isOnline) return "text-orange-600";
    if (syncStatus.pendingSync > 0) return "text-yellow-600";
    if (syncStatus.firebaseAvailable) return "text-green-600";
    return "text-blue-600";
  };

  const getSyncStatusIcon = () => {
    if (!syncStatus.isOnline) return <CloudOff className="h-4 w-4" />;
    if (syncStatus.pendingSync > 0)
      return <AlertTriangle className="h-4 w-4" />;
    if (syncStatus.firebaseAvailable) return <Cloud className="h-4 w-4" />;
    return <Database className="h-4 w-4" />;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Sincronização Firebase
        </h3>

        <button
          onClick={handleManualSync}
          disabled={isSyncing || !syncStatus.isOnline}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isSyncing || !syncStatus.isOnline
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
        </button>
      </div>

      {/* Status da Sincronização */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <div
            className={`flex items-center space-x-2 ${getSyncStatusColor()}`}
          >
            {getSyncStatusIcon()}
            <span className="text-sm font-medium">
              {!syncStatus.isOnline
                ? "Offline"
                : syncStatus.firebaseAvailable
                  ? "Firebase Conectado"
                  : "Apenas Local"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Última Sync:</span>
          <span className="text-sm text-gray-800">
            {syncStatus.lastSync === "Nunca"
              ? "Nunca"
              : new Date(syncStatus.lastSync).toLocaleString("pt-PT")}
          </span>
        </div>

        {syncStatus.pendingSync > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Pendentes:</span>
            <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {syncStatus.pendingSync} operações
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Conectividade:</span>
          <div className="flex items-center space-x-2">
            <Wifi
              className={`h-4 w-4 ${syncStatus.isOnline ? "text-green-600" : "text-red-600"}`}
            />
            <span
              className={`text-sm ${syncStatus.isOnline ? "text-green-600" : "text-red-600"}`}
            >
              {syncStatus.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Mensagem de Status */}
      {syncMessage && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">{syncMessage}</p>
        </div>
      )}

      {/* Informações Adicionais */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p>💾 Dados sempre salvos localmente</p>
          <p>🔄 Sincronização automática a cada 30s</p>
          <p>📱 Funciona offline completamente</p>
          {syncStatus.firebaseAvailable && (
            <p>🔥 Firebase: Dados partilhados entre dispositivos</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseSyncControl;
