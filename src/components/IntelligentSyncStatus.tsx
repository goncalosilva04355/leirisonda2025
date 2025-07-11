import React, { useState, useEffect } from "react";
import {
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Wifi,
  WifiOff,
  RefreshCw,
  Pause,
} from "lucide-react";

export const IntelligentSyncStatus: React.FC = () => {
  const [syncState, setSyncState] = useState({
    isFirebaseStable: false,
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
    autoSyncEnabled: false,
    retryDelay: 5000,
    nextTestIn: 0,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    updateSyncState();

    // Atualizar a cada 5 segundos
    const interval = setInterval(updateSyncState, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateSyncState = async () => {
    try {
      const { intelligentFirebaseSync } = await import(
        "../services/intelligentFirebaseSync"
      );
      const state = intelligentFirebaseSync.getState();
      setSyncState(state);
    } catch (error) {
      console.log("IntelligentFirebaseSync não disponível");
    }
  };

  const getSyncStatusColor = () => {
    if (syncState.autoSyncEnabled) return "text-green-600";
    if (syncState.isFirebaseStable) return "text-blue-600";
    if (syncState.consecutiveFailures > 0) return "text-orange-600";
    return "text-gray-600";
  };

  const getSyncStatusIcon = () => {
    if (syncState.autoSyncEnabled) return <Zap className="h-4 w-4" />;
    if (syncState.isFirebaseStable) return <CheckCircle className="h-4 w-4" />;
    if (syncState.consecutiveFailures > 0)
      return <AlertTriangle className="h-4 w-4" />;
    return <Brain className="h-4 w-4" />;
  };

  const getSyncStatusText = () => {
    if (syncState.autoSyncEnabled) return "Sync Automático ATIVO";
    if (syncState.isFirebaseStable) return "Firebase Estável";
    if (syncState.consecutiveFailures > 0) return "Detectando Estabilidade";
    return "Testando Firebase";
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 left-4 bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors z-40"
        title="Mostrar status de sincronização inteligente"
      >
        <Brain className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <Brain className="w-4 h-4 mr-2" />
          Sync Inteligente
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 text-sm">
        {/* Status Principal */}
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <div className={`mr-2 ${getSyncStatusColor()}`}>
              {getSyncStatusIcon()}
            </div>
            Status
          </span>
          <span className={`font-medium ${getSyncStatusColor()}`}>
            {getSyncStatusText()}
          </span>
        </div>

        {/* Conectividade */}
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            {navigator.onLine ? (
              <Wifi className="w-3 h-3 mr-2 text-green-600" />
            ) : (
              <WifiOff className="w-3 h-3 mr-2 text-red-600" />
            )}
            Conectividade
          </span>
          <span
            className={navigator.onLine ? "text-green-600" : "text-red-600"}
          >
            {navigator.onLine ? "Online" : "Offline"}
          </span>
        </div>

        {/* Sucessos/Falhas */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Firebase</span>
          <span className="text-xs">
            ✅ {syncState.consecutiveSuccesses} | ❌{" "}
            {syncState.consecutiveFailures}
          </span>
        </div>

        {/* Delay atual */}
        {syncState.consecutiveFailures > 0 && (
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-2" />
              Próximo teste
            </span>
            <span className="text-xs text-gray-600">
              {Math.round(syncState.retryDelay / 1000)}s
            </span>
          </div>
        )}
      </div>

      {/* Indicadores Visuais */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-center space-x-2">
          {syncState.autoSyncEnabled ? (
            <div className="flex items-center text-green-600 text-xs">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Auto-Sync Ativo
            </div>
          ) : syncState.isFirebaseStable ? (
            <div className="flex items-center text-blue-600 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Pronto para Sync
            </div>
          ) : (
            <div className="flex items-center text-orange-600 text-xs">
              <Brain className="w-3 h-3 mr-1" />
              Aprendendo...
            </div>
          )}
        </div>
      </div>

      {/* Informações */}
      <div className="mt-3 text-xs text-gray-500">
        <p>🧠 Sistema inteligente que detecta quando Firebase está estável</p>
        <p>⚡ Ativa sync automático apenas quando seguro</p>
        <p>💾 Dados sempre salvos localmente</p>
      </div>
    </div>
  );
};

export default IntelligentSyncStatus;
