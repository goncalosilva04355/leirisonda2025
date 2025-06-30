import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/AuthProvider";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationService } from "@/services/NotificationService";

interface DiagnosticResult {
  environment: string;
  isSupported: boolean;
  isInitialized: boolean;
  permission: NotificationPermission | null;
  serviceWorkerStatus: string;
  fcmTokenStatus: string;
  firebaseStatus: string;
  userTokens: Record<string, string>;
  recommendations: string[];
}

interface TestResult {
  timestamp: string;
  test: string;
  success: boolean;
  message: string;
  details?: any;
}

export default function NotificationTest() {
  const { user } = useAuth();
  const { status, requestPermission, initializeNotifications } =
    useNotifications();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se é Gonçalo (único com acesso a esta página)
  const isGoncalo = user?.email === "gongonsilva@gmail.com";

  useEffect(() => {
    if (isGoncalo) {
      runDiagnostics();
    }
  }, [isGoncalo]);

  const addTestResult = (
    test: string,
    success: boolean,
    message: string,
    details?: any,
  ) => {
    const result: TestResult = {
      timestamp: new Date().toLocaleTimeString(),
      test,
      success,
      message,
      details,
    };

    setTestResults((prev) => [result, ...prev.slice(0, 9)]); // Manter apenas últimos 10 resultados
  };

  const runDiagnostics = async () => {
    try {
      console.log("🔍 Executando diagnóstico completo...");
      const result = await notificationService.runDiagnostics();
      setDiagnostics(result);
      addTestResult(
        "Diagnóstico",
        true,
        "Diagnóstico completo executado",
        result,
      );
    } catch (error) {
      console.error("❌ Erro no diagnóstico:", error);
      addTestResult("Diagnóstico", false, `Erro: ${error}`, error);
    }
  };

  const testInitialization = async () => {
    setIsLoading(true);
    try {
      console.log("🚀 Testando inicialização de notificações...");
      const success = await initializeNotifications();
      addTestResult(
        "Inicialização",
        success,
        success
          ? "Notificações inicializadas com sucesso"
          : "Falha na inicialização",
      );

      if (success) {
        await runDiagnostics(); // Atualizar diagnóstico após inicialização
      }
    } catch (error) {
      addTestResult("Inicialização", false, `Erro: ${error}`, error);
    }
    setIsLoading(false);
  };

  const testPermissions = async () => {
    setIsLoading(true);
    try {
      console.log("🔐 Testando permissões...");
      const granted = await requestPermission();
      addTestResult(
        "Permissões",
        granted,
        granted ? "Permissões concedidas" : "Permissões negadas",
      );
    } catch (error) {
      addTestResult("Permissões", false, `Erro: ${error}`, error);
    }
    setIsLoading(false);
  };

  const testLocalNotification = async () => {
    try {
      console.log("📱 Testando notificação local...");
      await notificationService.showLocalNotification({
        title: "🧪 Teste Local",
        body: "Esta é uma notificação de teste local",
        data: { type: "test" },
        icon: "/leirisonda-icon.svg",
      });
      addTestResult("Notificação Local", true, "Notificação local enviada");
    } catch (error) {
      addTestResult("Notificação Local", false, `Erro: ${error}`, error);
    }
  };

  const testPushNotification = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log("📤 Testando notificação push...");

      // Testar endpoint do servidor primeiro
      const response = await fetch("/api/test-firebase-admin");
      const serverTest = await response.json();

      addTestResult(
        "Servidor Firebase",
        serverTest.success,
        serverTest.message,
        serverTest,
      );

      if (serverTest.success) {
        // Testar envio de notificação push real
        const pushResponse = await fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: "test-token",
            title: "🧪 Teste Push",
            body: "Esta é uma notificação push de teste",
            data: { type: "test_push", userId: user.id },
            icon: "/leirisonda-icon.svg",
          }),
        });

        const pushResult = await pushResponse.json();
        addTestResult(
          "Push Notification",
          pushResult.success,
          pushResult.success ? "Push test executado" : pushResult.error,
          pushResult,
        );
      }
    } catch (error) {
      addTestResult("Push Notification", false, `Erro: ${error}`, error);
    }
    setIsLoading(false);
  };

  const testWorkAssignment = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log("🏗️ Testando atribuição de obra...");

      // Simular obra de teste
      const testWork = {
        id: `test-${Date.now()}`,
        workSheetNumber: `TEST-${Math.floor(Math.random() * 1000)}`,
        clientName: "Cliente Teste",
        type: "piscina",
        status: "pendente",
      };

      // Atribuir ao Alexandre e Gonçalo
      const assignedUsers = ["admin_goncalo", "user_alexandre"];

      await notificationService.notifyWorkAssigned(testWork, assignedUsers);

      addTestResult(
        "Atribuição Obra",
        true,
        `Teste de atribuição enviado para ${assignedUsers.length} usuários`,
        { work: testWork, users: assignedUsers },
      );
    } catch (error) {
      addTestResult("Atribuição Obra", false, `Erro: ${error}`, error);
    }
    setIsLoading(false);
  };

  const checkPendingWorks = async () => {
    if (!user) return;

    try {
      console.log("📋 Verificando obras pendentes...");
      const pendingWorks = await notificationService.checkPendingAssignedWorks(
        user.id,
      );

      addTestResult(
        "Obras Pendentes",
        true,
        `${pendingWorks.length} obras pendentes encontradas`,
        { works: pendingWorks },
      );
    } catch (error) {
      addTestResult("Obras Pendentes", false, `Erro: ${error}`, error);
    }
  };

  const checkPendingNotifications = async () => {
    try {
      console.log("📋 Verificando notificações pendentes...");

      const pendingNotifications = JSON.parse(
        localStorage.getItem("pendingNotifications") || "[]",
      );

      const userPendingNotifications = pendingNotifications.filter(
        (notification: any) => notification.userId === user?.id,
      );

      const undeliveredNotifications = userPendingNotifications.filter(
        (notification: any) => !notification.delivered,
      );

      addTestResult(
        "Notificações Pendentes",
        true,
        `${userPendingNotifications.length} notificações salvas, ${undeliveredNotifications.length} não entregues`,
        {
          all: userPendingNotifications,
          undelivered: undeliveredNotifications,
          summary: {
            total: pendingNotifications.length,
            forUser: userPendingNotifications.length,
            undelivered: undeliveredNotifications.length,
          },
        },
      );
    } catch (error) {
      addTestResult("Notificações Pendentes", false, `Erro: ${error}`, error);
    }
  };

  const clearTests = () => {
    setTestResults([]);
    addTestResult("Sistema", true, "Resultados de teste limpos");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              Faça login para acessar os testes de notificação
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isGoncalo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              Esta página é restrita ao administrador principal
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">🧪 Teste de Notificações Push</h1>
          <p className="page-subtitle">
            Diagnóstico e teste do sistema de notificações entre dispositivos
          </p>
        </div>
      </div>

      {/* Status Atual */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge variant={status.isSupported ? "default" : "secondary"}>
                {status.isSupported ? "✅ Suportado" : "❌ Não Suportado"}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">Suporte</p>
            </div>
            <div className="text-center">
              <Badge variant={status.isEnabled ? "default" : "secondary"}>
                {status.isEnabled ? "✅ Habilitado" : "❌ Desabilitado"}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">Permissão</p>
            </div>
            <div className="text-center">
              <Badge variant={status.isInitialized ? "default" : "secondary"}>
                {status.isInitialized
                  ? "✅ Inicializado"
                  : "❌ Não Inicializado"}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">Estado</p>
            </div>
            <div className="text-center">
              <Badge variant={status.hasToken ? "default" : "secondary"}>
                {status.hasToken ? "✅ Com Token" : "❌ Sem Token"}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">Token FCM</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testes Básicos */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Testes Básicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              onClick={runDiagnostics}
              variant="outline"
              className="w-full"
            >
              🔍 Diagnóstico
            </Button>
            <Button
              onClick={testInitialization}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              🚀 Inicialização
            </Button>
            <Button
              onClick={testPermissions}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              🔐 Permissões
            </Button>
            <Button
              onClick={testLocalNotification}
              variant="outline"
              className="w-full"
            >
              📱 Local
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Testes Avançados */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Testes Avançados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={testPushNotification}
              disabled={isLoading}
              variant="default"
              className="w-full"
            >
              📤 Push Server
            </Button>
            <Button
              onClick={testWorkAssignment}
              disabled={isLoading}
              variant="default"
              className="w-full"
            >
              🏗️ Atribuição Obra
            </Button>
            <Button
              onClick={checkPendingWorks}
              variant="outline"
              className="w-full"
            >
              📋 Obras Pendentes
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <Button
              onClick={checkPendingNotifications}
              variant="outline"
              className="w-full"
            >
              📨 Notificações Pendentes
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem("pendingNotifications");
                addTestResult(
                  "Limpeza",
                  true,
                  "Notificações pendentes limpas",
                  {},
                );
              }}
              variant="destructive"
              className="w-full"
            >
              🗑️ Limpar Pendentes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diagnóstico Detalhado */}
      {diagnostics && (
        <Card>
          <CardHeader>
            <CardTitle>🔍 Diagnóstico Detalhado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Informações do Sistema</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Ambiente:</strong> {diagnostics.environment}
                  </p>
                  <p>
                    <strong>Permissão:</strong>{" "}
                    {diagnostics.permission || "N/A"}
                  </p>
                  <p>
                    <strong>Service Worker:</strong>{" "}
                    {diagnostics.serviceWorkerStatus}
                  </p>
                  <p>
                    <strong>FCM Token:</strong> {diagnostics.fcmTokenStatus}
                  </p>
                  <p>
                    <strong>Firebase:</strong> {diagnostics.firebaseStatus}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tokens de Usuários</h4>
                <div className="space-y-1 text-sm">
                  {Object.keys(diagnostics.userTokens).length > 0 ? (
                    Object.entries(diagnostics.userTokens).map(
                      ([userId, token]) => (
                        <p key={userId}>
                          <strong>{userId}:</strong> {token.substring(0, 20)}...
                        </p>
                      ),
                    )
                  ) : (
                    <p className="text-gray-500">Nenhum token salvo</p>
                  )}
                </div>
              </div>
            </div>

            {diagnostics.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recomendações</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {diagnostics.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-700">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resultados dos Testes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>📝 Resultados dos Testes</CardTitle>
          <Button onClick={clearTests} variant="outline" size="sm">
            🗑️ Limpar
          </Button>
        </CardHeader>
        <CardContent>
          {testResults.length > 0 ? (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.success
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={result.success ? "default" : "destructive"}
                      >
                        {result.success ? "✅" : "❌"} {result.test}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {result.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mt-1">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-sm cursor-pointer text-gray-600">
                        Ver detalhes
                      </summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              Nenhum teste executado ainda
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
