import React, { useState, useEffect } from "react";
import { AlertCircle, RefreshCw, Eye, Trash2, CheckCircle } from "lucide-react";
import { FirebaseQuotaRecovery } from "../utils/firebaseQuotaRecovery";

interface QuotaStatus {
  isBlocked: boolean;
  blockedFlags: string[];
  hoursUntilRecovery?: number;
  recommendation: string;
}

export const FirebaseQuotaRecoveryComponent: React.FC = () => {
  const [quotaStatus, setQuotaStatus] = useState<QuotaStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Verificar status da quota
  const checkStatus = () => {
    const status = FirebaseQuotaRecovery.checkQuotaStatus();
    setQuotaStatus(status);
    setIsVisible(status.isBlocked);
  };

  useEffect(() => {
    // Verificação inicial
    checkStatus();

    // Verificação periódica a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  // Recuperação manual
  const handleManualRecovery = async () => {
    setIsRecovering(true);
    try {
      const recovered = FirebaseQuotaRecovery.manualRecovery();
      if (recovered) {
        setIsVisible(false);
        // Refresh para aplicar mudanças
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error("Erro na recuperação:", error);
    } finally {
      setIsRecovering(false);
    }
  };

  // Limpeza silenciosa (sem confirmação)
  const handleSilentClear = () => {
    FirebaseQuotaRecovery.clearAllQuotaFlags();
    setIsVisible(false);
    checkStatus();
  };

  // Debug completo
  const handleDebug = () => {
    FirebaseQuotaRecovery.diagnoseQuotaIssues();
    setShowDetails(true);
  };

  if (!isVisible || !quotaStatus?.isBlocked) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-red-300 rounded-lg shadow-lg max-w-md">
      {/* Header */}
      <div className="bg-red-50 px-4 py-3 rounded-t-lg border-b">
        <div className="flex items-center space-x-2">
          <AlertCircle className="text-red-500" size={20} />
          <h3 className="font-semibold text-red-800">
            Firebase em Proteção de Quota
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-700 text-sm mb-3">
          O Firebase está bloqueado para proteger contra quota excedida.
        </p>

        {/* Status details */}
        <div className="bg-gray-50 rounded p-3 mb-3 text-xs">
          <div className="mb-2">
            <strong>Status:</strong> {quotaStatus.recommendation}
          </div>
          {quotaStatus.hoursUntilRecovery !== undefined && (
            <div className="mb-2">
              <strong>Tempo restante:</strong>{" "}
              {quotaStatus.hoursUntilRecovery.toFixed(1)}h
            </div>
          )}
          <div>
            <strong>Flags ativas:</strong> {quotaStatus.blockedFlags.length}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          {/* Quick recovery */}
          <button
            onClick={handleSilentClear}
            disabled={isRecovering}
            className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <CheckCircle size={16} />
            <span>Limpar e Reativar</span>
          </button>

          {/* Manual recovery with confirmation */}
          <button
            onClick={handleManualRecovery}
            disabled={isRecovering}
            className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isRecovering ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <RefreshCw size={16} />
            )}
            <span>Recuperação Manual</span>
          </button>

          {/* Toggle details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 flex items-center justify-center space-x-2"
          >
            <Eye size={16} />
            <span>{showDetails ? "Ocultar" : "Ver"} Detalhes</span>
          </button>

          {/* Debug button */}
          <button
            onClick={handleDebug}
            className="w-full px-3 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 flex items-center justify-center space-x-2"
          >
            <AlertCircle size={16} />
            <span>Debug Console</span>
          </button>

          {/* Hide button */}
          <button
            onClick={() => setIsVisible(false)}
            className="w-full px-3 py-2 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
          >
            Ocultar Aviso
          </button>
        </div>

        {/* Detailed status */}
        {showDetails && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">
              Flags Bloqueadas:
            </h4>
            <div className="space-y-1">
              {quotaStatus.blockedFlags.map((flag, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-mono text-gray-600">{flag}</span>
                  <span className="text-red-500">ATIVO</span>
                </div>
              ))}
            </div>

            {quotaStatus.blockedFlags.length === 0 && (
              <p className="text-gray-500 text-xs">
                Nenhuma flag específica encontrada
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseQuotaRecoveryComponent;
