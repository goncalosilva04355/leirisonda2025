import React, { useEffect, useState } from "react";
import { eliminateSpecificUsers } from "../utils/eliminateSpecificUsers";

const EliminateOldUsers: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const executeCleanup = async () => {
    if (isExecuting) return;

    setIsExecuting(true);
    console.log("🎯 Gonçalo solicitou eliminação dos usuários específicos...");
    console.log(
      "📧 Alvos: yrzamr01@gmail.com, alexkamaryta@gmail.com, davidcarreiraa92@gmail.com",
    );

    try {
      const cleanupResult = await eliminateSpecificUsers();
      setResult(cleanupResult);
    } catch (error) {
      console.error("Erro na execução:", error);
      setResult({ success: false, message: `Erro: ${error}` });
    } finally {
      setIsExecuting(false);
    }
  };

  // Auto-execução quando o componente monta
  useEffect(() => {
    executeCleanup();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            🎯 Eliminando Usuários Específicos
          </h2>

          <div className="mb-4 text-sm text-gray-600">
            <p>📧 Alvos identificados:</p>
            <ul className="list-disc list-inside mt-1">
              <li>yrzamr01@gmail.com</li>
              <li>alexkamaryta@gmail.com</li>
              <li>davidcarreiraa92@gmail.com</li>
            </ul>
          </div>

          {isExecuting && (
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-700">
                Eliminando usuários específicos... Por favor aguarde.
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
                  {result.details.usersEliminated.length > 0 && (
                    <p>
                      🗑️ Eliminados: {result.details.usersEliminated.join(", ")}
                    </p>
                  )}
                  {result.details.systemsCleaned.length > 0 && (
                    <p>
                      🧹 Sistemas limpos:{" "}
                      {result.details.systemsCleaned.join(", ")}
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
              🎯 Eliminar Usuários Específicos Agora
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EliminateOldUsers;
