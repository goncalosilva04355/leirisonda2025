/**
 * Indicador visual de status Firebase para dispositivos móveis
 */

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Loader } from "lucide-react";

export const FirebaseStatusVisual: React.FC = () => {
  const [status, setStatus] = useState<{
    loading: boolean;
    firebaseReady: boolean;
    dbConnected: boolean;
    authReady: boolean;
    canRead: boolean;
    canWrite: boolean;
    errors: string[];
  }>({
    loading: true,
    firebaseReady: false,
    dbConnected: false,
    authReady: false,
    canRead: false,
    canWrite: false,
    errors: [],
  });

  useEffect(() => {
    testFirebaseStatus();
  }, []);

  const testFirebaseStatus = async () => {
    setStatus((prev) => ({ ...prev, loading: true, errors: [] }));

    const errors: string[] = [];
    let firebaseReady = false;
    let dbConnected = false;
    let authReady = false;
    let canRead = false;
    let canWrite = false;

    try {
      // Test mobile Firebase configuration first
      try {
        const mobileConfig = await import("../firebase/mobileConfig");
        if (mobileConfig.initializeMobileFirebase) {
          console.log("📱 Testando Firebase mobile config...");
          const mobileResult = await mobileConfig.initializeMobileFirebase();

          if (mobileResult.success) {
            firebaseReady = true;
            dbConnected = !!mobileResult.db;
            authReady = !!mobileResult.auth;

            if (mobileResult.db) {
              // Test read/write with mobile config
              try {
                const { doc, getDoc, setDoc } = await import(
                  "firebase/firestore"
                );
                const testDoc = doc(mobileResult.db, "__test__", "mobile-test");

                // Test read
                await getDoc(testDoc);
                canRead = true;

                // Test write
                await setDoc(testDoc, {
                  test: true,
                  timestamp: new Date().toISOString(),
                  device: "mobile",
                  config: "mobile-optimized",
                });
                canWrite = true;

                console.log("✅ Mobile Firebase funcionando!");
              } catch (rwError: any) {
                errors.push(`Mobile R/W: ${rwError.code || rwError.message}`);
              }
            }

            return; // Exit early if mobile config works
          } else {
            errors.push(`Mobile init: ${mobileResult.error}`);
          }
        }
      } catch (mobileError) {
        console.log("📱 Mobile config não disponível, usando config padrão");
      }

      // Fallback to original config
      const config = await import("../firebase/config");

      if (config.isFirebaseReady) {
        firebaseReady = config.isFirebaseReady();
        if (!firebaseReady) {
          errors.push("Firebase não inicializado");
        }
      }

      // Test Firestore
      try {
        if (config.getDB) {
          const db = await config.getDB();
          if (db) {
            dbConnected = true;

            // Test read
            const { doc, getDoc } = await import("firebase/firestore");
            const testDoc = doc(db, "__test__", "mobile-test");
            await getDoc(testDoc);
            canRead = true;

            // Test write
            const { setDoc } = await import("firebase/firestore");
            await setDoc(testDoc, {
              test: true,
              timestamp: new Date().toISOString(),
              device: "mobile",
            });
            canWrite = true;
          } else {
            errors.push("Firestore não disponível");
          }
        } else {
          errors.push("getDB não disponível");
        }
      } catch (dbError: any) {
        errors.push(`DB: ${dbError.code || dbError.message}`);
      }

      // Test Auth
      try {
        if (config.getAuthService) {
          const auth = await config.getAuthService();
          authReady = !!auth;
          if (!authReady) {
            errors.push("Auth não disponível");
          }
        } else {
          errors.push("getAuthService não disponível");
        }
      } catch (authError: any) {
        errors.push(`Auth: ${authError.code || authError.message}`);
      }
    } catch (error: any) {
      errors.push(`Erro geral: ${error.message}`);
    }

    setStatus({
      loading: false,
      firebaseReady,
      dbConnected,
      authReady,
      canRead,
      canWrite,
      errors,
    });
  };

  const getOverallStatus = () => {
    if (status.loading) return "loading";
    if (status.errors.length > 0) return "error";
    if (
      status.firebaseReady &&
      status.dbConnected &&
      status.authReady &&
      status.canRead &&
      status.canWrite
    ) {
      return "success";
    }
    return "warning";
  };

  const getStatusIcon = () => {
    switch (getOverallStatus()) {
      case "loading":
        return <Loader className="w-5 h-5 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    if (status.loading) return "Testando Firebase...";

    const overall = getOverallStatus();
    if (overall === "success") return "Firebase OK ✅";
    if (overall === "error") return "Firebase com problemas ❌";
    return "Firebase parcialmente funcional ⚠️";
  };

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border p-3 max-w-xs z-50">
      <div className="flex items-center space-x-2 mb-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>

      <div className="space-y-1 text-xs">
        <div
          className={`flex items-center space-x-2 ${status.firebaseReady ? "text-green-600" : "text-red-600"}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${status.firebaseReady ? "bg-green-500" : "bg-red-500"}`}
          />
          <span>Firebase App</span>
        </div>

        <div
          className={`flex items-center space-x-2 ${status.dbConnected ? "text-green-600" : "text-red-600"}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${status.dbConnected ? "bg-green-500" : "bg-red-500"}`}
          />
          <span>Base Dados</span>
        </div>

        <div
          className={`flex items-center space-x-2 ${status.authReady ? "text-green-600" : "text-red-600"}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${status.authReady ? "bg-green-500" : "bg-red-500"}`}
          />
          <span>Autenticação</span>
        </div>

        <div
          className={`flex items-center space-x-2 ${status.canRead && status.canWrite ? "text-green-600" : "text-red-600"}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${status.canRead && status.canWrite ? "bg-green-500" : "bg-red-500"}`}
          />
          <span>Leitura/Escrita</span>
        </div>
      </div>

      {status.errors.length > 0 && (
        <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
          <div className="text-xs text-red-700 font-medium mb-1">Erros:</div>
          {status.errors.map((error, index) => (
            <div key={index} className="text-xs text-red-600">
              • {error}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={testFirebaseStatus}
        className="w-full mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200"
        disabled={status.loading}
      >
        {status.loading ? "Testando..." : "Testar Novamente"}
      </button>
    </div>
  );
};

export default FirebaseStatusVisual;
