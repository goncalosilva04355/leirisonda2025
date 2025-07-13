import React, { useState } from "react";
import {
  RefreshCw,
  Database,
  Users,
  CheckCircle,
  AlertCircle,
  Loader,
  ArrowUpDown,
} from "lucide-react";
import { fullSyncService, SyncResult } from "../services/fullSyncService";

export const FullSyncManager: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);

  const performFullSync = async () => {
    setSyncing(true);
    setResult(null);

    try {
      const syncResult = await fullSyncService.syncAllData();
      setResult(syncResult);
    } catch (error: any) {
      setResult({
        success: false,
        message: "Erro durante sincronização",
        details: [error.message],
        stats: {
          usersSync: { local: 0, firebase: 0, merged: 0 },
          poolsSync: { local: 0, firebase: 0, merged: 0 },
          worksSync: { local: 0, firebase: 0, merged: 0 },
          maintenanceSync: { local: 0, firebase: 0, merged: 0 },
          clientsSync: { local: 0, firebase: 0, merged: 0 },
        },
      });
    } finally {
      setSyncing(false);
    }
  };

  const getStatsSummary = () => {
    if (!result) return null;

    const { stats } = result;
    const total = {
      local:
        stats.usersSync.local +
        stats.poolsSync.local +
        stats.worksSync.local +
        stats.maintenanceSync.local +
        stats.clientsSync.local,
      firebase:
        stats.usersSync.firebase +
        stats.poolsSync.firebase +
        stats.worksSync.firebase +
        stats.maintenanceSync.firebase +
        stats.clientsSync.firebase,
      merged:
        stats.usersSync.merged +
        stats.poolsSync.merged +
        stats.worksSync.merged +
        stats.maintenanceSync.merged +
        stats.clientsSync.merged,
    };

    return total;
  };

  return (
    <div className="fixed top-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm flex items-center">
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Sincronização Completa
        </h3>
      </div>

      <div className="space-y-3">
        {/* Full Sync */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Sincronização Firebase ↔ Local
            </span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <button
            onClick={performFullSync}
            disabled={syncing}
            className="w-full px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
          >
            {syncing ? (
              <>
                <Loader className="w-3 h-3 animate-spin mr-1" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3 mr-1" />
                Sincronizar Tudo
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div
            className={`p-3 rounded border ${
              result.success
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center mb-2">
              {result.success ? (
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
              )}
              <span className="text-sm font-medium">{result.message}</span>
            </div>

            {/* Stats Summary */}
            {result.success && getStatsSummary() && (
              <div className="mb-2 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-medium">Local</div>
                    <div>{getStatsSummary()?.local}</div>
                  </div>
                  <div>
                    <div className="font-medium">Firebase</div>
                    <div>{getStatsSummary()?.firebase}</div>
                  </div>
                  <div>
                    <div className="font-medium">Final</div>
                    <div>{getStatsSummary()?.merged}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Stats */}
            <details className="text-xs">
              <summary className="cursor-pointer font-medium mb-1">
                Detalhes
              </summary>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                <div>
                  📱 Users: {result.stats.usersSync.local} → ☁️{" "}
                  {result.stats.usersSync.firebase} → 🔄{" "}
                  {result.stats.usersSync.merged}
                </div>
                <div>
                  📱 Piscinas: {result.stats.poolsSync.local} → ☁️{" "}
                  {result.stats.poolsSync.firebase} → 🔄{" "}
                  {result.stats.poolsSync.merged}
                </div>
                <div>
                  📱 Obras: {result.stats.worksSync.local} → ☁️{" "}
                  {result.stats.worksSync.firebase} → 🔄{" "}
                  {result.stats.worksSync.merged}
                </div>
                <div>
                  📱 Manutenções: {result.stats.maintenanceSync.local} → ☁️{" "}
                  {result.stats.maintenanceSync.firebase} → 🔄{" "}
                  {result.stats.maintenanceSync.merged}
                </div>
                <div>
                  📱 Clientes: {result.stats.clientsSync.local} → ☁️{" "}
                  {result.stats.clientsSync.firebase} → 🔄{" "}
                  {result.stats.clientsSync.merged}
                </div>
              </div>
            </details>

            {/* Full Log */}
            <details className="text-xs mt-2">
              <summary className="cursor-pointer font-medium">
                Log Completo
              </summary>
              <div className="mt-1 p-2 bg-gray-100 rounded text-xs max-h-32 overflow-y-auto">
                {result.details.map((detail, index) => (
                  <div key={index}>{detail}</div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};
