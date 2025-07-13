import React, { useState, useEffect } from "react";
import {
  Database,
  Cloud,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader,
  Play,
  TestTube,
} from "lucide-react";
import { dataMigrationService } from "../services/dataMigrationService";
import { firestoreDataService } from "../services/firestoreDataService";

const MigrationTester: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "running" | "completed" | "error"
  >("idle");
  const [results, setResults] = useState<string[]>([]);
  const [firestoreStatus, setFirestoreStatus] = useState<boolean>(false);

  useEffect(() => {
    // Verificar status do Firestore
    const checkFirestore = () => {
      setFirestoreStatus(firestoreDataService.isFirestoreAvailable());
    };

    checkFirestore();
    const interval = setInterval(checkFirestore, 2000);
    return () => clearInterval(interval);
  }, []);

  const addResult = (message: string) => {
    setResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const runMigrationTest = async () => {
    setIsRunning(true);
    setStatus("running");
    setResults([]);

    try {
      addResult("🚀 Iniciando migração e teste...");

      // Verificar Firestore
      if (!firestoreStatus) {
        addResult("⚠️ Firestore não está disponível - usando modo local");
        setStatus("error");
        return;
      }

      addResult("✅ Firestore disponível e conectado");

      // Verificar dados locais
      addResult("📊 Verificando dados no localStorage...");
      const localData = dataMigrationService.checkLocalStorageData();

      const totalLocal = Object.values(localData).reduce(
        (sum, arr) => sum + arr.length,
        0,
      );
      addResult(`📋 Encontrados ${totalLocal} registros no localStorage`);

      // Executar migração
      addResult("🔄 Iniciando migração para Firestore...");
      const migrationResult = await dataMigrationService.migrateToFirestore();

      if (migrationResult.success) {
        addResult(
          `✅ Migração bem-sucedida: ${migrationResult.migrated} registros migrados`,
        );
        migrationResult.details.forEach((detail) => addResult(detail));
      } else {
        addResult("❌ Falha na migração");
        migrationResult.errors.forEach((error) => addResult(error));
      }

      // Se não havia dados, criar dados de teste
      if (totalLocal === 0) {
        addResult("🧪 Criando dados de teste no Firestore...");
        await dataMigrationService.createTestData();
        addResult("✅ Dados de teste criados");
      }

      // Testar leitura dos dados
      addResult("🔍 Testando leitura dos dados do Firestore...");
      const firestoreData = await dataMigrationService.testFirestoreData();

      const totalFirestore = Object.values(firestoreData).reduce(
        (sum, arr) => sum + arr.length,
        0,
      );
      addResult(`📈 Confirmados ${totalFirestore} registros no Firestore`);

      // Detalhes por coleção
      Object.entries(firestoreData).forEach(([collection, data]) => {
        if (data.length > 0) {
          addResult(`  📁 ${collection}: ${data.length} registros`);
        }
      });

      addResult("🎉 Migração e teste concluídos com sucesso!");
      setStatus("completed");
    } catch (error) {
      addResult(`❌ Erro durante o processo: ${error}`);
      setStatus("error");
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "running":
        return <Loader className="h-5 w-5 animate-spin text-blue-600" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <TestTube className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "running":
        return "border-blue-300 bg-blue-50";
      case "completed":
        return "border-green-300 bg-green-50";
      case "error":
        return "border-red-300 bg-red-50";
      default:
        return "border-gray-300 bg-white";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Migração e Teste de Dados
        </h2>
        <p className="text-gray-600">
          Migrar dados do localStorage para Firestore e testar funcionalidade
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* localStorage */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold text-blue-900">localStorage</h3>
          <p className="text-sm text-blue-700">Dados locais existentes</p>
        </div>

        {/* Seta */}
        <div className="flex items-center justify-center">
          <ArrowRight className="h-8 w-8 text-gray-400" />
        </div>

        {/* Firestore */}
        <div
          className={`border rounded-lg p-4 text-center ${
            firestoreStatus
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <Cloud
            className={`h-8 w-8 mx-auto mb-2 ${
              firestoreStatus ? "text-green-600" : "text-red-600"
            }`}
          />
          <h3
            className={`font-semibold ${
              firestoreStatus ? "text-green-900" : "text-red-900"
            }`}
          >
            Firestore
          </h3>
          <p
            className={`text-sm ${
              firestoreStatus ? "text-green-700" : "text-red-700"
            }`}
          >
            {firestoreStatus ? "Conectado" : "Desconectado"}
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="text-center">
        <button
          onClick={runMigrationTest}
          disabled={isRunning || !firestoreStatus}
          className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold ${
            firestoreStatus
              ? "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isRunning ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Play className="h-5 w-5" />
          )}
          <span>
            {isRunning ? "Executando..." : "Executar Migração e Teste"}
          </span>
        </button>

        {!firestoreStatus && (
          <p className="mt-2 text-sm text-red-600">
            Firestore deve estar conectado para executar migração
          </p>
        )}
      </div>

      {/* Resultados */}
      {results.length > 0 && (
        <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
          <div className="flex items-center space-x-2 mb-3">
            {getStatusIcon()}
            <h3 className="font-semibold">Log de Execução</h3>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className="text-sm font-mono bg-white/50 rounded px-2 py-1"
              >
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold mb-2">O que este teste faz:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Verifica dados existentes no localStorage</li>
          <li>• Migra dados para Firestore (se existirem)</li>
          <li>• Cria dados de teste (se não existirem dados)</li>
          <li>• Testa leitura dos dados do Firestore</li>
          <li>• Confirma que a migração foi bem-sucedida</li>
        </ul>
      </div>
    </div>
  );
};

export default MigrationTester;
