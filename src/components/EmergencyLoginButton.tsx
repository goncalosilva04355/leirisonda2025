/**
 * Botão de login de emergência para quando Firebase está bloqueado
 */

import React, { useState } from "react";

interface EmergencyLoginButtonProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export function EmergencyLoginButton({ onLogin }: EmergencyLoginButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verificar se deve mostrar botão de emergência
  React.useEffect(() => {
    const checkEmergencyMode = () => {
      const isBlocked =
        (window as any).FIREBASE_BLOCKED === true ||
        localStorage.getItem("firebase_blocked") === "true";

      // Mostrar se Firebase bloqueado OU se há muitos erros
      const recentErrors = localStorage.getItem("recent_firebase_errors");
      let hasErrors = false;

      if (recentErrors) {
        try {
          const errors = JSON.parse(recentErrors);
          hasErrors = errors.length > 3;
        } catch (e) {}
      }

      setIsVisible(isBlocked || hasErrors);
    };

    checkEmergencyMode();

    // Verificar a cada 5 segundos
    const interval = setInterval(checkEmergencyMode, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEmergencyLogin = async () => {
    setLoading(true);
    try {
      // Usar credenciais padrão do admin
      await onLogin("gongonsilva@gmail.com", "123456");
    } catch (error) {
      console.error("❌ Erro no login de emergência:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="text-center">
        <h3 className="text-sm font-medium text-red-800 mb-2">
          🚨 Modo de Emergência
        </h3>
        <p className="text-xs text-red-700 mb-3">
          Firebase temporariamente indisponível
        </p>
        <button
          onClick={handleEmergencyLogin}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
        >
          {loading ? "Entrando..." : "🚨 Login de Emergência"}
        </button>
        <p className="text-xs text-red-600 mt-2">
          Utiliza apenas armazenamento local
        </p>
      </div>
    </div>
  );
}
