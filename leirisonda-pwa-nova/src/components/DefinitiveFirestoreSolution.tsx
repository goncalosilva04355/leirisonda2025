import React, { useState } from "react";
import {
  definitiveFirestoreTest,
  getFirestoreInstructions,
} from "../utils/definitiveFirestoreTest";

export const DefinitiveFirestoreSolution: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const runDefinitiveTest = async () => {
    setTesting(true);
    setResult(null);
    setShowInstructions(false);

    try {
      const testResult = await definitiveFirestoreTest();
      setResult(testResult);

      if (testResult.action === "ENABLE_FIRESTORE") {
        setShowInstructions(true);
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `Erro no teste: ${error.message}`,
        action: "ERROR",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-700 mb-2">
            🚨 SOLUÇÃO DEFINITIVA FIRESTORE
          </h1>
          <p className="text-gray-600">
            Teste final com configuração 100% correta do projeto leiria-1cfc9
          </p>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={runDefinitiveTest}
            disabled={testing}
            className={`px-8 py-4 rounded-lg font-bold text-lg ${
              testing
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {testing ? "🔄 TESTANDO..." : "🎯 EXECUTAR TESTE DEFINITIVO"}
          </button>
        </div>

        {/* Resultado do Teste */}
        {result && (
          <div
            className={`mb-6 p-6 rounded-lg border-2 ${
              result.success
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${
                result.success ? "text-green-700" : "text-red-700"
              }`}
            >
              {result.success ? "🎉 SUCESSO!" : "❌ PROBLEMA IDENTIFICADO"}
            </h2>

            <p
              className={`text-lg mb-4 ${
                result.success ? "text-green-700" : "text-red-700"
              }`}
            >
              {result.message}
            </p>

            {result.success && (
              <div className="bg-green-100 p-4 rounded">
                <h3 className="font-bold text-green-800 mb-2">
                  🎊 FIRESTORE FUNCIONANDO!
                </h3>
                <p className="text-green-700">
                  Os dados estão a ser guardados e lidos corretamente. A
                  aplicação pode agora funcionar normalmente com persistência na
                  nuvem.
                </p>
              </div>
            )}

            {result.data && (
              <details className="mt-4">
                <summary className="cursor-pointer font-medium">
                  📋 Detalhes Técnicos
                </summary>
                <pre className="mt-2 bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Instruções para habilitar Firestore */}
        {showInstructions && result?.data?.projectId && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">
              🔧 AÇÃO NECESSÁRIA
            </h2>

            <div className="bg-white p-4 rounded border">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {getFirestoreInstructions(result.data.projectId)}
              </pre>
            </div>

            <div className="mt-6 text-center">
              <a
                href={result.data.consoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg"
              >
                🚀 ABRIR FIREBASE CONSOLE
              </a>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={runDefinitiveTest}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
              >
                🔄 TESTAR NOVAMENTE
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            🔄 Recarregar Página
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefinitiveFirestoreSolution;
