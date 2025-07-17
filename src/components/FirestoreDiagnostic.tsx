// COMPONENTE CONVERTIDO PARA REST API - SEM SDK FIREBASE
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Database, CheckCircle, XCircle, Clock, Settings } from "lucide-react";
import {
  readFromFirestoreRest,
  saveToFirestoreRest,
} from "../utils/firestoreRestApi";

interface DiagnosticStep {
  step: string;
  status: "pending" | "success" | "error";
  message: string;
  details?: string;
}

export const FirestoreDiagnostic: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [forceAPI, setForceAPI] = useState(false);

  const addDiagnostic = (diagnostic: DiagnosticStep) => {
    setDiagnostics((prev) => {
      const existing = prev.findIndex((d) => d.step === diagnostic.step);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = diagnostic;
        return updated;
      }
      return [...prev, diagnostic];
    });
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);

    // Passo 1: Verificar ambiente
    addDiagnostic({
      step: "Ambiente",
      status: "success",
      message: "Usando REST API direta - sem SDK Firebase",
      details: `Modo: REST API pura
Projeto: leiria-1cfc9
SDK Firebase: Eliminado`,
    });

    // Passo 2: Testar conectividade REST API
    addDiagnostic({
      step: "Conectividade REST API",
      status: "pending",
      message: "Testando conexão com Firestore REST API...",
    });

    try {
      const testData = await readFromFirestoreRest("test");
      addDiagnostic({
        step: "Conectividade REST API",
        status: "success",
        message: "REST API funcionando",
        details: `Projeto: leiria-1cfc9
Resposta: ${testData.length} documentos de teste`,
      });

      // Passo 3: Testar escrita
      addDiagnostic({
        step: "Teste de Escrita",
        status: "pending",
        message: "Testando escrita via REST API...",
      });

      try {
        const testDoc = {
          message: "Diagnóstico REST API",
          timestamp: new Date().toISOString(),
          diagnostic: true,
        };

        const success = await saveToFirestoreRest(
          "test",
          `diagnostic_${Date.now()}`,
          testDoc,
        );

        if (success) {
          addDiagnostic({
            step: "Teste de Escrita",
            status: "success",
            message: "Escrita via REST API funcionando",
            details: "Documento de teste criado com sucesso",
          });
        } else {
          addDiagnostic({
            step: "Teste de Escrita",
            status: "error",
            message: "Falha na escrita via REST API",
          });
        }
      } catch (writeError: any) {
        addDiagnostic({
          step: "Teste de Escrita",
          status: "error",
          message: "Erro na escrita via REST API",
          details: writeError.message,
        });
      }

      // Passo 4: Verificar coleções existentes
      addDiagnostic({
        step: "Verificação de Dados",
        status: "pending",
        message: "Verificando coleções existentes...",
      });

      try {
        const [obras, piscinas, clientes, manutencoes] = await Promise.all([
          readFromFirestoreRest("obras"),
          readFromFirestoreRest("piscinas"),
          readFromFirestoreRest("clientes"),
          readFromFirestoreRest("manutencoes"),
        ]);

        addDiagnostic({
          step: "Verificação de Dados",
          status: "success",
          message: "Dados encontrados no Firestore",
          details: `Obras: ${obras.length}
Piscinas: ${piscinas.length}
Clientes: ${clientes.length}
Manutenções: ${manutencoes.length}`,
        });
      } catch (dataError: any) {
        addDiagnostic({
          step: "Verificação de Dados",
          status: "error",
          message: "Erro ao verificar dados",
          details: dataError.message,
        });
      }
    } catch (connectError: any) {
      addDiagnostic({
        step: "Conectividade REST API",
        status: "error",
        message: "Erro na REST API",
        details: connectError.message,
      });
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, [forceAPI]);

  const getStatusIcon = (status: DiagnosticStep["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: DiagnosticStep["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Sucesso
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Erro</Badge>;
      case "pending":
        return <Badge variant="secondary">Processando</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6" />
          <CardTitle>Diagnóstico REST API</CardTitle>
        </div>
        <div className="ml-auto flex space-x-2">
          <Button
            variant="outline"
            onClick={runDiagnostics}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {isRunning ? "Testando..." : "Testar Novamente"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setForceAPI(!forceAPI)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {forceAPI ? "Desativar" : "Forçar"} Teste REST API
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <CardDescription className="mb-6">
          Diagnóstico completo da REST API do Firestore (sem SDK Firebase)
        </CardDescription>

        {forceAPI && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>REST API Forçada:</strong> Testando conectividade
                  direta com Firestore sem usar Firebase SDK.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {diagnostics.map((diagnostic, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 border rounded-lg"
            >
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(diagnostic.status)}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {diagnostic.step}
                  </h3>
                  {getStatusBadge(diagnostic.status)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {diagnostic.message}
                </p>
                {diagnostic.details && (
                  <pre className="text-xs text-gray-500 mt-2 whitespace-pre-wrap bg-gray-50 p-2 rounded">
                    {diagnostic.details}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>

        {diagnostics.length === 0 && !isRunning && (
          <div className="text-center py-8 text-gray-500">
            Clique em "Testar Novamente" para iniciar o diagnóstico
          </div>
        )}

        {isRunning && (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500 animate-spin" />
            <p className="text-gray-600">Executando diagnóstico REST API...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FirestoreDiagnostic;
