import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Database,
  Cloud,
  HardDrive,
  Plus,
  Download,
  Upload,
  Trash2,
  Building2,
} from "lucide-react";
import { realFirebaseService } from "../services/realFirebaseService";
import { useDataSync } from "../hooks/useDataSync";

interface DiagnosticResult {
  status: "success" | "warning" | "error";
  message: string;
  detail?: string;
  action?: () => void;
  actionLabel?: string;
}

export const WorksDataDiagnostic: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [fixResults, setFixResults] = useState<string[]>([]);
  const { works, syncWithFirebase, addWork } = useDataSync();

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);
    const diagnosticResults: DiagnosticResult[] = [];

    try {
      // 1. Check Firebase connection
      diagnosticResults.push({
        status: "warning",
        message: "Verificando conexão Firebase...",
      });

      const firebaseReady = realFirebaseService.isReady();
      if (firebaseReady) {
        const connectionOk = await realFirebaseService.testConnection();
        if (connectionOk) {
          diagnosticResults.push({
            status: "success",
            message: "✅ Firebase conectado com sucesso",
          });
        } else {
          diagnosticResults.push({
            status: "error",
            message: "❌ Firebase não responde - problema de conectividade",
            detail: "Verifique a internet ou configuração Firebase",
          });
        }
      } else {
        diagnosticResults.push({
          status: "error",
          message: "❌ Firebase não inicializado",
          detail: "Serviço Firebase não está disponível",
        });
      }

      // 2. Check Firebase data
      diagnosticResults.push({
        status: "warning",
        message: "Verificando dados no Firebase...",
      });

      try {
        const firebaseData = await realFirebaseService.syncAllData();
        if (firebaseData) {
          diagnosticResults.push({
            status: firebaseData.works.length > 0 ? "success" : "warning",
            message: `📊 Firebase: ${firebaseData.works.length} obras encontradas`,
            detail:
              firebaseData.works.length === 0
                ? "Não há obras no Firebase - precisa criar algumas"
                : `Obras disponíveis: ${firebaseData.works.map((w: any) => w.title || w.description || "Sem título").join(", ")}`,
          });
        } else {
          diagnosticResults.push({
            status: "error",
            message: "❌ Não foi possível acessar dados do Firebase",
          });
        }
      } catch (error) {
        diagnosticResults.push({
          status: "error",
          message: "❌ Erro ao acessar Firebase",
          detail: error.message,
        });
      }

      // 3. Check local app state
      diagnosticResults.push({
        status: works.length > 0 ? "success" : "warning",
        message: `📱 App Local: ${works.length} obras carregadas`,
        detail:
          works.length === 0
            ? "A aplicação não tem obras carregadas em memória"
            : `Obras na app: ${works.map((w) => w.title || w.description || "Sem título").join(", ")}`,
      });

      // 4. Check localStorage
      const localWorks = localStorage.getItem("works");
      const localWorksCount = localWorks ? JSON.parse(localWorks).length : 0;
      diagnosticResults.push({
        status: localWorksCount > 0 ? "success" : "warning",
        message: `💾 localStorage: ${localWorksCount} obras`,
        detail:
          localWorksCount === 0
            ? "Não há obras salvas localmente"
            : "Obras encontradas no localStorage",
      });

      // 5. Check for sync issues
      if (works.length === 0 && firebaseData?.works?.length > 0) {
        diagnosticResults.push({
          status: "error",
          message: "🚨 PROBLEMA: Firebase tem dados mas app não carregou",
          detail: "Problema de sincronização detectado",
          action: () => performDataSync(),
          actionLabel: "Forçar Sincronização",
        });
      }

      // 6. Suggest solutions
      if (works.length === 0) {
        diagnosticResults.push({
          status: "warning",
          message: "💡 Soluções possíveis:",
          detail:
            "1. Criar obra teste, 2. Forçar sincronização, 3. Importar dados",
          action: () => createTestWork(),
          actionLabel: "Criar Obra Teste",
        });
      }
    } catch (error) {
      diagnosticResults.push({
        status: "error",
        message: "❌ Erro durante diagnóstico",
        detail: error.message,
      });
    }

    setResults(diagnosticResults);
    setIsRunning(false);
  };

  const performDataSync = async () => {
    setFixResults(["🔄 Iniciando sincronização forçada..."]);
    try {
      await syncWithFirebase();
      setFixResults((prev) => [...prev, "✅ Sincronização Firebase executada"]);

      // Force reload from Firebase
      const firebaseData = await realFirebaseService.syncAllData();
      if (firebaseData && firebaseData.works.length > 0) {
        setFixResults((prev) => [
          ...prev,
          `📥 ${firebaseData.works.length} obras encontradas no Firebase`,
        ]);
      }

      setFixResults((prev) => [
        ...prev,
        "🔄 Recarregando página para aplicar dados...",
      ]);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setFixResults((prev) => [
        ...prev,
        `❌ Erro na sincronização: ${error.message}`,
      ]);
    }
  };

  const createTestWork = async () => {
    setFixResults(["🔄 Criando obra de teste..."]);
    try {
      const testWork = {
        title: "Obra de Teste",
        description: "Obra criada para testar o sistema",
        client: "Cliente Teste",
        location: "Localização Teste",
        type: "Teste",
        status: "pending" as const,
        startDate: new Date().toISOString().split("T")[0],
        assignedTo: "Sistema",
        budget: 100,
      };

      await addWork(testWork);
      setFixResults((prev) => [...prev, "✅ Obra de teste criada com sucesso"]);

      setTimeout(() => {
        runDiagnostic();
      }, 1000);
    } catch (error) {
      setFixResults((prev) => [
        ...prev,
        `❌ Erro ao criar obra teste: ${error.message}`,
      ]);
    }
  };

  const clearAllData = () => {
    if (confirm("ATENÇÃO: Isto irá apagar TODOS os dados. Confirma?")) {
      localStorage.clear();
      setFixResults(["🗑️ Todos os dados locais foram limpos"]);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const exportData = () => {
    const data = {
      works: works,
      timestamp: new Date().toISOString(),
      source: "app_export",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `obras_export_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFixResults((prev) => [...prev, "📄 Dados exportados com sucesso"]);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.works && Array.isArray(data.works)) {
          setFixResults([
            `📥 Importando ${data.works.length} obras do arquivo...`,
          ]);

          for (const work of data.works) {
            try {
              await addWork(work);
            } catch (error) {
              console.warn("Erro ao importar obra:", work, error);
            }
          }

          setFixResults((prev) => [
            ...prev,
            `✅ ${data.works.length} obras importadas com sucesso`,
          ]);

          setTimeout(() => {
            runDiagnostic();
          }, 1000);
        } else {
          setFixResults(["❌ Arquivo inválido - não contém obras"]);
        }
      } catch (error) {
        setFixResults([`❌ Erro ao processar arquivo: ${error.message}`]);
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Diagnóstico: 0 Obras na Aplicação
            </h2>
            <p className="text-gray-600">
              Análise completa do problema e soluções automáticas
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Cloud className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <div className="text-sm text-blue-600">Firebase</div>
                <div className="text-lg font-semibold text-blue-900">
                  {realFirebaseService.isReady() ? "Conectado" : "Desconectado"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <div className="text-sm text-green-600">App State</div>
                <div className="text-lg font-semibold text-green-900">
                  {works.length} obras
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <HardDrive className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <div className="text-sm text-yellow-600">Local Storage</div>
                <div className="text-lg font-semibold text-yellow-900">
                  {JSON.parse(localStorage.getItem("works") || "[]").length}{" "}
                  obras
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <div className="text-sm text-red-600">Status</div>
                <div className="text-lg font-semibold text-red-900">
                  {works.length === 0 ? "PROBLEMA" : "OK"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Results */}
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Resultados do Diagnóstico:
          </h3>
          {results.map((result, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${
                result.status === "success"
                  ? "border-green-200 bg-green-50"
                  : result.status === "warning"
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <div className="mt-0.5">
                    {result.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : result.status === "warning" ? (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        result.status === "success"
                          ? "text-green-800"
                          : result.status === "warning"
                            ? "text-yellow-800"
                            : "text-red-800"
                      }`}
                    >
                      {result.message}
                    </div>
                    {result.detail && (
                      <div
                        className={`text-sm mt-1 ${
                          result.status === "success"
                            ? "text-green-700"
                            : result.status === "warning"
                              ? "text-yellow-700"
                              : "text-red-700"
                        }`}
                      >
                        {result.detail}
                      </div>
                    )}
                  </div>
                </div>
                {result.action && result.actionLabel && (
                  <button
                    onClick={result.action}
                    className={`px-3 py-1 text-xs rounded ${
                      result.status === "success"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : result.status === "warning"
                          ? "bg-yellow-600 text-white hover:bg-yellow-700"
                          : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {result.actionLabel}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRunning ? "animate-spin" : ""}`}
            />
            <span>{isRunning ? "Analisando..." : "Executar Diagnóstico"}</span>
          </button>

          <button
            onClick={performDataSync}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Cloud className="h-4 w-4" />
            <span>Forçar Sincronização</span>
          </button>

          <button
            onClick={createTestWork}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Criar Obra Teste</span>
          </button>

          <button
            onClick={exportData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Dados</span>
          </button>

          <label className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center space-x-2 cursor-pointer">
            <Upload className="h-4 w-4" />
            <span>Importar Dados</span>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>

          <button
            onClick={clearAllData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Limpar Tudo</span>
          </button>
        </div>

        {/* Fix Results */}
        {fixResults.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Log de Operações:
            </h3>
            <ul className="text-sm space-y-1">
              {fixResults.map((result, index) => (
                <li key={index} className="text-gray-700">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Possíveis Causas e Soluções:
        </h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>
            <strong>Firebase desconectado:</strong> Verificar internet e
            configuração
          </li>
          <li>
            <strong>Dados só no Firebase:</strong> Usar "Forçar Sincronização"
          </li>
          <li>
            <strong>Não há obras criadas:</strong> Criar primeira obra ou
            importar dados
          </li>
          <li>
            <strong>Problema de cache:</strong> Usar "Limpar Tudo" e recriar
            dados
          </li>
          <li>
            <strong>Backup perdido:</strong> Importar arquivo de backup anterior
          </li>
        </ol>
      </div>
    </div>
  );
};
