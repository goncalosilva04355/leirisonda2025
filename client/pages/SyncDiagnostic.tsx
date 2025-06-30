import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Users,
  Database,
  Wifi,
  WifiOff,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";
import { firebaseService } from "@/services/FirebaseService";

export function SyncDiagnostic() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    works,
    maintenances,
    users,
    isOnline,
    isSyncing,
    lastSync,
    syncData,
  } = useFirebaseSync();
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);

  useEffect(() => {
    runDiagnostic();
  }, []);

  const runDiagnostic = async () => {
    setIsRunningDiagnostic(true);

    try {
      console.log("🔍 EXECUTANDO DIAGNÓSTICO COMPLETO DE SINCRONIZAÇÃO...");

      // 1. Verificar dados locais
      const localWorks = JSON.parse(localStorage.getItem("works") || "[]");
      const localMaintenances = JSON.parse(
        localStorage.getItem("pool_maintenances") || "[]",
      );
      const localUsers = JSON.parse(localStorage.getItem("users") || "[]");

      // 2. Verificar backups
      const backupWorks1 = JSON.parse(
        localStorage.getItem("leirisonda_works") || "[]",
      );
      const backupWorks2 = JSON.parse(
        sessionStorage.getItem("temp_works") || "[]",
      );

      // 3. Verificar status Firebase
      const firebaseStatus = firebaseService.getFirebaseStatus();

      // 4. Verificar dados do Firebase (se disponível)
      let firebaseWorks = [];
      let firebaseMaintenances = [];
      let firebaseUsers = [];
      let firebaseError = null;

      if (firebaseStatus.isAvailable) {
        try {
          firebaseWorks = await firebaseService.getWorks();
          firebaseMaintenances = await firebaseService.getMaintenances();
          firebaseUsers = await firebaseService.getUsers();
        } catch (error) {
          firebaseError = error;
        }
      }

      // 5. Verificar atribuições de obras
      const worksWithAssignments = localWorks.filter(
        (w: any) => w.assignedUsers && w.assignedUsers.length > 0,
      );

      const alexandreWorks = localWorks.filter(
        (w: any) =>
          w.assignedUsers && w.assignedUsers.includes("user_alexandre"),
      );

      // 6. Verificar metadados de sincronização
      const lastUpdateMeta = localStorage.getItem("works_metadata");
      let lastUpdateData = null;
      if (lastUpdateMeta) {
        try {
          lastUpdateData = JSON.parse(lastUpdateMeta);
        } catch {}
      }

      // 7. Verificar cross-device updates
      const lastDeviceUpdate = localStorage.getItem("leirisonda_last_update");
      let lastDeviceData = null;
      if (lastDeviceUpdate) {
        try {
          lastDeviceData = JSON.parse(lastDeviceUpdate);
        } catch {}
      }

      const diagnostic = {
        timestamp: new Date().toISOString(),
        user: {
          isLoggedIn: !!user,
          userEmail: user?.email,
          userId: user?.id,
        },
        network: {
          isOnline,
          isSyncing,
          lastSync: lastSync?.toISOString(),
        },
        firebase: {
          ...firebaseStatus,
          error: firebaseError?.message,
          worksCount: firebaseWorks.length,
          maintenancesCount: firebaseMaintenances.length,
          usersCount: firebaseUsers.length,
        },
        localData: {
          works: localWorks.length,
          maintenances: localMaintenances.length,
          users: localUsers.length,
          worksWithAssignments: worksWithAssignments.length,
          alexandreWorks: alexandreWorks.length,
        },
        backups: {
          leirisondaWorks: backupWorks1.length,
          tempWorks: backupWorks2.length,
          emergencyWorks: 0, // Contar obras de emergência se existirem
        },
        sync: {
          lastUpdateData,
          lastDeviceData,
          crossDeviceUpdatesDetected: !!lastDeviceData,
        },
        comparison: {
          localVsFirebase: localWorks.length - firebaseWorks.length,
          syncedFromHook: works.length,
          discrepancy: Math.abs(localWorks.length - works.length),
        },
        assignments: {
          total: worksWithAssignments.length,
          forAlexandre: alexandreWorks.length,
          detailedAssignments: alexandreWorks.map((w: any) => ({
            id: w.id,
            client: w.clientName,
            workSheet: w.workSheetNumber,
            created: w.createdAt,
            assignedUsers: w.assignedUsers,
          })),
        },
      };

      // Contar obras de emergência
      let emergencyCount = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("emergency_work_")) {
          emergencyCount++;
        }
      }
      diagnostic.backups.emergencyWorks = emergencyCount;

      setDiagnosticData(diagnostic);
      console.log("✅ DIAGNÓSTICO COMPLETO:", diagnostic);
    } catch (error) {
      console.error("❌ Erro no diagnóstico:", error);
      setDiagnosticData({ error: error.message });
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  const forceSyncWithFirebase = async () => {
    if (syncData) {
      console.log("🔄 FORÇANDO SINCRONIZAÇÃO MANUAL...");
      await syncData();
      setTimeout(runDiagnostic, 2000); // Re-run diagnostic after sync
    }
  };

  const testCrossDeviceSync = async () => {
    console.log("🔄 TESTANDO SINCRONIZAÇÃO ENTRE DISPOSITIVOS...");

    // Create a test marker in localStorage
    const testMarker = {
      type: "sync_test",
      timestamp: new Date().toISOString(),
      device: navigator.userAgent.substring(0, 50),
      user: user?.email,
      testId: Math.random().toString(36).substr(2, 9),
    };

    localStorage.setItem("leirisonda_sync_test", JSON.stringify(testMarker));

    // Trigger cross-device notification
    window.dispatchEvent(
      new CustomEvent("leirisonda_sync_trigger", {
        detail: { source: "manual_test", testId: testMarker.testId },
      }),
    );

    console.log("📡 Teste de sincronização enviado:", testMarker.testId);
    setTimeout(runDiagnostic, 3000);
  };

  if (
    !user ||
    (user.role !== "admin" && user.email !== "gongonsilva@gmail.com")
  ) {
    return (
      <div className="p-6 max-w-md mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Acesso Negado
          </h2>
          <p className="text-red-600">
            Apenas administradores podem acessar o diagnóstico de sincronização.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Diagnóstico de Sincronização
              </h1>
              <p className="text-gray-600">
                Verificação completa da sincronização entre utilizadores
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={testCrossDeviceSync} variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              Testar Cross-Device
            </Button>
            <Button onClick={forceSyncWithFirebase} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Forçar Sync
            </Button>
            <Button onClick={runDiagnostic} disabled={isRunningDiagnostic}>
              {isRunningDiagnostic ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Atualizar
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`bg-white p-4 rounded-lg border ${isOnline ? "border-green-200" : "border-red-200"}`}
          >
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-600" />
              )}
              <span className={isOnline ? "text-green-600" : "text-red-600"}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          <div
            className={`bg-white p-4 rounded-lg border ${isSyncing ? "border-blue-200" : "border-gray-200"}`}
          >
            <div className="flex items-center space-x-2">
              <Activity
                className={`w-5 h-5 ${isSyncing ? "text-blue-600" : "text-gray-400"}`}
              />
              <span className={isSyncing ? "text-blue-600" : "text-gray-600"}>
                {isSyncing ? "Sincronizando..." : "Standby"}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">
                {lastSync ? new Date(lastSync).toLocaleTimeString() : "Nunca"}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">{works.length} obras</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Results */}
        {diagnosticData && (
          <div className="space-y-6">
            {/* Firebase Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                Status Firebase
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  {diagnosticData.firebase.isAvailable ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                  <span>
                    Disponível:{" "}
                    {diagnosticData.firebase.isAvailable ? "Sim" : "Não"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Obras Firebase: </span>
                  <span className="font-mono">
                    {diagnosticData.firebase.worksCount}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Manutenções Firebase: </span>
                  <span className="font-mono">
                    {diagnosticData.firebase.maintenancesCount}
                  </span>
                </div>
              </div>
              {diagnosticData.firebase.error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-600 text-sm">
                    Erro: {diagnosticData.firebase.error}
                  </p>
                </div>
              )}
            </div>

            {/* Data Comparison */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Comparação de Dados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600">Local vs Firebase:</p>
                  <p
                    className={`font-mono text-lg ${diagnosticData.comparison.localVsFirebase === 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {diagnosticData.comparison.localVsFirebase > 0 ? "+" : ""}
                    {diagnosticData.comparison.localVsFirebase}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Hook vs Local:</p>
                  <p
                    className={`font-mono text-lg ${diagnosticData.comparison.discrepancy === 0 ? "text-green-600" : "text-orange-600"}`}
                  >
                    {diagnosticData.comparison.discrepancy}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Dados do Hook:</p>
                  <p className="font-mono text-lg text-blue-600">
                    {diagnosticData.comparison.syncedFromHook}
                  </p>
                </div>
              </div>
            </div>

            {/* Assignment Analysis */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Análise de Atribuições
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Obras com atribuições:</p>
                  <p className="font-mono text-lg text-blue-600">
                    {diagnosticData.assignments.total}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Obras para Alexandre:</p>
                  <p className="font-mono text-lg text-green-600">
                    {diagnosticData.assignments.forAlexandre}
                  </p>
                </div>
              </div>

              {diagnosticData.assignments.detailedAssignments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">
                    Obras atribuídas a Alexandre:
                  </h4>
                  <div className="space-y-2">
                    {diagnosticData.assignments.detailedAssignments.map(
                      (work: any) => (
                        <div
                          key={work.id}
                          className="p-3 bg-green-50 border border-green-200 rounded"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{work.client}</p>
                              <p className="text-sm text-gray-600">
                                Folha: {work.workSheet}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                {new Date(work.created).toLocaleString()}
                              </p>
                              <p className="text-xs text-blue-600">
                                {work.assignedUsers.join(", ")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cross-Device Sync */}
            {diagnosticData.sync.lastDeviceData && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Último Update Cross-Device
                </h3>
                <div className="bg-gray-50 p-4 rounded">
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(
                      diagnosticData.sync.lastDeviceData,
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>
            )}

            {/* Raw Diagnostic Data */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Dados Completos do Diagnóstico
              </h3>
              <div className="bg-gray-50 p-4 rounded overflow-x-auto">
                <pre className="text-xs">
                  {JSON.stringify(diagnosticData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {isRunningDiagnostic && (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Executando diagnóstico completo...</p>
          </div>
        )}
      </div>
    </div>
  );
}
