import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/justFirestore";

export function FirestoreStatus() {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("Verificando Firestore...");

  useEffect(() => {
    // Verificar estado do Firestore
    setTimeout(() => {
      if (firestore) {
        setStatus("connected");
        setMessage("✅ Firestore conectado");
      } else {
        setStatus("disconnected");
        setMessage("❌ Firestore não conectado - usando localStorage");
      }
    }, 2000);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "green";
      case "disconnected":
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
