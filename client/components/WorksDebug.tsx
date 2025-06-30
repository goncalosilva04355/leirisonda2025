import React, { useState } from "react";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, Refresh, Database, Users } from "lucide-react";

export function WorksDebug() {
  const { works, syncData, createWork, isOnline, isSyncing } =
    useFirebaseSync();
  const { user, getAllUsers } = useAuth();
  const [showLocalStorage, setShowLocalStorage] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleDebugCheck = () => {
    // Verificar localStorage
    const localWorks = localStorage.getItem("works");
    const localUsers = localStorage.getItem("users");
    const allUsers = getAllUsers();

    // Filtrar obras atribuídas ao Alexandre
    const alexandreUser = allUsers.find(
      (u) => u.email === "alexkamaryta@gmail.com",
    );
    const worksAssignedToAlexandre =
      works?.filter(
        (work) =>
          work.assignedUsers &&
          work.assignedUsers.includes(alexandreUser?.id || ""),
      ) || [];

    setDebugInfo({
      currentUser: user,
      alexandre: alexandreUser,
      totalWorks: works?.length || 0,
      worksAssignedToAlexandre: worksAssignedToAlexandre.length,
      assignedWorksDetails: worksAssignedToAlexandre,
      lastWorks: works?.slice(0, 3) || [],
      localStorageWorks: localWorks ? JSON.parse(localWorks).length : 0,
      localStorageUsers: localUsers ? JSON.parse(localUsers).length : 0,
      allUsersCount: allUsers.length,
      isOnline,
      isSyncing,
    });
    setShowLocalStorage(true);
  };

  const handleForceSync = async () => {
    try {
      await syncData();
      console.log("Sync forçado concluído");
      handleDebugCheck(); // Atualizar info após sync
    } catch (error) {
      console.error("Erro no sync forçado:", error);
    }
  };

  const handleCreateTestWork = async () => {
    try {
      const allUsers = getAllUsers();
      const alexandreUser = allUsers.find(
        (u) => u.email === "alexkamaryta@gmail.com",
      );

      if (!alexandreUser) {
        console.error("Usuário Alexandre não encontrado");
        return;
      }

      const testWork = {
        workSheetNumber: `TEST-${Date.now()}`,
        type: "piscina" as const,
        clientName: "Cliente Teste para Alexandre",
        address: "Rua Teste, 123, Leiria",
        contact: "244 123 456",
        entryTime: new Date().toISOString(),
        status: "pendente" as const,
        vehicles: ["Carrinha Teste"],
        technicians: ["Técnico Teste"],
        assignedUsers: [alexandreUser.id], // Atribuir ao Alexandre
        photos: [],
        observations: "Obra de teste criada pelo debug",
        workPerformed: "Teste de atribuição",
        workSheetCompleted: false,
      };

      console.log("Criando obra teste para Alexandre:", testWork);
      const workId = await createWork(testWork);
      console.log("Obra teste criada com ID:", workId);

      // Verificar dados após criação
      setTimeout(() => {
        handleDebugCheck();
      }, 1000);
    } catch (error) {
      console.error("Erro ao criar obra teste:", error);
    }
  };

  if (!user || user.email !== "gongonsilva@gmail.com") {
    return null; // Só mostrar para Gonçalo
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
          <Database className="w-4 h-4 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Debug de Obras</h3>
      </div>

      <div className="flex space-x-2">
        <Button onClick={handleDebugCheck} variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Verificar Dados
        </Button>
        <Button
          onClick={handleForceSync}
          variant="outline"
          disabled={isSyncing}
        >
          <Refresh className="w-4 h-4 mr-2" />
          {isSyncing ? "Sincronizando..." : "Forçar Sync"}
        </Button>
      </div>

      {debugInfo && (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Status:</strong> {isOnline ? "Online" : "Offline"}{" "}
                  {isSyncing && "(Sincronizando)"}
                </div>
                <div>
                  <strong>Total de Obras:</strong> {debugInfo.totalWorks}
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

          {debugInfo.alexandre && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Usuário Alexandre:</strong>
                  </div>
                  <div>ID: {debugInfo.alexandre.id}</div>
                  <div>Email: {debugInfo.alexandre.email}</div>
                  <div>Nome: {debugInfo.alexandre.name}</div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {debugInfo.assignedWorksDetails.length > 0 && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Obras Atribuídas ao Alexandre:</strong>
                  </div>
                  {debugInfo.assignedWorksDetails.map((work: any) => (
                    <div key={work.id} className="bg-blue-50 p-2 rounded">
                      <div>Folha: {work.workSheetNumber}</div>
                      <div>Cliente: {work.clientName}</div>
                      <div>Status: {work.status}</div>
                      <div>
                        Criada: {new Date(work.createdAt).toLocaleString()}
                      </div>
                      <div>
                        Atribuída a:{" "}
                        {work.assignedUsers?.join(", ") || "Ninguém"}
                      </div>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {debugInfo.lastWorks.length > 0 && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Últimas 3 Obras Criadas:</strong>
                  </div>
                  {debugInfo.lastWorks.map((work: any) => (
                    <div key={work.id} className="bg-gray-50 p-2 rounded">
                      <div>Folha: {work.workSheetNumber}</div>
                      <div>Cliente: {work.clientName}</div>
                      <div>Status: {work.status}</div>
                      <div>
                        Criada: {new Date(work.createdAt).toLocaleString()}
                      </div>
                      <div>
                        Atribuída a:{" "}
                        {work.assignedUsers?.join(", ") || "Ninguém"}
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
