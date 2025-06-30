import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useNotifications } from "@/hooks/use-notifications";
import { notificationService } from "@/services/NotificationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  TestTube,
  User,
  Phone,
  AlertTriangle,
  RefreshCw,
  PlayCircle,
} from "lucide-react";

export function NotificationTest() {
  const { user } = useAuth();
  const {
    status,
    isLoading,
    initializeNotifications,
    requestPermission,
    showNotification,
    checkPendingWorks,
    checkStatus,
  } = useNotifications();

  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [userTokens, setUserTokens] = useState<Record<string, string>>({});
  const [pendingWorks, setPendingWorks] = useState<any[]>([]);

  // Verificar se é o Gonçalo
  const isGoncalo = user?.email === "gongonsilva@gmail.com";

  useEffect(() => {
    if (!isGoncalo) return;

    // Carregar tokens de usuários
    try {
      const tokens = JSON.parse(
        localStorage.getItem("userNotificationTokens") || "{}",
      );
      setUserTokens(tokens);
      console.log("🔑 Tokens carregados:", Object.keys(tokens));
    } catch (error) {
      console.error("❌ Erro ao carregar tokens:", error);
    }

    // Verificar status das notificações
    checkStatus();
  }, [isGoncalo, checkStatus]);

  const addTestResult = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
    setTestResults((prev) => [...prev, `${timestamp} ${emoji} ${message}`]);
  };

  const runFullTest = async () => {
    if (!user) {
      addTestResult("Usuário não logado", "error");
      return;
    }

    setIsTestRunning(true);
    setTestResults([]);

    try {
      addTestResult("Iniciando teste completo de notificações...");

      // 1. Verificar suporte
      addTestResult(`Suporte: ${status.isSupported ? "✅ Sim" : "❌ Não"}`);

      // 2. Verificar permissões
      const permission = Notification.permission;
      addTestResult(`Permissão: ${permission}`);

      if (permission !== "granted") {
        addTestResult("Solicitando permissão...");
        const granted = await requestPermission();
        addTestResult(
          `Permissão ${granted ? "concedida" : "negada"}`,
          granted ? "success" : "error",
        );
      }

      // 3. Verificar inicialização
      if (!status.isInitialized) {
        addTestResult("Inicializando serviço...");
        const initialized = await initializeNotifications();
        addTestResult(
          `Inicialização ${initialized ? "sucesso" : "falha"}`,
          initialized ? "success" : "error",
        );
      }

      // 4. Teste de notificação simples
      addTestResult("Testando notificação básica...");
      await showNotification(
        "🧪 Teste de Notificação",
        `Olá ${user.name}! Este é um teste de notificação.`,
        { type: "test", timestamp: Date.now() },
      );
      addTestResult("Notificação básica enviada", "success");

      // 5. Verificar obras pendentes
      addTestResult("Verificando obras pendentes...");
      const pending = await checkPendingWorks();
      setPendingWorks(pending);
      addTestResult(`Encontradas ${pending.length} obras pendentes`, "info");

      // 6. Teste específico para obra atribuída
      addTestResult("Testando notificação de obra atribuída...");
      await notificationService.notifyWorkAssigned(
        {
          id: `test_${Date.now()}`,
          workSheetNumber: "TEST-001",
          clientName: "Cliente Teste",
          type: "teste",
          status: "pendente",
        },
        [user.id],
      );
      addTestResult("Notificação de obra atribuída enviada", "success");

      // 7. Teste de mudança de status
      addTestResult("Testando notificação de mudança de status...");
      await notificationService.notifyWorkStatusChange(
        {
          id: `test_status_${Date.now()}`,
          workSheetNumber: "TEST-002",
          clientName: "Cliente Teste Status",
          type: "teste",
          status: "em_progresso",
        },
        "em_progresso",
        [user.id],
      );
      addTestResult("Notificação de mudança de status enviada", "success");

      addTestResult("🎉 Teste completo finalizado com sucesso!", "success");
    } catch (error) {
      console.error("❌ Erro no teste:", error);
      addTestResult(`Erro durante teste: ${error}`, "error");
    } finally {
      setIsTestRunning(false);
    }
  };

  const testBasicNotification = async () => {
    if (!user) return;

    try {
      await showNotification(
        "🔔 Teste Simples",
        `Notificação teste para ${user.name}`,
        { type: "simple_test" },
      );
      addTestResult("Notificação simples enviada", "success");
    } catch (error) {
      addTestResult(`Erro na notificação simples: ${error}`, "error");
    }
  };

  const forceInitialize = async () => {
    try {
      addTestResult("Forçando inicialização...");
      const success = await initializeNotifications();
      addTestResult(
        `Inicialização forçada: ${success ? "sucesso" : "falha"}`,
        success ? "success" : "error",
      );
    } catch (error) {
      addTestResult(`Erro na inicialização forçada: ${error}`, "error");
    }
  };

  const clearTests = () => {
    setTestResults([]);
  };

  if (!isGoncalo) {
    return (
      <div className="leirisonda-main">
        <div className="max-w-2xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Acesso Restrito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Esta página é exclusiva para diagnóstico técnico.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="leirisonda-main">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Teste de Notificações
          </h1>
          <p className="text-gray-600">
            Diagnóstico completo do sistema de notificações para {user?.name}
          </p>
        </div>

        {/* Status do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">Suportado</div>
                <Badge variant={status.isSupported ? "default" : "destructive"}>
                  {status.isSupported ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Habilitado</div>
                <Badge variant={status.isEnabled ? "default" : "destructive"}>
                  {status.isEnabled ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Inicializado</div>
                <Badge
                  variant={status.isInitialized ? "default" : "destructive"}
                >
                  {status.isInitialized ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Permissão</div>
                <Badge
                  variant={
                    status.permission === "granted"
                      ? "default"
                      : status.permission === "denied"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {status.permission || "Não solicitada"}
                </Badge>
              </div>
            </div>

            {status.hasToken && (
              <div className="text-center">
                <div className="text-sm text-gray-500">Token FCM</div>
                <Badge variant="default">Configurado</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tokens de Usuários */}
        {Object.keys(userTokens).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Tokens de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(userTokens).map(([userId, token]) => (
                  <div
                    key={userId}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{userId}</span>
                    <span className="text-sm text-gray-500 font-mono">
                      {token.substring(0, 20)}...
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Obras Pendentes */}
        {pendingWorks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Obras Pendentes Atribuídas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingWorks.map((work, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <span className="font-medium">
                        {work.workSheetNumber}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {work.clientName}
                      </span>
                    </div>
                    <Badge
                      variant={
                        work.status === "pendente" ? "destructive" : "secondary"
                      }
                    >
                      {work.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controles de Teste */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Testes de Notificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={runFullTest}
                disabled={isTestRunning || isLoading}
                className="flex items-center gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                {isTestRunning ? "Testando..." : "Teste Completo"}
              </Button>

              <Button
                onClick={testBasicNotification}
                variant="outline"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Teste Simples
              </Button>

              <Button
                onClick={forceInitialize}
                variant="outline"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Forçar Inicialização
              </Button>

              <Button
                onClick={clearTests}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados dos Testes */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Resultados dos Testes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Instruções de Uso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>1. Teste Completo:</strong> Verifica todo o sistema e
              envia notificações de teste
            </p>
            <p>
              <strong>2. Teste Simples:</strong> Envia apenas uma notificação
              básica
            </p>
            <p>
              <strong>3. Forçar Inicialização:</strong> Reinicia o serviço de
              notificações
            </p>
            <p>
              <strong>4. Permissões:</strong> Certifique-se que as notificações
              estão permitidas no browser
            </p>
            <p>
              <strong>5. Tokens:</strong> Verificam se o dispositivo está
              registrado para receber notificações
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
