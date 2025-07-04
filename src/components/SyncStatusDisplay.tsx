import React from "react";
import { Wifi, WifiOff, CheckCircle, AlertCircle, Loader } from "lucide-react";

interface SyncStatusDisplayProps {
  isLoading: boolean;
  lastSync: Date | null;
  error: string | null;
  syncEnabled: boolean;
}

export const SyncStatusDisplay: React.FC<SyncStatusDisplayProps> = ({
  isLoading,
  lastSync,
  error,
  syncEnabled,
}) => {
  // Firebase is always enabled now
  if (!syncEnabled) {
    // This should never happen now, but keeping as fallback
    return (
      <div className="flex items-center space-x-2 text-gray-500 text-xs">
        <WifiOff className="w-3 h-3" />
        <span>Modo Local</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-blue-600 text-xs">
        <Loader className="w-3 h-3 animate-spin" />
        <span>Sincronizando...</span>
      </div>
    );
  }

  if (error) {
    const isConfigError =
      error.includes("not configured") || error.includes("não configurado");
    const isConnectionError =
      error.includes("connection") || error.includes("conexão");

    let errorText = "Erro de sync";
    if (isConfigError) {
      errorText = "Config Firebase";
    } else if (isConnectionError) {
      errorText = "Sem conexão";
    }

    return (
      <div
        className="flex items-center space-x-2 text-red-600 text-xs"
        title={error}
      >
        <AlertCircle className="w-3 h-3" />
        <span>{errorText}</span>
      </div>
    );
  }

  if (lastSync) {
    return (
      <div className="flex items-center space-x-2 text-green-600 text-xs">
        <CheckCircle className="w-3 h-3" />
        <span>Firebase Ativo</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-green-600 text-xs">
      <Wifi className="w-3 h-3" />
      <span>Firebase Ativo</span>
    </div>
  );
};
