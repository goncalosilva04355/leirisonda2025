/**
 * Componente para verificar e mostrar o status atual do Firebase
 */

import React, { useState } from "react";
import {
  checkFirebaseStatus,
  estimateUnblockTime,
} from "../utils/firebaseStatusCheck";

export function FirebaseStatusChecker() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    try {
      const result = await checkFirebaseStatus();
      setStatus(result);
    } catch (error) {
      setStatus({
        status: "ERROR",
        message: "❌ Erro na verificação",
        detail: "Não foi possível verificar o status do Firebase",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!status) return "bg-gray-100";
    switch (status.status) {
      case "AVAILABLE":
        return "bg-green-100 border-green-300 text-green-800";
      case "BLOCKED":
        return "bg-red-100 border-red-300 text-red-800";
      case "ERROR":
      case "CONNECTION_ERROR":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const unblockTime = estimateUnblockTime();

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Status do Firebase
        </h3>
        <button
          onClick={handleCheck}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verificando..." : "Verificar Status"}
        </button>
      </div>

      {status && (
        <div className={`p-4 rounded-md border ${getStatusColor()}`}>
          <div className="flex items-start">
            <div className="flex-1">
              <p className="font-medium">{status.message}</p>
              <p className="text-sm mt-1">{status.detail}</p>

              {status.status === "BLOCKED" && (
                <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                  <p className="text-sm font-medium text-red-800">
                    ⏰ Tempo estimado de desbloqueio:
                  </p>
                  <p className="text-sm text-red-700">
                    Entre {unblockTime.min} e {unblockTime.max}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    💡 Dica: Use o modo emergência para continuar a trabalhar
                  </p>
                </div>
              )}

              {status.status === "AVAILABLE" && (
                <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                  <p className="text-sm text-green-700">
                    🎉 Pode tentar fazer login normalmente no Firebase!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!status && (
        <div className="text-center text-gray-500 py-8">
          <p>
            Clique em "Verificar Status" para testar a conectividade com o
            Firebase
          </p>
        </div>
      )}
    </div>
  );
}
