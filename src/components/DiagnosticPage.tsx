import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, XCircle, Loader } from "lucide-react";
import LoginTest from "./LoginTest";
import * as firebaseModule from "../firebase/leiriaConfig";

interface DiagnosticResult {
  name: string;
  status: "success" | "error" | "warning" | "loading";
  message: string;
  details?: string;
}

export const DiagnosticPage: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateDiagnostic = (
    name: string,
    result: Omit<DiagnosticResult, "name">,
  ) => {
    setDiagnostics((prev) => {
      const existing = prev.findIndex((d) => d.name === name);
      const newDiagnostic = { name, ...result };

      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newDiagnostic;
        return updated;
      } else {
        return [...prev, newDiagnostic];
      }
    });
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);

    // 1. Verificar localStorage
    updateDiagnostic("localStorage", {
      status: "loading",
      message: "Verificando localStorage...",
    });
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      updateDiagnostic("localStorage", {
        status: "success",
        message: "localStorage disponível e funcional",
      });
    } catch (error: any) {
      updateDiagnostic("localStorage", {
        status: "error",
        message: "localStorage não disponível",
        details: error.message,
      });
    }

    // 2. Verificar sessionStorage
    updateDiagnostic("sessionStorage", {
      status: "loading",
      message: "Verificando sessionStorage...",
    });
    try {
      sessionStorage.setItem("test", "test");
      sessionStorage.removeItem("test");
      updateDiagnostic("sessionStorage", {
        status: "success",
        message: "sessionStorage disponível e funcional",
      });
    } catch (error: any) {
      updateDiagnostic("sessionStorage", {
        status: "error",
        message: "sessionStorage não disponível",
        details: error.message,
      });
    }

    // 3. Verificar se está em modo privado
    updateDiagnostic("privateMode", {
      status: "loading",
      message: "Verificando modo privado...",
    });
    try {
      const isPrivate = (() => {
        try {
          localStorage.setItem("__private_test__", "test");
          localStorage.removeItem("__private_test__");
          return false;
        } catch {
          return true;
        }
      })();

      updateDiagnostic("privateMode", {
        status: isPrivate ? "warning" : "success",
        message: isPrivate ? "Navegação privada detectada" : "Navegação normal",
      });
    } catch (error: any) {
      updateDiagnostic("privateMode", {
        status: "error",
        message: "Erro ao verificar modo privado",
        details: error.message,
      });
    }

    // 4. Verificar dados existentes
    updateDiagnostic("existingData", {
      status: "loading",
      message: "Verificando dados existentes...",
    });
    try {
      const currentUser = localStorage.getItem("currentUser");
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      const appUsers = localStorage.getItem("app-users");

      updateDiagnostic("existingData", {
        status: "success",
        message: `Dados encontrados: ${
          [
            currentUser ? "currentUser" : null,
            isAuthenticated ? "isAuthenticated" : null,
            appUsers ? "app-users" : null,
          ]
            .filter(Boolean)
            .join(", ") || "nenhum"
        }`,
      });
    } catch (error: any) {
      updateDiagnostic("existingData", {
        status: "error",
        message: "Erro ao verificar dados existentes",
        details: error.message,
      });
    }

    // 5. Verificar Firebase
    updateDiagnostic("firebase", {
      status: "loading",
      message: "Verificando Firebase...",
    });
    try {
      // Tentar importar Firebase
      const firebaseModule = await import("../firebase/leiriaConfig");
      const isReady = firebaseModule.isFirebaseReady();

      updateDiagnostic("firebase", {
        status: isReady ? "success" : "warning",
        message: isReady
          ? "Firebase inicializado"
          : "Firebase não inicializado (normal antes do login)",
      });
    } catch (error: any) {
      updateDiagnostic("firebase", {
        status: "error",
        message: "Erro ao verificar Firebase",
        details: error.message,
      });
    }

    // 6. Verificar APIs de rede
    updateDiagnostic("network", {
      status: "loading",
      message: "Verificando conectividade...",
    });
    try {
      const response = await fetch("https://httpbin.org/get", {
        method: "GET",
        mode: "cors",
      });

      if (response.ok) {
        updateDiagnostic("network", {
          status: "success",
          message: "Conectividade de rede OK",
        });
      } else {
        updateDiagnostic("network", {
          status: "warning",
          message: `Rede disponível mas resposta: ${response.status}`,
        });
      }
    } catch (error: any) {
      updateDiagnostic("network", {
        status: "error",
        message: "Sem conectividade de rede ou CORS bloqueado",
        details: error.message,
      });
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "loading":
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "loading":
        return "border-blue-200 bg-blue-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4 text-blue-600">
            🔍 Diagnóstico do Sistema
          </h1>

          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Verificação automática do estado da aplicação
            </p>
            <button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isRunning ? <Loader className="w-4 h-4 animate-spin" /> : null}
              {isRunning ? "Executando..." : "Executar Novamente"}
            </button>
          </div>

          <div className="grid gap-3">
            {diagnostics.map((diagnostic) => (
              <div
                key={diagnostic.name}
                className={`border rounded-lg p-4 ${getStatusColor(diagnostic.status)}`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(diagnostic.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold">{diagnostic.name}</h3>
                    <p className="text-sm">{diagnostic.message}</p>
                    {diagnostic.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-gray-600">
                          Ver detalhes
                        </summary>
                        <pre className="text-xs mt-1 p-2 bg-white rounded border overflow-x-auto">
                          {diagnostic.details}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teste de Autenticação */}
        <LoginTest />

        {/* Informações do Sistema */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            ℹ️ Informações do Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>User Agent:</strong>
              <div className="font-mono text-xs mt-1 p-2 bg-gray-100 rounded break-all">
                {navigator.userAgent}
              </div>
            </div>
            <div>
              <strong>URL:</strong>
              <div className="font-mono text-xs mt-1 p-2 bg-gray-100 rounded break-all">
                {window.location.href}
              </div>
            </div>
            <div>
              <strong>Timestamp:</strong>
              <div className="font-mono text-xs mt-1 p-2 bg-gray-100 rounded">
                {new Date().toISOString()}
              </div>
            </div>
            <div>
              <strong>Viewport:</strong>
              <div className="font-mono text-xs mt-1 p-2 bg-gray-100 rounded">
                {window.innerWidth} x {window.innerHeight}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;
