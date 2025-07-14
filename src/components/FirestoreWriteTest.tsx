import React, { useState } from "react";
import {
  testFirestoreWriteCapability,
  diagnoseFirestoreIssues,
} from "../utils/testFirestoreWrite";
import {
  debugFirestoreWriteIssue,
  quickFirestoreTest,
} from "../utils/firestoreDebugTest";

interface TestResult {
  success: boolean;
  error?: string;
  tests?: Array<{ type: string; id: string; status: string }>;
  details?: string;
}

interface DiagnosisResult {
  checks: Array<{ name: string; status: string; value: string }>;
  issues: string[];
}

export function FirestoreWriteTest() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [debugResult, setDebugResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const runWriteTest = async () => {
    setLoading(true);
    try {
      console.log("🧪 Executando teste de escrita...");
      const result = await testFirestoreWriteCapability();
      setTestResult(result);
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
        details: error.stack,
      });
    } finally {
      setLoading(false);
    }
  };

  const runDiagnosis = async () => {
    setLoading(true);
    try {
      console.log("🔍 Executando diagnóstico...");
      const result = await diagnoseFirestoreIssues();
      setDiagnosis(result);
    } catch (error: any) {
      console.error("Erro no diagnóstico:", error);
    } finally {
      setLoading(false);
    }
  };

  const runDebugTest = async () => {
    setLoading(true);
    try {
      console.log("🔍 Executando teste debug detalhado...");
      const result = await debugFirestoreWriteIssue();
      setDebugResult(result);
    } catch (error: any) {
      console.error("Erro no teste debug:", error);
    } finally {
      setLoading(false);
    }
  };

  const runQuickTest = async () => {
    setLoading(true);
    try {
      console.log("🚀 Executando teste rápido...");
      const success = await quickFirestoreTest();
      if (success) {
        alert("✅ Teste rápido PASSOU! Firestore está funcionando.");
      } else {
        alert("❌ Teste rápido FALHOU! Há problemas no Firestore.");
      }
    } catch (error: any) {
      alert(`❌ Erro no teste rápido: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🔥 Teste Escrita Firestore - Leirisonda
      </h2>

      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <button
          onClick={runQuickTest}
          disabled={loading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors text-white"
        >
          {loading ? "⏳" : "🚀 Teste Rápido"}
        </button>

        <button
          onClick={runWriteTest}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
        >
          {loading ? "⏳ Testando..." : "🧪 Testar Escrita"}
        </button>

        <button
          onClick={runDiagnosis}
          disabled={loading}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
        >
          {loading ? "⏳ Diagnosticando..." : "🔍 Diagnóstico"}
        </button>

        <button
          onClick={runDebugTest}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
        >
          {loading ? "⏳ Debugando..." : "🔍 Debug Detalhado"}
        </button>
      </div>

      {/* Resultado do teste de escrita */}
      {testResult && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">
            📋 Resultado do Teste de Escrita
          </h3>
          <div
            className={`p-4 rounded-lg ${testResult.success ? "bg-green-900 border border-green-600" : "bg-red-900 border border-red-600"}`}
          >
            {testResult.success ? (
              <div>
                <p className="text-green-400 font-semibold mb-2">
                  ✅ SUCESSO! Firestore está funcionando!
                </p>
                {testResult.tests && (
                  <div>
                    <p className="mb-2">Testes realizados:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {testResult.tests.map((test, i) => (
                        <li key={i} className="text-green-300">
                          <strong>{test.type}</strong>: {test.id} -{" "}
                          {test.status}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-red-400 font-semibold mb-2">
                  ❌ FALHA! Problema no Firestore
                </p>
                <p className="text-red-300 mb-2">Erro: {testResult.error}</p>
                {testResult.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-200">
                      Ver detalhes
                    </summary>
                    <pre className="mt-2 p-2 bg-black rounded text-xs overflow-x-auto">
                      {testResult.details}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resultado do debug detalhado */}
      {debugResult && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">🔍 Debug Detalhado</h3>

          {/* Ambiente */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">🌍 Ambiente:</h4>
            <div className="bg-gray-800 p-3 rounded space-y-1 text-sm">
              <p>
                <strong>Desenvolvimento:</strong>{" "}
                {debugResult.environment.isDev ? "SIM" : "NÃO"}
              </p>
              <p>
                <strong>Netlify:</strong>{" "}
                {debugResult.environment.isNetlify ? "SIM" : "NÃO"}
              </p>
              <p>
                <strong>Firebase Forçado:</strong>{" "}
                {debugResult.environment.forceFirebase ? "SIM" : "NÃO"}
              </p>
              <p>
                <strong>URL:</strong> {debugResult.environment.url}
              </p>
            </div>
          </div>

          {/* Conexão Firestore */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">
              🔥 Conexão Firestore:
            </h4>
            <div
              className={`p-3 rounded ${debugResult.firestoreConnection.status === "success" ? "bg-green-900" : "bg-red-900"}`}
            >
              <p>
                <strong>Status:</strong>{" "}
                {debugResult.firestoreConnection.status}
              </p>
              {debugResult.firestoreConnection.error && (
                <p>
                  <strong>Erro:</strong> {debugResult.firestoreConnection.error}
                </p>
              )}
            </div>
          </div>

          {/* Testes de Escrita */}
          {debugResult.writeTests &&
            Object.keys(debugResult.writeTests).length > 0 && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">
                  📝 Testes de Escrita:
                </h4>
                <div className="space-y-2">
                  {Object.entries(debugResult.writeTests).map(
                    ([test, result]: [string, any]) => (
                      <div
                        key={test}
                        className={`p-2 rounded ${result.status === "success" ? "bg-green-900" : "bg-red-900"}`}
                      >
                        <p>
                          <strong>{test}:</strong> {result.status}
                        </p>
                        {result.id && (
                          <p>
                            <strong>ID:</strong> {result.id}
                          </p>
                        )}
                        {result.error && (
                          <p>
                            <strong>Erro:</strong> {result.error}
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          {/* Problemas e Recomendações */}
          {debugResult.issues && debugResult.issues.length > 0 && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2 text-red-400">
                ⚠️ Problemas:
              </h4>
              <ul className="space-y-1">
                {debugResult.issues.map((issue: string, i: number) => (
                  <li key={i} className="text-red-300 flex items-start gap-2">
                    <span className="text-red-500 font-bold">{i + 1}.</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {debugResult.recommendations &&
            debugResult.recommendations.length > 0 && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2 text-blue-400">
                  💡 Recomendações:
                </h4>
                <ul className="space-y-1">
                  {debugResult.recommendations.map((rec: string, i: number) => (
                    <li
                      key={i}
                      className="text-blue-300 flex items-start gap-2"
                    >
                      <span className="text-blue-500 font-bold">{i + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}

      {/* Resultado do diagnóstico */}
      {diagnosis && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">
            🔍 Diagnóstico Completo
          </h3>

          {/* Verificações */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Verificações:</h4>
            <div className="space-y-2">
              {diagnosis.checks.map((check, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 bg-gray-800 rounded"
                >
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      check.status === "OK"
                        ? "bg-green-600"
                        : check.status === "FAIL"
                          ? "bg-red-600"
                          : check.status === "ERROR"
                            ? "bg-red-700"
                            : "bg-yellow-600"
                    }`}
                  >
                    {check.status}
                  </span>
                  <span className="font-medium">{check.name}:</span>
                  <span className="text-gray-300">{check.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Problemas */}
          {diagnosis.issues.length > 0 ? (
            <div>
              <h4 className="text-lg font-semibold mb-2 text-red-400">
                ⚠️ Problemas Encontrados:
              </h4>
              <ul className="space-y-1">
                {diagnosis.issues.map((issue, i) => (
                  <li key={i} className="text-red-300 flex items-start gap-2">
                    <span className="text-red-500 font-bold">{i + 1}.</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-3 bg-green-900 border border-green-600 rounded">
              <p className="text-green-400 font-semibold">
                ✅ Nenhum problema encontrado!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Informações do ambiente */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h4 className="font-semibold mb-2">ℹ️ Informações do Ambiente:</h4>
        <div className="text-sm space-y-1 text-gray-300">
          <p>
            <strong>URL:</strong> {window.location.href}
          </p>
          <p>
            <strong>VITE_FORCE_FIREBASE:</strong>{" "}
            {import.meta.env.VITE_FORCE_FIREBASE || "não definido"}
          </p>
          <p>
            <strong>DEV Mode:</strong> {import.meta.env.DEV ? "SIM" : "NÃO"}
          </p>
          <p>
            <strong>NETLIFY:</strong>{" "}
            {import.meta.env.NETLIFY || "não definido"}
          </p>
        </div>
      </div>

      {/* Console log */}
      <div className="mt-4 text-sm text-gray-400">
        💡 Verifique o console do navegador (F12) para logs detalhados
      </div>
    </div>
  );
}
