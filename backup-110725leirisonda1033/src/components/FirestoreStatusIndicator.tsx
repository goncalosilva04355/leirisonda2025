import React, { useState, useEffect } from "react";
import {
  Database,
  Cloud,
  CloudOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  isFirebaseFirestoreAvailable,
  testFirebaseFirestore,
} from "../firebase/basicConfig";

const FirestoreStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<
    "checking" | "available" | "unavailable"
  >("checking");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkFirestore = async () => {
      // Esperar um pouco para o Firestore inicializar
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const isAvailable = isFirebaseFirestoreAvailable();
        if (isAvailable) {
          const testResult = await testFirebaseFirestore();
          setStatus(testResult ? "available" : "unavailable");
        } else {
          setStatus("unavailable");
        }
      } catch (error) {
        setStatus("unavailable");
      }
    };

    checkFirestore();
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case "checking":
        return {
          icon: <Database className="h-4 w-4 animate-pulse" />,
          text: "Verificando Firestore...",
          color: "bg-yellow-50 text-yellow-700 border-yellow-200",
          detail: "A verificar conexão com a base de dados na nuvem",
        };
      case "available":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Firestore Ativo",
          color: "bg-green-50 text-green-700 border-green-200",
          detail: "Base de dados na nuvem conectada e funcional",
        };
      case "unavailable":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: "Modo Local",
          color: "bg-blue-50 text-blue-700 border-blue-200",
          detail: "Usando armazenamento local - dados guardados no dispositivo",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-all ${statusInfo.color} ${showDetails ? "shadow-lg" : "shadow-sm"}`}
        onClick={() => setShowDetails(!showDetails)}
      >
        {statusInfo.icon}
        <span className="font-medium">{statusInfo.text}</span>
        {status === "available" && <Cloud className="h-3 w-3" />}
        {status === "unavailable" && <CloudOff className="h-3 w-3" />}
      </div>

      {showDetails && (
        <div
          className={`mt-2 p-3 rounded-lg border text-xs ${statusInfo.color}`}
        >
          <p>{statusInfo.detail}</p>
          {status === "available" && (
            <p className="mt-1 font-medium">
              ✅ Passo 3: Firestore configurado
            </p>
          )}
          {status === "unavailable" && (
            <p className="mt-1">💾 Dados guardados localmente</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FirestoreStatusIndicator;
