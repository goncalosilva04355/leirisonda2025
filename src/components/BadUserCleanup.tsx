import React, { useState } from "react";
import { executeCompleteCleanup } from "../utils/completeBadUserCleanup";

interface CleanupResult {
  success: boolean;
  message: string;
  details: {
    emailsFound: string[];
    emailsRemoved: string[];
    systemsCleaned: string[];
    errors: string[];
  };
}

const BadUserCleanup: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<CleanupResult | null>(null);

  const executeCleanup = async () => {
    if (isExecuting) return;

    setIsExecuting(true);
    console.log(
      "🧹 Gonçalo solicitou limpeza de utilizadores problemáticos...",
    );

    try {
      const cleanupResult = await executeCompleteCleanup();
      setResult(cleanupResult);
    } catch (error) {
      console.error("Erro na execução:", error);
      setResult({
        success: false,
        message: `Erro: ${error}`,
        details: {
          emailsFound: [],
          emailsRemoved: [],
          systemsCleaned: [],
          errors: [`${error}`],
        },
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            🧹 Limpeza de Utilizadores
          </h2>

          <div className="mb-4 text-sm text-gray-600">
            <p>
              Esta operação irá remover completamente todos os utilizadores
              problemáticos que ainda possam existir no sistema.
            </p>
          </div>

          {isExecuting && (
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-700">
                Executando limpeza... Por favor aguarde.
              </p>
            </div>
          )}

          {result && (
            <div
              className={`mb-4 p-4 rounded ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <p className="font-medium">
                {result.success ? "✅ Sucesso!" : "❌ Erro!"}
              </p>
              <p className="text-sm mt-1">{result.message}</p>

              {result.success && result.details && (
                <div className="mt-3 text-xs space-y-1">
                  {result.details.emailsRemoved.length > 0 && (
                    <p>
                      🗑️ Emails removidos: {result.details.emailsRemoved.length}
                    </p>
                  )}
                  {result.details.systemsCleaned.length > 0 && (
                    <p>
                      🧹 Sistemas limpos: {result.details.systemsCleaned.length}
                    </p>
                  )}
                  <p className="text-gray-600 mt-2">
                    A aplicação irá recarregar automaticamente...
                  </p>
                </div>
              )}

              {result.details?.errors.length > 0 && (
                <div className="mt-2 text-xs">
                  <p className="font-medium">Erros:</p>
                  <ul className="list-disc list-inside">
                    {result.details.errors.map(
                      (error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!isExecuting && !result && (
            <button
              onClick={executeCleanup}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              🧹 Executar Limpeza Agora
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadUserCleanup;
