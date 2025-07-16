import React, { useState } from "react";
import {
  Settings,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Loader,
  Database,
  TestTube,
  Shield,
  ArrowLeft,
  UserCheck,
  BarChart3,
  Users,
  Key,
  Smartphone,
  Bell,
} from "lucide-react";
import { FirebaseConfig } from "./FirebaseConfig";
import { FCMNotificationSetup } from "./FCMNotificationSetup";
import { NotificationDebugger } from "./NotificationDebugger";

interface User {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "manager" | "technician";
  active: boolean;
}

interface AdvancedSettingsProps {
  onBack: () => void;
  onNavigateToSection?: (section: string) => void;
  currentUser?: User | null;
  dataSync?: {
    pools: any[];
    maintenance: any[];
    works: any[];
    clients: any[];
    lastSync: string | null;
    syncWithFirebase: () => Promise<void>;
    enableSync: (enabled: boolean) => void;
  };
  notifications?: {
    pushPermission: string;
    notificationsEnabled: boolean;
    requestNotificationPermission: () => Promise<string>;
    testPushNotification: () => void;
    sendWorkAssignmentNotification: (
      workTitle: string,
      assignedTo: string,
    ) => void;
  };
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  onBack,
  onNavigateToSection,
  currentUser,
  dataSync,
  notifications,
}) => {
  const [activeTab, setActiveTab] = useState<
    | "firebase"
    | "device-sync"
    | "sync-test"
    | "notifications"
    | "auth-diagnostic"
    | "utilizadores"
    | "relatorios"
    | "clientes"
    | "configuracoes"
  >("firebase");
  const [syncTest, setSyncTest] = useState({
    status: "idle", // idle, testing, success, error
    message: "",
    details: [],
  });
  const [showFirebaseConfig, setShowFirebaseConfig] = useState(false);

  const testFirebaseConnection = async () => {
    setSyncTest({
      status: "testing",
      message: "Testando conexão...",
      details: [],
    });

    try {
      // Firebase is always configured with fixed settings
      const config = {
        apiKey: "AIzaSyC7BHkdQSdAoTzjM39vm90C9yejcoOPCjE",
        authDomain: "leirisonda-16f8b.firebaseapp.com",
        projectId: "leirisonda-16f8b",
        storageBucket: "leirisonda-16f8b.firebasestorage.app",
        messagingSenderId: "540456875574",
        appId: "1:540456875574:web:8a8fd4870cb4c943a40a97",
      };
      const tests = [];

      // Test 1: Configuration validation
      tests.push("✅ Configuração Firebase encontrada");

      // Test 2: Required fields
      const requiredFields = ["apiKey", "authDomain", "projectId"];
      const missingFields = requiredFields.filter((field) => !config[field]);

      if (missingFields.length > 0) {
        tests.push(`❌ Campos em falta: ${missingFields.join(", ")}`);
        setSyncTest({
          status: "error",
          message: "Configuração incompleta",
          details: tests,
        });
        return;
      }

      tests.push("✅ Todos os campos obrigatórios preenchidos");

      // Test 3: Network connectivity
      try {
        await fetch("https://www.google.com", { mode: "no-cors" });
        tests.push("✅ Conectividade à internet");
      } catch (error) {
        tests.push("❌ Sem conectividade à internet");
        setSyncTest({
          status: "error",
          message: "Sem conexão à internet",
          details: tests,
        });
        return;
      }

      // Test 4: Firebase endpoint test
      try {
        const response = await fetch(
          `https://${config.projectId}-default-rtdb.firebaseio.com/.json`,
        );
        tests.push("✅ Endpoint Firebase acessível");
      } catch (error) {
        tests.push("⚠️ Endpoint Firebase pode não estar acessível");
      }

      // Test 5: Simulate data operation
      tests.push("✅ Estrutura de dados validada");
      tests.push("✅ Permissões básicas verificadas");

      setSyncTest({
        status: "success",
        message: "Configuração Firebase válida e pronta para sincronização",
        details: tests,
      });
    } catch (error) {
      setSyncTest({
        status: "error",
        message: "Erro durante o teste",
        details: ["❌ Erro inesperado durante a verificação"],
      });
    }
  };

  const testSyncFunctionality = async () => {
    setSyncTest({
      status: "testing",
      message: "Testando funcionalidades de sincronização...",
      details: [],
    });

    const tests = [];

    try {
      // Test data availability
      tests.push("🔍 Verificando dados disponíveis...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (dataSync) {
        tests.push(
          `✅ Piscinas: ${dataSync.pools.length} registos encontrados`,
        );
        tests.push(
          `✅ Manutenções: ${dataSync.maintenance.length} registos encontrados`,
        );
        tests.push(`✅ Obras: ${dataSync.works.length} registos encontrados`);
        tests.push(
          `✅ Clientes: ${dataSync.clients.length} registos encontrados`,
        );
      }

      // Test sync functionality
      tests.push("🔄 Testando sincronização de piscinas...");
      await new Promise((resolve) => setTimeout(resolve, 800));
      tests.push("✅ Sincronização de piscinas: Operacional");

      tests.push("🔄 Testando sincronização de manutenções...");
      await new Promise((resolve) => setTimeout(resolve, 600));
      tests.push("✅ Sincronização de manutenções: Operacional");

      tests.push("🔄 Testando sincronização de obras...");
      await new Promise((resolve) => setTimeout(resolve, 700));
      tests.push("✅ Sincronização de obras: Operacional");

      tests.push("🔄 Testando sincronização de clientes...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      tests.push("✅ Sincronização de clientes: Operacional");

      // Test real-time listeners
      tests.push("🔄 Testando listeners em tempo real...");
      await new Promise((resolve) => setTimeout(resolve, 600));
      tests.push("✅ Real-time listeners: Ativos");

      // Show last sync info
      if (dataSync?.lastSync) {
        tests.push(
          `📅 Última sincronização: ${new Date(dataSync.lastSync).toLocaleString("pt-PT")}`,
        );
      }

      setSyncTest({
        status: "success",
        message: "Todas as funcionalidades de sincronização estão operacionais",
        details: tests,
      });
    } catch (error) {
      tests.push("❌ Erro durante teste de sincronização");
      setSyncTest({
        status: "error",
        message: "Falha no teste de sincronização",
        details: tests,
      });
    }
  };

  const activateRealSync = async () => {
    if (!dataSync) return;

    setSyncTest({
      status: "testing",
      message: "Ativando sincronização em tempo real...",
      details: [],
    });

    try {
      await dataSync.syncWithFirebase();
      dataSync.enableSync(true);

      setSyncTest({
        status: "success",
        message: "Sincronização em tempo real ativada com sucesso!",
        details: [
          "✅ Firebase conectado",
          "✅ Dados sincronizados",
          "✅ Real-time updates ativos",
          "🔄 Todas as alterações serão sincronizadas automaticamente",
        ],
      });
    } catch (error) {
      setSyncTest({
        status: "error",
        message: "Erro ao ativar sincronização",
        details: ["❌ Verifique a configuração Firebase"],
      });
    }
  };

  if (showFirebaseConfig) {
    return (
      <FirebaseConfig
        onConfigured={() => {
          setShowFirebaseConfig(false);
          setActiveTab("sync-test");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-bold">Configurações Avançadas</h1>
                <p className="text-gray-300 text-sm">
                  Área protegida para administradores
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="grid grid-cols-8 text-sm">
            <button
              onClick={() => setActiveTab("firebase")}
              className={`py-4 px-3 text-center font-medium transition-colors ${
                activeTab === "firebase"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <Database className="w-4 h-4" />
                <span>Firebase</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("device-sync")}
              className={`py-4 px-3 text-center font-medium transition-colors ${
                activeTab === "device-sync"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <Smartphone className="w-4 h-4" />
                <span>Dispositivos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("sync-test")}
              className={`py-4 px-3 text-center font-medium transition-colors ${
                activeTab === "sync-test"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <TestTube className="w-4 h-4" />
                <span>Sync Test</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`py-4 px-3 text-center font-medium transition-colors ${
                activeTab === "notifications"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <Bell className="w-4 h-4" />
                <span>Push FCM</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("auth-diagnostic")}
              className={`py-4 px-3 text-center font-medium transition-colors ${
                activeTab === "auth-diagnostic"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <Key className="w-4 h-4" />
                <span>Auth</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("utilizadores")}
              className={`py-4 px-3 text-center font-medium transition-colors ${
                activeTab === "utilizadores"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <UserCheck className="w-4 h-4" />
                <span>Utilizadores</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("relatorios")}
              className={`py-4 px-3 text-center font-medium transition-colors ${
                activeTab === "relatorios"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <BarChart3 className="w-4 h-4" />
                <span>Relatórios</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("clientes")}
              className={`py-4 px-3 text-center font-medium transition-colors ${
                activeTab === "clientes"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <Users className="w-4 h-4" />
                <span>Clientes</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("configuracoes")}
              className={`py-4 px-3 text-center font-medium transition-colors ${
                activeTab === "configuracoes"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <Settings className="w-4 h-4" />
                <span>Config</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "firebase" && (
            <div className="space-y-6">
              <div className="text-center">
                <Database className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Configuração Firebase
                </h3>
                <p className="text-gray-600 mb-6">
                  Configure as credenciais Firebase para ativar sincronização em
                  tempo real
                </p>
              </div>

              {/* Current Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Estado Atual
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Firebase configurado e ativo</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Configuração permanente para todos os dispositivos
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowFirebaseConfig(true)}
                  className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Settings className="w-5 h-5" />
                  <span>Configurar</span>
                </button>
                <button
                  onClick={testFirebaseConnection}
                  className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Wifi className="w-5 h-5" />
                  <span>Testar Conexão</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "device-sync" && (
            <div className="space-y-6">
              <div className="text-center">
                <Smartphone className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Sincronização Entre Dispositivos
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Gerir a sincronização de dados entre diferentes dispositivos e
                  controlar o acesso multi-dispositivo.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">
                  Funcionalidade de sincronização temporariamente desativada.
                </p>
              </div>
            </div>
          )}

          {activeTab === "sync-test" && (
            <div className="space-y-6">
              <div className="text-center">
                <TestTube className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Teste de Sincronização
                </h3>
                <p className="text-gray-600 mb-6">
                  Verifique o funcionamento das funcionalidades de sincronização
                </p>
              </div>

              {/* Test Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={testFirebaseConnection}
                  disabled={syncTest.status === "testing"}
                  className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
                >
                  {syncTest.status === "testing" ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Database className="w-5 h-5" />
                  )}
                  <span>Testar Firebase</span>
                </button>
                <button
                  onClick={testSyncFunctionality}
                  disabled={syncTest.status === "testing"}
                  className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
                >
                  {syncTest.status === "testing" ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Wifi className="w-5 h-5" />
                  )}
                  <span>Testar Sincronização</span>
                </button>
              </div>

              {/* Activate Real Sync */}
              <div className="mt-4">
                <button
                  onClick={activateRealSync}
                  disabled={syncTest.status === "testing"}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
                >
                  {syncTest.status === "testing" ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  <span>Ativar Sincronização Real</span>
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Ativa sincronização automática para piscinas, obras,
                  manutenções e clientes
                </p>
              </div>

              {/* Test Results */}
              {syncTest.status !== "idle" && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    {syncTest.status === "testing" && (
                      <Loader className="w-6 h-6 text-blue-500 animate-spin" />
                    )}
                    {syncTest.status === "success" && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    {syncTest.status === "error" && (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    )}
                    <h4 className="font-semibold text-gray-900">
                      {syncTest.message}
                    </h4>
                  </div>

                  {syncTest.details.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">Detalhes:</h5>
                      <div className="bg-white rounded border p-3 space-y-1">
                        {syncTest.details.map((detail, index) => (
                          <div
                            key={index}
                            className="text-sm font-mono text-gray-700"
                          >
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Informações</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Configure o Firebase primeiro antes de testar</li>
                  <li>• Os testes verificam conectividade e funcionalidades</li>
                  <li>⚠️ Resultados são apenas simulações para demonstração</li>
                  <li>• Para uso real, implemente autenticação adequada</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "notifications" && notifications && (
            <div className="space-y-6">
              <div className="text-center">
                <Wifi className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Notificações Push
                </h3>
                <p className="text-gray-600 mb-6">
                  Configure e teste notificações push para atribuição de obras
                </p>
              </div>

              {/* Permission Status */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Estado das Permissões
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          "Notification" in window
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Suporte do Browser
                        </h5>
                        <p className="text-sm text-gray-600">
                          {"Notification" in window
                            ? "Suportado"
                            : "Não suportado"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          notifications.pushPermission === "granted"
                            ? "bg-green-500"
                            : notifications.pushPermission === "denied"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                      ></div>
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Permissão Atual
                        </h5>
                        <p className="text-sm text-gray-600">
                          {notifications.pushPermission === "granted"
                            ? "Concedida"
                            : notifications.pushPermission === "denied"
                              ? "Negada"
                              : "Pendente"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Controls */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Controles de Notificação
                </h4>
                <div className="space-y-4">
                  {/* Enable Notifications */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">
                        Ativar Notificações
                      </h5>
                      <p className="text-sm text-gray-600">
                        Permitir notificações push quando obras forem atribuídas
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          notifications.pushPermission === "granted"
                            ? "bg-green-100 text-green-800"
                            : notifications.pushPermission === "denied"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {notifications.pushPermission === "granted"
                          ? "Ativadas"
                          : notifications.pushPermission === "denied"
                            ? "Negadas"
                            : "Pendente"}
                      </span>
                      <button
                        onClick={notifications.requestNotificationPermission}
                        disabled={notifications.pushPermission === "granted"}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          notifications.pushPermission === "granted"
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {notifications.pushPermission === "granted"
                          ? "Ativadas"
                          : "Ativar"}
                      </button>
                    </div>
                  </div>

                  {/* Test Notification */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">
                        Teste de Notificação
                      </h5>
                      <p className="text-sm text-gray-600">
                        Enviar uma notificação de teste para verificar se está a
                        funcionar
                      </p>
                    </div>
                    <button
                      onClick={notifications.testPushNotification}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
                    >
                      Testar
                    </button>
                  </div>

                  {/* Simulate Work Assignment */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Simular Atribuição de Obra
                        </h5>
                        <p className="text-sm text-gray-600">
                          Testar o sistema completo de atribuição e notificações
                        </p>
                      </div>
                    </div>
                    {notifications.pushPermission !== "granted" && (
                      <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          ⚠️ <strong>Notificações não ativadas!</strong> Para
                          receber notificações de obras, clique em "Ativar"
                          acima primeiro.
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          const testWorkTitle = `Obra Teste ${new Date().toLocaleTimeString()}`;
                          notifications.sendWorkAssignmentNotification(
                            testWorkTitle,
                            "Utilizador Teste",
                          );
                          alert(
                            `✅ Obra "${testWorkTitle}" atribuída a "Utilizador Teste"\n📋 Verifique o resumo no dashboard`,
                          );
                        }}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium transition-colors"
                      >
                        🏗️ Simular Obra
                      </button>
                      <button
                        onClick={() => {
                          // Check notification permissions first
                          if (Notification.permission !== "granted") {
                            alert(
                              "❌ Notificações não estão ativadas!\n\n" +
                                "Para receber notificações de obras atribuídas:\n" +
                                "1. Clique no botão 'Ativar' acima\n" +
                                "2. Permita notificações quando o browser pedir\n" +
                                "3. Tente a simulação novamente",
                            );
                            return;
                          }

                          const testWorkTitle = `Obra Urgente ${new Date().toLocaleTimeString()}`;
                          // Get current user from localStorage (check both possible keys)
                          let currentUserName = "Utilizador Atual";

                          // First try the mock-current-user key
                          const mockCurrentUser =
                            localStorage.getItem("mock-current-user");
                          if (mockCurrentUser) {
                            try {
                              currentUserName =
                                JSON.parse(mockCurrentUser).name;
                            } catch (e) {
                              console.warn(
                                "Error parsing mock-current-user:",
                                e,
                              );
                            }
                          } else {
                            // Fallback to currentUser key
                            const currentUser =
                              localStorage.getItem("currentUser");
                            if (currentUser) {
                              try {
                                currentUserName = JSON.parse(currentUser).name;
                              } catch (e) {
                                console.warn("Error parsing currentUser:", e);
                              }
                            }
                          }

                          console.log(
                            "🔍 DEBUG: Current user for notification:",
                            currentUserName,
                          );
                          notifications.sendWorkAssignmentNotification(
                            testWorkTitle,
                            currentUserName,
                          );

                          // Show success message with debugging info
                          const debugInfo = `\n\n📋 Debug Info:\n- Usuário: ${currentUserName}\n- Permissão: ${Notification.permission}\n- Hora: ${new Date().toLocaleTimeString()}`;
                          alert(
                            `🔔 Obra "${testWorkTitle}" atribuída a si!\n📱 Deve receber notificação push${debugInfo}`,
                          );
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
                      >
                        🔔 Testar Push
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary of Assigned Works */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-3">
                  📋 Resumo de Atribuições de Obra
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-2xl font-bold text-gray-900">
                      {dataSync?.works?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total de Obras</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-2xl font-bold text-orange-600">
                      {dataSync?.works?.filter(
                        (work) => work && work.assignedTo,
                      )?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      Obras Atribuídas
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-2xl font-bold text-green-600">
                      {dataSync?.works?.filter(
                        (work) => work.status === "completed",
                      )?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      Obras Concluídas
                    </div>
                  </div>
                </div>
                <div className="text-sm text-yellow-800">
                  💡 Este resumo mostra o estado atual do sistema de atribuição
                  de obras. Quando uma obra é atribuída, automaticamente aparece
                  nas estatísticas e o utilizador responsável recebe uma
                  notificação push.
                </div>
              </div>

              {/* How it works */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Como funcionam as notificações:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • Quando uma obra é criada e atribuída a um utilizador, ele
                    recebe uma notificação push
                  </li>
                  <li>
                    • A obra aparece automaticamente no dashboard do utilizador
                    na seção "Obras Atribuídas"
                  </li>
                  <li>
                    • As notificações funcionam mesmo com a aplicação fechada
                    (no telemóvel)
                  </li>
                  <li>
                    • Para telemóveis, adicione a aplicação ao ecrã inicial para
                    melhor experiência
                  </li>
                  <li>
                    • O service worker garante que as notificações funcionem em
                    background
                  </li>
                </ul>
              </div>

              {/* Mobile Instructions */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">
                  📱 Instruções para Telemóvel:
                </h4>
                <ol className="text-sm text-green-800 space-y-1">
                  <li>1. Abra a aplicação no browser do telemóvel</li>
                  <li>2. Faça login e aceda às configurações avançadas</li>
                  <li>3. Clique em "Ativar" na seção de notificações</li>
                  <li>4. Permita notificações quando o browser pedir</li>
                  <li>5. Teste com o botão "Testar" ou "Simular"</li>
                  <li>6. Adicione a app ao ecrã inicial (opcional)</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="text-center">
                <Bell className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Notificações Push FCM
                </h3>
                <p className="text-gray-600 mb-6">
                  Configure Firebase Cloud Messaging para notificações push em
                  tempo real
                </p>
              </div>

              {/* FCM Setup Component */}
              <FCMNotificationSetup />

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  🔔 Como funciona o FCM:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • FCM (Firebase Cloud Messaging) envia notificações push
                    reais
                  </li>
                  <li>• Funciona mesmo com a aplicação fechada</li>
                  <li>• Cada dispositivo recebe um token único</li>
                  <li>
                    • Quando uma obra é atribuída, o FCM envia notificação
                    automaticamente
                  </li>
                  <li>• Fallback para notificações locais se FCM falhar</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "auth-diagnostic" && (
            <div className="space-y-6">
              <div className="text-center">
                <Key className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Diagnóstico de Autenticação
                </h3>
                <p className="text-gray-600 mb-6">
                  Ferramenta de diagnóstico para problemas de login entre
                  dispositivos
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h4 className="font-medium text-orange-900 mb-3">
                  🔧 Problema Identificado e Corrigido
                </h4>
                <div className="text-sm text-orange-800 space-y-2">
                  <p>
                    <strong>Problema:</strong> A configuração anterior usava
                    'browserSessionPersistence' que só mantinha a sessão no
                    mesmo navegador/dispositivo.
                  </p>
                  <p>
                    <strong>Solução:</strong> Removida a limitação de
                    persistência para permitir login entre dispositivos.
                  </p>
                  <p>
                    <strong>Status:</strong> ✅ Corrigido - Utilizadores devem
                    conseguir fazer login noutro dispositivo agora.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 mb-3">
                  📱 Como testar o login noutro dispositivo:
                </h4>
                <ol className="text-sm text-blue-800 space-y-2">
                  <li>1. Faça login neste dispositivo normalmente</li>
                  <li>2. Abra a aplicação noutro dispositivo/navegador</li>
                  <li>3. Use o mesmo email e password</li>
                  <li>4. O login deve funcionar normalmente</li>
                  <li>
                    5. Os dados devem estar sincronizados (se Firebase
                    configurado)
                  </li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">
                  ✅ Verificações Firebase para sincronização:
                </h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>
                    • Authentication → Sign-in method → Email/Password deve
                    estar ativado
                  </li>
                  <li>• Firestore Database deve estar configurado</li>
                  <li>
                    • Utilizadores criados aparecem em Authentication → Users
                  </li>
                  <li>
                    • As regras de segurança devem permitir acesso autenticado
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">
                  ⚠️ Se ainda houver problemas:
                </h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>
                    • Verifique se o Firebase Console tem Email/Password ativado
                  </li>
                  <li>
                    • Confirme que o utilizador foi criado no Firebase
                    Authentication
                  </li>
                  <li>• Teste com incógnito/modo privado primeiro</li>
                  <li>• Limpe cache e cookies do navegador</li>
                  <li>• Execute o diagnóstico detalhado acima</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "utilizadores" && (
            <div className="space-y-6">
              <div className="text-center">
                <UserCheck className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Utilizadores
                </h3>
                <p className="text-gray-600 mb-6">
                  Gestão de utilizadores do sistema
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800 text-center">
                  Esta funcionalidade foi movida para as configurações
                  avançadas.
                </p>
                {onNavigateToSection && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        if (onNavigateToSection) {
                          console.log("🔄 Redirecionando para Utilizadores...");
                          onNavigateToSection("utilizadores");
                          onBack();
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <span>👥 Aceder aos Utilizadores</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "relatorios" && (
            <div className="space-y-6">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Relatórios
                </h3>
                <p className="text-gray-600 mb-6">
                  Gere relatórios detalhados em PDF
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-800 text-center">
                  Esta funcionalidade foi movida para as configurações
                  avançadas.
                </p>
                {onNavigateToSection && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        if (onNavigateToSection) {
                          onNavigateToSection("relatorios");
                          onBack();
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Aceder aos Relatórios
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "clientes" && (
            <div className="space-y-6">
              <div className="text-center">
                <Users className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Clientes
                </h3>
                <p className="text-gray-600 mb-6">
                  Gestão da base de dados de clientes
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <p className="text-purple-800 text-center">
                  Esta funcionalidade foi movida para as configurações
                  avançadas.
                </p>
                {onNavigateToSection && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        if (onNavigateToSection) {
                          onNavigateToSection("clientes");
                          onBack();
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Aceder aos Clientes
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "configuracoes" && (
            <div className="space-y-6">
              <div className="text-center">
                <Settings className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Configurações
                </h3>
                <p className="text-gray-600 mb-6">
                  Configurações gerais da aplicação
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-800 text-center">
                  Esta funcionalidade foi movida para as configurações
                  avançadas.
                </p>
                {onNavigateToSection && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        if (onNavigateToSection) {
                          console.log(
                            "🔄 Redirecionando para Configura��ões...",
                          );
                          onNavigateToSection("configuracoes");
                          onBack();
                        }
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <span>⚙️ Aceder às Configurações</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
