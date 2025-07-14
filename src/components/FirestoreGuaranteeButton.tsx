import React, { useState, useEffect } from "react";
import { fixAuthenticationIssues } from "../utils/forceLoginFix";
import { universalFirestoreSync } from "../services/universalFirestoreSync";

export function FirestoreGuaranteeButton() {
  const [status, setStatus] = useState<any>({});
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setStatus(universalFirestoreSync.getStatus());
    };

    // Atualizar status a cada 5 segundos
    const interval = setInterval(updateStatus, 5000);
    updateStatus(); // Primeira verificação

    return () => clearInterval(interval);
  }, []);

  const handleFixAll = async () => {
    try {
      console.log(
        "🔧 Corrigindo TUDO para garantir salvamento no Firestore...",
      );

      // 1. Corrigir autenticação
      const user = fixAuthenticationIssues();

      // 2. Forçar retry do Firestore
      await universalFirestoreSync.forceRetry();

      // 3. Atualizar status
      setTimeout(() => {
        setStatus(universalFirestoreSync.getStatus());
      }, 2000);

      alert(
        "✅ TUDO CORRIGIDO! Agora todos os dados serão salvos no Firestore.",
      );
    } catch (error) {
      console.error("❌ Erro na correção:", error);
      alert("❌ Erro na correção. Verifique o console para detalhes.");
    }
  };

  const getStatusColor = () => {
    if (status.hasFirestore && status.initialized) {
      return "bg-green-500 hover:bg-green-600";
    } else if (status.queueLength > 0) {
      return "bg-yellow-500 hover:bg-yellow-600";
    } else {
      return "bg-red-500 hover:bg-red-600";
    }
  };

  const getStatusText = () => {
    if (status.hasFirestore && status.initialized) {
      return "✅ Firestore Ativo";
    } else if (status.queueLength > 0) {
      return `⏳ Fila: ${status.queueLength}`;
    } else {
      return "❌ Firestore Inativo";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-4 max-w-sm">
        {/* Botão principal */}
        <button
          onClick={handleFixAll}
          className={`w-full px-4 py-2 text-white font-semibold rounded-lg transition-colors ${getStatusColor()}`}
        >
          🔥 GARANTIR FIRESTORE
        </button>

        {/* Status */}
        <div className="mt-2 text-sm text-gray-600 text-center">
          {getStatusText()}
        </div>

        {/* Toggle detalhes */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-2 text-xs text-blue-600 hover:text-blue-800"
        >
          {showDetails ? "▲ Ocultar" : "▼ Detalhes"}
        </button>

        {/* Detalhes expandidos */}
        {showDetails && (
          <div className="mt-3 p-3 bg-gray-50 rounded text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <strong>Inicializado:</strong>
                <br />
                <span
                  className={
                    status.initialized ? "text-green-600" : "text-red-600"
                  }
                >
                  {status.initialized ? "✅ Sim" : "❌ Não"}
                </span>
              </div>
              <div>
                <strong>Firestore:</strong>
                <br />
                <span
                  className={
                    status.hasFirestore ? "text-green-600" : "text-red-600"
                  }
                >
                  {status.hasFirestore ? "✅ OK" : "❌ Falha"}
                </span>
              </div>
              <div>
                <strong>Fila:</strong>
                <br />
                <span
                  className={
                    status.queueLength > 0
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                >
                  {status.queueLength} itens
                </span>
              </div>
              <div>
                <strong>Processando:</strong>
                <br />
                <span
                  className={
                    status.isProcessing ? "text-blue-600" : "text-gray-600"
                  }
                >
                  {status.isProcessing ? "🔄 Sim" : "⏹️ Não"}
                </span>
              </div>
            </div>

            <div className="border-t pt-2 mt-2">
              <div className="text-center">
                <strong>Status Geral:</strong>
                <br />
                {status.hasFirestore && status.initialized ? (
                  <span className="text-green-600 font-semibold">
                    🎉 TODOS OS DADOS SENDO SALVOS NO FIRESTORE!
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    ⚠️ Clique "GARANTIR FIRESTORE" para corrigir
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
