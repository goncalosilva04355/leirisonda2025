import React, { useState, useEffect, useContext } from "react";
import {
  RefreshCw,
  Play,
  Pause,
  Settings,
  Info,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAutoSync, AutoSyncContext } from "./AutoSyncProvider";
import { SyncStatusCompact } from "./SyncStatusIndicator";

export const AutoSyncDemo: React.FC = () => {
  // Verificar se estamos dentro do contexto
  const context = useContext(AutoSyncContext);
  const isInProvider = !!context;

  // Usar valores padrão se não estivermos no contexto
  const defaultValues = {
    isActive: false,
    syncing: false,
    lastSync: null,
    error: null,
    forceSyncNow: () => {},
    config: { syncInterval: 15000, collections: [], enabled: false },
  };

  const { isActive, syncing, lastSync, error, forceSyncNow, config } =
    isInProvider ? useAutoSync() : defaultValues;

  const syncInfo = {
    statusText: isActive ? "Ativo" : "Inativo",
    healthStatus: error
      ? "error"
      : syncing
        ? "warning"
        : isActive
          ? "healthy"
          : "disabled",
  };
  const [localTestData, setLocalTestData] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);

  // Adiciona logs
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  // Monitor de mudanças
  useEffect(() => {
    if (syncing) {
      addLog("🔄 Sincronização iniciada");
    }
  }, [syncing]);

  useEffect(() => {
    if (lastSync) {
      addLog("✅ Sincronização concluída");
    }
  }, [lastSync]);

  useEffect(() => {
    if (error) {
      addLog(`❌ Erro: ${error}`);
    }
  }, [error]);

  // Simula mudança de dados
  const simulateDataChange = () => {
    const testData = {
      id: Date.now().toString(),
      name: `Teste ${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    // Simula mudança no localStorage
    const currentPools = JSON.parse(localStorage.getItem("pools") || "[]");
    currentPools.push(testData);
    localStorage.setItem("pools", JSON.stringify(currentPools));

    addLog(`📝 Dados de teste adicionados: ${testData.name}`);
    setLocalTestData(JSON.stringify(testData, null, 2));
  };

  // Força limpeza
  const clearTestData = () => {
    const currentPools = JSON.parse(localStorage.getItem("pools") || "[]");
    const filtered = currentPools.filter(
      (item: any) => !item.name?.startsWith("Teste "),
    );
    localStorage.setItem("pools", JSON.stringify(filtered));
    addLog("🧹 Dados de teste removidos");
    setLocalTestData("");
  };

  // Se não estiver no contexto, mostrar aviso
  if (!isInProvider) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                AutoSync não disponível
              </h3>
              <p className="text-yellow-800 mb-4">
                O sistema de sincronização automática não está ativo nesta área.
                Este demo funciona apenas na aplicação principal.
              </p>
              <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
                <h4 className="font-medium text-yellow-900 mb-2">
                  Como ativar:
                </h4>
                <ol className="text-yellow-800 text-sm space-y-1">
                  <li>1. Faça login na aplicação principal</li>
                  <li>2. Vá às configurações da aplicação</li>
                  <li>3. A sincronização automática estará disponível</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Sincronização Automática
          </h2>
          <p className="text-gray-600">
            Sistema de sincronização em tempo real localStorage ↔ Firebase
          </p>
        </div>
        <SyncStatusCompact />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Geral */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p
                className={`font-semibold ${
                  syncInfo.healthStatus === "healthy"
                    ? "text-green-600"
                    : syncInfo.healthStatus === "warning"
                      ? "text-yellow-600"
                      : syncInfo.healthStatus === "error"
                        ? "text-red-600"
                        : "text-gray-600"
                }`}
              >
                {syncInfo.statusText}
              </p>
            </div>
            {syncInfo.healthStatus === "healthy" && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {syncInfo.healthStatus === "warning" && (
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            )}
            {syncInfo.healthStatus === "error" && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>

        {/* Configuração */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Intervalo</p>
              <p className="font-semibold text-gray-900">
                {config.syncInterval / 1000}s
              </p>
            </div>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Última Sync */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Última Sync</p>
              <p className="font-semibold text-gray-900">
                {lastSync ? lastSync.toLocaleTimeString() : "Nunca"}
              </p>
            </div>
            <RefreshCw
              className={`w-5 h-5 ${syncing ? "animate-spin text-blue-500" : "text-gray-400"}`}
            />
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Controles de Teste
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={forceSyncNow}
            disabled={syncing}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            Forçar Sync
          </button>

          <button
            onClick={simulateDataChange}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar Teste
          </button>

          <button
            onClick={clearTestData}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Limpar Testes
          </button>
        </div>
      </div>

      {/* Informações Técnicas */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configuração Técnica
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Collections Monitoradas
            </h4>
            <ul className="space-y-1">
              {config.collections.map((collection) => (
                <li
                  key={collection}
                  className="text-sm text-gray-600 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {collection}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recursos Ativos</h4>
            <ul className="space-y-1">
              <li className="text-sm text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Detecção automática de mudanças
              </li>
              <li className="text-sm text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Sincronização bidirecional
              </li>
              <li className="text-sm text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Listeners do Firebase em tempo real
              </li>
              <li className="text-sm text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Interceptação de localStorage
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dados de Teste */}
      {localTestData && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Último Dado de Teste
          </h3>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
            {localTestData}
          </pre>
        </div>
      )}

      {/* Logs */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Log de Atividade
        </h3>

        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma atividade registrada</p>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className="text-sm font-mono text-gray-700 p-2 bg-gray-50 rounded"
              >
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alertas */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">
                Erro na Sincronização
              </h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Informação */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Como Funciona</h4>
            <p className="text-blue-700 text-sm mt-1">
              O sistema monitora automaticamente mudanças no localStorage e no
              Firebase, sincronizando os dados bidirecionalmente em tempo real.
              Qualquer alteração em qualquer parte da aplicação dispara uma
              sincronização automática.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Importação de ícones que faltam
import { Plus, Trash2 } from "lucide-react";
