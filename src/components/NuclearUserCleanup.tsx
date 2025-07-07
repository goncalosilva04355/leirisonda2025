import React, { useState } from "react";
import { completeUserCleanupService } from "../services/completeUserCleanup";

const NuclearUserCleanup: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [cleanupResult, setCleanupResult] = useState<any>(null);

  const analyzeUserData = async () => {
    setIsAnalyzing(true);
    try {
      const result = await completeUserCleanupService.analyzeUserData();
      setAnalysis(result);
      console.log("📊 Análise completa:", result);
    } catch (error) {
      console.error("Erro na análise:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performNuclearCleanup = async () => {
    if (
      !confirm(
        "⚠️ ATENÇÃO: Esta operação vai ELIMINAR TODOS os utilizadores e dados de autenticação, incluindo sessões do Firebase. Apenas o super admin será recriado. Confirma?",
      )
    ) {
      return;
    }

    setIsCleaning(true);
    try {
      const result = await completeUserCleanupService.nuclearUserCleanup();
      setCleanupResult(result);
      console.log("🚨 Resultado da limpeza nuclear:", result);

      if (result.success) {
        alert(
          "✅ LIMPEZA NUCLEAR CONCLUÍDA! A página irá recarregar para garantir estado limpo.",
        );
      } else {
        alert(`❌ Erro na limpeza: ${result.message}`);
      }
    } catch (error) {
      console.error("Erro na limpeza nuclear:", error);
      alert(`❌ Erro crítico: ${error}`);
    } finally {
      setIsCleaning(false);
    }
  };

  const checkOldUsers = async () => {
    const hasOldUsers = await completeUserCleanupService.hasOldUsersLoggedIn();
    if (hasOldUsers) {
      alert(
        "⚠️ UTILIZADORES ANTIGOS DETECTADOS! É necessária limpeza nuclear.",
      );
    } else {
      alert("✅ Nenhum utilizador antigo detectado.");
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-red-800 mb-4">
        🚨 Limpeza Nuclear de Utilizadores - VERSÃO MELHORADA
      </h3>
      <p className="text-red-700 mb-4">
        Esta versão melhorada elimina COMPLETAMENTE a persistência do Firebase
        Auth que estava a permitir que utilizadores antigos continuassem
        logados.
      </p>

      <div className="space-y-4">
        {/* Quick Check */}
        <button
          onClick={checkOldUsers}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-medium"
        >
          🔍 Verificar Utilizadores Antigos
        </button>

        {/* Analysis */}
        <button
          onClick={analyzeUserData}
          disabled={isAnalyzing}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded font-medium"
        >
          {isAnalyzing
            ? "📊 Analisando..."
            : "📊 Analisar Dados de Utilizadores"}
        </button>

        {/* Nuclear Cleanup */}
        <button
          onClick={performNuclearCleanup}
          disabled={isCleaning}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded font-medium"
        >
          {isCleaning ? "🚨 Limpeza em Curso..." : "🚨 LIMPEZA NUCLEAR TOTAL"}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="mt-6 bg-white border rounded p-4">
          <h4 className="font-bold text-gray-800 mb-2">📊 Análise de Dados:</h4>
          <div className="text-sm space-y-2">
            <p>
              <strong>Total de dados de utilizador:</strong>{" "}
              {analysis.totalUserData}
            </p>
            <p>
              <strong>Firebase Auth ativo:</strong>{" "}
              {analysis.firebaseAuthUser ? "✅ SIM (PROBLEMA!)" : "❌ Não"}
            </p>
            <p>
              <strong>Chaves relacionadas:</strong>{" "}
              {analysis.userRelatedKeys.length}
            </p>
            <p>
              <strong>Bases IndexedDB:</strong>{" "}
              {analysis.indexedDBDatabases.length}
            </p>

            {analysis.firebaseAuthUser && (
              <div className="bg-red-100 border border-red-300 rounded p-2 mt-2">
                <p className="text-red-800 font-medium">
                  ⚠️ FIREBASE AUTH ATIVO! Utilizador antigo ainda logado:{" "}
                  {analysis.details.firebaseCurrentUser?.email}
                </p>
              </div>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer font-medium">
                Ver detalhes completos
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(analysis, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      {/* Cleanup Results */}
      {cleanupResult && (
        <div className="mt-6 bg-white border rounded p-4">
          <h4 className="font-bold text-gray-800 mb-2">
            🚨 Resultado da Limpeza Nuclear:
          </h4>
          <div className="text-sm space-y-2">
            <p
              className={`font-medium ${cleanupResult.success ? "text-green-600" : "text-red-600"}`}
            >
              {cleanupResult.message}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p>
                  <strong>localStorage limpo:</strong>{" "}
                  {cleanupResult.details.localStorageKeysCleared.length} chaves
                </p>
                <p>
                  <strong>sessionStorage:</strong>{" "}
                  {cleanupResult.details.sessionStorageCleared ? "✅" : "❌"}
                </p>
              </div>
              <div>
                <p>
                  <strong>Firebase Auth:</strong>{" "}
                  {cleanupResult.details.firebaseAuthCleared ? "✅" : "❌"}
                </p>
                <p>
                  <strong>IndexedDB:</strong>{" "}
                  {cleanupResult.details.indexedDBCleared ? "✅" : "❌"}
                </p>
                <p>
                  <strong>Super admin:</strong>{" "}
                  {cleanupResult.details.superAdminRecreated ? "✅" : "❌"}
                </p>
              </div>
            </div>

            {cleanupResult.details.errors.length > 0 && (
              <div className="bg-red-100 border border-red-300 rounded p-2 mt-2">
                <p className="text-red-800 font-medium">Erros:</p>
                <ul className="text-red-700 text-xs">
                  {cleanupResult.details.errors.map(
                    (error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-red-600">
        <p>
          <strong>Melhorias desta versão:</strong>
        </p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>🔥 Força logout completo do Firebase Auth</li>
          <li>🗃️ Limpa bases IndexedDB do Firebase</li>
          <li>🔐 Remove persistência de autenticação</li>
          <li>🔄 Força recarregamento para estado limpo</li>
          <li>📊 Análise detalhada antes da limpeza</li>
        </ul>
      </div>
    </div>
  );
};

export default NuclearUserCleanup;
