import React, { useState, useCallback } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Zap,
} from "lucide-react";
import {
  FirebaseWriteDiagnostic,
  FirebaseWriteDiagnosticResult,
  quickFirebaseWriteCheck,
} from "../utils/firebaseWriteDiagnostic";

export const FirebaseWriteDiagnosticComponent: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] =
    useState<FirebaseWriteDiagnosticResult | null>(null);
  const [showReport, setShowReport] = useState(false);

  const runDiagnostic = useCallback(async () => {
    setIsRunning(true);
    console.log("🔍 Iniciando diagnóstico do Firebase...");

    try {
      const result = await FirebaseWriteDiagnostic.runCompleteDiagnostic();
      setDiagnosticResult(result);
      setShowReport(true);

      // Log detalhado no console
      const report = FirebaseWriteDiagnostic.generateReport(result);
      console.log(report);
    } catch (error) {
      console.error("💥 Erro durante diagnóstico:", error);
    } finally {
      setIsRunning(false);
    }
  }, []);

  const applyAutoFix = useCallback(async () => {
    if (!diagnosticResult) return;

    console.log("🔧 Aplicando correções automáticas...");
    await FirebaseWriteDiagnostic.autoFix(diagnosticResult);

    // Re-executar diagnóstico após correção
    setTimeout(() => {
      runDiagnostic();
    }, 2000);
  }, [diagnosticResult, runDiagnostic]);

  const quickCheck = useCallback(async () => {
    setIsRunning(true);
    await quickFirebaseWriteCheck();
    setIsRunning(false);
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusColor = (status: boolean) => {
    return status ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Diagnóstico Firebase - Escrita de Dados
        </h3>

        <div className="flex space-x-2">
          <button
            onClick={quickCheck}
            disabled={isRunning}
            className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 flex items-center"
          >
            <Zap className="w-4 h-4 mr-1" />
            Check Rápido
          </button>

          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-2" />
            )}
            {isRunning ? "Executando..." : "Executar Diagnóstico"}
          </button>
        </div>
      </div>

      {/* Indicador de execução */}
      {isRunning && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin text-blue-600" />
            <span className="text-blue-700">
              Executando testes de conectividade e escrita...
            </span>
          </div>
        </div>
      )}

      {/* Resultados do diagnóstico */}
      {diagnosticResult && showReport && (
        <div className="space-y-4">
          {/* Status Geral */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Firebase
                </span>
                {getStatusIcon(diagnosticResult.isFirebaseReady)}
              </div>
              <div
                className={`text-xs mt-1 ${getStatusColor(diagnosticResult.isFirebaseReady)}`}
              >
                {diagnosticResult.isFirebaseReady
                  ? "Inicializado"
                  : "Não Conectado"}
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Firestore
                </span>
                {getStatusIcon(diagnosticResult.isFirestoreConnected)}
              </div>
              <div
                className={`text-xs mt-1 ${getStatusColor(diagnosticResult.isFirestoreConnected)}`}
              >
                {diagnosticResult.isFirestoreConnected
                  ? "Conectado"
                  : "Desconectado"}
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Leitura
                </span>
                {getStatusIcon(diagnosticResult.canRead)}
              </div>
              <div
                className={`text-xs mt-1 ${getStatusColor(diagnosticResult.canRead)}`}
              >
                {diagnosticResult.canRead ? "Funcional" : "Bloqueada"}
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Escrita
                </span>
                {getStatusIcon(diagnosticResult.canWrite)}
              </div>
              <div
                className={`text-xs mt-1 ${getStatusColor(diagnosticResult.canWrite)}`}
              >
                {diagnosticResult.canWrite ? "Funcional" : "Bloqueada"}
              </div>
            </div>
          </div>

          {/* Testes Detalhados */}
          <div className="border border-gray-200 rounded-md p-4">
            <h4 className="font-medium text-gray-700 mb-3">
              Testes Realizados
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center">
                {getStatusIcon(diagnosticResult.testResults.connectionTest)}
                <span className="text-sm ml-2">Conexão</span>
              </div>
              <div className="flex items-center">
                {getStatusIcon(diagnosticResult.testResults.readTest)}
                <span className="text-sm ml-2">Leitura</span>
              </div>
              <div className="flex items-center">
                {getStatusIcon(diagnosticResult.testResults.writeTest)}
                <span className="text-sm ml-2">Escrita</span>
              </div>
              <div className="flex items-center">
                {getStatusIcon(diagnosticResult.testResults.deleteTest)}
                <span className="text-sm ml-2">Deleção</span>
              </div>
            </div>
          </div>

          {/* Problemas Identificados */}
          {diagnosticResult.errorDetails.length > 0 && (
            <div className="border border-red-200 rounded-md p-4 bg-red-50">
              <h4 className="font-medium text-red-700 mb-3 flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                Problemas Identificados
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {diagnosticResult.errorDetails.map((error, index) => (
                  <li key={index} className="text-sm text-red-600">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Categorização de Problemas */}
          {(diagnosticResult.rulesIssue ||
            diagnosticResult.networkIssue ||
            diagnosticResult.authIssue) && (
            <div className="border border-orange-200 rounded-md p-4 bg-orange-50">
              <h4 className="font-medium text-orange-700 mb-3">
                Tipos de Problema
              </h4>
              <div className="space-y-2">
                {diagnosticResult.rulesIssue && (
                  <div className="flex items-center text-sm text-orange-600">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Problema com regras de segurança do Firestore
                  </div>
                )}
                {diagnosticResult.authIssue && (
                  <div className="flex items-center text-sm text-orange-600">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Problema de autenticação
                  </div>
                )}
                {diagnosticResult.networkIssue && (
                  <div className="flex items-center text-sm text-orange-600">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Problema de conectividade de rede
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sugestões de Correção */}
          {diagnosticResult.fixSuggestions.length > 0 && (
            <div className="border border-blue-200 rounded-md p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-blue-700">
                  Sugestões de Correção
                </h4>
                <button
                  onClick={applyAutoFix}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Aplicar Correções
                </button>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {diagnosticResult.fixSuggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-600">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Status de Sucesso */}
          {diagnosticResult.canWrite && diagnosticResult.canRead && (
            <div className="border border-green-200 rounded-md p-4 bg-green-50">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-medium text-green-700">
                  ✅ Firebase está funcionando corretamente! Gravação de dados
                  habilitada.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instruções de uso */}
      <div className="mt-6 p-3 bg-gray-50 rounded-md">
        <h5 className="font-medium text-gray-700 mb-2">Como usar:</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • <strong>Check Rápido:</strong> Verificação rápida no console
          </li>
          <li>
            • <strong>Diagnóstico Completo:</strong> Análise detalhada com
            interface visual
          </li>
          <li>
            • <strong>Aplicar Correções:</strong> Tentativa automática de
            resolver problemas
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseWriteDiagnosticComponent;
