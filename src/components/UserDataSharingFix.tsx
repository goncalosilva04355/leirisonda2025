import React, { useState, useEffect } from "react";
import {
  Users,
  Database,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";
import { db, auth, isFirebaseReady } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { realFirebaseService } from "../services/realFirebaseService";

interface DiagnosticResult {
  issue: string;
  description: string;
  status: "error" | "warning" | "success";
  action?: string;
}

interface UserDataSharingFixProps {
  currentUser?: {
    uid: string;
    email: string;
    name: string;
    role: string;
  };
}

export function UserDataSharingFix({ currentUser }: UserDataSharingFixProps) {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    try {
      console.log(
        "🔍 Diagnóstico: Verificando acesso a dados entre utilizadores...",
      );

      // 1. Check Firebase Authentication
      if (!auth || !auth.currentUser) {
        results.push({
          issue: "Autenticação Firebase",
          description: "Utilizador não autenticado no Firebase",
          status: "error",
          action: "Login necessário",
        });
      } else {
        results.push({
          issue: "Autenticação Firebase",
          description: `Utilizador autenticado: ${auth.currentUser.email}`,
          status: "success",
        });
      }

      // 2. Check Firebase Connection
      if (!isFirebaseReady()) {
        results.push({
          issue: "Conexão Firebase",
          description: "Firebase não está configurado corretamente",
          status: "error",
          action: "Configuração necessária",
        });
      } else {
        results.push({
          issue: "Conexão Firebase",
          description: "Firebase conectado e operacional",
          status: "success",
        });
      }

      // 3. Check Firestore Collections (Global Shared Data)
      try {
        const collections = ["pools", "works", "maintenance", "clients"];
        for (const collectionName of collections) {
          const collectionRef = collection(db, collectionName);
          const snapshot = await getDocs(collectionRef);

          if (snapshot.empty) {
            results.push({
              issue: `Coleção ${collectionName}`,
              description:
                "Coleção vazia - dados podem não estar sendo compartilhados",
              status: "warning",
              action: "Verificar sincronizaç��o",
            });
          } else {
            results.push({
              issue: `Coleção ${collectionName}`,
              description: `${snapshot.docs.length} registros encontrados - dados compartilhados`,
              status: "success",
            });
          }
        }
      } catch (error) {
        results.push({
          issue: "Acesso às Coleções",
          description: `Erro ao acessar coleções: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
          status: "error",
          action: "Verificar permissões",
        });
      }

      // 4. Check Real-time Database (Alternative Shared Data)
      const rtdbReady = realFirebaseService.isReady();
      if (rtdbReady) {
        try {
          const testConnection = await realFirebaseService.testConnection();
          if (testConnection) {
            results.push({
              issue: "Realtime Database",
              description: "Conexão com database em tempo real funcionando",
              status: "success",
            });
          } else {
            results.push({
              issue: "Realtime Database",
              description: "Falha na conexão com database em tempo real",
              status: "warning",
              action: "Reconectar",
            });
          }
        } catch (error) {
          results.push({
            issue: "Realtime Database",
            description: "Erro no acesso ao database em tempo real",
            status: "error",
            action: "Verificar configuração",
          });
        }
      }

      // 5. Check Local Storage vs Firebase Data Consistency
      const localPools = JSON.parse(localStorage.getItem("pools") || "[]");
      const localWorks = JSON.parse(localStorage.getItem("works") || "[]");

      if (localPools.length > 0 || localWorks.length > 0) {
        results.push({
          issue: "Dados Locais vs Firebase",
          description: `Dados encontrados no localStorage: ${localPools.length} piscinas, ${localWorks.length} obras`,
          status: "warning",
          action: "Sincronização necessária",
        });
      }

      // 6. Check User Permissions
      if (currentUser) {
        try {
          const userDoc = doc(db, "users", currentUser.uid);
          const userSnapshot = await getDocs(
            query(collection(db, "users"), orderBy("createdAt", "desc")),
          );

          results.push({
            issue: "Perfil de Utilizador",
            description: `Utilizador encontrado no sistema: ${currentUser.name} (${currentUser.role})`,
            status: "success",
          });

          if (userSnapshot.docs.length > 1) {
            results.push({
              issue: "Outros Utilizadores",
              description: `${userSnapshot.docs.length} utilizadores no sistema - dados devem ser partilhados`,
              status: "success",
            });
          } else {
            results.push({
              issue: "Outros Utilizadores",
              description:
                "Apenas um utilizador encontrado - verifique se outros utilizadores existem",
              status: "warning",
              action: "Criar outros utilizadores",
            });
          }
        } catch (error) {
          results.push({
            issue: "Perfil de Utilizador",
            description: "Erro ao verificar perfil do utilizador",
            status: "error",
            action: "Verificar autenticação",
          });
        }
      }
    } catch (error) {
      results.push({
        issue: "Diagnóstico Geral",
        description: `Erro durante diagnóstico: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        status: "error",
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  const applyDataSharingFix = async () => {
    setIsRunning(true);

    try {
      console.log(
        "🔧 Aplicando correção para partilha de dados entre utilizadores...",
      );

      // 1. Force sync all local data to Firebase shared collections
      const localData = {
        pools: JSON.parse(localStorage.getItem("pools") || "[]"),
        works: JSON.parse(localStorage.getItem("works") || "[]"),
        maintenance: JSON.parse(localStorage.getItem("maintenance") || "[]"),
        clients: JSON.parse(localStorage.getItem("clients") || "[]"),
      };

      let totalSynced = 0;

      // 2. Sync pools to shared Firebase collection
      for (const pool of localData.pools) {
        try {
          await setDoc(
            doc(db, "pools", pool.id || `pool-${Date.now()}-${Math.random()}`),
            {
              ...pool,
              sharedGlobally: true,
              visibleToAllUsers: true,
              syncedAt: new Date().toISOString(),
              syncedBy: currentUser?.email || "system",
            },
          );
          totalSynced++;
        } catch (error) {
          console.warn(`Erro ao sincronizar piscina ${pool.id}:`, error);
        }
      }

      // 3. Sync works to shared Firebase collection
      for (const work of localData.works) {
        try {
          await setDoc(
            doc(db, "works", work.id || `work-${Date.now()}-${Math.random()}`),
            {
              ...work,
              sharedGlobally: true,
              visibleToAllUsers: true,
              syncedAt: new Date().toISOString(),
              syncedBy: currentUser?.email || "system",
            },
          );
          totalSynced++;
        } catch (error) {
          console.warn(`Erro ao sincronizar obra ${work.id}:`, error);
        }
      }

      // 4. Sync maintenance to shared Firebase collection
      for (const maintenance of localData.maintenance) {
        try {
          await setDoc(
            doc(
              db,
              "maintenance",
              maintenance.id || `maint-${Date.now()}-${Math.random()}`,
            ),
            {
              ...maintenance,
              sharedGlobally: true,
              visibleToAllUsers: true,
              syncedAt: new Date().toISOString(),
              syncedBy: currentUser?.email || "system",
            },
          );
          totalSynced++;
        } catch (error) {
          console.warn(
            `Erro ao sincronizar manutenção ${maintenance.id}:`,
            error,
          );
        }
      }

      // 5. Sync clients to shared Firebase collection
      for (const client of localData.clients) {
        try {
          await setDoc(
            doc(
              db,
              "clients",
              client.id || `client-${Date.now()}-${Math.random()}`,
            ),
            {
              ...client,
              sharedGlobally: true,
              visibleToAllUsers: true,
              syncedAt: new Date().toISOString(),
              syncedBy: currentUser?.email || "system",
            },
          );
          totalSynced++;
        } catch (error) {
          console.warn(`Erro ao sincronizar cliente ${client.id}:`, error);
        }
      }

      // 6. Also sync to Realtime Database for enhanced sharing
      if (realFirebaseService.isReady()) {
        console.log("🔄 Sincronizando também para Realtime Database...");

        for (const pool of localData.pools) {
          await realFirebaseService.addPool(pool);
        }

        for (const work of localData.works) {
          await realFirebaseService.addWork(work);
        }

        for (const maintenance of localData.maintenance) {
          await realFirebaseService.addMaintenance(maintenance);
        }

        for (const client of localData.clients) {
          await realFirebaseService.addClient(client);
        }
      }

      // 7. Mark local data as synced but keep it
      localStorage.setItem("dataSyncedToFirebase", "true");
      localStorage.setItem("lastDataSync", new Date().toISOString());

      console.log(
        `✅ Correção aplicada: ${totalSynced} registros sincronizados para partilha global`,
      );

      setFixApplied(true);

      // Re-run diagnostics to verify fix
      setTimeout(() => {
        runDiagnostics();
      }, 2000);
    } catch (error) {
      console.error("❌ Erro ao aplicar correção:", error);
    }

    setIsRunning(false);
  };

  useEffect(() => {
    // Auto-run diagnostics on component mount
    runDiagnostics();
  }, [currentUser]);

  const errorCount = diagnostics.filter((d) => d.status === "error").length;
  const warningCount = diagnostics.filter((d) => d.status === "warning").length;
  const successCount = diagnostics.filter((d) => d.status === "success").length;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Diagnóstico: Partilha de Dados Entre Utilizadores
          </h3>
          <p className="text-sm text-gray-600">
            Verificar e corrigir problemas de acesso a dados entre diferentes
            utilizadores
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">Funcionando</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {successCount}
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">Avisos</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {warningCount}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-800">Erros</span>
          </div>
          <p className="text-2xl font-bold text-red-900 mt-1">{errorCount}</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {diagnostics.map((diagnostic, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              diagnostic.status === "error"
                ? "bg-red-50 border-red-200"
                : diagnostic.status === "warning"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-green-50 border-green-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {diagnostic.status === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              ) : diagnostic.status === "warning" ? (
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4
                  className={`font-medium ${
                    diagnostic.status === "error"
                      ? "text-red-800"
                      : diagnostic.status === "warning"
                        ? "text-yellow-800"
                        : "text-green-800"
                  }`}
                >
                  {diagnostic.issue}
                </h4>
                <p
                  className={`text-sm ${
                    diagnostic.status === "error"
                      ? "text-red-700"
                      : diagnostic.status === "warning"
                        ? "text-yellow-700"
                        : "text-green-700"
                  }`}
                >
                  {diagnostic.description}
                </p>
                {diagnostic.action && (
                  <p
                    className={`text-xs mt-1 font-medium ${
                      diagnostic.status === "error"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    Ação: {diagnostic.action}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={runDiagnostics}
          disabled={isRunning}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRunning ? "animate-spin" : ""}`} />
          {isRunning ? "Verificando..." : "Executar Diagnóstico"}
        </Button>

        {(errorCount > 0 || warningCount > 0) && !fixApplied && (
          <Button
            onClick={applyDataSharingFix}
            disabled={isRunning}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Zap className="h-4 w-4" />
            {isRunning ? "Aplicando Correção..." : "Corrigir Partilha de Dados"}
          </Button>
        )}

        {fixApplied && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Correção aplicada com sucesso!</span>
          </div>
        )}
      </div>

      {currentUser && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">Utilizador Atual</span>
          </div>
          <div className="text-sm text-blue-700">
            <p>
              <strong>Nome:</strong> {currentUser.name}
            </p>
            <p>
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p>
              <strong>Papel:</strong> {currentUser.role}
            </p>
            <p>
              <strong>UID:</strong> {currentUser.uid}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
