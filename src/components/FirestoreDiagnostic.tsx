import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Database,
  Wifi,
  Settings,
  Terminal,
} from "lucide-react";

interface DiagnosticResult {
  step: string;
  status: "success" | "error" | "warning" | "pending";
  message: string;
  details?: string;
}

export default function FirestoreDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [forceFirebase, setForceFirebase] = useState(false);

  const addDiagnostic = (result: DiagnosticResult) => {
    setDiagnostics((prev) => [...prev, result]);
  };

  const clearDiagnostics = () => {
    setDiagnostics([]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    clearDiagnostics();

    // Passo 1: Verificar variáveis de ambiente
    addDiagnostic({
      step: "Variáveis de Ambiente",
      status: "pending",
      message: "Verificando configuração...",
    });

    try {
      const isNetlify =
        import.meta.env.NETLIFY === "true" ||
        import.meta.env.VITE_IS_NETLIFY === "true";
      const isDev = import.meta.env.DEV;
      const hasFirebaseVars = !!import.meta.env.VITE_FIREBASE_API_KEY;
      const forceFirebaseEnabled =
        import.meta.env.VITE_FORCE_FIREBASE === "true" ||
        import.meta.env.VITE_FORCE_FIREBASE === "true" ||
        forceFirebase;

      addDiagnostic({
        step: "Variáveis de Ambiente",
        status: isNetlify ? "success" : hasFirebaseVars ? "warning" : "error",
        message: isNetlify
          ? "Executando no Netlify - Firebase ativo"
          : hasFirebaseVars
            ? "Variáveis Firebase detectadas"
            : "Firebase desativado (desenvolvimento local)",
        details: `
Environment: ${isDev ? "Development" : "Production"}
Netlify: ${isNetlify}
Firebase Vars: ${hasFirebaseVars}
Force Firebase: ${forceFirebaseEnabled}
        `.trim(),
      });

      if (!isNetlify && !forceFirebaseEnabled) {
        addDiagnostic({
          step: "Configuração Firebase",
          status: "success",
          message:
            "Firebase desativado durante desenvolvimento (configurado corretamente)",
          details: `VITE_FORCE_FIREBASE=${import.meta.env.VITE_FORCE_FIREBASE}
Modo desenvolvimento: ${isDev}
Aplicação funcionará com localStorage apenas
Firebase será ativado automaticamente no Netlify`,
        });
        setIsRunning(false);
        return;
      }

      // Passo 2: Verificar inicialização do Firebase
      addDiagnostic({
        step: "Inicialização Firebase",
        status: "pending",
        message: "Verificando Firebase App...",
      });

      try {
        const { getFirebaseApp } = await import("../firebase/basicConfig");
        const app = getFirebaseApp();

        if (app) {
          addDiagnostic({
            step: "Inicialização Firebase",
            status: "success",
            message: "Firebase App inicializada com sucesso",
            details: `Project ID: ${app.options.projectId}`,
          });
        } else {
          addDiagnostic({
            step: "Inicialização Firebase",
            status: "error",
            message: "Firebase App não inicializada",
          });
          setIsRunning(false);
          return;
        }
      } catch (error: any) {
        addDiagnostic({
          step: "Inicialização Firebase",
          status: "error",
          message: "Erro ao inicializar Firebase",
          details: error.message,
        });
        setIsRunning(false);
        return;
      }

      // Passo 3: Verificar Firestore
      addDiagnostic({
        step: "Firestore",
        status: "pending",
        message: "Verificando Firestore...",
      });

      try {
        const { getFirebaseFirestoreAsync } = await import(
          "../firebase/firestoreConfig"
        );
        const firestore = await getFirebaseFirestoreAsync();

        if (firestore) {
          addDiagnostic({
            step: "Firestore",
            status: "success",
            message: "Firestore inicializado com sucesso",
          });

          // Passo 4: Teste de conectividade
          addDiagnostic({
            step: "Conectividade",
            status: "pending",
            message: "Testando conexão com Firestore...",
          });

          try {
            const { doc, getDoc } = await import("firebase/firestore");
            const testDoc = doc(firestore, "connection-test", "ping");
            await getDoc(testDoc);

            addDiagnostic({
              step: "Conectividade",
              status: "success",
              message: "Conexão com Firestore funcionando",
            });

            // Passo 5: Testar coleção Obras
            addDiagnostic({
              step: "Coleção Obras",
              status: "pending",
              message: "Testando acesso à coleção Obras...",
            });

            try {
              const { collection, getDocs, limit, query } = await import(
                "firebase/firestore"
              );
              const obrasRef = collection(firestore, "obras");
              const obrasQuery = query(obrasRef, limit(1));
              const snapshot = await getDocs(obrasQuery);

              addDiagnostic({
                step: "Coleção Obras",
                status: "success",
                message: `Coleção Obras acessível (${snapshot.size} documentos encontrados)`,
              });
            } catch (error: any) {
              addDiagnostic({
                step: "Coleção Obras",
                status: "error",
                message: "Erro ao acessar coleção Obras",
                details: error.message,
              });
            }
          } catch (error: any) {
            addDiagnostic({
              step: "Conectividade",
              status: "error",
              message: "Erro na conectividade com Firestore",
              details: error.message,
            });
          }
        } else {
          addDiagnostic({
            step: "Firestore",
            status: "error",
            message: "Firestore não inicializado",
          });
        }
      } catch (error: any) {
        addDiagnostic({
          step: "Firestore",
          status: "error",
          message: "Erro ao verificar Firestore",
          details: error.message,
        });
      }
    } catch (error: any) {
      addDiagnostic({
        step: "Diagnóstico",
        status: "error",
        message: "Erro durante diagnóstico",
        details: error.message,
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "pending":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: DiagnosticResult["status"]) => {
    const variants = {
      success: "default",
      error: "destructive",
      warning: "secondary",
      pending: "outline",
    } as const;

    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  useEffect(() => {
    // Auto-executar na primeira carga
    runDiagnostics();
  }, [forceFirebase]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Diagnóstico do Firestore
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Terminal className="h-4 w-4" />
              )}
              {isRunning ? "Executando..." : "Executar Diagnóstico"}
            </Button>

            <Button
              variant="outline"
              onClick={() => setForceFirebase(!forceFirebase)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {forceFirebase ? "Desativar" : "Forçar"} Firebase Local
            </Button>

            <Button
              variant="ghost"
              onClick={clearDiagnostics}
              disabled={isRunning}
            >
              Limpar
            </Button>
          </div>

          {forceFirebase && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                <div>
                  <p className="text-sm text-yellow-700">
                    <strong>Firebase Forçado Localmente:</strong> Isto pode
                    causar problemas de quotas ou conectividade. Use apenas para
                    debugging.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {diagnostics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-6 w-6" />
              Resultados do Diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diagnostics.map((diagnostic, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 border rounded-lg"
                >
                  {getStatusIcon(diagnostic.status)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{diagnostic.step}</h4>
                      {getStatusBadge(diagnostic.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {diagnostic.message}
                    </p>
                    {diagnostic.details && (
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                        {diagnostic.details}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
