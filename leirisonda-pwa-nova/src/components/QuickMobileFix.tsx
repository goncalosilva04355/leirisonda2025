import React, { useState } from "react";
import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { mobileFirebaseQuickFix } from "../utils/mobileFirebaseQuickFix";

interface QuickMobileFixProps {
  onFixApplied?: () => void;
}

export const QuickMobileFix: React.FC<QuickMobileFixProps> = ({
  onFixApplied,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [fixResult, setFixResult] = useState<string>("");

  const applyQuickFix = async () => {
    setIsApplying(true);
    setFixResult("");

    try {
      const result = mobileFirebaseQuickFix.applyQuickFix();
      setFixResult(result.message);

      if (result.success && onFixApplied) {
        setTimeout(() => {
          onFixApplied();
        }, 2000);
      }
    } catch (error: any) {
      setFixResult(`❌ Erro: ${error.message}`);
    } finally {
      setIsApplying(false);
    }
  };

  const applyFullReset = async () => {
    if (
      !confirm(
        "⚠️ ATENÇÃO: Isto vai limpar TODAS as configurações Firebase. Continuar?",
      )
    ) {
      return;
    }

    setIsApplying(true);
    try {
      const result = mobileFirebaseQuickFix.applyFullReset();
      setFixResult(result.message);

      if (result.success && onFixApplied) {
        setTimeout(() => {
          onFixApplied();
        }, 2000);
      }
    } catch (error: any) {
      setFixResult(`❌ Reset falhou: ${error.message}`);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
      <div className="flex items-start space-x-2">
        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-orange-800 font-medium mb-2">
            📱 Problema Firebase detectado no dispositivo móvel
          </p>
          <p className="text-orange-700 text-xs mb-3">
            Múltiplos projetos Firebase carregados. Isto pode impedir o login.
          </p>

          {/* Result Message */}
          {fixResult && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <pre className="text-blue-800 whitespace-pre-wrap">
                {fixResult}
              </pre>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={applyQuickFix}
              disabled={isApplying}
              className="w-full bg-orange-600 text-white py-2 px-3 rounded-md hover:bg-orange-700 disabled:opacity-50 text-xs font-medium flex items-center justify-center space-x-1"
            >
              {isApplying ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>A corrigir...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3" />
                  <span>Corrigir Agora</span>
                </>
              )}
            </button>

            <button
              onClick={applyFullReset}
              disabled={isApplying}
              className="w-full bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 disabled:opacity-50 text-xs font-medium"
            >
              🚨 Reset Completo
            </button>

            <div className="bg-green-50 border border-green-200 rounded p-2">
              <p className="text-green-800 font-medium text-xs mb-1">
                💡 Solução alternativa:
              </p>
              <p className="text-green-700 text-xs">
                Use password{" "}
                <code className="bg-green-100 px-1 rounded">123</code> para
                qualquer utilizador
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickMobileFix;
