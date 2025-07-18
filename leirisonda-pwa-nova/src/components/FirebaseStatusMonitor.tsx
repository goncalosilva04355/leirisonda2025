import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";

export const FirebaseStatusMonitor: React.FC = () => {
  const [status, setStatus] = useState<
    "checking" | "forced_ready" | "forced_local" | "fallback"
  >("checking");

  useEffect(() => {
    // Verificar status inicial
    if ((window as any).FIREBASE_FORCED_READY) {
      setStatus("forced_ready");
    } else if ((window as any).FIREBASE_FORCED_LOCAL) {
      setStatus("forced_local");
    }

    // Escutar eventos de força inicialização
    const handleForceReady = () => {
      setStatus("forced_ready");
      (window as any).FIREBASE_FORCED_READY = true;
    };

    const handleForceLocal = () => {
      setStatus("forced_local");
      (window as any).FIREBASE_FORCED_LOCAL = true;
    };

    window.addEventListener("firebaseForceReady", handleForceReady);
    window.addEventListener("firebaseForcedLocal", handleForceLocal);

    // Timeout para fallback
    const timeout = setTimeout(() => {
      if (status === "checking") {
        setStatus("fallback");
      }
    }, 5000);

    return () => {
      window.removeEventListener("firebaseForceReady", handleForceReady);
      window.removeEventListener("firebaseForcedLocal", handleForceLocal);
      clearTimeout(timeout);
    };
  }, [status]);

  const getStatusDisplay = () => {
    switch (status) {
      case "checking":
        return {
          icon: <Wifi className="h-4 w-4 animate-pulse" />,
          text: "Inicializando Firebase...",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200",
        };
      case "forced_ready":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Firebase Ativo",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-200",
        };
      case "forced_local":
        return {
          icon: <WifiOff className="h-4 w-4" />,
          text: "Modo Local",
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
        };
      case "fallback":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: "Sistema Local",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-3 py-2 rounded-lg border text-sm font-medium ${display.bgColor} ${display.textColor} ${display.borderColor} shadow-sm`}
    >
      <div className="flex items-center space-x-2">
        {display.icon}
        <span>{display.text}</span>
      </div>
    </div>
  );
};
