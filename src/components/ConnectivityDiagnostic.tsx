/**
 * Componente de diagnóstico visual de conectividade
 * Mostra o que está a impedir a conexão e como resolver
 */

import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Settings,
  X,
  Play,
} from "lucide-react";
import { FirebaseConnectivityFix } from "../utils/firebaseConnectivityFix";

interface ConnectivityDiagnosticProps {
  onClose?: () => void;
  autoRun?: boolean;
}

export const ConnectivityDiagnostic: React.FC<ConnectivityDiagnosticProps> = ({
  onClose,
  autoRun = false,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [quickStatus, setQuickStatus] = useState<any>(null);
  const [isFixing, setIsFixing] = useState(false);
  const [isEmergencyFixing, setIsEmergencyFixing] = useState(false);

  // Auto-run diagnostic on mount se autoRun for true
  useEffect(() => {
    if (autoRun) {
      runDiagnostic();
    } else {
      runQuickCheck();
    }
  }, [autoRun]);

  const runQuickCheck = async () => {
    try {
      const status = await FirebaseConnectivityFix.quickStatusCheck();
      setQuickStatus(status);
    } catch (error) {
      console.error("Erro na verificação rápida:", error);
    }
  };

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      const diagnostic = await FirebaseConnectivityFix.runDiagnostic();
      setResults(diagnostic);
    } catch (error) {
      console.error("Erro no diagnóstico:", error);
      setResults({
        status: "error",
        issues: ["❌ Erro interno no diagnóstico"],
        fixes: ["🔧 Tente novamente"],
        recommendations: ["⚠️ Contacte suporte se persistir"],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const applyFixes = async () => {
    setIsFixing(true);

    try {
      const result = await FirebaseConnectivityFix.applyAutomaticFixes();

      if (result.success) {
        alert("✅ Correções aplicadas! A página será recarregada.");
        window.location.reload();
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error("Erro ao aplicar correções:", error);
      alert("❌ Erro ao aplicar correções. Tente novamente.");
    } finally {
      setIsFixing(false);
    }
  };

  const applyEmergencyFix = async () => {
    setIsEmergencyFixing(true);

    try {
      const result = await EmergencyConnectivityFix.emergencyFix();

      if (result.success) {
        alert(
          "🚨 Correção de emergência aplicada! A página será recarregada em 3 segundos.",
        );
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error("Erro na correção de emergência:", error);
      alert(
        "❌ Erro na correção de emergência. A página será recarregada manualmente.",
      );
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } finally {
      setIsEmergencyFixing(false);
    }
  };

  const getStatusIcon = (status: any) => {
    if (!status) return null;

    const allGood =
      status.isOnline &&
      status.firebaseReady &&
      status.userAuthenticated &&
      status.canReadFirestore;

    if (allGood) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (status.isOnline) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    } else {
      return <WifiOff className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (status: any) => {
    if (!status) return "Verificando...";

    if (!status.isOnline) return "Sem conexão";
    if (!status.firebaseReady) return "Firebase não inicializado";
    if (!status.userAuthenticated) return "Não autenticado";
    if (!status.canReadFirestore) return "Sem acesso aos dados";

    return "Conectado";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border max-w-2xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Settings className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Diagnóstico de Conectividade
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Status */}
        {quickStatus && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Status Atual</h4>
              {getStatusIcon(quickStatus)}
            </div>

            <div className="text-sm text-gray-600 mb-3">
              {getStatusText(quickStatus)}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                className={`flex items-center space-x-2 ${quickStatus.isOnline ? "text-green-600" : "text-red-600"}`}
              >
                {quickStatus.isOnline ? (
                  <Wifi className="w-3 h-3" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
                <span>Internet</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${quickStatus.firebaseReady ? "text-green-600" : "text-red-600"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${quickStatus.firebaseReady ? "bg-green-500" : "bg-red-500"}`}
                />
                <span>Firebase</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${quickStatus.userAuthenticated ? "text-green-600" : "text-red-600"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${quickStatus.userAuthenticated ? "bg-green-500" : "bg-red-500"}`}
                />
                <span>Autenticação</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${quickStatus.canReadFirestore ? "text-green-600" : "text-red-600"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${quickStatus.canReadFirestore ? "bg-green-500" : "bg-red-500"}`}
                />
                <span>Base Dados</span>
              </div>
            </div>
          </div>
        )}

        {/* Diagnostic Results */}
        {results && (
          <div className="space-y-3">
            {/* Issues */}
            {results.issues.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h5 className="font-medium text-red-800 mb-2">
                  Problemas Encontrados:
                </h5>
                <ul className="text-sm text-red-700 space-y-1">
                  {results.issues.map((issue: string, index: number) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fixes */}
            {results.fixes.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h5 className="font-medium text-blue-800 mb-2">
                  Correções Sugeridas:
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  {results.fixes.map((fix: string, index: number) => (
                    <li key={index}>{fix}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {results.recommendations.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h5 className="font-medium text-green-800 mb-2">
                  Recomendações:
                </h5>
                <ul className="text-sm text-green-700 space-y-1">
                  {results.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-3 border-t">
          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>
              {isRunning ? "A Diagnosticar..." : "Executar Diagnóstico"}
            </span>
          </button>

          {results && results.fixes.length > 0 && (
            <button
              onClick={applyFixes}
              disabled={isFixing}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFixing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
              <span>{isFixing ? "A Aplicar..." : "Aplicar Correções"}</span>
            </button>
          )}

          <button
            onClick={applyEmergencyFix}
            disabled={isEmergencyFixing}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEmergencyFixing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>
              {isEmergencyFixing ? "EMERGENCY FIX..." : "🚨 EMERGENCY FIX"}
            </span>
          </button>
        </div>

        {/* Manual Instructions */}
        <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
          <strong>Instruções manuais:</strong>
          <br />
          1. Verificar se tem internet estável
          <br />
          2. Aguardar 2-3 minutos após publicar regras no Firebase
          <br />
          3. Fazer refresh da página (F5)
          <br />
          4. Se persistir, contactar suporte
        </div>
      </div>
    </div>
  );
};

export default ConnectivityDiagnostic;
