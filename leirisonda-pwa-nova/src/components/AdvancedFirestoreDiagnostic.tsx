import React, { useState } from "react";
import {
  advancedFirestoreTest,
  checkFirebaseProjectStatus,
} from "../utils/advancedFirestoreTest";

export const AdvancedFirestoreDiagnostic: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [projectStatus, setProjectStatus] = useState<any>(null);

  const runAdvancedTest = async () => {
    setTesting(true);
    setResult(null);

    try {
      const testResult = await advancedFirestoreTest();
      setResult(testResult);
    } catch (error: any) {
      setResult({
        success: false,
        message: `Erro no teste: ${error.message}`,
        data: { error: error.message },
      });
    } finally {
      setTesting(false);
    }
  };

  const checkProject = async () => {
    setTesting(true);
    setProjectStatus(null);

    try {
      const status = await checkFirebaseProjectStatus();
      setProjectStatus(status);
    } catch (error: any) {
      setProjectStatus({
        success: false,
        message: `Erro ao verificar projeto: ${error.message}`,
        data: { error: error.message },
      });
    } finally {
      setTesting(false);
    }
  };

  const getActionMessage = (action: string) => {
    switch (action) {
      case "MANUAL_CHECK":
        return `🔧 AÇÃO NECESSÁRIA:
1. Aceda a: https://console.firebase.google.com/project/leiria25/firestore
2. Verifique se o Firestore está com status "Ativo"
3. Se ainda estiver "Criando", aguarde mais alguns minutos
4. Verifique se as regras de segurança estão corretas
5. Tente o teste novamente`;

      case "INVESTIGATE":
        return `🔍 INVESTIGAÇÃO NECESSÁRIA:
Este não é o erro típico de Firestore não habilitado.
Verifique os detalhes técnicos abaixo e contacte suporte se necessário.`;

      case "CHECK_NETWORK":
        return `🌐 VERIFICAR CONECTIVIDADE:
1. Verifique sua conexão à internet
2. Certifique-se que não há bloqueadores (firewall, ad-blocker)
3. Tente recarregar a página`;

      default:
        return "Verifique os detalhes para mais informações.";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          🔬 Diagnóstico Avançado do Firestore
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={runAdvancedTest}
            disabled={testing}
            className={`py-3 px-4 rounded-lg font-medium ${
              testing
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {testing ? "🔄 Testando..." : "🧪 Teste com Retry Automático"}
          </button>

          <button
            onClick={checkProject}
            disabled={testing}
            className={`py-3 px-4 rounded-lg font-medium ${
              testing
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {testing ? "🔄 Verificando..." : "🔍 Verificar Projeto Firebase"}
          </button>
        </div>

        {/* Resultado do Teste Avançado */}
        {result && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              result.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <h3
              className={`font-bold text-lg ${
                result.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {result.success ? "✅ Teste Avançado" : "❌ Teste Avançado"}
            </h3>
            <p
              className={`mt-2 ${
                result.success ? "text-green-700" : "text-red-700"
              }`}
            >
              {result.message}
            </p>

            {result.action && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <pre className="text-sm text-yellow-800 whitespace-pre-wrap">
                  {getActionMessage(result.action)}
                </pre>
              </div>
            )}

            {result.canRetry && (
              <button
                onClick={runAdvancedTest}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                🔄 Tentar Novamente
              </button>
            )}

            <details className="mt-3">
              <summary className="cursor-pointer font-medium">
                📋 Detalhes Técnicos
              </summary>
              <pre className="mt-2 bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Status do Projeto */}
        {projectStatus && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              projectStatus.success
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            <h3
              className={`font-bold text-lg ${
                projectStatus.success ? "text-green-800" : "text-yellow-800"
              }`}
            >
              {projectStatus.success
                ? "✅ Status do Projeto"
                : "⚠️ Status do Projeto"}
            </h3>
            <p
              className={`mt-2 ${
                projectStatus.success ? "text-green-700" : "text-yellow-700"
              }`}
            >
              {projectStatus.message}
            </p>

            <details className="mt-3">
              <summary className="cursor-pointer font-medium">
                📋 Detalhes do Projeto
              </summary>
              <pre className="mt-2 bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(projectStatus.data, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Guia de Resolução */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-800 mb-3">
            💡 Possíveis Causas do Erro getImmediate
          </h3>
          <ul className="text-blue-700 text-sm space-y-2">
            <li>
              • <strong>Firestore ainda sendo provisionado:</strong> Pode
              demorar 5-10 minutos após criação
            </li>
            <li>
              • <strong>Regras de segurança:</strong> Podem estar bloqueando
              acesso
            </li>
            <li>
              • <strong>Configuração incorreta:</strong> Project ID ou região
              podem estar errados
            </li>
            <li>
              • <strong>Cache do browser:</strong> Pode estar a usar
              configuração antiga
            </li>
            <li>
              • <strong>Problema de rede:</strong> Firewall ou bloqueadores
              podem interferir
            </li>
          </ul>

          <div className="mt-4 p-3 bg-blue-100 rounded">
            <p className="text-blue-800 text-sm">
              <strong>Dica:</strong> Se acabou de criar o Firestore, aguarde
              5-10 minutos e tente novamente. O provisionamento inicial pode
              demorar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFirestoreDiagnostic;
