/**
 * Botão de teste para verificar funcionalidade Firebase-Only
 */

import React, { useState } from "react";
import { FirebaseOnlyService } from "../services/firebaseOnlyService";
import { FirebaseOnlyAuth } from "../services/firebaseOnlyAuth";

export function FirebaseOnlyTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTest = async () => {
    setIsRunning(true);
    setResults(null);

    console.log("🧪 TESTE FIREBASE-ONLY");
    console.log("======================");

    const testResults = {
      authStatus: false,
      serviceStatus: false,
      dataRead: false,
      dataWrite: false,
      errors: [] as string[],
    };

    try {
      // 1. Testar autenticação
      console.log("1️⃣ Testando autenticação...");
      const authResult = await FirebaseOnlyAuth.initialize();
      testResults.authStatus = authResult;
      console.log(`Auth: ${authResult ? "✅" : "❌"}`);

      // 2. Testar serviço
      console.log("2️⃣ Testando serviço...");
      const serviceResult = await FirebaseOnlyService.initialize();
      testResults.serviceStatus = serviceResult;
      console.log(`Service: ${serviceResult ? "✅" : "❌"}`);

      // 3. Testar leitura de dados
      console.log("3️⃣ Testando leitura...");
      try {
        const users = await FirebaseOnlyService.getUsers();
        const pools = await FirebaseOnlyService.getPools();
        testResults.dataRead = true;
        console.log(`✅ Leitura: ${users.length} users, ${pools.length} pools`);
      } catch (error) {
        testResults.errors.push(`Erro na leitura: ${error}`);
        console.log("❌ Erro na leitura:", error);
      }

      // 4. Testar escrita (teste simples)
      console.log("4️⃣ Testando escrita...");
      try {
        const testPool = {
          name: "Teste Pool " + Date.now(),
          type: "residential",
          location: "Teste",
          client: "Cliente Teste",
        };

        const writeResult = await FirebaseOnlyService.addPool(testPool);
        testResults.dataWrite = writeResult;
        console.log(`✅ Escrita: ${writeResult ? "Sucesso" : "Falhou"}`);
      } catch (error) {
        testResults.errors.push(`Erro na escrita: ${error}`);
        console.log("❌ Erro na escrita:", error);
      }

      setResults(testResults);
    } catch (error) {
      console.error("❌ Erro no teste:", error);
      testResults.errors.push(`Erro geral: ${error}`);
      setResults(testResults);
    } finally {
      setIsRunning(false);
    }
  };

  // Só mostrar se sistema foi migrado
  const isMigrated = localStorage.getItem("migratedToFirebaseOnly") === "true";
  if (!isMigrated) return null;

  return (
    <div className="fixed bottom-20 right-4 max-w-xs">
      <button
        onClick={runTest}
        disabled={isRunning}
        className={`
          px-3 py-2 rounded text-sm font-medium shadow-lg w-full
          ${
            isRunning
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600 text-white"
          }
        `}
      >
        {isRunning ? "🧪 Testando..." : "🧪 Teste Firebase"}
      </button>

      {results && (
        <div className="mt-2 bg-white border rounded p-3 shadow-lg text-xs">
          <div className="font-medium mb-2">Resultado do Teste:</div>

          <div className="space-y-1">
            <div>Auth: {results.authStatus ? "✅" : "❌"}</div>
            <div>Service: {results.serviceStatus ? "✅" : "❌"}</div>
            <div>Leitura: {results.dataRead ? "✅" : "❌"}</div>
            <div>Escrita: {results.dataWrite ? "✅" : "❌"}</div>
          </div>

          {results.errors.length > 0 && (
            <div className="mt-2 text-red-600">
              <div className="font-medium">Erros:</div>
              {results.errors.map((error: string, index: number) => (
                <div key={index} className="text-xs">
                  {error}
                </div>
              ))}
            </div>
          )}

          <div className="mt-2 text-center">
            <button
              onClick={() => setResults(null)}
              className="text-blue-500 underline text-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
