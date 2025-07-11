import React, { useState, useEffect } from "react";
import {
  firestore,
  getFirestoreStatus,
  getFirestoreError,
} from "../firebase/justFirestore";

export function FirestoreStatus() {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("🔄 Verificando Firestore...");

  useEffect(() => {
    // Verificar estado inicial
    const checkStatus = () => {
      const currentStatus = getFirestoreStatus();
      const error = getFirestoreError();

      if (currentStatus === "connected") {
        setStatus("connected");
        setMessage("✅ Firestore conectado");
      } else if (currentStatus === "error") {
        setStatus("error");
        setMessage(`❌ Erro: ${error}`);
      } else {
        setStatus("checking");
        setMessage("🔄 Inicializando...");
      }
    };

    // Verificar imediatamente
    checkStatus();

    // Verificar novamente após 3 segundos
    const timer = setTimeout(checkStatus, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "green";
      case "error":
        return "red";
      default:
        return "orange";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        padding: "8px 12px",
        backgroundColor: "white",
        border: `2px solid ${getStatusColor()}`,
        borderRadius: "6px",
        fontSize: "12px",
        zIndex: 9999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {message}
    </div>
  );
}
