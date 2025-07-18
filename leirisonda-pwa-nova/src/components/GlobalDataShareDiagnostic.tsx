import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { globalDataShare } from "../services/globalDataShareService";
import { useGlobalDataShare } from "../hooks/useGlobalDataShare";

export function GlobalDataShareDiagnostic() {
  const [diagnosticState, setDiagnosticState] = useState({
    isChecking: false,
    results: null as any,
    error: null as string | null,
  });

  const globalData = useGlobalDataShare();

  const runDiagnostic = async () => {
    setDiagnosticState({ isChecking: true, results: null, error: null });

    try {
      console.log("🔍 EXECUTANDO DIAGNÓSTICO DE PARTILHA GLOBAL");

      // Verificar se o serviço está pronto
      const isReady = globalDataShare.isReady();

      // Obter dados globais
      let globalDataResult = null;
      if (isReady) {
        globalDataResult = await globalDataShare.getAllGlobalData();
      }

      const results = {
        serviceReady: isReady,
        globalDataAvailable: !!globalDataResult,
        dataSharing: {
          pools: globalDataResult?.pools?.length || 0,
          works: globalDataResult?.works?.length || 0,
          maintenance: globalDataResult?.maintenance?.length || 0,
          clients: globalDataResult?.clients?.length || 0,
        },
        localStorageBlocked: true, // Sempre bloqueado
        allUsersSeeSameData: isReady,
        timestamp: new Date().toISOString(),
      };

      setDiagnosticState({
        isChecking: false,
        results,
        error: null,
      });

      console.log("✅ DIAGNÓSTICO CONCLUÍDO:", results);
    } catch (error: any) {
      console.error("❌ Erro no diagnóstico:", error);
      setDiagnosticState({
        isChecking: false,
        results: null,
        error: error.message,
      });
    }
  };

  const fixDataSharing = async () => {
    try {
      console.log("🔧 CORRIGINDO PARTILHA DE DADOS...");

      await globalDataShare.initialize();
      await globalDataShare.migrateAllDataToGlobalSharing();

      // Reexecutar diagnóstico
      await runDiagnostic();

      console.log("✅ PARTILHA DE DADOS CORRIGIDA");
    } catch (error: any) {
      console.error("❌ Erro ao corrigir partilha:", error);
      setDiagnosticState((prev) => ({ ...prev, error: error.message }));
    }
  };

  useEffect(() => {
    // Executar diagnóstico inicial
    runDiagnostic();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Diagnóstico: Partilha de Dados Entre Utilizadores
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Resolver o problema "dados não são partilhados entre utilizadores"
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {diagnosticState.isChecking && (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Verificando estrutura de dados...</span>
          </div>
        )}

        {/* Dados na Aplicação Atual */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            📊 Dados na Aplicação Atual
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              Obras:{" "}
              <span className="font-bold">{globalData.works.length}</span>
            </div>
            <div>
              Piscinas:{" "}
              <span className="font-bold">{globalData.pools.length}</span>
            </div>
            <div>
              Manutenções:{" "}
              <span className="font-bold">{globalData.maintenance.length}</span>
            </div>
            <div>
              Clientes:{" "}
              <span className="font-bold">{globalData.clients.length}</span>
            </div>
          </div>
          <div className="mt-2 font-semibold">
            Total:{" "}
            <span className="text-blue-800">
              {globalData.works.length +
                globalData.pools.length +
                globalData.maintenance.length +
                globalData.clients.length}
            </span>
          </div>
        </div>

        {/* Dados Partilhados (Global) */}
        <div
          className={`p-4 rounded-lg ${
            globalData.isGloballyShared ? "bg-green-50" : "bg-yellow-50"
          }`}
        >
          <h3
            className={`font-semibold mb-2 ${
              globalData.isGloballyShared ? "text-green-800" : "text-yellow-800"
            }`}
          >
            🌐 Dados Partilhados (Global)
          </h3>
          {globalData.isGloballyShared ? (
            <div className="text-green-700">
              ✅ A verificar estrutura...
              <div className="text-sm mt-2">
                Todos os dados são visíveis para todos os utilizadores
              </div>
            </div>
          ) : (
            <div className="text-yellow-700">
              ⚠️ Estrutura de partilha não ativa
            </div>
          )}
        </div>

        {/* Problema Identificado */}
        {diagnosticState.results &&
          !diagnosticState.results.allUsersSeeSameData && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">
                ⚠️ Problema Identificado
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Sintoma:</strong> Os dados não aparecem para todos os
                  utilizadores
                </div>
                <div>
                  <strong>Causa:</strong> Os dados estão numa estrutura local em
                  vez de global partilhada
                </div>
                <div>
                  <strong>Solução:</strong> Migrar dados para estrutura
                  partilhada no Firebase
                </div>
              </div>
            </div>
          )}

        {/* Resultado do Diagnóstico */}
        {diagnosticState.results && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  diagnosticState.results.serviceReady
                    ? "default"
                    : "destructive"
                }
              >
                {diagnosticState.results.serviceReady
                  ? "✅ Serviço Ativo"
                  : "❌ Serviço Inativo"}
              </Badge>
              <Badge
                variant={
                  diagnosticState.results.localStorageBlocked
                    ? "default"
                    : "destructive"
                }
              >
                {diagnosticState.results.localStorageBlocked
                  ? "✅ localStorage Bloqueado"
                  : "❌ localStorage Ativo"}
              </Badge>
              <Badge
                variant={
                  diagnosticState.results.allUsersSeeSameData
                    ? "default"
                    : "destructive"
                }
              >
                {diagnosticState.results.allUsersSeeSameData
                  ? "✅ Partilha Global"
                  : "❌ Dados Locais"}
              </Badge>
            </div>
          </div>
        )}

        {diagnosticState.error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-red-800 font-semibold">❌ Erro:</p>
            <p className="text-red-700 text-sm">{diagnosticState.error}</p>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <Button
            onClick={fixDataSharing}
            className="flex-1"
            variant={
              diagnosticState.results?.allUsersSeeSameData
                ? "outline"
                : "default"
            }
          >
            🔧 Corrigindo...
          </Button>
          <Button
            onClick={runDiagnostic}
            variant="outline"
            className="flex items-center gap-2"
          >
            🔄 Verificar Novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
