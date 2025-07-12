import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, Database, DatabaseZap, Circle } from "lucide-react";

interface FirebaseStatusDisplayProps {
  className?: string;
}

export const FirebaseStatusDisplay: React.FC<FirebaseStatusDisplayProps> = ({
  className = "",
}) => {
  const [firebaseStatus, setFirebaseStatus] = useState<
    "connected" | "disconnected" | "loading"
  >("loading");
  const [firestoreStatus, setFirestoreStatus] = useState<
    "connected" | "disconnected" | "loading"
  >("loading");
  const [firebaseVersion, setFirebaseVersion] = useState<string>("");

  useEffect(() => {
    const checkFirebaseStatus = async () => {
      try {
        // Check if Firebase is available globally
        if (typeof window !== "undefined" && (window as any).firebase) {
          setFirebaseStatus("connected");
          const firebase = (window as any).firebase;
          setFirebaseVersion(firebase.SDK_VERSION || "Unknown");
        } else {
          setFirebaseStatus("disconnected");
        }

        // Check Firestore status
        try {
          if (
            typeof window !== "undefined" &&
            (window as any).firebase?.firestore
          ) {
            const db = (window as any).firebase.firestore();
            // Try a simple read operation to test connectivity
            await db.collection("test").limit(1).get();
            setFirestoreStatus("connected");
          } else {
            setFirestoreStatus("disconnected");
          }
        } catch (error) {
          console.log("Firestore check:", error);
          setFirestoreStatus("disconnected");
        }
      } catch (error) {
        console.log("Firebase check error:", error);
        setFirebaseStatus("disconnected");
        setFirestoreStatus("disconnected");
      }
    };

    checkFirebaseStatus();

    // Check status every 5 seconds
    const interval = setInterval(checkFirebaseStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: "connected" | "disconnected" | "loading") => {
    switch (status) {
      case "connected":
        return "text-green-500";
      case "disconnected":
        return "text-red-500";
      case "loading":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (
    service: "firebase" | "firestore",
    status: "connected" | "disconnected" | "loading",
  ) => {
    if (status === "loading") {
      return <Circle className="h-3 w-3 animate-pulse" />;
    }

    if (service === "firebase") {
      return status === "connected" ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      );
    } else {
      return status === "connected" ? (
        <DatabaseZap className="h-3 w-3" />
      ) : (
        <Database className="h-3 w-3" />
      );
    }
  };

  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-lg p-3 ${className}`}
    >
      <div className="text-xs font-medium text-gray-600 mb-2 text-center">
        Status dos Serviços
      </div>

      <div className="flex items-center justify-between space-x-4 text-xs">
        {/* Firebase Status */}
        <div className="flex items-center space-x-1">
          <span className={getStatusColor(firebaseStatus)}>
            {getStatusIcon("firebase", firebaseStatus)}
          </span>
          <span className="text-gray-700">Firebase</span>
          <span className={`font-medium ${getStatusColor(firebaseStatus)}`}>
            {firebaseStatus === "connected"
              ? "●"
              : firebaseStatus === "disconnected"
                ? "●"
                : "●"}
          </span>
        </div>

        {/* Version */}
        {firebaseVersion && (
          <div className="text-gray-500 text-[10px]">v{firebaseVersion}</div>
        )}

        {/* Firestore Status */}
        <div className="flex items-center space-x-1">
          <span className={getStatusColor(firestoreStatus)}>
            {getStatusIcon("firestore", firestoreStatus)}
          </span>
          <span className="text-gray-700">Firestore</span>
          <span className={`font-medium ${getStatusColor(firestoreStatus)}`}>
            {firestoreStatus === "connected"
              ? "●"
              : firestoreStatus === "disconnected"
                ? "●"
                : "●"}
          </span>
        </div>
      </div>

      {/* Status text */}
      <div className="mt-2 text-center">
        {firebaseStatus === "connected" && firestoreStatus === "connected" && (
          <span className="text-[10px] text-green-600 font-medium">
            ✅ Todos os serviços online
          </span>
        )}
        {(firebaseStatus === "disconnected" ||
          firestoreStatus === "disconnected") && (
          <span className="text-[10px] text-red-600 font-medium">
            ❌ Alguns serviços offline
          </span>
        )}
        {(firebaseStatus === "loading" || firestoreStatus === "loading") && (
          <span className="text-[10px] text-yellow-600 font-medium">
            🔄 Verificando conexão...
          </span>
        )}
      </div>
    </div>
  );
};
