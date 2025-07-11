import React, { useState } from "react";
import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { mobileFirebaseQuickFix } from "../utils/mobileFirebaseQuickFix";

interface QuickMobileFixProps {
  onFixApplied?: () => void;
}

export const QuickMobileFix: React.FC<QuickMobileFixProps> = ({
  onFixApplied,
}) => {
  const applyQuickFix = () => {
    try {
      // 1. Limpar todas as proteções Firebase
      localStorage.removeItem("firebase-quota-exceeded");
      localStorage.removeItem("firebase-quota-check-time");
      localStorage.removeItem("firebase-emergency-shutdown");
      localStorage.removeItem("firebase-circuit-breaker");
      localStorage.removeItem("firebase-conflict-detected");

      // 2. Remover iframes duplicados
      const firebaseIframes = document.querySelectorAll(
        'iframe[src*="firebaseapp.com"]',
      );
      console.log(
        `📱 Removing ${firebaseIframes.length - 1} duplicate Firebase iframes`,
      );

      for (let i = 1; i < firebaseIframes.length; i++) {
        firebaseIframes[i].remove();
      }

      // 3. Configurar modo móvel
      localStorage.setItem("mobile-optimized", "true");
      localStorage.setItem("firebase-mobile-mode", "enabled");

      // 4. Disparar evento de fix aplicado
      window.dispatchEvent(
        new CustomEvent("quickMobileFixApplied", {
          detail: { timestamp: new Date().toISOString() },
        }),
      );

      console.log("✅ Quick mobile fix aplicado com sucesso");

      if (onFixApplied) {
        onFixApplied();
      }

      return true;
    } catch (error) {
      console.error("❌ Erro no quick fix:", error);
      return false;
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

          <div className="space-y-2">
            <button
              onClick={applyQuickFix}
              className="w-full bg-orange-600 text-white py-2 px-3 rounded-md hover:bg-orange-700 text-xs font-medium flex items-center justify-center space-x-1"
            >
              <CheckCircle className="h-3 w-3" />
              <span>Corrigir Agora</span>
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
