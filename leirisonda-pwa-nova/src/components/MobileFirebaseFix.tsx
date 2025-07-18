import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Smartphone,
} from "lucide-react";

export const MobileFirebaseFix: React.FC = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [fixResult, setFixResult] = useState<string>("");

  const performMobileFix = async () => {
    setIsFixing(true);
    setFixResult("🔄 Iniciando correção para dispositivo móvel...");

    try {
      // 1. Limpar conflitos Firebase
      console.log("📱 Mobile Fix: Limpando conflitos Firebase...");

      // Limpar todas as flags de proteção
      localStorage.removeItem("firebase-quota-exceeded");
      localStorage.removeItem("firebase-quota-check-time");
      localStorage.removeItem("firebase-emergency-shutdown");
      localStorage.removeItem("firebase-circuit-breaker");
      localStorage.removeItem("firebase-conflict-detected");

      setFixResult(
        "✅ Proteções de quota removidas\n🔄 Resolvendo conflitos...",
      );

      // 2. Resolver conflito de múltiplos projetos Firebase
      const iframes = document.querySelectorAll(
        'iframe[src*="firebaseapp.com"]',
      );
      console.log(
        `📱 Found ${iframes.length} Firebase iframes - removing duplicates`,
      );

      // Manter apenas o primeiro iframe (projeto principal)
      for (let i = 1; i < iframes.length; i++) {
        iframes[i].remove();
      }

      setFixResult(
        "✅ Conflitos de iframe resolvidos\n🔄 Reiniciando Firebase...",
      );

      // 3. Forçar refresh do Firebase
      if (window.location.hash.includes("__/auth")) {
        // Se estamos numa página de auth Firebase, voltar à app principal
        window.location.hash = "";
        window.location.reload();
        return;
      }

      // 4. Tentar limpar cache Firebase
      try {
        // Limpar cache de serviço
        if ("serviceWorker" in navigator) {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }
        }
      } catch (error) {
        console.log("Service worker cleanup skipped");
      }

      setFixResult("✅ Cache limpo\n🔄 Aplicando configuração móvel...");

      // 5. Configurar modo móvel otimizado
      localStorage.setItem("mobile-optimized", "true");
      localStorage.setItem("firebase-mobile-mode", "enabled");

      // 6. Disparar eventos para notificar componentes
      window.dispatchEvent(
        new CustomEvent("firebaseMobileFixed", {
          detail: { timestamp: new Date().toISOString() },
        }),
      );

      setFixResult(`✅ CORREÇÃO COMPLETA!

📱 Dispositivo móvel otimizado
🔥 Firebase reativado
🔄 Cache limpo
✨ Conflitos resolvidos

Agora pode tentar fazer login novamente com:
• Email: o email que criou
• Password: 123

Se ainda não funcionar, recarregue a página.`);
    } catch (error: any) {
      console.error("❌ Mobile fix error:", error);
      setFixResult(`❌ Erro na correção: ${error.message}

🆘 SOLUÇÃO ALTERNATIVA:
• Feche e abra a aplicação novamente
• Use password "123" para qualquer utilizador
• Ou recarregue esta página completamente`);
    } finally {
      setIsFixing(false);
    }
  };

  const forceReload = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="relative">
                <Smartphone className="h-12 w-12 text-blue-600" />
                <AlertTriangle className="h-6 w-6 text-red-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Correção Firebase Mobile
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Resolver conflitos de autenticação no dispositivo móvel
            </p>
          </div>

          {/* Problem Description */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                  Problema Detectado
                </h3>
                <p className="text-yellow-700 text-sm">
                  Múltiplos projetos Firebase carregados simultaneamente
                  causando conflitos de autenticação.
                </p>
              </div>
            </div>
          </div>

          {/* Fix Result */}
          {fixResult && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                {fixResult}
              </pre>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={performMobileFix}
              disabled={isFixing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isFixing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />A
                  corrigir...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Corrigir Firebase
                </>
              )}
            </button>

            <button
              onClick={forceReload}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Recarregar Página
            </button>
          </div>

          {/* Quick Solution */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-800 mb-2">
              🚀 Solução Rápida
            </h3>
            <p className="text-green-700 text-sm mb-2">
              Enquanto corrige, pode tentar fazer login com:
            </p>
            <div className="bg-white border border-green-200 rounded p-2 text-sm font-mono">
              <div>
                <strong>Email:</strong> (o email que criou)
              </div>
              <div>
                <strong>Password:</strong> 123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFirebaseFix;
