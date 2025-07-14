import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Loader2, Wifi, WifiOff } from "lucide-react";
import { productionAutoSync } from "../services/productionAutoSync";

export function ProductionSyncStatus() {
  const [syncStatus, setSyncStatus] = useState(productionAutoSync.getStatus());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Atualizar status periodicamente
    const updateStatus = () => {
      setSyncStatus(productionAutoSync.getStatus());
    };

    // Atualizar a cada 5 segundos
    const interval = setInterval(updateStatus, 5000);

    // Listener para quando sincronização for ativada
    const handleSyncActivated = () => {
      updateStatus();
      // Mostrar por mais tempo quando ativada
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 8000);
    };

    window.addEventListener("productionSyncActivated", handleSyncActivated);

    // Esconder automaticamente após 15 segundos se estiver ativa
    if (syncStatus.isActive) {
      setTimeout(() => setIsVisible(false), 15000);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "productionSyncActivated",
        handleSyncActivated,
      );
    };
  }, []);

  // Não mostrar em desenvolvimento unless forçado
  const isDev = import.meta.env.DEV;
  const showInDev = import.meta.env.VITE_FORCE_FIREBASE;

  if (isDev && !showInDev) {
    return null;
  }

  if (!isVisible && syncStatus.isActive) {
    return null;
  }

  const getStatusIcon = () => {
    if (syncStatus.isActive) {
      return <Wifi className="h-4 w-4 text-green-600" />;
    } else if (syncStatus.retryCount > 0) {
      return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
    } else {
      return <WifiOff className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusText = () => {
    if (syncStatus.isActive) {
      return "Sincronização Ativa";
    } else if (syncStatus.retryCount > 0) {
      return `Ativando... (${syncStatus.retryCount}/10)`;
    } else {
      return "Sincronização Inativa";
    }
  };

  const getStatusColor = () => {
    if (syncStatus.isActive) {
      return "bg-green-50 border-green-200 text-green-800";
    } else if (syncStatus.retryCount > 0) {
      return "bg-blue-50 border-blue-200 text-blue-800";
    } else {
      return "bg-red-50 border-red-200 text-red-800";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-3 rounded-lg border shadow-lg transition-all duration-300 ${getStatusColor()}`}
    >
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>

        {/* Botão para esconder */}
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      {/* Info adicional se não estiver ativa */}
      {!syncStatus.isActive && syncStatus.lastAttempt && (
        <div className="text-xs mt-1 opacity-75">
          Última tentativa:{" "}
          {new Date(parseInt(syncStatus.lastAttempt)).toLocaleTimeString(
            "pt-PT",
          )}
        </div>
      )}

      {/* Info quando ativa */}
      {syncStatus.isActive && syncStatus.lastEnabled && (
        <div className="text-xs mt-1 opacity-75">
          Ativa desde:{" "}
          {new Date(parseInt(syncStatus.lastEnabled)).toLocaleTimeString(
            "pt-PT",
          )}
        </div>
      )}
    </div>
  );
}

export default ProductionSyncStatus;
