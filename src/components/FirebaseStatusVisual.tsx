// COMPONENTE CONVERTIDO PARA REST API - SEM SDK FIREBASE
import React, { useState, useEffect } from "react";
import {
  readFromFirestoreRest,
  saveToFirestoreRest,
} from "../utils/firestoreRestApi";

export const FirebaseStatusVisual: React.FC = () => {
  const [status, setStatus] = useState<{
    loading: boolean;
    restApiReady: boolean;
    dbConnected: boolean;
    dataCount: number;
    errors: string[];
  }>({
    loading: true,
    restApiReady: false,
    dbConnected: false,
    dataCount: 0,
    errors: [],
  });

  useEffect(() => {
    testRestApiStatus();
  }, []);

  const testRestApiStatus = async () => {
    setStatus((prev) => ({ ...prev, loading: true, errors: [] }));

    const errors: string[] = [];
    let restApiReady = false;
    let dbConnected = false;
    let dataCount = 0;

    try {
      console.log("🌐 Testando REST API do Firestore...");

      // Test basic connectivity
      const testData = await readFromFirestoreRest("test");
      restApiReady = true;
      console.log("✅ REST API conectada");

      // Test read/write
      try {
        const testDoc = {
          message: "Mobile test",
          timestamp: new Date().toISOString(),
          mobile: true,
        };

        const writeSuccess = await saveToFirestoreRest(
          "test",
          `mobile_${Date.now()}`,
          testDoc,
        );

        if (writeSuccess) {
          dbConnected = true;
          console.log("✅ REST API funcional (leitura/escrita)");
        } else {
          errors.push("Escrita REST API falhou");
        }
      } catch (rwError: any) {
        console.error("❌ Erro leitura/escrita REST API:", rwError);
        errors.push(`Leitura/escrita: ${rwError.message}`);
      }

      // Count total data
      try {
        const [obras, piscinas, clientes, manutencoes] = await Promise.all([
          readFromFirestoreRest("obras"),
          readFromFirestoreRest("piscinas"),
          readFromFirestoreRest("clientes"),
          readFromFirestoreRest("manutencoes"),
        ]);

        dataCount =
          obras.length + piscinas.length + clientes.length + manutencoes.length;
        console.log(`📊 Total de dados: ${dataCount}`);
      } catch (countError: any) {
        console.warn("⚠️ Erro ao contar dados:", countError);
        errors.push(`Contagem de dados: ${countError.message}`);
      }
    } catch (error: any) {
      console.error("❌ Erro na REST API:", error);
      errors.push(`Conectividade: ${error.message}`);
    }

    setStatus({
      loading: false,
      restApiReady,
      dbConnected,
      dataCount,
      errors,
    });
  };

  const getOverallStatus = () => {
    if (status.loading) return "loading";
    if (status.restApiReady && status.dbConnected) return "success";
    if (status.restApiReady) return "warning";
    return "error";
  };

  const getStatusText = () => {
    if (status.loading) return "Testando REST API...";

    const overall = getOverallStatus();
    if (overall === "success") return "REST API OK ✅";
    if (overall === "error") return "REST API com problemas ❌";
    return "REST API parcialmente funcional ⚠️";
  };

  const getStatusColor = () => {
    const overall = getOverallStatus();
    if (overall === "success") return "text-green-600 bg-green-100";
    if (overall === "error") return "text-red-600 bg-red-100";
    if (overall === "warning") return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className={`px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor()}`}
      >
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${status.restApiReady ? "bg-green-500" : "bg-red-500"}`}
          />
          <span>REST API</span>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${status.dbConnected ? "bg-green-500" : "bg-red-500"}`}
          />
          <span>Leitura/Escrita</span>
        </div>

        {status.dataCount > 0 && (
          <div className="text-xs mt-1">📊 {status.dataCount} documentos</div>
        )}

        {status.errors.length > 0 && (
          <div className="text-xs mt-1 text-red-600">
            ⚠️ {status.errors.length} erro(s)
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-center">
        <div className={`px-2 py-1 rounded ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      <button
        onClick={testRestApiStatus}
        className="w-full mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200"
        disabled={status.loading}
      >
        {status.loading ? "Testando..." : "Testar REST API"}
      </button>
    </div>
  );
};

export default FirebaseStatusVisual;
