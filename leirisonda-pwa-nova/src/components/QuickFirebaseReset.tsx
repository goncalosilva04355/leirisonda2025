import React from "react";
import { RefreshCw, Database } from "lucide-react";

export const QuickFirebaseReset: React.FC = () => {
  const resetFirebase = () => {
    // Lista de todas as flags que podem bloquear o Firebase
    const flagsToRemove = [
      "firebase-quota-exceeded",
      "firebase-quota-check-time",
      "firebase-emergency-shutdown",
      "firebase-emergency-time",
      "firebase-circuit-breaker",
      "firebase-quota-cooldown",
    ];

    console.log("🧹 Limpando todas as flags de quota do Firebase...");

    // Remover todas as flags
    flagsToRemove.forEach((flag) => {
      localStorage.removeItem(flag);
      console.log(`✅ Removida flag: ${flag}`);
    });

    // Mostrar confirmação
    alert(
      "✅ Firebase reativado! Todas as flags de quota foram removidas. Refresh da página para aplicar mudanças.",
    );

    // Refresh automático
    const shouldRefresh = confirm("Refresh da página agora?");
    if (shouldRefresh) {
      window.location.reload();
    }
  };

  const checkQuotaStatus = () => {
    console.group("🔍 DIAGNÓSTICO DE QUOTA FIREBASE");

    const flagsToCheck = [
      "firebase-quota-exceeded",
      "firebase-quota-check-time",
      "firebase-emergency-shutdown",
      "firebase-emergency-time",
    ];

    let hasBlockingFlags = false;

    flagsToCheck.forEach((flag) => {
      const value = localStorage.getItem(flag);
      if (value) {
        console.log(`🚨 ${flag}: ${value}`);
        hasBlockingFlags = true;
      } else {
        console.log(`✅ ${flag}: não definido`);
      }
    });

    if (!hasBlockingFlags) {
      console.log("✅ Nenhuma flag de bloqueio encontrada");
    } else {
      console.log(
        "⚠️ Flags de bloqueio encontradas - Firebase pode estar inativo",
      );
    }

    console.groupEnd();

    alert(
      hasBlockingFlags
        ? "⚠️ Flags de bloqueio encontradas! Verifique o console para detalhes."
        : "✅ Firebase não está bloqueado por quota",
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
      <div className="flex items-center space-x-2 mb-2">
        <Database className="text-blue-600" size={16} />
        <span className="text-sm font-medium text-gray-700">
          Firebase Tools
        </span>
      </div>

      <div className="space-y-2">
        <button
          onClick={resetFirebase}
          className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center justify-center space-x-1"
        >
          <RefreshCw size={14} />
          <span>Reativar Firebase</span>
        </button>

        <button
          onClick={checkQuotaStatus}
          className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center"
        >
          Verificar Status
        </button>
      </div>
    </div>
  );
};

export default QuickFirebaseReset;
