import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  Database,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { testFirebaseConnection } from "../utils/firebaseConnectionTest";

interface FirebaseStatusProps {
  className?: string;
}

export const FirebaseAlwaysOnStatus: React.FC<FirebaseStatusProps> = ({
  className,
}) => {
  const [status, setStatus] = useState<"testing" | "connected" | "error">(
    "testing",
  );
  const [details, setDetails] = useState<string>("");
  const [lastTest, setLastTest] = useState<Date | null>(null);

  useEffect(() => {
    const runQuickTest = async () => {
      try {
        // Teste rápido e simples
        const { getFirebaseApp } = await import("../firebase/basicConfig");
        const app = getFirebaseApp();

        setLastTest(new Date());

        if (app && app.options.projectId) {
          setStatus("connected");
          setDetails(`Conectado: ${app.options.projectId}`);
        } else {
          setStatus("error");
          setDetails("Firebase não inicializado");
        }
      } catch (error: any) {
        setStatus("error");
        setDetails(error.message);
        setLastTest(new Date());
      }
    };

    // Teste inicial rápido
    runQuickTest();

    // Desativar polling durante desenvolvimento para evitar refresh no Builder.io
    if (!import.meta.env.DEV) {
      const interval = setInterval(runQuickTest, 30000); // 30 segundos
      return () => clearInterval(interval);
    }
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case "testing":
        return <Database className="h-4 w-4 animate-pulse" />;
      case "connected":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "testing":
        return "text-blue-600";
      case "connected":
        return "text-green-600";
      case "error":
        return "text-red-600";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "testing":
        return "Verificando Firebase...";
      case "connected":
        return "Sincronizado";
      case "error":
        return "Erro de Conexão";
    }
  };

  return (
    <div
      className={`flex items-center space-x-2 ${getStatusColor()} ${className}`}
    >
      {getStatusIcon()}
      <span className="text-sm font-medium">{getStatusText()}</span>
      {lastTest && (
        <span className="text-xs opacity-75">
          {lastTest.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default FirebaseAlwaysOnStatus;
