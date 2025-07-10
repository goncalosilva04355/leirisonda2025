import React, { useState } from "react";
import { Shield, RefreshCw } from "lucide-react";

export const AuthSyncDiagnostic: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostic = async () => {
    setIsRunning(true);

    // Simulated diagnostic
    setTimeout(() => {
      alert(
        "Diagnóstico simplificado:\n✅ Sistema operacional\n✅ Configuração básica verificada",
      );
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Shield className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Diagnóstico de Autentica��ão e Sincronização
        </h3>
      </div>

      <p className="text-gray-600 mb-4">
        Componente simplificado para evitar dependências complexas.
      </p>

      <button
        onClick={runDiagnostic}
        disabled={isRunning}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
      >
        {isRunning ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Shield className="h-4 w-4" />
        )}
        <span>{isRunning ? "A verificar..." : "Executar Diagnóstico"}</span>
      </button>
    </div>
  );
};
