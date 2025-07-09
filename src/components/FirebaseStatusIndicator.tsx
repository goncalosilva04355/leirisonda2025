/**
 * Componente para mostrar o status do Firebase na interface
 */

import React, { useState, useEffect } from "react";
import { getFirebaseStatus } from "../firebase/simpleConfig";

export function FirebaseStatusIndicator() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    // Verificar status a cada 5 segundos
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm">
        🔄 Verificando Firebase...
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
      <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm">
        ✅ Firebase Ativo
        {status.db && " | DB ✓"}
        {status.auth && " | Auth ✓"}
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
      ❌ Firebase Inativo
      <details className="mt-1">
        <summary className="cursor-pointer text-xs">Detalhes</summary>
        <div className="text-xs mt-1">
          <div>App: {status.app ? "✅" : "❌"}</div>
          <div>Auth: {status.auth ? "✅" : "❌"}</div>
          <div>DB: {status.db ? "✅" : "❌"}</div>
          <div>Inicializando: {status.initializing ? "✅" : "❌"}</div>
        </div>
      </details>
    </div>
  );
}
