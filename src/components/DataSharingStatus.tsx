import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Users,
  Database,
} from "lucide-react";
import { realFirebaseService } from "../services/realFirebaseService";
import { crossUserDataSync } from "../services/crossUserDataSync";

interface DataSharingStatusProps {
  onFixApplied?: () => void;
}

export function DataSharingStatus({ onFixApplied }: DataSharingStatusProps) {
  const [status, setStatus] = useState<{
    checking: boolean;
    firebase: {
      realtimeDb: { connected: boolean; dataCount: number };
      firestore: { connected: boolean; dataCount: number };
    };
    localStorage: {
      works: number;
      pools: number;
      maintenance: number;
      clients: number;
    };
    sharing: {
      isWorking: boolean;
      recommendedAction: string;
    };
  }>({
    checking: true,
    firebase: {
      realtimeDb: { connected: false, dataCount: 0 },
      firestore: { connected: false, dataCount: 0 },
    },
    localStorage: {
      works: 0,
      pools: 0,
      maintenance: 0,
      clients: 0,
    },
    sharing: {
      isWorking: false,
      recommendedAction: "",
    },
  });

  const [isFixing, setIsFixing] = useState(false);

  const checkDataSharingStatus = async () => {
    console.log("🔍 Iniciando diagnóstico de partilha de dados...");
    setStatus((prev) => ({ ...prev, checking: true }));

    try {
      // Check localStorage data
      console.log("📱 Verificando dados locais...");
      const localData = {
        works: JSON.parse(localStorage.getItem("works") || "[]").length,
        pools: JSON.parse(localStorage.getItem("pools") || "[]").length,
        maintenance: JSON.parse(localStorage.getItem("maintenance") || "[]")
          .length,
        clients: JSON.parse(localStorage.getItem("clients") || "[]").length,
      };
      console.log("📱 Dados locais encontrados:", localData);

      // Check Realtime Database (realFirebaseService)
      console.log("🔗 Verificando conexão Firebase Realtime Database...");
      let realtimeDbStatus = { connected: false, dataCount: 0 };

      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 10000),
      );

      try {
        const realtimeData = await Promise.race([
          realFirebaseService.syncAllData(),
          timeout,
        ]);

        console.log("🔗 Dados do Firebase recebidos:", realtimeData);

        if (realtimeData && typeof realtimeData === "object") {
          const data = realtimeData as any;
          realtimeDbStatus = {
            connected: true,
            dataCount:
              (data.works?.length || 0) +
              (data.pools?.length || 0) +
              (data.maintenance?.length || 0) +
              (data.clients?.length || 0),
          };
        }
      } catch (error) {
        console.warn("❌ Realtime Database check failed:", error);
        realtimeDbStatus = { connected: false, dataCount: 0 };
      }

      // Check Firestore (crossUserDataSync) - simplified check
      console.log("📊 Analisando estado da partilha...");
      let firestoreStatus = { connected: false, dataCount: 0 };
      // Note: crossUserDataSync usa Firestore, mas vamos simplificar a verificação

      // Determine sharing status
      const totalLocalData = Object.values(localData).reduce(
        (sum, count) => sum + count,
        0,
      );
      const hasLocalData = totalLocalData > 0;
      const hasRealtimeData = realtimeDbStatus.dataCount > 0;

      console.log("📊 Análise:", {
        totalLocalData,
        hasLocalData,
        hasRealtimeData,
        realtimeDbConnected: realtimeDbStatus.connected,
      });

      let sharingStatus = {
        isWorking: false,
        recommendedAction: "",
      };

      if (hasLocalData && !hasRealtimeData) {
        console.log("📋 Situação: Dados locais sem partilha");
        sharingStatus = {
          isWorking: false,
          recommendedAction: "MIGRATE_TO_REALTIME",
        };
      } else if (hasRealtimeData) {
        console.log("✅ Situação: Partilha ativa");
        sharingStatus = {
          isWorking: true,
          recommendedAction: "WORKING",
        };
      } else if (!hasLocalData && !hasRealtimeData) {
        console.log("📝 Situação: Sem dados");
        sharingStatus = {
          isWorking: true,
          recommendedAction: "NO_DATA",
        };
      }

      console.log("✅ Diagnóstico concluído");
      setStatus({
        checking: false,
        firebase: {
          realtimeDb: realtimeDbStatus,
          firestore: firestoreStatus,
        },
        localStorage: localData,
        sharing: sharingStatus,
      });
    } catch (error) {
      console.error("❌ Erro durante diagnóstico:", error);
      // Set a fallback state even on error
      setStatus({
        checking: false,
        firebase: {
          realtimeDb: { connected: false, dataCount: 0 },
          firestore: { connected: false, dataCount: 0 },
        },
        localStorage: {
          works: 0,
          pools: 0,
          maintenance: 0,
          clients: 0,
        },
        sharing: {
          isWorking: false,
          recommendedAction: "ERROR",
        },
      });
    }
  };

  const fixDataSharing = async () => {
    setIsFixing(true);
    try {
      console.log("🔧 Aplicando correção de partilha de dados...");

      // Get current user
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null",
      );

      // Migrate data to shared structure using crossUserDataSync
      const migrationResult =
        await crossUserDataSync.migrateToSharedData(currentUser);

      if (migrationResult.success) {
        console.log("✅ Migração concluída:", migrationResult);

        // Re-check status
        await checkDataSharingStatus();

        if (onFixApplied) {
          onFixApplied();
        }
      } else {
        console.error("❌ Migração falhou:", migrationResult);
      }
    } catch (error) {
      console.error("❌ Erro na correção de partilha:", error);
    } finally {
      setIsFixing(false);
    }
  };

  useEffect(() => {
    checkDataSharingStatus();
  }, []);

  const totalLocalData = Object.values(status.localStorage).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <Card className="p-4 border-l-4 border-l-blue-500">
      <div className="flex items-start gap-3">
        <Database className="w-5 h-5 text-blue-600 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-3">
            Estado da Partilha de Dados Entre Utilizadores
          </h3>

          {status.checking && (
            <div className="flex items-center gap-2 text-blue-600 mb-3">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verificando estado da partilha...</span>
            </div>
          )}

          {!status.checking && (
            <div className="space-y-3">
              {/* Status da Partilha */}
              <div
                className={`flex items-center gap-2 ${status.sharing.isWorking ? "text-green-600" : "text-orange-600"}`}
              >
                {status.sharing.isWorking ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {status.sharing.isWorking
                    ? "Partilha de dados ativa - todos os utilizadores veem os mesmos dados"
                    : "Partilha de dados não configurada - dados podem estar isolados"}
                </span>
              </div>

              {/* Detalhes dos Dados */}
              <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                <div>
                  <span className="font-medium text-gray-700">
                    Dados locais (localStorage):{" "}
                  </span>
                  <span>
                    {totalLocalData} registros ({status.localStorage.works}{" "}
                    obras, {status.localStorage.pools} piscinas,{" "}
                    {status.localStorage.maintenance} manutenções,{" "}
                    {status.localStorage.clients} clientes)
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-700">
                    Dados partilhados (Firebase):{" "}
                  </span>
                  <span>
                    {status.firebase.realtimeDb.dataCount} registros no Realtime
                    Database
                  </span>
                  {status.firebase.realtimeDb.connected ? (
                    <span className="text-green-600 ml-2">✓ Conectado</span>
                  ) : (
                    <span className="text-red-600 ml-2">✗ Não conectado</span>
                  )}
                </div>
              </div>

              {/* Ação Recomendada */}
              {status.sharing.recommendedAction === "MIGRATE_TO_REALTIME" && (
                <div className="space-y-3">
                  <div className="bg-orange-50 p-3 rounded text-sm">
                    <p className="font-medium text-orange-800 mb-1">
                      Ação necessária:
                    </p>
                    <p className="text-orange-700">
                      Os dados estão apenas no dispositivo local. Para que todos
                      os utilizadores vejam as obras, é necessário migrar para a
                      estrutura partilhada do Firebase.
                    </p>
                  </div>

                  <Button
                    onClick={fixDataSharing}
                    disabled={isFixing}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isFixing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Migrando dados...
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 mr-2" />
                        Ativar Partilha de Dados
                      </>
                    )}
                  </Button>
                </div>
              )}

              {status.sharing.recommendedAction === "NO_DATA" && (
                <div className="bg-blue-50 p-3 rounded text-sm">
                  <p className="text-blue-700">
                    Sem dados encontrados. Quando criar obras, piscinas ou
                    outros dados, eles serão automaticamente partilhados entre
                    todos os utilizadores.
                  </p>
                </div>
              )}

              {status.sharing.recommendedAction === "ERROR" && (
                <div className="bg-red-50 p-3 rounded text-sm">
                  <p className="font-medium text-red-800 mb-1">
                    Erro durante verificação:
                  </p>
                  <p className="text-red-700">
                    Ocorreu um erro ao verificar o estado da partilha. Verifique
                    a conexão e tente novamente.
                  </p>
                </div>
              )}

              <Button
                onClick={checkDataSharingStatus}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Verificar novamente
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default DataSharingStatus;
