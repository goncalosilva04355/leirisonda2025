import React, { useState } from "react";
import {
  Bug,
  Database,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Play,
} from "lucide-react";
import FirebaseHealthCheckFixed from "../utils/firebaseHealthCheckFixed";

export const SimpleFirebaseDebug: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastReport, setLastReport] = useState<string>("");

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      console.log("🔍 Executando verificação completa do Firebase...");

      const healthCheck = await FirebaseHealthCheckFixed.runCompleteCheck();
      const operations = await FirebaseHealthCheckFixed.testBasicOperations();
      const report = FirebaseHealthCheckFixed.generateHealthReport(
        healthCheck,
        operations,
      );

      setLastReport(report);
      console.log("📋 Relatório de saúde gerado:", report);

      // Show summary in alert
      const workingServices = [
        healthCheck.app,
        healthCheck.auth,
        healthCheck.firestore,
        healthCheck.storage,
      ].filter(Boolean).length;
      const summary = `Firebase Health Check Completo:
      
✅ Serviços Funcionando: ${workingServices}/4

${healthCheck.app ? "✅" : "❌"} Firebase App
${healthCheck.auth ? "✅" : "❌"} Authentication  
${healthCheck.firestore ? "✅" : "❌"} Firestore Database
${healthCheck.storage ? "✅" : "❌"} Storage

${operations.canRead ? "✅" : "❌"} Leitura Firestore
${operations.canWrite ? "✅" : "❌"} Escrita Firestore

Veja a consola para detalhes completos.`;

      alert(summary);
    } catch (error: any) {
      console.error("Erro na verificação:", error);
      alert(`❌ Erro na verificação: ${error.message}`);
    }
    setLoading(false);
  };

  const downloadReport = () => {
    if (!lastReport) {
      alert("Execute primeiro o health check para gerar um relatório");
      return;
    }

    const blob = new Blob([lastReport], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `firebase-health-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const quickTest = async () => {
    try {
      // Quick Firebase test
      const { getApps } = await import("firebase/app");
      const apps = getApps();

      const status = {
        app: apps.length > 0,
        timestamp: new Date().toLocaleTimeString(),
      };

      console.log("🔥 Firebase Quick Test:", status);
      alert(
        `Firebase App: ${status.app ? "✅ OK" : "❌ Falha"}\nTempo: ${status.timestamp}`,
      );
    } catch (error) {
      console.error("Firebase test error:", error);
      alert("❌ Erro ao testar Firebase");
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
          title="Debug Firebase"
        >
          <Bug className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900 flex items-center">
          <Database className="h-4 w-4 mr-2" />
          Firebase Health Check
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <button
          onClick={runHealthCheck}
          disabled={loading}
          className="w-full flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          {loading ? "A verificar..." : "Health Check Completo"}
        </button>

        <button
          onClick={quickTest}
          className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Teste Rápido
        </button>

        {lastReport && (
          <button
            onClick={downloadReport}
            className="w-full flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Descarregar Relatório
          </button>
        )}

        <div className="text-xs text-gray-600">
          <p>
            <strong>Health Check Completo:</strong> Testa todos os serviços
            Firebase
          </p>
          <p>
            <strong>Teste Rápido:</strong> Verificação básica do Firebase App
          </p>
        </div>

        <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          <strong>💡 Dica:</strong> Use o Health Check Completo para verificar
          se Firebase, Auth, Firestore e Storage estão funcionando.
        </div>
      </div>
    </div>
  );
};

export default SimpleFirebaseDebug;
