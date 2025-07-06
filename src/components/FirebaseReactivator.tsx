import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, Check, X } from "lucide-react";
import { isFirebaseReady, getFirebaseStatus } from "../firebase/config";
import { DataProtectionService } from "../utils/dataProtection";

export const FirebaseReactivator: React.FC = () => {
  const [firebaseStatus, setFirebaseStatus] = useState(() =>
    getFirebaseStatus(),
  );
  const [isReactivating, setIsReactivating] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [protectionStatus, setProtectionStatus] = useState(() =>
    DataProtectionService.getProtectionStatus(),
  );

  // Verificar status a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setFirebaseStatus(getFirebaseStatus());
      setProtectionStatus(DataProtectionService.getProtectionStatus());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const reactivateFirebase = async () => {
    setIsReactivating(true);

    try {
      // Backup de segurança antes de tentar reativar
      DataProtectionService.createEmergencyBackup();

      // Tentar reativar Firebase
      console.log("🔄 Attempting Firebase reactivation...");

      // Recarregar configuração
      window.location.reload();
    } catch (error) {
      console.error("❌ Firebase reactivation failed:", error);
      setIsReactivating(false);
    }
  };

  const forceDataRestore = () => {
    const success = DataProtectionService.restoreFromLatestBackup();
    if (success) {
      setLastSync(`Dados restaurados: ${new Date().toLocaleTimeString()}`);
      // Recarregar página para aplicar dados restaurados
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Status compacto sempre visível */}
      <div className="bg-white rounded-lg shadow-lg border p-3 min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {firebaseStatus.ready ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm font-medium">
              {firebaseStatus.ready ? "Firebase Ativo" : "Firebase Inativo"}
            </span>
          </div>

          {!firebaseStatus.ready && (
            <button
              onClick={reactivateFirebase}
              disabled={isReactivating}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isReactivating ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                "Reativar"
              )}
            </button>
          )}
        </div>

        {/* Status detalhado */}
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>App:</span>
            <span
              className={firebaseStatus.app ? "text-green-600" : "text-red-600"}
            >
              {firebaseStatus.app ? "✓" : "✗"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Auth:</span>
            <span
              className={
                firebaseStatus.auth ? "text-green-600" : "text-red-600"
              }
            >
              {firebaseStatus.auth ? "✓" : "✗"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Database:</span>
            <span
              className={firebaseStatus.db ? "text-green-600" : "text-red-600"}
            >
              {firebaseStatus.db ? "✓" : "✗"}
            </span>
          </div>
        </div>

        {/* Proteção de dados */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-700">
              Proteção de Dados
            </span>
            <span className="text-xs text-green-600">✓ Ativa</span>
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Backups:</span>
              <span className="font-medium">
                {protectionStatus.backupsAvailable}
              </span>
            </div>

            {protectionStatus.dataIntegrity &&
              !protectionStatus.dataIntegrity.valid && (
                <div className="bg-red-50 border border-red-200 rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-red-800 font-medium">
                      Dados corrompidos!
                    </span>
                    <button
                      onClick={forceDataRestore}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Restaurar
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Ações de emergência */}
        {!firebaseStatus.ready && (
          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="space-y-2">
              <button
                onClick={() => DataProtectionService.createEmergencyBackup()}
                className="w-full text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
              >
                🔒 Backup Agora
              </button>

              <button
                onClick={forceDataRestore}
                className="w-full text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700"
              >
                🚨 Restaurar Dados
              </button>
            </div>
          </div>
        )}

        {lastSync && (
          <div className="mt-2 text-xs text-green-600 bg-green-50 p-1 rounded">
            {lastSync}
          </div>
        )}
      </div>
    </div>
  );
};
