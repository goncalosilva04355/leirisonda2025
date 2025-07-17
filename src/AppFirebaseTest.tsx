import React, { useEffect, useState } from "react";

// Test Firebase imports specifically
console.log("🔥 AppFirebaseTest: Testing Firebase imports...");

// Import Firebase config at module level
import {
  isFirebaseReady,
  isFirestoreReady,
  getFirebaseFirestore,
} from "./firebase/leiriaConfig";

console.log("✅ Firebase imports successful");

export default function AppFirebaseTest() {
  const [firebaseStatus, setFirebaseStatus] = useState("checking...");

  useEffect(() => {
    try {
      console.log("🔥 Testing Firebase functions...");
      const ready = isFirebaseReady();
      const firestoreReady = isFirestoreReady();
      const db = getFirebaseFirestore();

      setFirebaseStatus(
        `Firebase: ${ready}, Firestore: ${firestoreReady}, DB: ${db ? "OK" : "NULL"}`,
      );
      console.log("✅ Firebase functions work correctly");
    } catch (error) {
      console.error("❌ Firebase functions failed:", error);
      setFirebaseStatus(`Error: ${error.message}`);
    }
  }, []);

  console.log("🔥 AppFirebaseTest renderizado com sucesso!");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0891b2 0%, #0284c7 100%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          🔥 Firebase Test
        </h1>
        <p style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>
          Firebase imports test funcionando
        </p>
        <p style={{ fontSize: "0.875rem", marginBottom: "2rem", opacity: 0.8 }}>
          Status: {firebaseStatus}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "white",
            color: "#0891b2",
            border: "none",
            padding: "1rem 2rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Recarregar
        </button>
      </div>
    </div>
  );
}
