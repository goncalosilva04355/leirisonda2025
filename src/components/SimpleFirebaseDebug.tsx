import React, { useState } from "react";
import { Bug, Database, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export const SimpleFirebaseDebug: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const testFirebase = async () => {
    try {
      // Test Firebase basic functionality
      const { getApps } = await import("firebase/app");
      const apps = getApps();

      const status = {
        app: apps.length > 0,
        timestamp: new Date().toLocaleTimeString(),
      };

      console.log("🔥 Firebase Status:", status);
      alert(
        `Firebase App: ${status.app ? "✅ OK" : "❌ Falha"}\nTempo: ${status.timestamp}`,
      );
    } catch (error) {
      console.error("Firebase test error:", error);
      alert("❌ Erro ao testar Firebase");
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
          title="Debug Firebase"
        >
          <Bug className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900 flex items-center">
          <Database className="h-4 w-4 mr-2" />
          Firebase Debug (Simples)
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <button
          onClick={testFirebase}
          className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Testar Firebase
        </button>

        <div className="text-xs text-gray-600">
          <p>Esta é uma versão simplificada do debug Firebase.</p>
          <p>Clique em "Testar Firebase" para verificar o status.</p>
        </div>

        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          <strong>Nota:</strong> Se ainda tem problemas, recarregue a página.
        </div>
      </div>
    </div>
  );
};

export default SimpleFirebaseDebug;
