import React, { useState, useEffect } from "react";
import {
  Database,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Zap,
  Settings,
} from "lucide-react";
import {
  dataPersistenceManager,
  DataPersistenceStatus,
} from "../utils/dataPersstenceFix";

interface DataPersistenceDiagnosticProps {
  onClose?: () => void;
  autoCheck?: boolean;
}

export const DataPersistenceDiagnostic: React.FC<
  DataPersistenceDiagnosticProps
> = ({ onClose, autoCheck = false }) => {
  const [status, setStatus] = useState<DataPersistenceStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(autoCheck);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const result = await dataPersistenceManager.diagnoseDataPersistence();
      setStatus(result);
      setLastCheck(new Date());

      console.log("📊 Diagnóstico de persistência:", result);
    } catch (error) {
      console.error("❌ Erro no diagnóstico:", error);
    } finally {
      setLoading(false);
    }
  };

  const repairPersistence = async () => {
    setRepairing(true);
    try {
      const success = await dataPersistenceManager.repairDataPersistence();

      if (success) {
        alert(
          "✅ Reparação concluída com sucesso! Os dados devem agora ser guardados corretamente.",
        );
        // Executar diagnóstico novamente para verificar
        await runDiagnostic();
      } else {
        alert(
          "❌ Não foi possível reparar automaticamente. Contacte o suporte técnico.",
        );
      }
    } catch (error) {
      console.error("❌ Erro na reparação:", error);
      alert(
        "❌ Erro durante a reparação. Tente novamente ou contacte o suporte.",
      );
    } finally {
      setRepairing(false);
    }
  };

  const forceSync = async () => {
    setLoading(true);
    try {
      const success = await dataPersistenceManager.forceDataSync();

      if (success) {
        alert("✅ Sincronização forçada concluída!");
        await runDiagnostic();
      } else {
        alert(
          "⚠️ Sincronização parcial. Alguns dados podem não ter sincronizado.",
        );
      }
    } catch (error) {
      console.error("❌ Erro na sincronização:", error);
      alert("❌ Erro na sincronização. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-verificação inicial
  useEffect(() => {
    if (autoCheckEnabled) {
      runDiagnostic();
    }
  }, [autoCheckEnabled]);

  // Auto-verificação periódica
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoCheckEnabled) {
      interval = setInterval(() => {
        runDiagnostic();
      }, 60000); // Verificar a cada minuto
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoCheckEnabled]);

  const getStatusIcon = (working: boolean) => {
    if (working) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (working: boolean) => {
    return working ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Diagnóstico de Persistência de Dados
          </h2>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Controlos */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={runDiagnostic}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Verificar Agora</span>
        </button>

        <button
          onClick={forceSync}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          <Zap className="h-4 w-4" />
          <span>Sincronizar Dados</span>
        </button>

        <button
          onClick={repairPersistence}
          disabled={repairing}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
        >
          <Settings className={`h-4 w-4 ${repairing ? "animate-spin" : ""}`} />
          <span>{repairing ? "Reparando..." : "Reparar Sistema"}</span>
        </button>
      </div>

      {/* Toggle Auto-Check */}
      <div className="flex items-center space-x-2 mb-6">
        <input
          type="checkbox"
          id="auto-check"
          checked={autoCheckEnabled}
          onChange={(e) => setAutoCheckEnabled(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="auto-check" className="text-sm text-gray-700">
          Verificação automática ativa
        </label>
      </div>

      {/* Status */}
      {status && (
        <div className="space-y-4">
          {/* Status Geral */}
          <div className="p-4 rounded-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Estado Geral</h3>
              {getStatusIcon(status.working)}
            </div>
            <p className={`text-sm ${getStatusColor(status.working)}`}>
              {status.working
                ? "✅ Sistema de persistência está funcional"
                : "❌ Problemas na persistência de dados detectados"}
            </p>
          </div>

          {/* Status Detalhado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* localStorage */}
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">localStorage</h4>
                {getStatusIcon(status.localStorage)}
              </div>
              <p className={`text-sm ${getStatusColor(status.localStorage)}`}>
                {status.localStorage
                  ? "Funcional - dados locais guardados"
                  : "Com problemas - dados podem não guardar"}
              </p>
            </div>

            {/* Firestore */}
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Firestore</h4>
                {getStatusIcon(status.firestore)}
              </div>
              <p className={`text-sm ${getStatusColor(status.firestore)}`}>
                {status.firestore
                  ? "Funcional - dados na nuvem guardados"
                  : "Com problemas - sincronização offline"}
              </p>
            </div>
          </div>

          {/* Problemas Detectados */}
          {status.issues.length > 0 && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <h4 className="font-medium text-red-800 mb-2">
                🚨 Problemas Detectados:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {status.issues.map((issue, index) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recomendações */}
          {status.recommendations.length > 0 && (
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">
                💡 Recomendações:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {status.recommendations.map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Última Verificação */}
          {lastCheck && (
            <div className="text-xs text-gray-500 text-center">
              Última verificação: {lastCheck.toLocaleString("pt-PT")}
            </div>
          )}
        </div>
      )}

      {loading && !status && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-700">A verificar sistema...</span>
        </div>
      )}

      {/* Instruções */}
      <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">ℹ️ Como usar:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • <strong>Verificar Agora:</strong> Executa diagnóstico completo
          </li>
          <li>
            • <strong>Sincronizar Dados:</strong> Força sincronização com a
            nuvem
          </li>
          <li>
            • <strong>Reparar Sistema:</strong> Tenta corrigir problemas
            automaticamente
          </li>
          <li>
            • <strong>Verificação automática:</strong> Monitoriza continuamente
            o sistema
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DataPersistenceDiagnostic;
