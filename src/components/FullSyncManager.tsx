import React, { useState } from "react";
import { RefreshCw, Database } from "lucide-react";

export const FullSyncManager: React.FC = () => {
  const [syncing, setSyncing] = useState(false);

  const runFullSync = async () => {
    setSyncing(true);

    // Simulated sync
    setTimeout(() => {
      alert(
        "Sincronização simulada:\n✅ Dados verificados\n✅ Sincronização concluída",
      );
      setSyncing(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Database className="h-6 w-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Gestor de Sincronização Completa
        </h3>
      </div>

      <p className="text-gray-600 mb-4">
        Força a sincronização completa de todos os dados entre dispositivos.
      </p>

      <button
        onClick={runFullSync}
        disabled={syncing}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
      >
        {syncing ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Database className="h-4 w-4" />
        )}
        <span>{syncing ? "A sincronizar..." : "Sincronização Completa"}</span>
      </button>
    </div>
  );
};
