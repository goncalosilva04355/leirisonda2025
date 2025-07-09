import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";

export const FirebaseStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<
    "connecting" | "connected" | "local" | "error"
  >("connecting");

  useEffect(() => {
    // Escutar eventos de status do Firebase
    const handleFirebaseReady = () => setStatus("connected");
    const handleFirebaseLocal = () => setStatus("local");

    window.addEventListener("firebaseReady", handleFirebaseReady);
    window.addEventListener("firebaseLocalMode", handleFirebaseLocal);

    // Timeout para considerar erro se não conectar
    const timeout = setTimeout(() => {
      if (status === "connecting") {
        setStatus("local");
      }
    }, 10000); // 10 segundos

    return () => {
      window.removeEventListener("firebaseReady", handleFirebaseReady);
      window.removeEventListener("firebaseLocalMode", handleFirebaseLocal);
      clearTimeout(timeout);
    };
  }, [status]);

  const getStatusInfo = () => {
    switch (status) {
      case "connecting":
        return {
          icon: <Wifi className="h-4 w-4 animate-pulse" />,
          text: "Conectando...",
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
        };
      case "connected":
        return {
          icon: <Wifi className="h-4 w-4" />,
          text: "Sincronização ativa",
          color: "text-green-600 bg-green-50 border-green-200",
        };
      case "local":
        return {
          icon: <WifiOff className="h-4 w-4" />,
          text: "Modo local",
          color: "text-blue-600 bg-blue-50 border-blue-200",
        };
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: "Erro de conexão",
          color: "text-red-600 bg-red-50 border-red-200",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm ${statusInfo.color}`}
    >
      {statusInfo.icon}
      <span>{statusInfo.text}</span>
    </div>
  );
};
