/**
 * Botão para reativar Firebase manualmente no iPhone
 */

import React, { useState } from "react";
import { checkFirebaseOnMobile } from "../utils/iPhoneFirebaseCheck";

export function FirebaseReactivateButton() {
  const [isReactivating, setIsReactivating] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleReactivate = async () => {
    setIsReactivating(true);
    console.log("🔄 Reativando Firebase manualmente...");

    try {
      // Aguardar um pouco para dar tempo do Firebase inicializar
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = await checkFirebaseOnMobile();
      setLastResult(result);

      if (result.overall) {
        console.log("✅ Firebase reativado com sucesso!");
        alert("✅ Firebase reativado com sucesso!");
      } else {
        console.log("⚠️ Firebase ainda não está ativo");
        alert(
          "⚠️ Firebase ainda não está completamente ativo. Verifique a conexão de internet.",
        );
      }
    } catch (error) {
      console.error("❌ Erro ao reativar Firebase:", error);
      alert("❌ Erro ao reativar Firebase. Tente novamente.");
    } finally {
      setIsReactivating(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-xs">
      <button
        onClick={handleReactivate}
        disabled={isReactivating}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium shadow-lg
          ${
            isReactivating
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white active:bg-blue-700"
          }
        `}
      >
        {isReactivating ? <>🔄 Reativando...</> : <>🔥 Reativar Firebase</>}
      </button>

      {lastResult && (
        <div className="mt-2 text-xs bg-white border rounded p-2 shadow">
          <div className="font-medium">Último teste:</div>
          <div>Auth: {lastResult.authStatus ? "✅" : "❌"}</div>
          <div>DB: {lastResult.dbStatus ? "✅" : "❌"}</div>
          <div>Status: {lastResult.overall ? "🟢 Ativo" : "🔴 Inativo"}</div>
        </div>
      )}
    </div>
  );
}
