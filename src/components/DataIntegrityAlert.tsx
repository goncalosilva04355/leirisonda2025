import React, { useState, useEffect } from "react";
import { AlertTriangle, RefreshCw, X, CheckCircle } from "lucide-react";
import {
  dataIntegrityService,
  IntegrityCheckResult,
} from "../services/dataIntegrityService";

interface DataIntegrityAlertProps {
  onIntegrityIssue?: (hasIssues: boolean) => void;
}

export const DataIntegrityAlert: React.FC<DataIntegrityAlertProps> = ({
  onIntegrityIssue,
}) => {
  const [integrityResult, setIntegrityResult] =
    useState<IntegrityCheckResult | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

  useEffect(() => {
    // Listener para problemas de integridade
    const handleIntegrityCheck = () => {
      performIntegrityCheck();
    };

    // Listener para recuperação forçada de dados
    const handleForceRecovery = () => {
      handleForceDataSync();
    };

    // Check inicial
    performIntegrityCheck();

    // Setup listeners
    window.addEventListener("data-integrity-check", handleIntegrityCheck);
    window.addEventListener("force-data-recovery", handleForceRecovery);

    // Verificação periódica desabilitada para melhorar performance
    // const interval = setInterval(performIntegrityCheck, 120000);

    return () => {
      window.removeEventListener("data-integrity-check", handleIntegrityCheck);
      window.removeEventListener("force-data-recovery", handleForceRecovery);
      // clearInterval(interval);
    };
  }, []);

  const performIntegrityCheck = () => {
    try {
      const currentData = {
        pools: JSON.parse(localStorage.getItem("pools") || "[]"),
        maintenance: JSON.parse(localStorage.getItem("maintenance") || "[]"),
        works: JSON.parse(localStorage.getItem("works") || "[]"),
        clients: JSON.parse(localStorage.getItem("clients") || "[]"),
        users: JSON.parse(localStorage.getItem("users") || "[]"),
      };

      const result = dataIntegrityService.validateDataIntegrity(currentData);
      setIntegrityResult(result);

      // Mostrar alerta apenas se houver problemas
      const hasIssues = !result.isValid || result.warnings.length > 0;
      setIsVisible(hasIssues);

      if (onIntegrityIssue) {
        onIntegrityIssue(hasIssues);
      }

      if (hasIssues) {
        console.warn("🚨 Problemas de integridade detectados:", result);
      }
    } catch (error) {
      console.error("❌ Erro durante verificação de integridade:", error);
    }
  };

  const handleAutoFix = async () => {
    setIsFixing(true);
    try {
      // Auto-fix para caracteres corrompidos
      fixCorruptedCharacters();
      removeDuplicates();

      // Re-verificar após correções
      setTimeout(() => {
        performIntegrityCheck();
        setIsFixing(false);
      }, 1000);
    } catch (error) {
      console.error("❌ Erro durante correção automática:", error);
      setIsFixing(false);
    }
  };

  const handleForceDataSync = async () => {
    setIsFixing(true);
    try {
      await dataIntegrityService.forceDataSync();

      setTimeout(() => {
        performIntegrityCheck();
        setIsFixing(false);
      }, 2000);
    } catch (error) {
      console.error("❌ Erro durante sincronização forçada:", error);
      setIsFixing(false);
    }
  };

  const fixCorruptedCharacters = () => {
    const fixString = (str: string): string => {
      return str
        .replace(/��/g, "ção")
        .replace(/�/g, "")
        .replace(/ç��o/g, "ção")
        .replace(/manuten��ão/g, "manutenção")
        .replace(/atribu��da/g, "atribuída")
        .replace(/filtração/g, "filtração")
        .replace(/orçamento/g, "orçamento")
        .replace(/configurações/g, "configurações");
    };

    const fixObject = (obj: any): any => {
      const fixed = { ...obj };
      Object.keys(fixed).forEach((key) => {
        if (typeof fixed[key] === "string") {
          fixed[key] = fixString(fixed[key]);
        }
      });
      return fixed;
    };

    ["pools", "maintenance", "works", "clients"].forEach((dataType) => {
      const data = JSON.parse(localStorage.getItem(dataType) || "[]");
      const fixedData = data.map(fixObject);
      localStorage.setItem(dataType, JSON.stringify(fixedData));
    });

    console.log("✅ Caracteres corrompidos corrigidos automaticamente");
  };

  const removeDuplicates = () => {
    let totalRemoved = 0;

    ["pools", "maintenance", "works", "clients"].forEach((dataType) => {
      const data = JSON.parse(localStorage.getItem(dataType) || "[]");
      const uniqueData = data.filter(
        (item: any, index: number, arr: any[]) =>
          arr.findIndex((t) => t.id === item.id) === index,
      );

      if (uniqueData.length !== data.length) {
        const removed = data.length - uniqueData.length;
        totalRemoved += removed;
        localStorage.setItem(dataType, JSON.stringify(uniqueData));
        console.log(`✅ Removidas ${removed} duplicações em ${dataType}`);
      }
    });

    if (totalRemoved > 0) {
      console.log(`✅ Total de ${totalRemoved} duplicações removidas`);
    }
  };

  if (!isVisible || !integrityResult) {
    return null;
  }

  const hasErrors = !integrityResult.isValid;
  const hasWarnings = integrityResult.warnings.length > 0;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div
        className={`rounded-lg shadow-lg border-l-4 p-4 ${
          hasErrors
            ? "bg-red-50 border-red-500"
            : "bg-yellow-50 border-yellow-500"
        }`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {hasErrors ? (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
          </div>

          <div className="ml-3 flex-1">
            <h3
              className={`text-sm font-medium ${
                hasErrors ? "text-red-800" : "text-yellow-800"
              }`}
            >
              {hasErrors
                ? "Problemas de Dados Detectados"
                : "Avisos de Integridade"}
            </h3>

            <div
              className={`mt-2 text-sm ${
                hasErrors ? "text-red-700" : "text-yellow-700"
              }`}
            >
              {hasErrors && (
                <div className="mb-2">
                  <p className="font-medium">Erros:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {integrityResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {hasWarnings && (
                <div>
                  <p className="font-medium">Avisos:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {integrityResult.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleAutoFix}
                disabled={isFixing}
                className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                  hasErrors
                    ? "bg-red-100 text-red-800 hover:bg-red-200"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                } disabled:opacity-50`}
              >
                {isFixing ? (
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-1" />
                )}
                {isFixing ? "Corrigindo..." : "Corrigir"}
              </button>

              <button
                onClick={handleForceDataSync}
                disabled={isFixing}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${isFixing ? "animate-spin" : ""}`}
                />
                Sincronizar
              </button>
            </div>
          </div>

          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => setIsVisible(false)}
              className={`rounded-md inline-flex text-sm ${
                hasErrors
                  ? "text-red-400 hover:text-red-600"
                  : "text-yellow-400 hover:text-yellow-600"
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
