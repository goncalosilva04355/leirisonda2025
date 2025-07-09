/**
 * Componente para mostrar o status do Firebase na interface
 */

import React, { useState, useEffect } from "react";
import { getFirebaseStatus } from "../firebase/simpleConfig";

export function FirebaseStatusIndicator() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar se é dispositivo móvel
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);

    const checkStatus = async () => {
      try {
        const firebaseStatus = getFirebaseStatus();
        setStatus(firebaseStatus);
      } catch (error) {
        console.error("Erro ao verificar status Firebase:", error);
        setStatus({ ready: false, error: true });
      } finally {
        setLoading(false);
      }
    };

    checkStatus();

    // Verificar status a cada 10 segundos (menos frequente no mobile)
    const interval = setInterval(checkStatus, mobile ? 10000 : 5000);

    // Escutar eventos específicos do mobile
    const handleMobileReady = () => {
      setStatus((prev) => ({ ...prev, ready: true, mobile: true }));
      setLoading(false);
    };

    const handleMobileNotReady = (event: any) => {
      setStatus({ ready: false, mobile: true, details: event.detail });
      setLoading(false);
    };

    window.addEventListener("firebaseMobileReady", handleMobileReady);
    window.addEventListener("firebaseMobileNotReady", handleMobileNotReady);

    return () => {
      clearInterval(interval);
      window.removeEventListener("firebaseMobileReady", handleMobileReady);
      window.removeEventListener(
        "firebaseMobileNotReady",
        handleMobileNotReady,
      );
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm max-w-xs">
        🔄{" "}
        {isMobile
          ? "Verificando Firebase (iPhone)..."
          : "Verificando Firebase..."}
      </div>
    );
  }

  if (!status) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
        ❌ Erro ao verificar Firebase
      </div>
    );
  }

  if (status.ready) {
    return (
      <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm max-w-xs">
        ✅ Firebase Ativo {isMobile ? "(iPhone)" : ""}
        {status.db && " | DB ✓"}
        {status.auth && " | Auth ✓"}
        {status.mobile && (
          <div className="text-xs mt-1">📱 Otimizado para mobile</div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm max-w-xs">
      ❌ Firebase Inativo {isMobile ? "(iPhone)" : ""}
      <details className="mt-1">
        <summary className="cursor-pointer text-xs">
          Detalhes {isMobile ? "📱" : ""}
        </summary>
        <div className="text-xs mt-1">
          <div>App: {status.app ? "✅" : "❌"}</div>
          <div>Auth: {status.auth ? "✅" : "❌"}</div>
          <div>DB: {status.db ? "✅" : "❌"}</div>
          <div>Inicializando: {status.initializing ? "✅" : "❌"}</div>
          {isMobile && (
            <div className="text-orange-600 mt-1">📱 Modo iPhone detectado</div>
          )}
          {status.details?.errorDetails && (
            <div className="text-red-600 mt-1 text-xs">
              Erro: {status.details.errorDetails.message}
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
