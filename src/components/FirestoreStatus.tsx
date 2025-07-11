import React, { useState, useEffect } from "react";
import { getDB, isFirestoreReady } from "../firebase";

export function FirestoreStatus() {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("🔄 Verificando Firestore...");

  useEffect(() => {
    const checkStatus = () => {
      try {
        const db = getDB();
        const ready = isFirestoreReady();

        if (db && ready) {
          setStatus("connected");
          setMessage("✅ Firestore conectado");
        } else {
          setStatus("error");
          setMessage("❌ Firestore não inicializado");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          `❌ Erro: ${error instanceof Error ? error.message : "Desconhecido"}`,
        );
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
