import React from "react";

// Test Firebase imports specifically
console.log("🔥 AppFirebaseTest: Testing Firebase imports...");

try {
  // Test Firebase imports that are in App.tsx
  console.log("Testing firebase/leiriaConfig import...");

  // Import Firebase config
  import {
    isFirebaseReady,
    isFirestoreReady,
    getFirebaseFirestore,
  } from "./firebase/leiriaConfig";

  console.log("✅ Firebase imports successful");
} catch (error) {
  console.error("❌ Firebase import failed:", error);
}

export default function AppFirebaseTest() {
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
        <p style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>
          Firebase imports test funcionando
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
