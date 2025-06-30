import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";
import { firebaseService } from "@/services/FirebaseService";
import { Work, PoolMaintenance, User } from "@shared/types";
import {
  ArrowLeft,
  RefreshCw,
  Database,
  AlertCircle,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

export function DataSyncDiagnostic() {
  const { user } = useAuth();
  const {
    works: syncedWorks,
    maintenances: syncedMaintenances,
    users: syncedUsers,
    isOnline,
    isSyncing,
    lastSync,
    isFirebaseAvailable,
    syncData,
  } = useFirebaseSync();

  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [localData, setLocalData] = useState<{
    works: Work[];
    maintenances: PoolMaintenance[];
    users: User[];
  }>({
    works: [],
    maintenances: [],
    users: [],
  });
  const [firebaseData, setFirebaseData] = useState<{
    works: Work[];
    maintenances: PoolMaintenance[];
    users: User[];
  }>({
    works: [],
    maintenances: [],
    users: [],
  });

  useEffect(() => {
    runDiagnostic();
  }, []);

  const loadLocalData = () => {
    try {
      const works = JSON.parse(localStorage.getItem("works") || "[]");
      const maintenances = JSON.parse(
        localStorage.getItem("pool_maintenances") || "[]",
      );
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      return { works, maintenances, users };
    } catch (error) {
      console.error("Erro ao carregar dados locais:", error);
      return { works: [], maintenances: [], users: [] };
    }
  };

  const loadFirebaseData = async () => {
    if (!isFirebaseAvailable || !isOnline) {
      return { works: [], maintenances: [], users: [] };
    }

    try {
      const [works, maintenances, users] = await Promise.all([
        firebaseService.getWorks(),
        firebaseService.getMaintenances(),
        firebaseService.getUsers(),
      ]);

      return { works, maintenances, users };
    } catch (error) {
      console.error("Erro ao carregar dados do Firebase:", error);
      return { works: [], maintenances: [], users: [] };
    }
  };

  const runDiagnostic = async () => {
    setIsLoading(true);
    console.log("🔍 Iniciando diagnóstico de sincronização de dados...");

    try {
      // Carregar dados locais
      const local = loadLocalData();
      setLocalData(local);

      // Carregar dados do Firebase
      const firebase = await loadFirebaseData();
      setFirebaseData(firebase);

      // Analisar diferenças
      const results = {
        timestamp: new Date().toISOString(),
        online: isOnline,
        firebaseAvailable: isFirebaseAvailable,
        lastSync: lastSync?.toISOString() || null,
        isSyncing,
        summary: {
          localWorks: local.works.length,
          firebaseWorks: firebase.works.length,
          localMaintenances: local.maintenances.length,
          firebaseMaintenances: firebase.maintenances.length,
          localUsers: local.users.length,
          firebaseUsers: firebase.users.length,
        },
        missingInFirebase: {
          works: local.works.filter(
            (lw) => !firebase.works.find((fw) => fw.id === lw.id),
          ),
          maintenances: local.maintenances.filter(
            (lm) => !firebase.maintenances.find((fm) => fm.id === lm.id),
          ),
          users: local.users.filter(
            (lu) => !firebase.users.find((fu) => fu.id === lu.id),
          ),
        },
        missingInLocal: {
          works: firebase.works.filter(
            (fw) => !local.works.find((lw) => lw.id === fw.id),
          ),
          maintenances: firebase.maintenances.filter(
            (fm) => !local.maintenances.find((lm) => lm.id === fm.id),
          ),
          users: firebase.users.filter(
            (fu) => !local.users.find((lu) => lu.id === fu.id),
          ),
        },
        syncedData: {
          works: syncedWorks.length,
          maintenances: syncedMaintenances.length,
          users: syncedUsers.length,
        },
        recommendations: [],
      };

      // Gerar recomendações
      if (results.missingInFirebase.works.length > 0) {
        results.recommendations.push({
          type: "warning",
          message: `⚠️ ${results.missingInFirebase.works.length} obras existem localmente mas não no Firebase`,
          action: "Fazer upload para o Firebase",
          data: results.missingInFirebase.works,
        });
      }

      if (results.missingInFirebase.maintenances.length > 0) {
        results.recommendations.push({
          type: "warning",
          message: `⚠️ ${results.missingInFirebase.maintenances.length} manutenções existem localmente mas não no Firebase`,
          action: "Fazer upload para o Firebase",
          data: results.missingInFirebase.maintenances,
        });
      }

      if (results.missingInLocal.works.length > 0) {
        results.recommendations.push({
          type: "info",
          message: `ℹ️ ${results.missingInLocal.works.length} obras existem no Firebase mas não localmente`,
          action: "Fazer download do Firebase",
          data: results.missingInLocal.works,
        });
      }

      if (results.missingInLocal.maintenances.length > 0) {
        results.recommendations.push({
          type: "info",
          message: `ℹ️ ${results.missingInLocal.maintenances.length} manutenções existem no Firebase mas não localmente`,
          action: "Fazer download do Firebase",
          data: results.missingInLocal.maintenances,
        });
      }

      if (
        results.missingInFirebase.works.length === 0 &&
        results.missingInFirebase.maintenances.length === 0 &&
        results.missingInLocal.works.length === 0 &&
        results.missingInLocal.maintenances.length === 0
      ) {
        results.recommendations.push({
          type: "success",
          message: "✅ Todos os dados estão sincronizados corretamente",
          action: "Nenhuma ação necessária",
        });
      }

      if (!isOnline) {
        results.recommendations.push({
          type: "error",
          message: "❌ Dispositivo está offline",
          action: "Verificar ligação à internet",
        });
      }

      if (!isFirebaseAvailable) {
        results.recommendations.push({
          type: "error",
          message: "❌ Firebase não disponível",
          action: "Verificar configuração do Firebase",
        });
      }

      setDiagnosticResults(results);
      console.log("🔍 Diagnóstico completado:", results);
    } catch (error) {
      console.error("❌ Erro durante diagnóstico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const forceSync = async () => {
    setIsLoading(true);
    console.log("🔄 Forçando sincronização completa...");

    try {
      await syncData();
      alert("✅ Sincronização forçada completada!");
      await runDiagnostic();
    } catch (error) {
      console.error("❌ Erro na sincronização forçada:", error);
      alert("❌ Erro na sincronização: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFromFirebase = async () => {
    if (!isFirebaseAvailable || !isOnline) {
      alert("❌ Firebase não disponível ou offline");
      return;
    }

    setIsLoading(true);
    console.log("⬇️ Fazendo download completo do Firebase...");

    try {
      // Carregar todos os dados do Firebase
      const [works, maintenances, users] = await Promise.all([
        firebaseService.getWorks(),
        firebaseService.getMaintenances(),
        firebaseService.getUsers(),
      ]);

      // Sobrescrever dados locais
      localStorage.setItem("works", JSON.stringify(works));
      localStorage.setItem("pool_maintenances", JSON.stringify(maintenances));
      localStorage.setItem("users", JSON.stringify(users));

      alert(
        `✅ Download completado!\n- ${works.length} obras\n- ${maintenances.length} manutenções\n- ${users.length} utilizadores`,
      );
      await runDiagnostic();
    } catch (error) {
      console.error("❌ Erro no download:", error);
      alert("❌ Erro no download: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadToFirebase = async () => {
    if (!isFirebaseAvailable || !isOnline) {
      alert("❌ Firebase não disponível ou offline");
      return;
    }

    setIsLoading(true);
    console.log("⬆️ Fazendo upload completo para o Firebase...");

    try {
      // Carregar dados locais
      const local = loadLocalData();

      // Upload obras
      for (const work of local.works) {
        try {
          await firebaseService.updateWork(work.id, work);
        } catch (error) {
          console.log("Criando nova obra:", work.id);
          await firebaseService.createWork(work);
        }
      }

      // Upload manutenções
      for (const maintenance of local.maintenances) {
        try {
          await firebaseService.updateMaintenance(maintenance.id, maintenance);
        } catch (error) {
          console.log("Criando nova manutenção:", maintenance.id);
          await firebaseService.createMaintenance(maintenance);
        }
      }

      // Upload utilizadores (apenas os criados dinamicamente)
      const globalUsers = ["gongonsilva@gmail.com", "alexkamaryta@gmail.com"];
      const dynamicUsers = local.users.filter(
        (u) => !globalUsers.includes(u.email),
      );

      for (const user of dynamicUsers) {
        try {
          await firebaseService.updateUser(user.id, user);
        } catch (error) {
          console.log("Criando novo utilizador:", user.id);
          await firebaseService.createUser(user);
        }
      }

      alert(
        `✅ Upload completado!\n- ${local.works.length} obras\n- ${local.maintenances.length} manutenções\n- ${dynamicUsers.length} utilizadores dinâmicos`,
      );
      await runDiagnostic();
    } catch (error) {
      console.error("❌ Erro no upload:", error);
      alert("❌ Erro no upload: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLocalData = async () => {
    if (
      !confirm(
        "⚠️ ATENÇÃO: Isto vai apagar TODOS os dados locais!\n\nTens a certeza? Esta ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    try {
      localStorage.removeItem("works");
      localStorage.removeItem("pool_maintenances");
      localStorage.removeItem("users");

      // Manter apenas os utilizadores globais
      const globalUsers = [
        {
          id: "global-goncalo",
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Fonseca",
          role: "admin",
          permissions: {
            canEdit: true,
            canDelete: true,
            canViewReports: true,
            canManageUsers: true,
            canViewUsers: true,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: "global-alexandre",
          email: "alexkamaryta@gmail.com",
          name: "Alexandre Fernandes",
          role: "user",
          permissions: {
            canEdit: true,
            canDelete: false,
            canViewReports: true,
            canManageUsers: false,
            canViewUsers: false,
          },
          createdAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem("users", JSON.stringify(globalUsers));

      // Restaurar passwords
      localStorage.setItem("password_global-goncalo", "19867gsf");
      localStorage.setItem("password_gongonsilva@gmail.com", "19867gsf");
      localStorage.setItem("password_global-alexandre", "69alexandre");
      localStorage.setItem("password_alexkamaryta@gmail.com", "69alexandre");

      alert("✅ Dados locais limpos e utilizadores globais restaurados!");
      await runDiagnostic();
    } catch (error) {
      console.error("❌ Erro ao limpar dados:", error);
      alert("❌ Erro ao limpar dados: " + error);
    }
  };

  if (!user) {
    return (
      <div className="leirisonda-main">
        <div className="max-w-md mx-auto mt-20 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-4">É necessário estar autenticado.</p>
          <Link
            to="/login"
            className="btn-leirisonda inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Ir para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="leirisonda-main">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <Link
              to="/dashboard"
              className="btn-leirisonda bg-gray-500 hover:bg-gray-600 inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Voltar
            </Link>
            <div>
              <h1 className="page-title">
                <Database className="h-8 w-8 text-blue-600" />
                Diagnóstico de Sincronização de Dados
              </h1>
              <p className="page-subtitle">
                Diagnosticar e resolver problemas de sincronização entre
                dispositivos
              </p>
            </div>
          </div>
          <div className="page-header-actions">
            <button
              onClick={runDiagnostic}
              disabled={isLoading}
              className="btn-leirisonda-secondary inline-flex items-center gap-2"
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
              {isLoading ? "A diagnosticar..." : "Executar Diagnóstico"}
            </button>
          </div>
        </div>

        {/* Status de Conectividade */}
        <div className="card-leirisonda mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-green-600" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-600" />
                )}
                <span className={isOnline ? "text-green-600" : "text-red-600"}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isFirebaseAvailable ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span>
                  Firebase:{" "}
                  {isFirebaseAvailable ? "Disponível" : "Indisponível"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isSyncing ? (
                  <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-gray-400" />
                )}
                <span>{isSyncing ? "A sincronizar..." : "Inativo"}</span>
              </div>
              {lastSync && (
                <div className="text-sm text-gray-500">
                  Última sync: {lastSync.toLocaleString("pt-PT")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resultados do Diagnóstico */}
        {diagnosticResults && (
          <div className="space-y-6">
            {/* Resumo */}
            <div className="card-leirisonda">
              <h3 className="text-lg font-semibold mb-4">Resumo dos Dados</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="stat-card-leirisonda stat-card-primary">
                  <div className="text-2xl font-bold text-blue-600">
                    {diagnosticResults.summary.localWorks}
                  </div>
                  <div className="text-sm text-gray-600">Obras Locais</div>
                </div>
                <div className="stat-card-leirisonda stat-card-secondary">
                  <div className="text-2xl font-bold text-teal-600">
                    {diagnosticResults.summary.firebaseWorks}
                  </div>
                  <div className="text-sm text-gray-600">Obras Firebase</div>
                </div>
                <div className="stat-card-leirisonda stat-card-primary">
                  <div className="text-2xl font-bold text-blue-600">
                    {diagnosticResults.summary.localMaintenances}
                  </div>
                  <div className="text-sm text-gray-600">Manut. Locais</div>
                </div>
                <div className="stat-card-leirisonda stat-card-secondary">
                  <div className="text-2xl font-bold text-teal-600">
                    {diagnosticResults.summary.firebaseMaintenances}
                  </div>
                  <div className="text-sm text-gray-600">Manut. Firebase</div>
                </div>
                <div className="stat-card-leirisonda stat-card-success">
                  <div className="text-2xl font-bold text-green-600">
                    {diagnosticResults.syncedData.works}
                  </div>
                  <div className="text-sm text-gray-600">Obras Sync</div>
                </div>
                <div className="stat-card-leirisonda stat-card-success">
                  <div className="text-2xl font-bold text-green-600">
                    {diagnosticResults.syncedData.maintenances}
                  </div>
                  <div className="text-sm text-gray-600">Manut. Sync</div>
                </div>
              </div>
            </div>

            {/* Recomendações */}
            <div className="card-leirisonda">
              <h3 className="text-lg font-semibold mb-4">Diagnóstico</h3>
              <div className="space-y-3">
                {diagnosticResults.recommendations.map(
                  (rec: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        rec.type === "error"
                          ? "bg-red-50 border-red-200 text-red-800"
                          : rec.type === "warning"
                            ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                            : rec.type === "success"
                              ? "bg-green-50 border-green-200 text-green-800"
                              : "bg-blue-50 border-blue-200 text-blue-800"
                      }`}
                    >
                      <div className="font-medium">{rec.message}</div>
                      <div className="text-sm mt-1">{rec.action}</div>
                      {rec.data && rec.data.length > 0 && (
                        <div className="mt-2 text-xs bg-white bg-opacity-50 p-2 rounded">
                          {rec.data.slice(0, 3).map((item: any) => (
                            <div key={item.id}>
                              • {item.title || item.location || item.name} (
                              {item.id})
                            </div>
                          ))}
                          {rec.data.length > 3 && (
                            <div>... e mais {rec.data.length - 3}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Ações de Correção */}
            <div className="card-leirisonda">
              <h3 className="text-lg font-semibold mb-4">Ações de Correção</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={forceSync}
                  disabled={isLoading || !isOnline || !isFirebaseAvailable}
                  className="btn-leirisonda justify-center"
                >
                  <RefreshCw size={16} />
                  Sincronização Forçada
                </button>

                <button
                  onClick={downloadFromFirebase}
                  disabled={isLoading || !isOnline || !isFirebaseAvailable}
                  className="btn-leirisonda-secondary justify-center"
                >
                  <Download size={16} />
                  Download do Firebase
                </button>

                <button
                  onClick={uploadToFirebase}
                  disabled={isLoading || !isOnline || !isFirebaseAvailable}
                  className="btn-leirisonda bg-green-600 hover:bg-green-700 justify-center"
                >
                  <Upload size={16} />
                  Upload para Firebase
                </button>

                <button
                  onClick={clearLocalData}
                  disabled={isLoading}
                  className="btn-leirisonda bg-red-600 hover:bg-red-700 justify-center"
                >
                  <Trash2 size={16} />
                  Limpar Dados Locais
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded">
                <strong>💡 Soluções Recomendadas:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong>Dados em falta no telefone:</strong> Use "Download
                    do Firebase" para trazer todos os dados para este
                    dispositivo
                  </li>
                  <li>
                    <strong>
                      Dados criados não aparecem noutros dispositivos:
                    </strong>{" "}
                    Use "Upload para Firebase" para enviar dados locais
                  </li>
                  <li>
                    <strong>Problemas de sincronização:</strong> Use
                    "Sincronização Forçada" para tentar resolver automaticamente
                  </li>
                  <li>
                    <strong>Dados corruptos ou duplicados:</strong> Use "Limpar
                    Dados Locais" (cuidado: remove tudo exceto utilizadores
                    globais)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
