import React, { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  RefreshCw,
} from "lucide-react";
import StabilityMonitor from "../utils/stabilityMonitor";

export const AppStabilityStatus: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stabilityReport, setStabilityReport] = useState<any>(null);
  const [isHealthy, setIsHealthy] = useState(true);

  // Atualizar relatório de estabilidade
  const updateReport = () => {
    try {
      const report = StabilityMonitor.getStabilityReport();
      setStabilityReport(report);

      // Determinar se aplicação está saudável
      const healthy = report.errorCount < 5 && report.renderCount < 100;
      setIsHealthy(healthy);
    } catch (error) {
      console.error("Error getting stability report:", error);
    }
  };

  useEffect(() => {
    updateReport();

    // Atualizar a cada 5 segundos
    const interval = setInterval(updateReport, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stabilityReport) return null;

  return (
    <>
      {/* Ícone de Status (canto inferior esquerdo) */}
      <div className="fixed bottom-4 left-4 z-30">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-full shadow-lg transition-colors ${
            isHealthy
              ? "bg-green-100 text-green-600 hover:bg-green-200"
              : "bg-red-100 text-red-600 hover:bg-red-200"
          }`}
          title={
            isHealthy
              ? "Aplicação estável"
              : "Problemas de estabilidade detectados"
          }
        >
          {isHealthy ? (
            <Shield className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5 animate-pulse" />
          )}
        </button>
      </div>

      {/* Painel de Status */}
      {isOpen && (
        <div className="fixed bottom-16 left-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 z-40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Status da Aplicação
            </h3>
            <button
              onClick={updateReport}
              className="text-gray-400 hover:text-gray-600"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Status Geral */}
            <div
              className={`p-2 rounded flex items-center ${
                isHealthy
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {isHealthy ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-2" />
              )}
              <span className="text-sm font-medium">
                {isHealthy ? "Aplicação Estável" : "Problemas Detectados"}
              </span>
            </div>

            {/* Métricas */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Renders:</span>
                <span
                  className={`font-mono ${
                    stabilityReport.renderCount > 50
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {stabilityReport.renderCount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Erros:</span>
                <span
                  className={`font-mono ${
                    stabilityReport.errorCount > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {stabilityReport.errorCount}
                </span>
              </div>

              {stabilityReport.memory && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Memória:</span>
                  <span
                    className={`font-mono text-xs ${
                      stabilityReport.memory.percentage > 80
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {stabilityReport.memory.percentage.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            {/* Erros Recentes */}
            {stabilityReport.recentErrors?.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-1">
                  Erros Recentes:
                </h4>
                <div className="max-h-24 overflow-y-auto">
                  {stabilityReport.recentErrors.map(
                    (error: any, index: number) => (
                      <div
                        key={index}
                        className="text-xs text-red-600 truncate"
                      >
                        {error.message}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => {
                  StabilityMonitor.reset();
                  updateReport();
                }}
                className="px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
              >
                Reset Contadores
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("stability_errors");
                  updateReport();
                }}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
              >
                Limpar Erros
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppStabilityStatus;
