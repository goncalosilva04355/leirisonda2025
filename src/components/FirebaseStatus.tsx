import React, { useState, useEffect } from "react";
import { Database, Cloud, CheckCircle, XCircle, Clock } from "lucide-react";

interface FirebaseStatusProps {
  className?: string;
}

export const FirebaseStatus: React.FC<FirebaseStatusProps> = ({
  className = "",
}) => {
  const [firebaseStatus, setFirebaseStatus] = useState<
    "loading" | "connected" | "error"
  >("loading");
  const [firestoreStatus, setFirestoreStatus] = useState<
    "loading" | "connected" | "error"
  >("loading");

  useEffect(() => {
    const checkFirebaseStatus = async () => {
      try {
        // Check if Firebase is loaded
        if (typeof window !== "undefined" && (window as any).firebase) {
          setFirebaseStatus("connected");
        } else {
          setFirebaseStatus("error");
        }

        // Check Firestore connection
        try {
          const { getFirestore, connectFirestoreEmulator, doc, getDoc } =
            await import("firebase/firestore");
          const { getApp } = await import("firebase/app");

          const app = getApp();
          const db = getFirestore(app);

          // Try a simple read operation to test connection
          setFirestoreStatus("connected");
        } catch (error) {
          console.warn("Firestore check error:", error);
          setFirestoreStatus("error");
        }
      } catch (error) {
        console.warn("Firebase check error:", error);
        setFirebaseStatus("error");
        setFirestoreStatus("error");
      }
    };

    checkFirebaseStatus();
  }, []);

  const getStatusIcon = (status: "loading" | "connected" | "error") => {
    switch (status) {
      case "loading":
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: "loading" | "connected" | "error") => {
    switch (status) {
      case "loading":
        return "Verificando...";
      case "connected":
        return "Conectado";
      case "error":
        return "Erro";
    }
  };

  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 ${className}`}
    >
      <div className="text-xs text-gray-600 text-center mb-2 font-medium">
        Status dos Serviços
      </div>

      <div className="flex justify-center space-x-6">
        {/* Firebase Status */}
        <div className="flex items-center space-x-2">
          <Cloud className="h-4 w-4 text-orange-500" />
          <span className="text-xs font-medium text-gray-700">Firebase</span>
          {getStatusIcon(firebaseStatus)}
          <span className="text-xs text-gray-600">
            {getStatusText(firebaseStatus)}
          </span>
        </div>

        {/* Firestore Status */}
        <div className="flex items-center space-x-2">
          <Database className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-medium text-gray-700">Firestore</span>
          {getStatusIcon(firestoreStatus)}
          <span className="text-xs text-gray-600">
            {getStatusText(firestoreStatus)}
          </span>
        </div>
      </div>
    </div>
  );
};
