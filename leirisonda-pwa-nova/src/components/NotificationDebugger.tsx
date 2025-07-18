import React, { useState } from "react";
import { Bell, TestTube2, AlertCircle, CheckCircle } from "lucide-react";

export const NotificationDebugger: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
    console.log(message);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testBasicNotification = async () => {
    setIsLoading(true);
    addResult("🧪 Testando notificação básica...");

    try {
      // Verificar suporte
      if (!("Notification" in window)) {
        addResult("❌ Browser não suporta notificações");
        return;
      }

      addResult(`📋 Permissão atual: ${Notification.permission}`);

      // Verificar permissão
      if (Notification.permission !== "granted") {
        addResult("🔑 Solicitando permissão...");
        const permission = await Notification.requestPermission();
        addResult(`📋 Nova permissão: ${permission}`);

        if (permission !== "granted") {
          addResult(
            "❌ Permissão negada - não é possível mostrar notificações",
          );
          return;
        }
      }

      // Criar notificação
      addResult("🔔 Criando notificação de teste...");
      const notification = new Notification("🧪 Teste Leirisonda", {
        body: "Esta é uma notificação de teste básica. Se conseguir ver isto, as notificações estão funcionais!",
        icon: "/icon.svg",
        badge: "/icon.svg",
        requireInteraction: true,
        tag: "debug-test",
      });

      notification.onshow = () => {
        addResult("✅ Notificação mostrada com sucesso!");
      };

      notification.onerror = (error) => {
        addResult(`❌ Erro na notificação: ${error}`);
      };

      notification.onclick = () => {
        addResult("👆 Notificação clicada pelo utilizador");
        notification.close();
      };

      // Auto-fechar após 5 segundos
      setTimeout(() => {
        notification.close();
        addResult("⏰ Notificação fechada automaticamente");
      }, 5000);
    } catch (error: any) {
      addResult(`❌ Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testServiceNotification = async () => {
    setIsLoading(true);
    addResult("🔧 Testando através do serviço...");

    try {
      const { pushNotificationService } = await import(
        "../services/pushNotificationService"
      );

      // Inicializar serviço se necessário
      addResult("🚀 Inicializando serviço...");
      await pushNotificationService.startNotificationService();

      // Obter utilizador atual
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}",
      );
      const userId = String(currentUser.id) || currentUser.email || "test-user";

      addResult(`👤 Utilizador: ${userId}`);

      // Enviar notificação
      addResult("📤 Enviando notificação de obra...");
      const success = await pushNotificationService.notifyObraAssignment(
        {
          id: "debug-test",
          workSheetNumber: "LS-DEBUG",
          title: "Obra de Teste Debug",
          client: "Cliente Debug",
        },
        userId,
      );

      if (success) {
        addResult("✅ Notificação enviada com sucesso através do serviço!");
      } else {
        addResult("❌ Falha ao enviar notificação através do serviço");
      }
    } catch (error: any) {
      addResult(`❌ Erro no serviço: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testPermissionStatus = () => {
    addResult("🔍 Verificando status de permissões...");

    addResult(`🌐 Suporte a notificações: ${"Notification" in window}`);
    addResult(`🌐 Suporte a service worker: ${"serviceWorker" in navigator}`);
    addResult(`📋 Permissão: ${Notification.permission}`);
    addResult(`📱 User Agent: ${navigator.userAgent.substring(0, 50)}...`);
    addResult(`🔌 Online: ${navigator.onLine}`);

    // Verificar localStorage
    const notificationsEnabled = localStorage.getItem("notifications-enabled");
    const fcmToken = localStorage.getItem("fcm-device-token");

    addResult(`💾 Notificações habilitadas: ${notificationsEnabled}`);
    addResult(`🎫 Token FCM existe: ${fcmToken ? "Sim" : "Não"}`);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center mb-4">
        <TestTube2 className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          Debug de Notificações
        </h3>
      </div>

      <div className="space-y-4">
        {/* Botões de teste */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={testPermissionStatus}
            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            disabled={isLoading}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Status
          </button>

          <button
            onClick={testBasicNotification}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            <Bell className="h-4 w-4 mr-2" />
            Teste Básico
          </button>

          <button
            onClick={testServiceNotification}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={isLoading}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Teste Serviço
          </button>
        </div>

        {/* Resultados */}
        {testResults.length > 0 && (
          <div className="border rounded-lg">
            <div className="flex items-center justify-between p-3 border-b bg-gray-50">
              <h4 className="font-medium text-gray-900">Resultados do Teste</h4>
              <button
                onClick={clearResults}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Limpar
              </button>
            </div>
            <div className="p-3 max-h-64 overflow-y-auto bg-gray-900 text-green-400 font-mono text-sm">
              {testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Como usar:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>
              <strong>Status:</strong> Verifica o estado atual das permissões
            </li>
            <li>
              <strong>Teste Básico:</strong> Cria uma notificação simples
              diretamente
            </li>
            <li>
              <strong>Teste Serviço:</strong> Testa através do sistema de
              notificações completo
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default NotificationDebugger;
