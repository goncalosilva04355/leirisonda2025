import React, { useState, useEffect } from "react";
import { AlertTriangle, X, Settings } from "lucide-react";
import { syncManager } from "../utils/syncManager";

export const FirebaseQuotaAlert: React.FC = () => {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem("quota-alert-dismissed") === "true";
  });
  const [syncStatus, setSyncStatus] = useState(syncManager.getSyncStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(syncManager.getSyncStatus());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("quota-alert-dismissed", "true");
  };

  const handleEnableSync = () => {
    const confirmReload = confirm(
      "Para tentar reativar a sincronização, é necessário recarregar a página. Continuar?",
    );
    if (confirmReload) {
      syncManager.clearQuotaExceeded();
      localStorage.setItem("firebase-sync-enabled", "true");
      window.location.reload();
    }
  };

  // Don't show if dismissed or if quota is not exceeded
  if (dismissed || !syncStatus.quotaExceeded) {
    return null;
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-orange-800">
            Sincronização Firebase Temporariamente Desativada
          </h3>
          <div className="mt-2 text-sm text-orange-700">
            <p>
              A sincronização automática com Firebase foi desativada devido a
              excesso de quota. O sistema está a funcionar em modo local.
            </p>
            <div className="mt-2">
              <p className="font-medium">O que isto significa:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Os dados ficam guardados localmente no seu dispositivo</li>
                <li>Múltiplos dispositivos não sincronizam automaticamente</li>
                <li>
                  Todas as funcionalidades continuam a funcionar normalmente
                </li>
              </ul>
            </div>
            <div className="mt-3">
              <p className="font-medium">Para reativar a sincronização:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                {syncStatus.hoursUntilRetry &&
                syncStatus.hoursUntilRetry > 0 ? (
                  <li>
                    Aguarde {syncStatus.hoursUntilRetry} hora(s) para o limite
                    de quota reiniciar
                  </li>
                ) : (
                  <li>
                    O limite de quota já deveria ter reiniciado - tente reativar
                  </li>
                )}
                <li>Ou configure um plano Firebase pago para quota superior</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleEnableSync}
              className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 flex items-center space-x-1"
            >
              <Settings className="h-4 w-4" />
              <span>Tentar Reativar</span>
            </button>
            <button
              onClick={handleDismiss}
              className="bg-white text-orange-800 px-3 py-1 rounded text-sm border border-orange-300 hover:bg-orange-50"
            >
              Entendi
            </button>
          </div>
        </div>
        <div className="ml-3 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="bg-orange-50 rounded-md p-1.5 text-orange-500 hover:bg-orange-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
