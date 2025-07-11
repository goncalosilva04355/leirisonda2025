import React, { useState, useEffect } from "react";
import {
  Share,
  Users,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Globe,
  Shield,
  ArrowRight,
  Database,
  Wifi,
  Bug,
} from "lucide-react";
import {
  migrateToSharedData,
  forceSyncAfterMigration,
  checkSharedDataStructure,
} from "../utils/migrateToSharedData";
import { useDataSync } from "../hooks/useDataSync";

interface DataSharingFixManagerProps {
  onClose?: () => void;
}

export const DataSharingFixManager: React.FC<DataSharingFixManagerProps> = ({
  onClose,
}) => {
  const [isFixing, setIsFixing] = useState(false);
  const [fixResult, setFixResult] = useState<string | null>(null);
  const [dataStructure, setDataStructure] = useState<any>(null);
  const [isCheckingStructure, setIsCheckingStructure] = useState(false);

  const { works, pools, maintenance, clients, syncWithFirebase } =
    useDataSync();

  useEffect(() => {
    checkDataStructureStatus();
  }, []);

  const checkDataStructureStatus = async () => {
    setIsCheckingStructure(true);
    try {
      const structure = await checkSharedDataStructure();
      setDataStructure(structure);
    } catch (error) {
      console.error("Error checking data structure:", error);
    } finally {
      setIsCheckingStructure(false);
    }
  };

  const handleFixDataSharing = async () => {
    setIsFixing(true);
    setFixResult(null);

    try {
      console.log("🚀 INICIANDO CORREÇÃO DA PARTILHA DE DADOS...");

      // Step 1: Migrate to shared structure
      const migrationResult = await migrateToSharedData();

      if (migrationResult.success) {
        console.log("✅ Migration completed successfully");

        // Step 2: Force sync after migration
        const syncSuccess = await forceSyncAfterMigration();

        if (syncSuccess) {
          // Step 3: Force refresh of current data
          await syncWithFirebase();

          // Step 4: Recheck structure
          await checkDataStructureStatus();

          setFixResult(
            `✅ PROBLEMA RESOLVIDO!\n\n` +
              `🌐 Dados migrados para estrutura global:\n` +
              `• Piscinas: ${migrationResult.migrated.pools}\n` +
              `• Obras: ${migrationResult.migrated.works}\n` +
              `• Manutenções: ${migrationResult.migrated.maintenance}\n` +
              `• Clientes: ${migrationResult.migrated.clients}\n\n` +
              `🔄 AGORA TODOS OS UTILIZADORES VEEM OS MESMOS DADOS!\n\n` +
              `Pode fechar esta janela e verificar se o problema foi resolvido.`,
          );
        } else {
          setFixResult(
            "⚠️ Migração concluída mas sync falhou. Tente recarregar a página.",
          );
        }
      } else {
        setFixResult(
          `❌ Erro na migração:\n\n` +
            migrationResult.errors.join("\n") +
            `\n\nPor favor, contacte o suporte técnico.`,
        );
      }
    } catch (error) {
      console.error("Error fixing data sharing:", error);
      setFixResult(
        `❌ Erro durante a correção: ${error.message}\n\n` +
          `Tente novamente ou contacte o suporte técnico.`,
      );
    } finally {
      setIsFixing(false);
    }
  };

  const getCurrentDataCount = () => {
    return works.length + pools.length + maintenance.length + clients.length;
  };

  const getSharedDataCount = () => {
    if (!dataStructure) return 0;
    const { sharedCounts } = dataStructure;
    return Object.values(sharedCounts).reduce(
      (total: number, count: number) => total + count,
      0,
    );
  };

  const isProblemDetected = () => {
    const hasLocalData = getCurrentDataCount() > 0;
    const hasSharedData = getSharedDataCount() > 0;

    // Problem exists if we have local data but no shared data, or vice versa
    return (hasLocalData && !hasSharedData) || (!hasLocalData && hasSharedData);
  };

  const getStatusColor = () => {
    if (isCheckingStructure) return "text-gray-500";
    if (isProblemDetected()) return "text-red-600";
    return "text-green-600";
  };

  const getStatusIcon = () => {
    if (isCheckingStructure)
      return <RefreshCw className="h-5 w-5 animate-spin" />;
    if (isProblemDetected()) return <AlertTriangle className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };

  const getStatusMessage = () => {
    if (isCheckingStructure) return "Verificando estrutura de dados...";
    if (isProblemDetected()) return "Problema detectado: Dados não partilhados";
    return "Dados partilhados corretamente";
  };

  return (
    <div className="space-y-6">
      {/* Problem Detection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Bug className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Diagnóstico: Partilha de Dados Entre Utilizadores
            </h2>
            <p className="text-gray-600">
              Resolver o problema "dados não são partilhados entre utilizadores"
            </p>
          </div>
        </div>

        {/* Status */}
        <div className={`flex items-center space-x-2 mb-4 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="font-medium">{getStatusMessage()}</span>
        </div>

        {/* Current Data Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
              <Database className="h-4 w-4 mr-1" />
              Dados na Aplicação Atual
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Obras:</span>
                <span className="font-medium">{works.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Piscinas:</span>
                <span className="font-medium">{pools.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Manutenções:</span>
                <span className="font-medium">{maintenance.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Clientes:</span>
                <span className="font-medium">{clients.length}</span>
              </div>
              <div className="border-t pt-1 flex justify-between font-semibold">
                <span>Total:</span>
                <span>{getCurrentDataCount()}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center">
              <Globe className="h-4 w-4 mr-1" />
              Dados Partilhados (Global)
            </h3>
            {dataStructure ? (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Obras:</span>
                  <span className="font-medium">
                    {dataStructure.sharedCounts.works}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Piscinas:</span>
                  <span className="font-medium">
                    {dataStructure.sharedCounts.pools}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Manutenções:</span>
                  <span className="font-medium">
                    {dataStructure.sharedCounts.maintenance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Clientes:</span>
                  <span className="font-medium">
                    {dataStructure.sharedCounts.clients}
                  </span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{getSharedDataCount()}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                A verificar estrutura...
              </div>
            )}
          </div>
        </div>

        {/* Problem Explanation */}
        {isProblemDetected() && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-red-800 mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Problema Identificado
            </h3>
            <div className="text-sm text-red-700 space-y-1">
              <p>
                <strong>Sintoma:</strong> Os dados não aparecem para todos os
                utilizadores
              </p>
              <p>
                <strong>Causa:</strong> Os dados estão numa estrutura local em
                vez de global partilhada
              </p>
              <p>
                <strong>Solução:</strong> Migrar dados para estrutura partilhada
                no Firebase
              </p>
            </div>
          </div>
        )}

        {/* Fix Button */}
        {isProblemDetected() && (
          <div className="flex space-x-3">
            <button
              onClick={handleFixDataSharing}
              disabled={isFixing}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center space-x-2 font-medium"
            >
              {isFixing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Corrigindo...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" />
                  <span>CORRIGIR PROBLEMA DE PARTILHA</span>
                </>
              )}
            </button>

            <button
              onClick={checkDataStructureStatus}
              disabled={isCheckingStructure}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center space-x-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isCheckingStructure ? "animate-spin" : ""}`}
              />
              <span>Verificar Novamente</span>
            </button>
          </div>
        )}

        {/* Success State */}
        {!isProblemDetected() && !isCheckingStructure && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Sistema Funcionando Corretamente
            </h3>
            <div className="text-sm text-green-700 space-y-1">
              <p>✅ Os dados estão na estrutura global partilhada</p>
              <p>✅ Todos os utilizadores veem os mesmos dados</p>
              <p>✅ Sincronização entre dispositivos ativa</p>
            </div>
          </div>
        )}

        {/* Fix Result */}
        {fixResult && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Resultado da Correção:
            </h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {fixResult}
            </pre>
          </div>
        )}
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
          <Wifi className="h-4 w-4 mr-1" />
          Como Funciona a Partilha de Dados
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>
            Estrutura global: Todos os dados ficam numa localização partilhada
            no Firebase
          </li>
          <li>
            Tempo real: Alterações aparecem imediatamente para todos os
            utilizadores
          </li>
          <li>
            Multi-dispositivo: O mesmo conjunto de dados em telemóveis, tablets
            e computadores
          </li>
          <li>Backup automático: Os dados ficam sempre seguros na nuvem</li>
        </ul>
      </div>

      {/* Close Button */}
      {onClose && (
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};
