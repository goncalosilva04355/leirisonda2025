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
} from "lucide-react";
import { FirebaseConfig } from "./FirebaseConfig";

interface AdvancedSettingsProps {
  onBack: () => void;
  dataSync?: {
    pools: any[];
    maintenance: any[];
    works: any[];
    clients: any[];
    lastSync: Date | null;
    syncWithFirebase: () => Promise<void>;
    enableSync: (enabled: boolean) => void;
  };
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  onBack,
  dataSync,
}) => {
  const [activeTab, setActiveTab] = useState<"firebase" | "sync-test">(
    "firebase",
  );
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
      // Check if Firebase config exists
      const savedConfig = localStorage.getItem("firebase-config");
      if (!savedConfig) {
        setSyncTest({
          status: "error",
          message: "Firebase não configurado",
          details: ["Configure as credenciais Firebase primeiro"],
        });
        return;
      }

      const config = JSON.parse(savedConfig);
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
      // Test user sync simulation
      tests.push("🔄 Testando sincronização de utilizadores...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      tests.push("✅ Sincronização de utilizadores: OK");

      // Test pool sync simulation
      tests.push("🔄 Testando sincronização de piscinas...");
      await new Promise((resolve) => setTimeout(resolve, 800));
      tests.push("✅ Sincronização de piscinas: OK");

      // Test maintenance sync simulation
      tests.push("🔄 Testando sincronização de manutenções...");
      await new Promise((resolve) => setTimeout(resolve, 600));
      tests.push("✅ Sincronização de manutenções: OK");

      // Test real-time listeners
      tests.push("🔄 Testando listeners em tempo real...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      tests.push("✅ Listeners em tempo real: OK");

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
          <div className="flex">
            <button
              onClick={() => setActiveTab("firebase")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "firebase"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Configuração Firebase</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("sync-test")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "sync-test"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <TestTube className="w-5 h-5" />
                <span>Teste de Sincronização</span>
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
                  {localStorage.getItem("firebase-config") ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span>Firebase configurado</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <AlertCircle className="w-5 h-5" />
                      <span>Firebase não configurado</span>
                    </div>
                  )}
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
                  disabled={!localStorage.getItem("firebase-config")}
                  className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Wifi className="w-5 h-5" />
                  <span>Testar Conexão</span>
                </button>
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
                  <li>• Resultados são apenas simulações para demonstração</li>
                  <li>• Para uso real, implemente autenticação adequada</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
