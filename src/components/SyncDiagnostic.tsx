import React, { useState, useEffect } from "react";
import { realFirebaseService } from "../services/realFirebaseService";
// import { authService } from "../services/authService"; // Removed - no longer exists
import { useDataSync } from "../hooks/useDataSync";

interface SyncDiagnosticProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SyncDiagnostic: React.FC<SyncDiagnosticProps> = ({
  isVisible,
  onClose,
}) => {
  const [diagnosticData, setDiagnosticData] = useState<any>({});
  const [testWork, setTestWork] = useState({
    title: "Teste de Sincronização",
    description: "Obra criada para testar sincronização entre dispositivos",
    client: "Cliente Teste",
    location: "Local Teste",
    type: "Manutenção",
    status: "pending",
    startDate: new Date().toISOString().split("T")[0],
    assignedTo: "Sistema",
    budget: 100,
  });

  const { addWork, works, syncWithFirebase } = useDataSync();

  useEffect(() => {
    if (isVisible) {
      loadDiagnosticData();
    }
  }, [isVisible]);

  const loadDiagnosticData = async () => {
    try {
      // const currentUser = authService.getCurrentUserProfile(); // Service not available
      const currentUser = null;
      const firebaseStatus = {
        isInitialized: realFirebaseService.initialize(),
        isReady: realFirebaseService.isReady(),
        canConnect: false,
      };

      try {
        firebaseStatus.canConnect = await realFirebaseService.testConnection();
      } catch (error) {
        firebaseStatus.canConnect = false;
      }

      const localData = {
        works: JSON.parse(localStorage.getItem("works") || "[]"),
        currentUser: JSON.parse(localStorage.getItem("currentUser") || "null"),
        isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
      };

      let firebaseData = { works: [], users: [] };
      if (firebaseStatus.isReady) {
        try {
          const syncData = await realFirebaseService.syncAllData();
          firebaseData = (syncData as { works: any[]; users: any[] }) || {
            works: [],
            users: [],
          };
        } catch (error) {
          console.warn("Failed to get Firebase data:", error);
        }
      }

      setDiagnosticData({
        currentUser,
        firebaseStatus,
        localData,
        firebaseData,
        localWorksCount: localData.works.length,
        firebaseWorksCount: firebaseData.works.length,
        syncedWorksCount: works.length,
      });
    } catch (error) {
      console.error("Diagnostic error:", error);
    }
  };

  const testCreateWork = async () => {
    try {
      console.log("🧪 Testing work creation...");

      const workData = {
        ...testWork,
        title: `${testWork.title} - ${new Date().toLocaleTimeString()}`,
      };

      console.log("📝 Creating work with data:", workData);

      await addWork(workData);

      console.log("✅ Work created successfully");

      // Wait a moment then reload diagnostic data
      setTimeout(() => {
        loadDiagnosticData();
        alert("Obra criada! Verifique nos outros dispositivos se aparece.");
      }, 1000);
    } catch (error) {
      console.error("❌ Failed to create test work:", error);
      alert(`Erro ao criar obra: ${error}`);
    }
  };

  const forceFirebaseSync = async () => {
    try {
      console.log("🔄 Forcing Firebase sync...");
      await syncWithFirebase();
      setTimeout(loadDiagnosticData, 1000);
      alert("Sincronização forçada concluída!");
    } catch (error) {
      console.error("❌ Sync failed:", error);
      alert(`Erro na sincronização: ${error}`);
    }
  };

  const testFirebaseConnection = async () => {
    try {
      const isReady = realFirebaseService.isReady();
      const canConnect = await realFirebaseService.testConnection();

      alert(`Firebase Ready: ${isReady}\nCan Connect: ${canConnect}`);
    } catch (error) {
      alert(`Connection test failed: ${error}`);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Diagnóstico de Sincronização</h2>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              Fechar
            </button>
          </div>

          {/* Test Actions */}
          <div className="mb-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">Ações de Teste</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium">
                  Título da Obra:
                </label>
                <input
                  type="text"
                  value={testWork.title}
                  onChange={(e) =>
                    setTestWork({ ...testWork, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Cliente:</label>
                <input
                  type="text"
                  value={testWork.client}
                  onChange={(e) =>
                    setTestWork({ ...testWork, client: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={testCreateWork}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                🧪 Criar Obra Teste
              </button>
              <button
                onClick={forceFirebaseSync}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                🔄 Forçar Sincronização
              </button>
              <button
                onClick={testFirebaseConnection}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                🔥 Testar Firebase
              </button>
              <button
                onClick={loadDiagnosticData}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                🔄 Atualizar
              </button>
            </div>
          </div>

          {/* Current User */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Utilizador Atual:</h3>
            <div className="bg-gray-100 p-3 rounded">
              {diagnosticData.currentUser ? (
                <div>
                  <p>
                    <strong>Nome:</strong> {diagnosticData.currentUser.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {diagnosticData.currentUser.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {diagnosticData.currentUser.role}
                  </p>
                  <p>
                    <strong>UID:</strong> {diagnosticData.currentUser.uid}
                  </p>
                </div>
              ) : (
                <p>Nenhum utilizador logado</p>
              )}
            </div>
          </div>

          {/* Sync Status */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Estado da Sincronização:</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm font-medium">Local (localStorage)</p>
                <p className="text-lg font-bold">
                  {diagnosticData.localWorksCount || 0} obras
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm font-medium">Firebase (cloud)</p>
                <p className="text-lg font-bold">
                  {diagnosticData.firebaseWorksCount || 0} obras
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm font-medium">App (sincronizado)</p>
                <p className="text-lg font-bold">
                  {diagnosticData.syncedWorksCount || 0} obras
                </p>
              </div>
            </div>
          </div>

          {/* Firebase Status */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Estado do Firebase:</h3>
            <div className="bg-gray-100 p-3 rounded">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm">Inicializado:</p>
                  <p
                    className={`font-bold ${diagnosticData.firebaseStatus?.isInitialized ? "text-green-600" : "text-red-600"}`}
                  >
                    {diagnosticData.firebaseStatus?.isInitialized
                      ? "✅ Sim"
                      : "❌ Não"}
                  </p>
                </div>
                <div>
                  <p className="text-sm">Pronto:</p>
                  <p
                    className={`font-bold ${diagnosticData.firebaseStatus?.isReady ? "text-green-600" : "text-red-600"}`}
                  >
                    {diagnosticData.firebaseStatus?.isReady
                      ? "✅ Sim"
                      : "❌ Não"}
                  </p>
                </div>
                <div>
                  <p className="text-sm">Conectado:</p>
                  <p
                    className={`font-bold ${diagnosticData.firebaseStatus?.canConnect ? "text-green-600" : "text-red-600"}`}
                  >
                    {diagnosticData.firebaseStatus?.canConnect
                      ? "✅ Sim"
                      : "❌ Não"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                Dados Locais (últimas 3 obras):
              </h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(
                  diagnosticData.localData?.works?.slice(-3) || [],
                  null,
                  2,
                )}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Dados Firebase (últimas 3 obras):
              </h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(
                  diagnosticData.firebaseData?.works?.slice(-3) || [],
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
