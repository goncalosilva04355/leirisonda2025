import React, { useState, useEffect } from "react";
import {
  Database,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Trash2,
  Eye,
  Settings,
  Activity,
} from "lucide-react";
import { FirebaseQuotaRecovery } from "../utils/firebaseQuotaRecovery";
import { syncManager } from "../utils/syncManager";

export const FirebaseDebugPage: React.FC = () => {
  const [quotaStatus, setQuotaStatus] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [localStorageItems, setLocalStorageItems] = useState<
    Record<string, string>
  >({});
  const [refreshing, setRefreshing] = useState(false);

  const refreshAll = async () => {
    setRefreshing(true);
    try {
      // Verificar status da quota
      const quota = FirebaseQuotaRecovery.checkQuotaStatus();
      setQuotaStatus(quota);

      // Verificar status do sync
      const sync = syncManager.getSyncStatus();
      setSyncStatus(sync);

      // Obter itens do localStorage relacionados ao Firebase
      const firebaseItems: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.includes("firebase") ||
            key.includes("quota") ||
            key.includes("sync"))
        ) {
          firebaseItems[key] = localStorage.getItem(key) || "";
        }
      }
      setLocalStorageItems(firebaseItems);

      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const clearAllFirebaseFlags = () => {
    if (
      window.confirm(
        "⚠️ Limpar TODAS as flags do Firebase? Isso irá reativar todas as operações.",
      )
    ) {
      FirebaseQuotaRecovery.clearAllQuotaFlags();

      // Limpar também flags do syncManager
      syncManager.clearQuotaExceeded();
      localStorage.removeItem("firebase-emergency-shutdown");
      localStorage.removeItem("firebase-emergency-time");

      // Refresh
      refreshAll();

      alert("✅ Todas as flags foram limpas! O Firebase deve estar reativado.");
    }
  };

  const clearSpecificFlag = (flagName: string) => {
    if (window.confirm(`Remover flag: ${flagName}?`)) {
      localStorage.removeItem(flagName);
      refreshAll();
    }
  };

  const StatusBadge: React.FC<{ status: boolean; label: string }> = ({
    status,
    label,
  }) => (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {status ? (
        <CheckCircle size={12} className="mr-1" />
      ) : (
        <AlertCircle size={12} className="mr-1" />
      )}
      {label}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">
              Firebase Debug Console
            </h1>
          </div>
          <button
            onClick={refreshAll}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={refreshing ? "animate-spin" : ""} size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quota Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="text-orange-600" size={20} />
            <h2 className="font-semibold text-gray-900">Status da Quota</h2>
          </div>

          {quotaStatus ? (
            <div className="space-y-3">
              <StatusBadge
                status={!quotaStatus.isBlocked}
                label={quotaStatus.isBlocked ? "BLOQUEADO" : "ATIVO"}
              />

              <div className="text-sm text-gray-600">
                <p>
                  <strong>Recomendação:</strong> {quotaStatus.recommendation}
                </p>
                {quotaStatus.hoursUntilRecovery !== undefined && (
                  <p>
                    <strong>Horas até recuperação:</strong>{" "}
                    {quotaStatus.hoursUntilRecovery.toFixed(1)}h
                  </p>
                )}
                <p>
                  <strong>Flags bloqueadas:</strong>{" "}
                  {quotaStatus.blockedFlags.length}
                </p>
              </div>

              {quotaStatus.blockedFlags.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Flags Ativas:
                  </h3>
                  <div className="space-y-1">
                    {quotaStatus.blockedFlags.map(
                      (flag: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-xs bg-red-50 p-2 rounded"
                        >
                          <span className="font-mono">{flag}</span>
                          <button
                            onClick={() => clearSpecificFlag(flag)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Carregando...</p>
          )}
        </div>

        {/* Sync Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="text-green-600" size={20} />
            <h2 className="font-semibold text-gray-900">
              Status da Sincronização
            </h2>
          </div>

          {syncStatus ? (
            <div className="space-y-3">
              <StatusBadge
                status={syncStatus.enabled}
                label={syncStatus.enabled ? "HABILITADO" : "DESABILITADO"}
              />

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Quota excedida:</strong>{" "}
                  {syncStatus.quotaExceeded ? "Sim" : "Não"}
                </p>
                <p>
                  <strong>Shutdown emergencial:</strong>{" "}
                  {syncStatus.emergencyShutdown ? "Sim" : "Não"}
                </p>
                <p>
                  <strong>Contagem de erros:</strong> {syncStatus.errorCount}
                </p>
                {syncStatus.hoursUntilRetry && (
                  <p>
                    <strong>Horas até retry:</strong>{" "}
                    {syncStatus.hoursUntilRetry}h
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Carregando...</p>
          )}
        </div>
      </div>

      {/* LocalStorage Items */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Eye className="text-purple-600" size={20} />
            <h2 className="font-semibold text-gray-900">
              LocalStorage (Firebase)
            </h2>
          </div>
          <button
            onClick={clearAllFirebaseFlags}
            className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            <Trash2 size={14} />
            <span>Limpar Tudo</span>
          </button>
        </div>

        {Object.keys(localStorageItems).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(localStorageItems).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded border"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm text-gray-800 truncate">
                    {key}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{value}</p>
                </div>
                <button
                  onClick={() => clearSpecificFlag(key)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Nenhum item Firebase encontrado no localStorage
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="font-semibold text-blue-900 mb-3">
          Ações de Recuperação
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => FirebaseQuotaRecovery.clearAllQuotaFlags()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Limpar Flags de Quota
          </button>
          <button
            onClick={() => {
              FirebaseQuotaRecovery.manualRecovery();
              refreshAll();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Recuperação Manual
          </button>
          <button
            onClick={() => FirebaseQuotaRecovery.diagnoseQuotaIssues()}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Diagnóstico Console
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirebaseDebugPage;
