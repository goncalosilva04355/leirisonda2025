import React, { useState } from "react";
import {
  Trash2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Users,
  FileText,
  Eye,
  Play,
  XCircle,
} from "lucide-react";
import { orphanUserCleanupService } from "../services/orphanUserCleanupService";

interface CleanupResult {
  success: boolean;
  cleaned: number;
  errors: string[];
  details: any[];
}

interface OrphanReport {
  totalWorks: number;
  worksWithOrphans: number;
  totalOrphanUsers: number;
  orphanDetails: any[];
}

export const OrphanUserCleanup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<OrphanReport | null>(null);
  const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(
    null,
  );
  const [showDetails, setShowDetails] = useState(false);

  const generateReport = async () => {
    setIsLoading(true);
    setCleanupResult(null);

    try {
      console.log("📊 Gerando relatório de utilizadores órfãos...");
      const reportData = await orphanUserCleanupService.getOrphanUsersReport();
      setReport(reportData);
      console.log("✅ Relatório gerado:", reportData);
    } catch (error) {
      console.error("❌ Erro ao gerar relatório:", error);
      alert("Erro ao gerar relatório. Verifique a consola para detalhes.");
    } finally {
      setIsLoading(false);
    }
  };

  const executeCleanup = async () => {
    if (
      !window.confirm(
        "Tem a certeza que quer eliminar todos os utilizadores inexistentes das obras atribuídas?\n\n" +
          "Esta ação é irreversível e irá remover permanentemente as atribuições de utilizadores que não existem no Firestore.",
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("🧹 Executando limpeza de utilizadores órfãos...");
      const result = await orphanUserCleanupService.cleanOrphanUsersFromWorks();
      setCleanupResult(result);

      // Atualizar relatório após limpeza
      if (result.success) {
        await generateReport();
      }

      console.log("✅ Limpeza concluída:", result);
    } catch (error) {
      console.error("❌ Erro durante limpeza:", error);
      alert("Erro durante a limpeza. Verifique a consola para detalhes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              Limpeza de Utilizadores Órfãos
            </h3>
            <p className="text-sm text-gray-600">
              Remove utilizadores inexistentes das obras atribuídas
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-6">
          <button
            onClick={generateReport}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span>Gerar Relatório</span>
          </button>

          {report && report.totalOrphanUsers > 0 && (
            <button
              onClick={executeCleanup}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>Executar Limpeza</span>
            </button>
          )}
        </div>

        {/* Report Results */}
        {report && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Relatório de Análise
            </h4>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-medium text-blue-600">
                      Total Obras
                    </p>
                    <p className="text-lg font-bold text-blue-900">
                      {report.totalWorks}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg ${report.worksWithOrphans > 0 ? "bg-yellow-50" : "bg-green-50"}`}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle
                    className={`h-4 w-4 ${report.worksWithOrphans > 0 ? "text-yellow-600" : "text-green-600"}`}
                  />
                  <div>
                    <p
                      className={`text-xs font-medium ${report.worksWithOrphans > 0 ? "text-yellow-600" : "text-green-600"}`}
                    >
                      Obras Afetadas
                    </p>
                    <p
                      className={`text-lg font-bold ${report.worksWithOrphans > 0 ? "text-yellow-900" : "text-green-900"}`}
                    >
                      {report.worksWithOrphans}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg ${report.totalOrphanUsers > 0 ? "bg-red-50" : "bg-green-50"}`}
              >
                <div className="flex items-center space-x-2">
                  <Users
                    className={`h-4 w-4 ${report.totalOrphanUsers > 0 ? "text-red-600" : "text-green-600"}`}
                  />
                  <div>
                    <p
                      className={`text-xs font-medium ${report.totalOrphanUsers > 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      Utilizadores Órfãos
                    </p>
                    <p
                      className={`text-lg font-bold ${report.totalOrphanUsers > 0 ? "text-red-900" : "text-green-900"}`}
                    >
                      {report.totalOrphanUsers}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs font-medium text-gray-600">Estado</p>
                    <p className="text-lg font-bold text-gray-900">
                      {report.totalOrphanUsers === 0 ? "Limpo" : "Necessário"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Message */}
            {report.totalOrphanUsers === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <div>
                    <h5 className="text-sm font-medium text-green-800">
                      Tudo Limpo!
                    </h5>
                    <p className="text-sm text-green-700">
                      Não foram encontrados utilizadores órfãos nas obras
                      atribuídas.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
                  <div>
                    <h5 className="text-sm font-medium text-yellow-800">
                      Utilizadores Órfãos Encontrados
                    </h5>
                    <p className="text-sm text-yellow-700">
                      Foram encontrados {report.totalOrphanUsers} utilizadores
                      órfãos em {report.worksWithOrphans} obras. Clique em
                      "Executar Limpeza" para os remover.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Details Toggle */}
            {report.orphanDetails.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showDetails ? "Ocultar" : "Mostrar"} Detalhes (
                  {report.orphanDetails.length} obras)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Detailed Report */}
        {showDetails && report && report.orphanDetails.length > 0 && (
          <div className="mb-6">
            <h5 className="font-medium text-gray-900 mb-3">
              Detalhes dos Utilizadores Órfãos
            </h5>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {report.orphanDetails.map((detail, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h6 className="font-medium text-gray-900">
                        {detail.workTitle}
                      </h6>
                      <p className="text-xs text-gray-500">
                        ID: {detail.workId}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm text-red-700 font-medium">
                          Utilizadores órfãos ({detail.orphanUsers.length}):
                        </p>
                        <ul className="text-sm text-red-600 ml-4 list-disc">
                          {detail.orphanUsers.map(
                            (user: any, userIndex: number) => (
                              <li key={userIndex}>
                                {user.name} (ID: {user.id})
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cleanup Results */}
        {cleanupResult && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Resultado da Limpeza
            </h4>

            {cleanupResult.success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <h5 className="text-sm font-medium text-green-800">
                    Limpeza Concluída com Sucesso!
                  </h5>
                </div>
                <p className="text-sm text-green-700">
                  {cleanupResult.cleaned} obras foram atualizadas e utilizadores
                  órfãos removidos.
                </p>

                {cleanupResult.details.length > 0 && (
                  <div className="mt-3">
                    <details className="text-sm text-green-700">
                      <summary className="cursor-pointer font-medium">
                        Ver detalhes da limpeza ({cleanupResult.details.length}{" "}
                        obras)
                      </summary>
                      <div className="mt-2 space-y-2">
                        {cleanupResult.details.map((detail, index) => (
                          <div key={index} className="bg-white rounded p-2">
                            <p className="font-medium">{detail.workTitle}</p>
                            {detail.removedUsers.length > 0 && (
                              <p className="text-xs">
                                Removidos: {detail.removedUsers.join(", ")}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <XCircle className="h-5 w-5 text-red-400 mr-3" />
                  <h5 className="text-sm font-medium text-red-800">
                    Erro Durante a Limpeza
                  </h5>
                </div>
                {cleanupResult.errors.length > 0 && (
                  <ul className="text-sm text-red-700 list-disc ml-4">
                    {cleanupResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="text-sm font-medium text-blue-800 mb-2">
            Como Funciona
          </h5>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>
              Clique em "Gerar Relatório" para verificar se há utilizadores
              órfãos
            </li>
            <li>Revise os detalhes dos utilizadores que serão removidos</li>
            <li>
              Clique em "Executar Limpeza" para remover permanentemente as
              atribuições órfãs
            </li>
            <li>A limpeza atualiza tanto o Firestore quanto o localStorage</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default OrphanUserCleanup;
