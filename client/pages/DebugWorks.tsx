import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Database, RefreshCw, Users, Eye } from "lucide-react";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DebugWorks() {
  const { works, syncData, createWork, isOnline, isSyncing } =
    useFirebaseSync();
  const { user, getAllUsers } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isCreatingTest, setIsCreatingTest] = useState(false);

  // Só permitir acesso ao Gonçalo
  if (!user || user.email !== "gongonsilva@gmail.com") {
    return (
      <div className="p-6 max-w-md mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Acesso Negado
          </h2>
          <p className="text-red-600 mb-4">
            Esta página é restrita ao administrador principal.
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    handleDebugCheck();
  }, [works]);

  const handleDebugCheck = () => {
    const allUsers = getAllUsers();
    const alexandreUser = allUsers.find(
      (u) => u.email === "alexkamaryta@gmail.com",
    );

    console.log("🔍 Debug Check iniciado");
    console.log("🔍 Total usuários:", allUsers.length);
    console.log("🔍 Usuário Alexandre:", alexandreUser);
    console.log("🔍 Total obras:", works?.length);

    const worksWithAssignments =
      works?.filter((w) => w.assignedUsers && w.assignedUsers.length > 0) || [];
    console.log("🔍 Obras com atribuições:", worksWithAssignments);

    const worksAssignedToAlexandre =
      works?.filter((work) => {
        const isAssigned =
          work.assignedUsers &&
          work.assignedUsers.includes(alexandreUser?.id || "");
        if (isAssigned) {
          console.log("✅ Obra atribuída ao Alexandre:", {
            workSheet: work.workSheetNumber,
            client: work.clientName,
            assignedTo: work.assignedUsers,
            createdAt: work.createdAt,
          });
        }
        return isAssigned;
      }) || [];

    // Verificar localStorage
    const localWorks = localStorage.getItem("works");
    const localUsers = localStorage.getItem("users");

    setDebugInfo({
      currentUser: user,
      alexandre: alexandreUser,
      totalWorks: works?.length || 0,
      worksWithAssignments: worksWithAssignments.length,
      worksAssignedToAlexandre: worksAssignedToAlexandre.length,
      assignedWorksDetails: worksAssignedToAlexandre,
      lastWorks: works?.slice(0, 5) || [],
      localStorageWorks: localWorks ? JSON.parse(localWorks).length : 0,
      localStorageUsers: localUsers ? JSON.parse(localUsers).length : 0,
      allUsersCount: allUsers.length,
      allUsers: allUsers,
      isOnline,
      isSyncing,
    });
  };

  const handleForceSync = async () => {
    try {
      console.log("🔄 Iniciando sync forçado...");
      await syncData();
      console.log("✅ Sync forçado concluído");
      handleDebugCheck();
    } catch (error) {
      console.error("❌ Erro no sync forçado:", error);
    }
  };

  const handleCreateTestWork = async () => {
    setIsCreatingTest(true);
    try {
      const allUsers = getAllUsers();
      const alexandreUser = allUsers.find(
        (u) => u.email === "alexkamaryta@gmail.com",
      );

      if (!alexandreUser) {
        console.error("❌ Usuário Alexandre não encontrado");
        alert("Usuário Alexandre não encontrado!");
        return;
      }

      const testWork = {
        workSheetNumber: `DEBUG-${Date.now()}`,
        type: "piscina" as const,
        clientName: "Cliente Teste Debug - Alexandre",
        address: "Rua Debug, 123, Leiria",
        contact: "244 999 888",
        entryTime: new Date().toISOString(),
        status: "pendente" as const,
        vehicles: ["Carrinha Debug"],
        technicians: ["Técnico Debug"],
        assignedUsers: [alexandreUser.id], // Usar o ID correto do Alexandre
        photos: [],
        observations:
          "Obra de teste criada pelo sistema de debug para verificar atribuições",
        workPerformed: "Teste de sistema de atribuição de obras",
        workSheetCompleted: false,
      };

      console.log("🔨 Criando obra teste para Alexandre:", {
        alexandreId: alexandreUser.id,
        alexandreEmail: alexandreUser.email,
        testWork,
      });

      const workId = await createWork(testWork);
      console.log("✅ Obra teste criada com ID:", workId);

      alert(`Obra teste criada com sucesso! ID: ${workId}`);

      // Aguardar um pouco e verificar dados
      setTimeout(() => {
        handleDebugCheck();
      }, 2000);
    } catch (error) {
      console.error("❌ Erro ao criar obra teste:", error);
      alert("Erro ao criar obra teste: " + error);
    } finally {
      setIsCreatingTest(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Debug de Obras</h1>
          <p className="mt-1 text-gray-600">
            Diagnóstico e teste do sistema de atribuição de obras
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Database className="w-4 h-4 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Ações de Debug
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleDebugCheck} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Verificar Dados
          </Button>
          <Button
            onClick={handleForceSync}
            variant="outline"
            disabled={isSyncing}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {isSyncing ? "Sincronizando..." : "Forçar Sync"}
          </Button>
          <Button
            onClick={handleCreateTestWork}
            variant="outline"
            disabled={isCreatingTest}
          >
            <Users className="w-4 h-4 mr-2" />
            {isCreatingTest ? "Criando..." : "Criar Obra Teste Alexandre"}
          </Button>
        </div>
      </div>

      {/* Debug Info */}
      {debugInfo && (
        <div className="space-y-4">
          {/* Status Geral */}
          <Alert>
            <AlertDescription>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Status da Conexão:</strong>{" "}
                  {debugInfo.isOnline ? "Online" : "Offline"}{" "}
                  {debugInfo.isSyncing && "(Sincronizando)"}
                </div>
                <div>
                  <strong>Total de Obras:</strong> {debugInfo.totalWorks}
                </div>
                <div>
                  <strong>Obras com Atribuições:</strong>{" "}
                  {debugInfo.worksWithAssignments}
                </div>
                <div>
                  <strong>Obras Atribuídas ao Alexandre:</strong>{" "}
                  {debugInfo.worksAssignedToAlexandre}
                </div>
                <div>
                  <strong>Usuários no Sistema:</strong>{" "}
                  {debugInfo.allUsersCount}
                </div>
                <div>
                  <strong>Obras no localStorage:</strong>{" "}
                  {debugInfo.localStorageWorks}
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Info do Alexandre */}
          {debugInfo.alexandre && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Usuário Alexandre:</strong>
                  </div>
                  <div>
                    ID: <code>{debugInfo.alexandre.id}</code>
                  </div>
                  <div>Email: {debugInfo.alexandre.email}</div>
                  <div>Nome: {debugInfo.alexandre.name}</div>
                  <div>Role: {debugInfo.alexandre.role}</div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Todos os Usuários */}
          <Alert>
            <AlertDescription>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Todos os Usuários:</strong>
                </div>
                {debugInfo.allUsers.map((user: any) => (
                  <div key={user.id} className="bg-gray-50 p-2 rounded">
                    <div>
                      ID: <code>{user.id}</code>
                    </div>
                    <div>Email: {user.email}</div>
                    <div>Nome: {user.name}</div>
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>

          {/* Obras Atribuídas ao Alexandre */}
          {debugInfo.assignedWorksDetails.length > 0 && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Obras Atribuídas ao Alexandre:</strong>
                  </div>
                  {debugInfo.assignedWorksDetails.map((work: any) => (
                    <div
                      key={work.id}
                      className="bg-blue-50 p-3 rounded border"
                    >
                      <div>
                        <strong>Folha:</strong> {work.workSheetNumber}
                      </div>
                      <div>
                        <strong>Cliente:</strong> {work.clientName}
                      </div>
                      <div>
                        <strong>Status:</strong> {work.status}
                      </div>
                      <div>
                        <strong>Criada:</strong>{" "}
                        {new Date(work.createdAt).toLocaleString()}
                      </div>
                      <div>
                        <strong>Atribuída a:</strong>{" "}
                        <code>
                          {work.assignedUsers?.join(", ") || "Ninguém"}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Últimas Obras */}
          {debugInfo.lastWorks.length > 0 && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Últimas 5 Obras Criadas:</strong>
                  </div>
                  {debugInfo.lastWorks.map((work: any) => (
                    <div
                      key={work.id}
                      className="bg-gray-50 p-3 rounded border"
                    >
                      <div>
                        <strong>Folha:</strong> {work.workSheetNumber}
                      </div>
                      <div>
                        <strong>Cliente:</strong> {work.clientName}
                      </div>
                      <div>
                        <strong>Status:</strong> {work.status}
                      </div>
                      <div>
                        <strong>Criada:</strong>{" "}
                        {new Date(work.createdAt).toLocaleString()}
                      </div>
                      <div>
                        <strong>Atribuída a:</strong>{" "}
                        <code>
                          {work.assignedUsers?.join(", ") || "Ninguém"}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
