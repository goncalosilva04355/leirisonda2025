/**
 * Controle manual do Firebase - sem getImmediate errors
 */

import React, { useState, useEffect } from "react";
import { UltimateSimpleFirebase } from "../firebase/ultimateSimpleFirebase";

export function ManualFirebaseControl() {
  const [status, setStatus] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [showControl, setShowControl] = useState(true);

  const updateStatus = () => {
    const currentStatus = UltimateSimpleFirebase.getStatus();
    setStatus(currentStatus);
  };

  useEffect(() => {
    updateStatus();

    // Atualizar status a cada 5 segundos
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleManualInit = async () => {
    setIsInitializing(true);
    setTestResults(null);

    try {
      console.log("🚀 Iniciando Firebase com UltimateSimpleFirebase...");
      const success = await UltimateSimpleFirebase.simpleInit();

      updateStatus();

      if (success) {
        console.log("✅ Inicialização UltimateSimple bem-sucedida");

        // Executar teste de conectividade
        console.log("🧪 Executando teste de conectividade...");
        const firestoreWorks = await UltimateSimpleFirebase.testFirestore();

        setTestResults({
          canRead: firestoreWorks,
          canWrite: firestoreWorks,
          error: firestoreWorks ? undefined : "Firestore não funcional",
        });
      } else {
        setTestResults({
          canRead: false,
          canWrite: false,
          error: "Inicialização falhou",
        });
      }
    } catch (error) {
      console.error("❌ Erro na inicialização UltimateSimple:", error);
      setTestResults({
        canRead: false,
        canWrite: false,
        error: `Erro: ${error}`,
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleTest = async () => {
    console.log("🧪 Executando teste de conectividade UltimateSimple...");
    const firestoreWorks = await UltimateSimpleFirebase.testFirestore();

    setTestResults({
      canRead: firestoreWorks,
      canWrite: firestoreWorks,
      error: firestoreWorks ? undefined : "Firestore não funcional",
    });
  };

  if (!showControl) return null;

  return (
    <div className="fixed top-32 right-4 max-w-xs z-40">
      <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-green-600">🟢 Firebase Simples</h3>
          <button
            onClick={() => setShowControl(false)}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
        </div>

        {status && (
          <div className="mb-3 text-xs space-y-1">
            <div>Ready: {status.ready ? "✅" : "❌"}</div>
            <div>App: {status.hasApp ? "✅" : "❌"}</div>
            <div>Auth: {status.hasAuth ? "✅" : "❌"}</div>
            <div>DB: {status.hasDB ? "✅" : "❌"}</div>
            <div>Checked: {status.checked ? "✅" : "❌"}</div>
          </div>
        )}

        <div className="space-y-2">
          {!status?.ready && (
            <button
              onClick={handleManualInit}
              disabled={isInitializing}
              className={`w-full px-3 py-2 rounded text-sm font-medium ${
                isInitializing
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isInitializing
                ? "🔄 Inicializando..."
                : "🟢 Inicializar Simples"}
            </button>
          )}

          {status?.ready && (
            <div className="space-y-2">
              <button
                onClick={handleTest}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium"
              >
                🧪 Testar Conectividade
              </button>

              <button
                onClick={async () => {
                  console.log("🔄 Reset completo do Firebase...");
                  UltimateSimpleFirebase.reset();
                  updateStatus();
                  setTestResults(null);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm font-medium"
              >
                🔄 Reset Sistema
              </button>
            </div>
          )}
        </div>

        {testResults && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
            <div className="font-medium mb-1">Teste de Conectividade:</div>
            <div>Leitura: {testResults.canRead ? "✅" : "❌"}</div>
            <div>Escrita: {testResults.canWrite ? "✅" : "❌"}</div>
            {testResults.error && (
              <div className="text-red-600 mt-1">Erro: {testResults.error}</div>
            )}

            {testResults.canRead && testResults.canWrite && (
              <div className="mt-2 p-2 bg-green-100 rounded text-green-800">
                🎉 Firebase totalmente funcional!
              </div>
            )}
          </div>
        )}

        <div className="mt-3 text-xs text-gray-600">
          Sistema Firebase Ultra-Simples. Uma só tentativa, aguarda 5 segundos.
        </div>
      </div>
    </div>
  );
}
