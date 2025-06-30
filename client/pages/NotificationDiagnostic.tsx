import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NotificationService } from "@/services/NotificationService";
import {
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Users,
  Database,
  Smartphone,
} from "lucide-react";

export function NotificationDiagnostic() {
  const { user } = useAuth();
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  // Só permitir acesso ao Gonçalo
  if (!user || user.email !== "gongonsilva@gmail.com") {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-600 mb-2">Acesso Negado</h2>
        <p className="text-gray-600">
          Esta página é restrita ao administrador principal.
        </p>
      </div>
    );
  }

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const result = await NotificationService.runDiagnostics();
      setDiagnostics(result);

      // Verificar dados de usuários
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const globalUsers = [
        {
          id: "admin_goncalo",
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Fonseca",
        },
        {
          id: "user_alexandre",
          email: "alexkamaryta@gmail.com",
          name: "Alexandre Fernandes",
        },
      ];

      const allUsers = [...storedUsers, ...globalUsers];
      const uniqueUsers = allUsers.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.id === user.id),
      );

      // Verificar obras atribuídas
      const works = JSON.parse(localStorage.getItem("works") || "[]");
      const worksWithAssignments = works.filter(
        (work: any) => work.assignedUsers && work.assignedUsers.length > 0,
      );

      // Verificar notificações pendentes
      const pendingNotifications = JSON.parse(
        localStorage.getItem("pendingNotifications") || "[]",
      );

      setDiagnostics({
        ...result,
        usersData: {
          totalUsers: uniqueUsers.length,
          users: uniqueUsers,
          storedCount: storedUsers.length,
          globalCount: globalUsers.length,
        },
        worksData: {
          totalWorks: works.length,
          worksWithAssignments: worksWithAssignments.length,
          assignmentDetails: worksWithAssignments.map((work: any) => ({
            id: work.id,
            workSheetNumber: work.workSheetNumber,
            clientName: work.clientName,
            assignedUsers: work.assignedUsers,
          })),
        },
        notificationsData: {
          pendingCount: pendingNotifications.length,
          pendingNotifications: pendingNotifications,
        },
      });
    } catch (error) {
      console.error("Erro no diagnóstico:", error);
      setDiagnostics({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testNotificationSystem = async () => {
    setIsLoading(true);
    const results: any[] = [];

    try {
      // Teste 1: Verificar suporte a notificações
      results.push({
        test: "Suporte a Notificações",
        status: NotificationService.isSupported ? "PASS" : "FAIL",
        message: NotificationService.isSupported
          ? "Navegador suporta notificações"
          : "Navegador não suporta notificações",
      });

      // Teste 2: Verificar inicialização
      results.push({
        test: "Inicialização do Serviço",
        status: NotificationService.isInitialized ? "PASS" : "FAIL",
        message: NotificationService.isInitialized
          ? "Serviço de notificações inicializado"
          : "Serviço de notificações não inicializado",
      });

      // Teste 3: Verificar permissões
      const permission =
        "Notification" in window ? Notification.permission : "denied";
      results.push({
        test: "Permissões de Notificação",
        status: permission === "granted" ? "PASS" : "WARN",
        message: `Permissão: ${permission}`,
      });

      // Teste 4: Teste de notificação local
      try {
        await NotificationService.showLocalNotification({
          title: "🧪 Teste de Notificação",
          body: "Esta é uma notificação de teste do sistema Leirisonda",
          icon: "/leirisonda-icon.svg",
        });
        results.push({
          test: "Notificação Local",
          status: "PASS",
          message: "Notificação local enviada com sucesso",
        });
      } catch (error) {
        results.push({
          test: "Notificação Local",
          status: "FAIL",
          message: `Erro: ${error.message}`,
        });
      }

      // Teste 5: Verificar obras atribuídas para Alexandre
      try {
        const alexandreWorks =
          await NotificationService.checkPendingAssignedWorks("user_alexandre");
        results.push({
          test: "Obras Atribuídas (Alexandre)",
          status: "PASS",
          message: `Encontradas ${alexandreWorks.length} obras atribuídas ao Alexandre`,
        });
      } catch (error) {
        results.push({
          test: "Obras Atribuídas (Alexandre)",
          status: "FAIL",
          message: `Erro: ${error.message}`,
        });
      }

      setTestResults(results);
    } catch (error) {
      results.push({
        test: "Sistema Geral",
        status: "FAIL",
        message: `Erro crítico: ${error.message}`,
      });
      setTestResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestWork = async () => {
    try {
      const testWork = {
        id: `test_work_${Date.now()}`,
        workSheetNumber: `TEST-${Date.now()}`,
        clientName: "Cliente Teste",
        assignedUsers: ["user_alexandre"],
        type: "teste",
        address: "Endereço Teste",
        contact: "123456789",
        status: "pendente",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entryTime: new Date().toISOString(),
        vehicles: [],
        technicians: [],
        photos: [],
      };

      // Simular notificação de obra atribuída
      await NotificationService.notifyWorkAssigned(testWork, [
        "user_alexandre",
      ]);

      alert("Obra teste criada e notificação enviada para Alexandre!");
      runDiagnostics();
    } catch (error) {
      alert(`Erro ao criar obra teste: ${error.message}`);
    }
  };

  const clearNotificationData = () => {
    if (
      confirm("Tem certeza que deseja limpar todos os dados de notificação?")
    ) {
      localStorage.removeItem("pendingNotifications");
      localStorage.removeItem("lastNotificationBroadcast");
      localStorage.removeItem("lastWorkAssignmentNotification");
      localStorage.removeItem("lastNotificationUpdate");
      alert("Dados de notificação limpos!");
      runDiagnostics();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Diagnóstico de Notificações
          </h1>
          <p className="text-gray-600 mt-1">
            Ferramentas de diagnóstico para resolver problemas de notificações
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runDiagnostics}
            disabled={isLoading}
            variant="outline"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
          <Button onClick={testNotificationSystem} disabled={isLoading}>
            <Bell className="w-4 h-4 mr-2" />
            Testar Sistema
          </Button>
        </div>
      </div>

      {/* Status Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          {diagnostics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    diagnostics.isSupported ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {diagnostics.isSupported ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <p className="font-medium">Suportado</p>
                <p className="text-sm text-gray-600">
                  {diagnostics.isSupported ? "Sim" : "Não"}
                </p>
              </div>
              <div className="text-center">
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    diagnostics.isInitialized ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {diagnostics.isInitialized ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <p className="font-medium">Inicializado</p>
                <p className="text-sm text-gray-600">
                  {diagnostics.isInitialized ? "Sim" : "Não"}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 bg-blue-100">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-medium">Pendentes</p>
                <p className="text-sm text-gray-600">
                  {diagnostics.pendingNotifications || 0}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Carregando diagnóstico...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dados dos Usuários */}
      {diagnostics?.usersData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Dados dos Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {diagnostics.usersData.totalUsers}
                  </p>
                  <p className="text-sm text-gray-600">Total de Usuários</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {diagnostics.usersData.storedCount}
                  </p>
                  <p className="text-sm text-gray-600">Armazenados</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {diagnostics.usersData.globalCount}
                  </p>
                  <p className="text-sm text-gray-600">Globais</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Lista de Usuários:</h4>
                <div className="space-y-2">
                  {diagnostics.usersData.users.map(
                    (user: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {user.id}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dados das Obras */}
      {diagnostics?.worksData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Dados das Obras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {diagnostics.worksData.totalWorks}
                  </p>
                  <p className="text-sm text-gray-600">Total de Obras</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {diagnostics.worksData.worksWithAssignments}
                  </p>
                  <p className="text-sm text-gray-600">Com Atribuições</p>
                </div>
              </div>
              {diagnostics.worksData.assignmentDetails.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Obras com Atribuições:</h4>
                  <div className="space-y-2">
                    {diagnostics.worksData.assignmentDetails.map(
                      (work: any, index: number) => (
                        <div key={index} className="p-2 bg-gray-50 rounded">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {work.workSheetNumber}
                              </p>
                              <p className="text-sm text-gray-600">
                                {work.clientName}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                Atribuído a:
                              </p>
                              <p className="text-sm font-medium">
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
          </CardContent>
        </Card>
      )}

      {/* Resultados dos Testes */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados dos Testes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div className="flex items-center gap-3">
                    {result.status === "PASS" && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {result.status === "FAIL" && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    {result.status === "WARN" && (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-medium">{result.test}</p>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium ${
                      result.status === "PASS"
                        ? "bg-green-100 text-green-800"
                        : result.status === "FAIL"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {result.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações de Teste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={createTestWork} variant="outline">
              Criar Obra Teste
            </Button>
            <Button onClick={clearNotificationData} variant="destructive">
              Limpar Dados
            </Button>
            <Button
              onClick={() =>
                NotificationService.processPendingNotifications(
                  "user_alexandre",
                )
              }
              variant="outline"
            >
              Forçar Notificações (Alexandre)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dados Técnicos */}
      {diagnostics && (
        <Card>
          <CardHeader>
            <CardTitle>Dados Técnicos</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(diagnostics, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
