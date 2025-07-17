import React, { useState, useEffect } from "react";
import {
  Share,
  Users,
  Database,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  Globe,
  Shield,
} from "lucide-react";
import {
  migrateToSharedData,
  forceSyncAfterMigration,
  checkSharedDataStructure,
} from "../utils/migrateToSharedData";

interface DataStructureInfo {
  hasSharedData: boolean;
  hasOldData: boolean;
  sharedCounts: {
    pools: number;
    works: number;
    maintenance: number;
    clients: number;
  };
  oldCounts: {
    pools: number;
    works: number;
    maintenance: number;
    clients: number;
  };
}

export const SharedDataManager: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [dataInfo, setDataInfo] = useState<DataStructureInfo | null>(null);
  const [migrationResult, setMigrationResult] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Check data structure on component mount
  useEffect(() => {
    checkDataStructure();
  }, []);

  const checkDataStructure = async () => {
    setIsChecking(true);
    try {
      const info = await checkSharedDataStructure();
      setDataInfo(info);
      console.log("📊 Data structure check completed:", info);
    } catch (error) {
      console.error("Error checking data structure:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleMigrateData = async () => {
    if (
      !confirm(
        "🚨 IMPORTANTE: Esta operação vai migrar todos os dados para uma estrutura partilhada onde TODOS os utilizadores veem os MESMOS dados. Isto resolve o problema de dados não partilhados. Continuar?",
      )
    ) {
      return;
    }

    setIsMigrating(true);
    setMigrationResult(null);

    try {
      console.log("🚀 Iniciando migração para dados partilhados...");
      const result = await migrateToSharedData();
      setMigrationResult(result);

      if (result.success) {
        // Force sync after migration
        await forceSyncAfterMigration();

        // Recheck data structure
        await checkDataStructure();

        alert(
          `✅ MIGRAÇÃO CONCLUÍDA!\n\n` +
            `Dados migrados:\n` +
            `• Piscinas: ${result.migrated.pools}\n` +
            `• Obras: ${result.migrated.works}\n` +
            `• Manutenções: ${result.migrated.maintenance}\n` +
            `• Clientes: ${result.migrated.clients}\n\n` +
            `🌐 AGORA TODOS OS UTILIZADORES VEEM OS MESMOS DADOS!`,
        );
      } else {
        alert("❌ Erro na migração. Verifique os logs para detalhes.");
      }
    } catch (error) {
      console.error("Migration error:", error);
      alert(`❌ Erro durante a migração: ${error.message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleForceSync = async () => {
    try {
      const success = await forceSyncAfterMigration();
      if (success) {
        alert("✅ Sincronização forçada concluída!");
        await checkDataStructure();
      } else {
        alert("❌ Erro na sincronização. Verifique a conectividade.");
      }
    } catch (error) {
      alert(`❌ Erro na sincronização: ${error.message}`);
    }
  };

  const getStatusColor = (hasData: boolean) => {
    return hasData ? "text-green-600" : "text-gray-400";
  };

  const getStatusIcon = (hasData: boolean) => {
    return hasData ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    );
  };

  const needsMigration = dataInfo?.hasOldData && !dataInfo?.hasSharedData;
  const isPartiallyMigrated = dataInfo?.hasOldData && dataInfo?.hasSharedData;
  const isFullyMigrated = !dataInfo?.hasOldData && dataInfo?.hasSharedData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Share className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Partilha de Dados Entre Utilizadores
            </h2>
            <p className="text-gray-600">
              Gerir como os dados são partilhados entre todos os utilizadores do
              sistema
            </p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <div className="text-sm text-blue-600">Status da Partilha</div>
                <div className="text-lg font-semibold text-blue-900">
                  {isFullyMigrated
                    ? "✅ Ativa"
                    : needsMigration
                      ? "❌ Inativa"
                      : "⚠️ Parcial"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <div className="text-sm text-green-600">Dados Globais</div>
                <div className="text-lg font-semibold text-green-900">
                  {dataInfo
                    ? Object.values(dataInfo.sharedCounts).reduce(
                        (a, b) => a + b,
                        0,
                      )
                    : "..."}{" "}
                  itens
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <div className="text-sm text-yellow-600">Dados Locais</div>
                <div className="text-lg font-semibold text-yellow-900">
                  {dataInfo
                    ? Object.values(dataInfo.oldCounts).reduce(
                        (a, b) => a + b,
                        0,
                      )
                    : "..."}{" "}
                  itens
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        {dataInfo && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  Estado da Partilha de Dados:
                </span>
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showDetails ? "Ocultar" : "Ver"} Detalhes
              </button>
            </div>

            {showDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shared Data */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800 mb-3 flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    Dados Partilhados (Todos os utilizadores veem)
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(dataInfo.sharedCounts.pools > 0)}
                        <span className="text-sm">Piscinas</span>
                      </div>
                      <span
                        className={`text-sm font-medium ${getStatusColor(dataInfo.sharedCounts.pools > 0)}`}
                      >
                        {dataInfo.sharedCounts.pools}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(dataInfo.sharedCounts.works > 0)}
                        <span className="text-sm">Obras</span>
                      </div>
                      <span
                        className={`text-sm font-medium ${getStatusColor(dataInfo.sharedCounts.works > 0)}`}
                      >
                        {dataInfo.sharedCounts.works}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(dataInfo.sharedCounts.maintenance > 0)}
                        <span className="text-sm">Manutenções</span>
                      </div>
                      <span
                        className={`text-sm font-medium ${getStatusColor(dataInfo.sharedCounts.maintenance > 0)}`}
                      >
                        {dataInfo.sharedCounts.maintenance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(dataInfo.sharedCounts.clients > 0)}
                        <span className="text-sm">Clientes</span>
                      </div>
                      <span
                        className={`text-sm font-medium ${getStatusColor(dataInfo.sharedCounts.clients > 0)}`}
                      >
                        {dataInfo.sharedCounts.clients}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Old Data */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-yellow-800 mb-3 flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Dados Não Partilhados (Apenas local)
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(dataInfo.oldCounts.pools > 0)}
                        <span className="text-sm">Piscinas</span>
                      </div>
                      <span
                        className={`text-sm font-medium ${getStatusColor(dataInfo.oldCounts.pools > 0)}`}
                      >
                        {dataInfo.oldCounts.pools}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(dataInfo.oldCounts.works > 0)}
                        <span className="text-sm">Obras</span>
                      </div>
                      <span
                        className={`text-sm font-medium ${getStatusColor(dataInfo.oldCounts.works > 0)}`}
                      >
                        {dataInfo.oldCounts.works}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(dataInfo.oldCounts.maintenance > 0)}
                        <span className="text-sm">Manutenções</span>
                      </div>
                      <span
                        className={`text-sm font-medium ${getStatusColor(dataInfo.oldCounts.maintenance > 0)}`}
                      >
                        {dataInfo.oldCounts.maintenance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(dataInfo.oldCounts.clients > 0)}
                        <span className="text-sm">Clientes</span>
                      </div>
                      <span
                        className={`text-sm font-medium ${getStatusColor(dataInfo.oldCounts.clients > 0)}`}
                      >
                        {dataInfo.oldCounts.clients}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={checkDataStructure}
            disabled={isChecking}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`}
            />
            <span>{isChecking ? "Verificando..." : "Verificar Estado"}</span>
          </button>

          {needsMigration && (
            <button
              onClick={handleMigrateData}
              disabled={isMigrating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center space-x-2"
            >
              <ArrowRight
                className={`h-4 w-4 ${isMigrating ? "animate-pulse" : ""}`}
              />
              <span>
                {isMigrating ? "Migrando..." : "Migrar para Dados Partilhados"}
              </span>
            </button>
          )}

          <button
            onClick={handleForceSync}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
          >
            <Database className="h-4 w-4" />
            <span>Forçar Sincronização</span>
          </button>
        </div>

        {/* Migration Result */}
        {migrationResult && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Resultado da Migração:
            </h3>
            <div className="space-y-1 text-sm">
              {migrationResult.success ? (
                <div className="text-green-700">
                  <div>✅ Migração concluída com sucesso!</div>
                  <div>📊 Pools: {migrationResult.migrated.pools}</div>
                  <div>🏗️ Obras: {migrationResult.migrated.works}</div>
                  <div>
                    🔧 Manutenções: {migrationResult.migrated.maintenance}
                  </div>
                  <div>👥 Clientes: {migrationResult.migrated.clients}</div>
                </div>
              ) : (
                <div className="text-red-700">
                  <div>❌ Erro na migração</div>
                  {migrationResult.errors.map(
                    (error: string, index: number) => (
                      <div key={index}>• {error}</div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* How it works */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            Como Funciona a Partilha de Dados
          </h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Dados partilhados são visíveis para TODOS os utilizadores</li>
            <li>Alterações feitas por um utilizador aparecem para todos</li>
            <li>Sincronização em tempo real entre dispositivos</li>
            <li>Backup automático no Firebase</li>
          </ul>
        </div>

        {/* Current Status */}
        <div
          className={`border rounded-lg p-4 ${
            isFullyMigrated
              ? "bg-green-50 border-green-200"
              : needsMigration
                ? "bg-red-50 border-red-200"
                : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <h3
            className={`text-sm font-medium mb-2 flex items-center ${
              isFullyMigrated
                ? "text-green-800"
                : needsMigration
                  ? "text-red-800"
                  : "text-yellow-800"
            }`}
          >
            {isFullyMigrated ? (
              <CheckCircle className="h-4 w-4 mr-1" />
            ) : (
              <AlertTriangle className="h-4 w-4 mr-1" />
            )}
            Estado Atual
          </h3>
          <div
            className={`text-sm space-y-1 ${
              isFullyMigrated
                ? "text-green-700"
                : needsMigration
                  ? "text-red-700"
                  : "text-yellow-700"
            }`}
          >
            {isFullyMigrated && (
              <>
                <div>✅ Dados totalmente partilhados</div>
                <div>✅ Todos os utilizadores veem os mesmos dados</div>
                <div>✅ Sincronização ativa</div>
              </>
            )}
            {needsMigration && (
              <>
                <div>❌ Dados NÃO estão partilhados</div>
                <div>❌ Cada utilizador vê dados diferentes</div>
                <div>❌ É necessário migrar para resolver</div>
              </>
            )}
            {isPartiallyMigrated && (
              <>
                <div>⚠️ Migração parcial detectada</div>
                <div>⚠️ Alguns dados podem não estar partilhados</div>
                <div>⚠️ Recomenda-se completar a migração</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
