import React, { useState } from "react";
import { AlertTriangle, Trash2, RefreshCw } from "lucide-react";

export const EmergencyCleanupButton: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const executeEmergencyCleanup = async () => {
    setIsExecuting(true);
    setLastResult(null);

    try {
      console.log("🚨 BOTÃO DE EMERGÊNCIA ACIONADO!");

      // Executar os comandos disponíveis
      if ((window as any).KILL_DUPLICATES_NOW) {
        console.log("💀 Executando eliminação direta...");
        await (window as any).KILL_DUPLICATES_NOW();
      }

      if ((window as any).startContinuousCleanup) {
        console.log("🔄 Iniciando limpeza contínua...");
        (window as any).startContinuousCleanup();
      }

      setLastResult("Limpeza de emergência executada! Verifique o console.");

      // Recarregar após 5 segundos
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      console.error("❌ Erro no botão de emergência:", error);
      setLastResult(`Erro: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
        <h4 className="font-medium text-red-900">Limpeza de Emergência</h4>
      </div>

      <p className="text-red-700 text-sm mb-4">
        Use este botão se ainda existem duplicados após as verificações
        automáticas.
      </p>

      <button
        onClick={executeEmergencyCleanup}
        disabled={isExecuting}
        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExecuting ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Executando...</span>
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4" />
            <span>Eliminar Duplicados Agora</span>
          </>
        )}
      </button>

      {lastResult && (
        <div className="mt-3 p-2 bg-gray-100 rounded text-sm text-gray-700">
          {lastResult}
        </div>
      )}

      <div className="mt-3 text-xs text-red-600">
        <strong>IDs alvo:</strong> 1752578821484, 1752513775718, 1752582282132,
        1752574634617, 1752517424794, 1752582282133, 1752604451507,
        1752602368414
      </div>
    </div>
  );
};

export default EmergencyCleanupButton;
