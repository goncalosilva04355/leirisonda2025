import React, { useState } from "react";
import {
  testFirestoreConnection,
  testFirestoreQuota,
} from "../utils/testFirestore";
import { simpleFirebaseTest } from "../utils/simpleFirebaseTest";
import EnvDebug from "./EnvDebug";
import FirestoreInstructions from "./FirestoreInstructions";

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

export const FirestoreTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<TestResult | null>(
    null,
  );
  const [quotaResult, setQuotaResult] = useState<any>(null);
  const [simpleResult, setSimpleResult] = useState<any>(null);

  const runSimpleTest = async () => {
    setTesting(true);
    setSimpleResult(null);

    try {
      console.log("🧪 Executando teste Firebase simplificado...");
      const result = await simpleFirebaseTest();
      setSimpleResult(result);
    } catch (error: any) {
      setSimpleResult({
        success: false,
        message: `Erro: ${error.message}`,
        error: error.message,
      });
    } finally {
      setTesting(false);
    }
  };

  const runTests = async () => {
    setTesting(true);
    setConnectionResult(null);
    setQuotaResult(null);

    try {
      console.log("🚀 Iniciando testes do Firestore...");

      // Teste de conectividade
      const connResult = await testFirestoreConnection();
      setConnectionResult(connResult);

      if (connResult.success) {
        // Se conectividade OK, testar quota
        const quotaRes = await testFirestoreQuota();
        setQuotaResult(quotaRes);
      }
    } catch (error: any) {
      setConnectionResult({
        success: false,
        message: `Erro inesperado: ${error.message}`,
        details: { error: error.message },
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <EnvDebug />

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          🔥 Teste de Conectividade Firestore
        </h2>

        <div className="space-y-3">
          <button
            onClick={runSimpleTest}
            disabled={testing}
            className={`w-full py-3 px-4 rounded-lg font-medium ${
              testing
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-yellow-600 hover:bg-yellow-700 text-white"
            }`}
          >
            {testing ? "🔄 Testando..." : "🔧 Teste Simplificado (Recomendado)"}
          </button>

          <button
            onClick={runTests}
            disabled={testing}
            className={`w-full py-3 px-4 rounded-lg font-medium ${
              testing
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {testing ? "🔄 Testando..." : "🧪 Teste Completo"}
          </button>
        </div>

        {/* Resultado do Teste Simples */}
        {simpleResult && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              simpleResult.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <h3
              className={`font-bold text-lg ${
                simpleResult.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {simpleResult.success ? "✅ Inicialização" : "❌ Inicialização"}
            </h3>
            <p
              className={`mt-2 ${
                simpleResult.success ? "text-green-700" : "text-red-700"
              }`}
            >
              {simpleResult.message}
            </p>

            {simpleResult.success && (
              <div className="mt-2 text-green-700 text-sm">
                <p>• App: {simpleResult.app}</p>
                <p>• Projeto: {simpleResult.projectId}</p>
                <p>• Firestore: {simpleResult.firestoreType}</p>
              </div>
            )}

            {!simpleResult.success &&
              simpleResult.code === "FIRESTORE_NOT_ENABLED" &&
              simpleResult.projectId && (
                <div className="mt-4">
                  <FirestoreInstructions projectId={simpleResult.projectId} />
                </div>
              )}

            <details className="mt-3">
              <summary className="cursor-pointer font-medium">
                📋 Detalhes Técnicos
              </summary>
              <pre className="mt-2 bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(simpleResult, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Resultado da Conectividade */}
        {connectionResult && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              connectionResult.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <h3
              className={`font-bold text-lg ${
                connectionResult.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {connectionResult.success
                ? "✅ Conectividade"
                : "❌ Conectividade"}
            </h3>
            <p
              className={`mt-2 ${
                connectionResult.success ? "text-green-700" : "text-red-700"
              }`}
            >
              {connectionResult.message}
            </p>

            {connectionResult.details && (
              <details className="mt-3">
                <summary className="cursor-pointer font-medium">
                  📋 Detalhes Técnicos
                </summary>
                <pre className="mt-2 bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {JSON.stringify(connectionResult.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Resultado da Quota */}
        {quotaResult && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              quotaResult.hasQuota
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            <h3
              className={`font-bold text-lg ${
                quotaResult.hasQuota ? "text-green-800" : "text-yellow-800"
              }`}
            >
              {quotaResult.hasQuota ? "✅ Quota" : "⚠️ Quota"}
            </h3>
            <p
              className={`mt-2 ${
                quotaResult.hasQuota ? "text-green-700" : "text-yellow-700"
              }`}
            >
              {quotaResult.message}
            </p>

            {quotaResult.details && (
              <details className="mt-3">
                <summary className="cursor-pointer font-medium">
                  📋 Detalhes da Quota
                </summary>
                <pre className="mt-2 bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {JSON.stringify(quotaResult.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Dicas */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-bold text-blue-800">💡 Dicas de Diagnóstico</h4>
          <ul className="mt-2 text-blue-700 text-sm space-y-1">
            <li>• Verifique o console do browser (F12) para logs detalhados</li>
            <li>
              • Se a conectividade falhar, verifique as regras do Firestore
            </li>
            <li>• Se a quota estiver excedida, aguarde algumas horas</li>
            <li>
              • Certifique-se que o projeto Firebase tem Firestore habilitado
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FirestoreTest;
