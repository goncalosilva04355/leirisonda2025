import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, RefreshCw, Settings } from "lucide-react";

interface AppStatus {
  isLoaded: boolean;
  hasErrors: boolean;
  authStatus: "authenticated" | "not_authenticated" | "checking";
  firebaseStatus: "ready" | "not_ready" | "error";
  storageStatus: "available" | "limited" | "unavailable";
  errorMessages: string[];
}

export const AppStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>({
    isLoaded: false,
    hasErrors: false,
    authStatus: "checking",
    firebaseStatus: "not_ready",
    storageStatus: "available",
    errorMessages: [],
  });

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkAppStatus = async () => {
      const newStatus: AppStatus = {
        isLoaded: true,
        hasErrors: false,
        authStatus: "checking",
        firebaseStatus: "not_ready",
        storageStatus: "available",
        errorMessages: [],
      };

      try {
        // Verificar localStorage
        localStorage.setItem("__test__", "test");
        localStorage.removeItem("__test__");
        newStatus.storageStatus = "available";
      } catch {
        newStatus.storageStatus = "unavailable";
        newStatus.hasErrors = true;
        newStatus.errorMessages.push("localStorage não disponível");
      }

      // Verificar autenticação
      try {
        const currentUser = localStorage.getItem("currentUser");
        const isAuthenticated = localStorage.getItem("isAuthenticated");

        if (currentUser && isAuthenticated === "true") {
          newStatus.authStatus = "authenticated";
        } else {
          newStatus.authStatus = "not_authenticated";
        }
      } catch (error) {
        newStatus.authStatus = "not_authenticated";
        newStatus.errorMessages.push("Erro ao verificar autenticação");
      }

      // Verificar Firebase (não crítico)
      try {
        // Verificar se Firebase está disponível sem importar
        const firebaseReady =
          window.localStorage.getItem("firebase-ready") === "true";
        newStatus.firebaseStatus = firebaseReady ? "ready" : "not_ready";
      } catch {
        newStatus.firebaseStatus = "error";
      }

      setStatus(newStatus);
    };

    checkAppStatus();

    // Verificar status periodicamente
    const interval = setInterval(checkAppStatus, 10000); // 10 segundos
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDiagnostic = () => {
    window.location.search = "?diagnostic=true";
  };

  if (!status.isLoaded) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-700">Carregando aplicação...</span>
        </div>
      </div>
    );
  }

  if (!status.hasErrors && status.authStatus !== "checking") {
    return null; // Não mostrar indicador se tudo estiver ok
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg max-w-sm">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {status.hasErrors ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <span className="font-medium text-sm">
              {status.hasErrors ? "Problemas detectados" : "Sistema OK"}
            </span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {showDetails && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Autenticação:</span>
              <span
                className={
                  status.authStatus === "authenticated"
                    ? "text-green-600"
                    : status.authStatus === "not_authenticated"
                      ? "text-orange-600"
                      : "text-blue-600"
                }
              >
                {status.authStatus === "authenticated"
                  ? "✓ Logado"
                  : status.authStatus === "not_authenticated"
                    ? "⚠ Não logado"
                    : "⏳ Verificando"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Storage:</span>
              <span
                className={
                  status.storageStatus === "available"
                    ? "text-green-600"
                    : status.storageStatus === "limited"
                      ? "text-orange-600"
                      : "text-red-600"
                }
              >
                {status.storageStatus === "available"
                  ? "✓ OK"
                  : status.storageStatus === "limited"
                    ? "⚠ Limitado"
                    : "✗ Indisponível"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Firebase:</span>
              <span
                className={
                  status.firebaseStatus === "ready"
                    ? "text-green-600"
                    : status.firebaseStatus === "not_ready"
                      ? "text-orange-600"
                      : "text-red-600"
                }
              >
                {status.firebaseStatus === "ready"
                  ? "✓ Pronto"
                  : status.firebaseStatus === "not_ready"
                    ? "⚠ Não iniciado"
                    : "✗ Erro"}
              </span>
            </div>

            {status.errorMessages.length > 0 && (
              <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                <div className="text-red-700 font-medium">Erros:</div>
                {status.errorMessages.map((error, index) => (
                  <div key={index} className="text-red-600">
                    • {error}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRefresh}
                className="flex-1 bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
              >
                🔄 Recarregar
              </button>
              <button
                onClick={handleDiagnostic}
                className="flex-1 bg-gray-500 text-white text-xs py-1 px-2 rounded hover:bg-gray-600"
              >
                🔍 Diagnóstico
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppStatusIndicator;
