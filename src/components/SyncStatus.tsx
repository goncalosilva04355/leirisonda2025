import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Users,
  Wrench,
  Waves,
} from "lucide-react";

interface SyncStatusProps {
  isOnline: boolean;
  syncEnabled: boolean;
  lastSync?: Date;
  pendingChanges?: number;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({
  isOnline,
  syncEnabled,
  lastSync,
  pendingChanges = 0,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = () => {
    if (!syncEnabled) return "text-gray-400";
    if (!isOnline) return "text-red-500";
    if (pendingChanges > 0) return "text-yellow-500";
    return "text-green-500";
  };

  const getStatusIcon = () => {
    if (!syncEnabled) return <WifiOff className="h-4 w-4" />;
    if (!isOnline) return <WifiOff className="h-4 w-4" />;
    if (pendingChanges > 0) return <AlertCircle className="h-4 w-4" />;
    return <Wifi className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!syncEnabled) return "Sincronização desativada";
    if (!isOnline) return "Sem conexão";
    if (pendingChanges > 0) return `${pendingChanges} alterações pendentes`;
    return "Sincronizado";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 ${getStatusColor()}`}
        title={getStatusText()}
      >
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
        {syncEnabled && isOnline && (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        )}
      </button>

      {showDetails && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <h4 className="font-semibold text-gray-900 mb-3">
            Estado da Sincronização
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conexão</span>
              <div className="flex items-center space-x-1">
                {isOnline ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Online</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-600">Offline</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Firebase</span>
              <div className="flex items-center space-x-1">
                {syncEnabled ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Configurado</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Não configurado
                    </span>
                  </>
                )}
              </div>
            </div>

            {lastSync && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última Sync</span>
                <span className="text-sm text-gray-900">
                  {lastSync.toLocaleTimeString("pt-PT")}
                </span>
              </div>
            )}

            {pendingChanges > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {pendingChanges} alterações por sincronizar
                  </span>
                </div>
                <p className="text-xs text-yellow-600 mt-1">
                  As alterações serão sincronizadas quando a conexão for
                  restaurada
                </p>
              </div>
            )}

            {syncEnabled && isOnline && pendingChanges === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Tudo sincronizado</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Todas as alterações estão atualizadas em tempo real
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <h5 className="text-xs font-medium text-gray-900 mb-2">
              Dados Sincronizados:
            </h5>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                <Users className="h-4 w-4 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">Utilizadores</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                <Waves className="h-4 w-4 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">Piscinas</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                <Wrench className="h-4 w-4 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">Manutenções</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook to detect online status
export const useOnlineStatus = () => {
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

  return isOnline;
};
