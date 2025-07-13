import React, { useState, useEffect } from "react";
import { AlertTriangle, Shield, RefreshCw, X } from "lucide-react";
import { syncManager } from "../utils/syncManager";

export const FirebaseQuotaAlert: React.FC = () => {
  const [quotaStatus, setQuotaStatus] = useState(syncManager.getSyncStatus());
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check quota status on mount
    const status = syncManager.getSyncStatus();
    setQuotaStatus(status);
    setIsVisible(status.quotaExceeded || status.emergencyShutdown);

    // Listen for quota exceeded events
    const handleQuotaExceeded = (event: CustomEvent) => {
      const status = syncManager.getSyncStatus();
      setQuotaStatus(status);
      setIsVisible(true);

      if (event.detail.emergency) {
        alert(
          "🚨 EMERGÊNCIA: Firebase quota critical! Sistema em shutdown de proteção.",
        );
      }
    };

    window.addEventListener(
      "firebase-quota-exceeded",
      handleQuotaExceeded as EventListener,
    );

    // Periodic status check
    const interval = setInterval(() => {
      const status = syncManager.getSyncStatus();
      setQuotaStatus(status);
      setIsVisible(status.quotaExceeded || status.emergencyShutdown);
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener(
        "firebase-quota-exceeded",
        handleQuotaExceeded as EventListener,
      );
      clearInterval(interval);
    };
  }, []);

  const handleManualRecovery = () => {
    const success = syncManager.manualRecovery();
    if (success) {
      setQuotaStatus(syncManager.getSyncStatus());
      setIsVisible(false);
      window.location.reload(); // Reload to reactivate services
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {quotaStatus.emergencyShutdown ? (
              <Shield className="h-6 w-6 text-white animate-pulse" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-white" />
            )}

            <div>
              <div className="font-bold">
                {quotaStatus.emergencyShutdown
                  ? "🚨 SISTEMA EM SHUTDOWN DE EMERGÊNCIA"
                  : "⚠️ FIREBASE QUOTA EXCEDIDA"}
              </div>
              <div className="text-sm opacity-90">
                {quotaStatus.emergencyShutdown
                  ? "Todas as operações Firebase foram desabilitadas para prevenir bloqueio permanente"
                  : `Sincronização pausada por ${quotaStatus.hoursUntilRetry || 24} horas para prevenir bloqueio`}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded text-sm"
            >
              {showDetails ? "Menos" : "Detalhes"}
            </button>

            <button
              onClick={handleManualRecovery}
              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm font-medium"
            >
              Recuperação Manual
            </button>

            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-red-700 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mt-3 pt-3 border-t border-red-500 text-sm space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="font-medium">Status:</div>
                <div className="opacity-90">
                  {quotaStatus.emergencyShutdown
                    ? "Shutdown Emergência"
                    : "Quota Excedida"}
                </div>
              </div>

              <div>
                <div className="font-medium">Erros registrados:</div>
                <div className="opacity-90">{quotaStatus.errorCount}/3</div>
              </div>

              <div>
                <div className="font-medium">Retry em:</div>
                <div className="opacity-90">
                  {quotaStatus.hoursUntilRetry
                    ? `${quotaStatus.hoursUntilRetry} horas`
                    : "Manual apenas"}
                </div>
              </div>
            </div>

            <div className="bg-red-700 p-3 rounded mt-3">
              <div className="font-medium mb-2">⚠️ O que isto significa:</div>
              <ul className="text-sm space-y-1 opacity-90">
                <li>
                  • O Firebase tem limites de operações por dia (gratuito:
                  50.000 leituras/dia)
                </li>
                <li>
                  • O sistema detectou que atingimos o limite e pausou
                  automaticamente
                </li>
                <li>• Os dados locais continuam a funcionar normalmente</li>
                <li>
                  • A sincronização será reativada automaticamente após o
                  período de espera
                </li>
                {quotaStatus.emergencyShutdown && (
                  <li>
                    • <strong>EMERGÊNCIA:</strong> Múltiplos erros de quota -
                    intervenção manual necessária
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-red-700 p-3 rounded">
              <div className="font-medium mb-2">
                ✅ O que continua a funcionar:
              </div>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Visualização de todos os dados existentes</li>
                <li>• Criação e edição de dados (guardados localmente)</li>
                <li>• Todas as funcionalidades da aplicação</li>
                <li>• Backup e restauro de dados</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Hook para verificar status da quota
export const useFirebaseQuotaStatus = () => {
  const [status, setStatus] = useState(syncManager.getSyncStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(syncManager.getSyncStatus());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return status;
};
