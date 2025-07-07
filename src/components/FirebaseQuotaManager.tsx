import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Shield,
  RefreshCw,
  CheckCircle,
  Settings,
  Database,
  TestTube,
} from "lucide-react";
import { syncManager } from "../utils/syncManager";
import { runQuotaTest } from "../utils/testFirebaseQuota";

export const FirebaseQuotaManager: React.FC = () => {
  const [quotaStatus, setQuotaStatus] = useState(syncManager.getSyncStatus());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuotaStatus(syncManager.getSyncStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRecovery = () => {
    const success = syncManager.manualRecovery();
    if (success) {
      setQuotaStatus(syncManager.getSyncStatus());
    }
  };

  const handleRefreshStatus = () => {
    setRefreshing(true);
    setTimeout(() => {
      setQuotaStatus(syncManager.getSyncStatus());
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = () => {
    if (quotaStatus.emergencyShutdown) return "text-red-600";
    if (quotaStatus.quotaExceeded) return "text-orange-600";
    return "text-green-600";
  };

  const getStatusIcon = () => {
    if (quotaStatus.emergencyShutdown)
      return <Shield className="w-6 h-6 text-red-600" />;
    if (quotaStatus.quotaExceeded)
      return <AlertTriangle className="w-6 h-6 text-orange-600" />;
    return <CheckCircle className="w-6 h-6 text-green-600" />;
  };

  const getStatusText = () => {
    if (quotaStatus.emergencyShutdown) return "SHUTDOWN DE EMERGÊNCIA";
    if (quotaStatus.quotaExceeded) return "QUOTA EXCEDIDA";
    return "OPERACIONAL";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gestão de Quota Firebase
        </h2>
        <p className="text-gray-600">
          Monitorização e controlo da quota do Firebase para prevenir bloqueios
        </p>
      </div>

      {/* Status Principal */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className={`text-xl font-bold ${getStatusColor()}`}>
                {getStatusText()}
              </h3>
              <p className="text-gray-600">
                Sistema de proteção contra quota excedida
              </p>
            </div>
          </div>

          <button
            onClick={handleRefreshStatus}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <RefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Status Geral</div>
            <div className={`font-bold ${getStatusColor()}`}>
              {quotaStatus.enabled ? "Ativo" : "Desabilitado"}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Erros de Quota</div>
            <div
              className={`font-bold ${quotaStatus.errorCount >= 3 ? "text-red-600" : "text-gray-900"}`}
            >
              {quotaStatus.errorCount}/3
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Retry Disponível</div>
            <div className="font-bold text-gray-900">
              {quotaStatus.hoursUntilRetry
                ? `${quotaStatus.hoursUntilRetry}h`
                : quotaStatus.emergencyShutdown
                  ? "Manual apenas"
                  : "Agora"}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Proteção Ativa</div>
            <div className="font-bold text-gray-900">
              {quotaStatus.quotaExceeded || quotaStatus.emergencyShutdown
                ? "SIM"
                : "NÃO"}
            </div>
          </div>
        </div>
      </div>

      {/* Ações de Administrador */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ações de Administrador
        </h3>

        <div className="space-y-4">
          {/* Test Firebase Quota Button */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <TestTube className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900">
                  Testar Quota Firebase
                </h4>
                <p className="text-blue-800 text-sm mt-1">
                  Verificar se a quota foi aumentada e o Firebase está
                  operacional
                </p>

                <button
                  onClick={runQuotaTest}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  🧪 Testar Quota Agora
                </button>
              </div>
            </div>
          </div>

          {(quotaStatus.quotaExceeded || quotaStatus.emergencyShutdown) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">
                    Sistema Protegido
                  </h4>
                  <p className="text-red-800 text-sm mt-1">
                    {quotaStatus.emergencyShutdown
                      ? "Shutdown de emergência ativo. Todas as operações Firebase foram desabilitadas."
                      : "Quota excedida detectada. Sistema em modo de proteção."}
                  </p>

                  <button
                    onClick={handleManualRecovery}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                  >
                    Recuperação Manual (Avançado)
                  </button>
                </div>
              </div>
            </div>
          )}

          {!quotaStatus.quotaExceeded && !quotaStatus.emergencyShutdown && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">
                    Sistema Operacional
                  </h4>
                  <p className="text-green-800 text-sm mt-1">
                    Firebase funcionando normalmente. Nenhuma ação necessária.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Informações Técnicas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informações Técnicas
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Limites do Firebase (Plano Gratuito):
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Leituras: 50.000 por dia</li>
              <li>• Escritas: 20.000 por dia</li>
              <li>• Eliminações: 20.000 por dia</li>
              <li>• Armazenamento: 1 GB</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Sistema de Proteção:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Deteta automaticamente erros de quota</li>
              <li>• Para todas as operações Firebase após 1 erro</li>
              <li>• Ativa shutdown de emergência após 3 erros</li>
              <li>• Período de espera: 24 horas</li>
              <li>• Permite recuperação manual por administradores</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              O que continua a funcionar:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Visualização de todos os dados</li>
              <li>• Criação e edição (guardado localmente)</li>
              <li>• Backup e restauro de dados</li>
              <li>• Todas as funcionalidades da aplicação</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-2">Debug Info:</h4>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          {JSON.stringify(quotaStatus, null, 2)}
        </pre>
      </div>
    </div>
  );
};
