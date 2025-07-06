import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  Check,
  X,
} from "lucide-react";
import { DataProtectionService } from "../utils/dataProtection";

export const DataRecovery: React.FC = () => {
  const [protectionStatus, setProtectionStatus] = useState(() =>
    DataProtectionService.getProtectionStatus(),
  );
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreResult, setRestoreResult] = useState<string | null>(null);
  const [backupList, setBackupList] = useState<string[]>([]);

  useEffect(() => {
    // Listar todos os backups disponíveis
    const keys = Object.keys(localStorage)
      .filter((key) => key.startsWith("backup_emergency_"))
      .sort()
      .reverse();
    setBackupList(keys);
  }, []);

  const restoreData = async () => {
    setIsRestoring(true);
    setRestoreResult(null);

    try {
      // Criar backup antes de restaurar
      DataProtectionService.createEmergencyBackup();

      // Tentar restaurar
      const success = DataProtectionService.restoreFromLatestBackup();

      if (success) {
        setRestoreResult(
          "✅ Dados restaurados com sucesso! A página será recarregada...",
        );
        // Recarregar após 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setRestoreResult(
          "❌ Falha na restauração. Nenhum backup válido encontrado.",
        );
      }
    } catch (error) {
      setRestoreResult(`❌ Erro na restauração: ${error}`);
    } finally {
      setIsRestoring(false);
    }
  };

  const createManualBackup = () => {
    const backupId = DataProtectionService.createEmergencyBackup();
    if (backupId) {
      setRestoreResult(`✅ Backup manual criado: ${backupId}`);
      // Atualizar lista de backups
      setTimeout(() => {
        const keys = Object.keys(localStorage)
          .filter((key) => key.startsWith("backup_emergency_"))
          .sort()
          .reverse();
        setBackupList(keys);
      }, 100);
    }
  };

  const exportData = () => {
    try {
      const data = {
        works: JSON.parse(localStorage.getItem("works") || "[]"),
        pools: JSON.parse(localStorage.getItem("pools") || "[]"),
        maintenance: JSON.parse(localStorage.getItem("maintenance") || "[]"),
        clients: JSON.parse(localStorage.getItem("clients") || "[]"),
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leirisonda_backup_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setRestoreResult("✅ Dados exportados para ficheiro!");
    } catch (error) {
      setRestoreResult(`❌ Erro na exportação: ${error}`);
    }
  };

  const checkCurrentData = () => {
    const works = JSON.parse(localStorage.getItem("works") || "[]");
    const pools = JSON.parse(localStorage.getItem("pools") || "[]");
    const maintenance = JSON.parse(localStorage.getItem("maintenance") || "[]");
    const clients = JSON.parse(localStorage.getItem("clients") || "[]");

    return { works, pools, maintenance, clients };
  };

  const currentData = checkCurrentData();

  return (
    <div className="space-y-6">
      {/* Alert de emergência */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-1 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              🚨 Centro de Recuperação de Emergência
            </h3>
            <p className="text-red-800 mb-4">
              Use esta área APENAS se as obras ou outros dados desapareceram.
              Todas as operações aqui são monitorizadas e criam backups
              automáticos.
            </p>
          </div>
        </div>
      </div>

      {/* Status atual dos dados */}
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Estado Atual dos Dados
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {currentData.works.length}
            </div>
            <div className="text-sm text-blue-800">Obras</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {currentData.pools.length}
            </div>
            <div className="text-sm text-green-800">Piscinas</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {currentData.maintenance.length}
            </div>
            <div className="text-sm text-orange-800">Manutenções</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {currentData.clients.length}
            </div>
            <div className="text-sm text-purple-800">Clientes</div>
          </div>
        </div>

        {/* Status da integridade */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">
              Integridade dos Dados:
            </span>
            <span
              className={`font-semibold ${
                protectionStatus.dataIntegrity?.valid
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {protectionStatus.dataIntegrity?.valid
                ? "✅ Íntegros"
                : "❌ Corrompidos"}
            </span>
          </div>

          {!protectionStatus.dataIntegrity?.valid && (
            <div className="mt-2 text-sm text-red-600">
              Problemas detectados:{" "}
              {protectionStatus.dataIntegrity?.issues?.join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* Ações de emergência */}
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          🚨 Ações de Emergência
        </h4>

        <div className="grid gap-4">
          {/* Restaurar dados */}
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
            <div>
              <h5 className="font-semibold text-red-900">
                Restaurar Dados do Backup
              </h5>
              <p className="text-sm text-red-700">
                Restaura automaticamente do backup mais recente válido
              </p>
            </div>
            <button
              onClick={restoreData}
              disabled={isRestoring}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isRestoring ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Restaurando...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Restaurar Agora</span>
                </>
              )}
            </button>
          </div>

          {/* Criar backup manual */}
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <h5 className="font-semibold text-blue-900">Backup Manual</h5>
              <p className="text-sm text-blue-700">
                Cria um backup imediato dos dados atuais
              </p>
            </div>
            <button
              onClick={createManualBackup}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Criar Backup</span>
            </button>
          </div>

          {/* Exportar dados */}
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <h5 className="font-semibold text-green-900">Exportar Dados</h5>
              <p className="text-sm text-green-700">
                Descarrega todos os dados num ficheiro JSON
              </p>
            </div>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de backups */}
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          💾 Backups Disponíveis ({protectionStatus.backupsAvailable})
        </h4>

        <div className="space-y-2 max-h-40 overflow-y-auto">
          {backupList.map((backup, index) => (
            <div
              key={backup}
              className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm"
            >
              <span className="font-mono">
                {backup.replace("backup_emergency_", "")}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  index === 0
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {index === 0 ? "Mais recente" : `${index + 1}º`}
              </span>
            </div>
          ))}

          {backupList.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              Nenhum backup de emergência encontrado
            </div>
          )}
        </div>
      </div>

      {/* Resultado das operações */}
      {restoreResult && (
        <div
          className={`p-4 rounded-lg ${
            restoreResult.includes("✅")
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {restoreResult}
        </div>
      )}
    </div>
  );
};
