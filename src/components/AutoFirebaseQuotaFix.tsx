import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export const AutoFirebaseQuotaFix: React.FC = () => {
  const [status, setStatus] = useState<
    "checking" | "fixed" | "no-issues" | "error"
  >("checking");
  const [flagsFound, setFlagsFound] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fixQuotaIssues = () => {
      try {
        // Flags que podem bloquear o Firebase
        const quotaFlags = [
          "firebase-quota-exceeded",
          "firebase-quota-check-time",
          "firebase-emergency-shutdown",
          "firebase-emergency-time",
          "firebase-circuit-breaker",
          "firebase-quota-cooldown",
        ];

        // Verificar quais flags estão ativas
        const activeFlags = quotaFlags.filter((flag) =>
          localStorage.getItem(flag),
        );
        setFlagsFound(activeFlags);

        if (activeFlags.length > 0) {
          console.log("🚨 Flags de quota encontradas:", activeFlags);

          // Limpar todas as flags
          activeFlags.forEach((flag) => {
            localStorage.removeItem(flag);
            console.log(`✅ Flag removida: ${flag}`);
          });

          setStatus("fixed");

          // Log da correção
          console.log("✅ Firebase quota flags limpas automaticamente");
          console.log("🔄 Firebase deve estar reativado agora");
        } else {
          setStatus("no-issues");
          console.log("✅ Nenhuma flag de quota encontrada - Firebase ativo");
        }
      } catch (error) {
        console.error("❌ Erro ao corrigir quota:", error);
        setStatus("error");
      }
    };

    // Executar correção após um pequeno delay
    const timer = setTimeout(fixQuotaIssues, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (status === "checking") {
    return (
      <div className="fixed top-4 left-4 z-50 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <RefreshCw className="animate-spin text-blue-600" size={16} />
          <span className="text-blue-800 text-sm">Verificando Firebase...</span>
        </div>
      </div>
    );
  }

  if (status === "no-issues") {
    return null; // Não mostrar nada se não há problemas
  }

  if (status === "fixed") {
    return (
      <div className="fixed top-4 left-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-md">
        <div className="flex items-start space-x-3">
          <CheckCircle className="text-green-600 mt-1" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-green-800 mb-1">
              ✅ Firebase Reativado
            </h3>
            <p className="text-green-700 text-sm mb-2">
              {flagsFound.length} flag(s) de quota foram removidas
              automaticamente.
            </p>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                {showDetails ? "Ocultar" : "Ver"} Detalhes
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>

            {showDetails && (
              <div className="mt-3 pt-2 border-t border-green-200">
                <p className="text-xs text-green-600 mb-1">Flags removidas:</p>
                <ul className="text-xs text-green-700 space-y-1">
                  {flagsFound.map((flag, index) => (
                    <li key={index} className="font-mono">
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="fixed top-4 left-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <AlertCircle className="text-red-600" size={20} />
          <span className="text-red-800 text-sm">
            Erro ao verificar Firebase quota
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default AutoFirebaseQuotaFix;
