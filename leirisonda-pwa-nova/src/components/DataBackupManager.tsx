import React, { useState } from "react";
import {
  Download,
  Upload,
  Database,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useAutoSyncData } from "../hooks/useAutoSyncData";

export const DataBackupManager: React.FC = () => {
  const { data, loading } = useAutoSyncData();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  // Backup completo dos dados
  const handleDataBackup = async () => {
    setIsBackingUp(true);
    setBackupStatus("Preparando backup dos dados...");

    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        version: "2.0",
        data: {
          users: data.users,
          pools: data.pools,
          maintenance: data.maintenance,
          works: data.works,
        },
        metadata: {
          totalUsers: data.users.length,
          totalPools: data.pools.length,
          totalMaintenance: data.maintenance.length,
          totalWorks: data.works.length,
          exportedBy: "Admin",
          exportedAt: new Date().toLocaleString("pt-PT"),
        },
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `leirisonda-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setBackupStatus("✅ Backup criado com sucesso!");
      console.log("📁 Backup de dados criado:", backupData.metadata);
    } catch (error) {
      console.error("❌ Erro ao criar backup:", error);
      setBackupStatus("❌ Erro ao criar backup dos dados");
    } finally {
      setIsBackingUp(false);
      setTimeout(() => setBackupStatus(null), 5000);
    }
  };

  // Backup da aplicação (download do código fonte)
  const handleAppBackup = () => {
    setBackupStatus("Preparando backup da aplicação...");

    try {
      // Informações sobre como fazer backup da aplicação
      const appBackupInfo = {
        timestamp: new Date().toISOString(),
        instructions: [
          "1. Para backup completo da aplicação, aceda ao repositório GitHub",
          "2. Clique em 'Code' → 'Download ZIP'",
          "3. Ou clone o repositório: git clone [URL_DO_REPOSITORIO]",
          "4. Para backup dos ficheiros locais, copie a pasta do projeto",
          "5. Guarde também as configurações do Firebase se personalizadas",
        ],
        files_to_backup: [
          "src/ - Código fonte da aplicação",
          "public/ - Ficheiros públicos",
          "package.json - Dependências",
          "tailwind.config.ts - Configurações de estilo",
          "vite.config.ts - Configurações de build",
          "firebase/ - Configurações Firebase (se personalizadas)",
        ],
        important_notes: [
          "O código fonte está no GitHub - sempre atualizado",
          "Os dados dos usuários estão no Firebase - use o backup de dados",
          "As configurações locais estão no localStorage do navegador",
        ],
      };

      const infoStr = JSON.stringify(appBackupInfo, null, 2);
      const infoBlob = new Blob([infoStr], { type: "application/json" });

      const url = URL.createObjectURL(infoBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `leirisonda-app-backup-info-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setBackupStatus("✅ Informações de backup da app criadas!");
    } catch (error) {
      console.error("❌ Erro ao criar info de backup da app:", error);
      setBackupStatus("❌ Erro ao criar informações de backup");
    } finally {
      setTimeout(() => setBackupStatus(null), 5000);
    }
  };

  // Restaurar dados de backup
  const handleDataRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setBackupStatus("Restaurando dados do backup...");

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);

        if (!backupData.data || !backupData.version) {
          throw new Error("Formato de backup inválido");
        }

        // Restaurar dados no localStorage
        if (backupData.data.users) {
          localStorage.setItem("users", JSON.stringify(backupData.data.users));
        }
        if (backupData.data.pools) {
          localStorage.setItem("pools", JSON.stringify(backupData.data.pools));
        }
        if (backupData.data.maintenance) {
          localStorage.setItem(
            "maintenance",
            JSON.stringify(backupData.data.maintenance),
          );
        }
        if (backupData.data.works) {
          localStorage.setItem("works", JSON.stringify(backupData.data.works));
        }

        setBackupStatus(
          `✅ Dados restaurados com sucesso! (${backupData.metadata?.exportedAt || "Data desconhecida"})`,
        );
        console.log("📁 Dados restaurados do backup:", backupData.metadata);

        // Recarregar a página para aplicar os dados restaurados
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("❌ Erro ao restaurar backup:", error);
        setBackupStatus(
          "❌ Erro ao restaurar dados - verifique o formato do ficheiro",
        );
      } finally {
        setIsRestoring(false);
        setTimeout(() => setBackupStatus(null), 8000);
      }
    };

    reader.readAsText(file);
  };

  const getCurrentDataStats = () => ({
    users: data.users.length,
    pools: data.pools.length,
    maintenance: data.maintenance.length,
    works: data.works.length,
    total:
      data.users.length +
      data.pools.length +
      data.maintenance.length +
      data.works.length,
  });

  const stats = getCurrentDataStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Backup e Restauro
        </h2>
        <p className="text-gray-600">
          Criar backups de segurança dos dados e da aplicação
        </p>
      </div>

      {/* Status */}
      {backupStatus && (
        <div
          className={`p-4 rounded-lg border ${
            backupStatus.includes("✅")
              ? "bg-green-50 border-green-200 text-green-800"
              : backupStatus.includes("❌")
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {backupStatus.includes("✅") && <CheckCircle className="w-5 h-5" />}
            {backupStatus.includes("❌") && (
              <AlertTriangle className="w-5 h-5" />
            )}
            {!backupStatus.includes("✅") && !backupStatus.includes("❌") && (
              <RefreshCw className="w-5 h-5 animate-spin" />
            )}
            <span className="font-medium">{backupStatus}</span>
          </div>
        </div>
      )}

      {/* Estatísticas dos Dados Atuais */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dados Atuais no Sistema
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.users}
            </div>
            <div className="text-sm text-blue-800">Utilizadores</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.pools}
            </div>
            <div className="text-sm text-green-800">Piscinas</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.maintenance}
            </div>
            <div className="text-sm text-yellow-800">Manutenções</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.works}
            </div>
            <div className="text-sm text-purple-800">Obras</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-800">Total</div>
          </div>
        </div>
      </div>

      {/* Backup de Dados */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Backup dos Dados
          </h3>
        </div>

        <p className="text-gray-600 mb-4">
          Exportar todos os dados do sistema (utilizadores, piscinas,
          manutenções, obras) para um ficheiro JSON.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDataBackup}
            disabled={isBackingUp || loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBackingUp ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isBackingUp ? "Criando Backup..." : "Criar Backup dos Dados"}
          </button>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
              <Upload className="w-5 h-5" />
              Restaurar Dados
              <input
                type="file"
                accept=".json"
                onChange={handleDataRestore}
                className="hidden"
                disabled={isRestoring}
              />
            </label>
            {isRestoring && (
              <RefreshCw className="w-5 h-5 animate-spin text-green-600" />
            )}
          </div>
        </div>
      </div>

      {/* Backup da Aplicação */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Backup da Aplicação
          </h3>
        </div>

        <p className="text-gray-600 mb-4">
          Obter informações sobre como fazer backup do código fonte e
          configurações da aplicação.
        </p>

        <button
          onClick={handleAppBackup}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Download className="w-5 h-5" />
          Obter Informações de Backup da App
        </button>

        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">Informação:</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• O código fonte está sempre atualizado no GitHub</li>
            <li>
              • Os dados estão guardados no Firebase (use o backup de dados
              acima)
            </li>
            <li>• Este botão cria um ficheiro com instruções detalhadas</li>
          </ul>
        </div>
      </div>

      {/* Avisos */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900">Avisos Importantes:</h4>
            <ul className="text-sm text-yellow-800 mt-2 space-y-1">
              <li>• Faça backups regulares dos dados importantes</li>
              <li>
                • O restauro de dados substitui completamente os dados atuais
              </li>
              <li>
                • Teste os backups regularmente para garantir que funcionam
              </li>
              <li>• Mantenha backups em locais seguros e múltiplos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
