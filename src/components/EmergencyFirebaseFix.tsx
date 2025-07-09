import React, { useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export const EmergencyFirebaseFix: React.FC = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [fixResult, setFixResult] = useState<string | null>(null);

  const performEmergencyFix = async () => {
    setIsFixing(true);
    setFixResult(null);

    try {
      console.log("🚨 EMERGENCY FIREBASE FIX - Starting complete reset...");

      // Step 1: Clear all possible caches
      console.log("🧹 Step 1: Clearing all caches...");

      // Clear localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.includes("firebase") ||
            key.includes("firestore") ||
            key.includes("auth") ||
            key.includes("_firebase"))
        ) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
      console.log(`🗑️ Cleared ${keysToRemove.length} localStorage keys`);

      // Clear sessionStorage
      sessionStorage.clear();
      console.log("🗑️ Cleared sessionStorage");

      // Step 2: Force delete Firebase apps
      console.log("🧹 Step 2: Deleting Firebase apps...");
      try {
        const { getApps, deleteApp } = await import("firebase/app");
        const apps = getApps();

        for (const app of apps) {
          await deleteApp(app);
        }
        console.log(`🗑️ Deleted ${apps.length} Firebase apps`);
      } catch (error) {
        console.warn("⚠️ Error deleting apps:", error);
      }

      // Step 3: Wait for cleanup
      console.log("⏰ Step 3: Waiting for cleanup...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 4: Use iOS-specific fix
      console.log("🍎 Step 4: Applying iOS-specific fix...");
      const { IOSFirebaseFix } = await import("../firebase/iosFirebaseFix");
      const iosSuccess = await IOSFirebaseFix.forceFirebaseClear();

      if (iosSuccess) {
        setFixResult("✅ Correção bem-sucedida! A recarregar página...");

        // Wait a moment then refresh page
        setTimeout(() => {
          console.log("🔄 Reloading page to complete fix...");
          window.location.reload();
        }, 2000);
      } else {
        setFixResult(
          "❌ Correção falhou. Pode precisar de verificar a conectividade à internet.",
        );
      }
    } catch (error: any) {
      console.error("💥 Emergency fix failed:", error);
      setFixResult(`❌ Erro durante a correção: ${error.message}`);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
        <h3 className="text-lg font-semibold text-red-900">
          🚨 Correção de Emergência Firebase
        </h3>
      </div>

      <div className="text-sm text-red-800 mb-4">
        <p className="mb-2">
          <strong>Use apenas se o database continuar indisponível.</strong>
        </p>
        <p className="mb-2">Esta correção vai:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Limpar completamente o cache do Firebase</li>
          <li>Reinicar todos os serviços</li>
          <li>Aplicar configurações específicas para iOS/Safari</li>
          <li>Recarregar a página automaticamente</li>
        </ul>
      </div>

      {fixResult && (
        <div
          className={`mb-4 p-3 rounded-md ${
            fixResult.includes("✅")
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-100 border border-red-300 text-red-800"
          }`}
        >
          {fixResult}
        </div>
      )}

      <button
        onClick={performEmergencyFix}
        disabled={isFixing}
        className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 flex items-center justify-center font-bold"
      >
        {isFixing ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />A executar
            correção de emergência...
          </>
        ) : (
          <>
            <AlertTriangle className="h-4 w-4 mr-2" />
            🚨 CORREÇÃO DE EMERGÊNCIA
          </>
        )}
      </button>

      <div className="mt-3 text-xs text-red-600">
        <strong>Nota:</strong> Esta operação vai recarregar a página
        automaticamente após a correção.
      </div>
    </div>
  );
};

export default EmergencyFirebaseFix;
