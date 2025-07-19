import React, { useState, useEffect } from "react";

interface SafeAppWrapperProps {
  children: React.ReactNode;
}

const SafeAppWrapper: React.FC<SafeAppWrapperProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Add safety checks before rendering
    try {
      // Check if React is available
      if (!React || !useState || !useEffect) {
        throw new Error("React hooks not available");
      }

      // Check if window object is available
      if (typeof window === "undefined") {
        throw new Error("Window object not available");
      }

      // Check if document is ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          setIsReady(true);
        });
      } else {
        setIsReady(true);
      }
    } catch (error) {
      console.error("🚨 SafeAppWrapper initialization error:", error);
      setHasError(true);
    }
  }, []);

  // Add global error handler for this component
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.filename?.includes("App.tsx")) {
        console.error("🚨 App.tsx error intercepted:", event.error);
        setHasError(true);
        event.preventDefault();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.stack?.includes("App.tsx")) {
        console.error(
          "🚨 App.tsx promise rejection intercepted:",
          event.reason,
        );
        setHasError(true);
        event.preventDefault();
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  if (hasError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>🔧 Leirisonda</h1>
          <p>Sistema de Gestão de Piscinas</p>
          <p style={{ marginTop: "1rem" }}>A aplicação está a carregar...</p>
          <button
            onClick={() => {
              setHasError(false);
              setIsReady(false);
              window.location.reload();
            }}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "white",
              color: "#667eea",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0891b2",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>🔧 Leirisonda</h1>
          <p>A carregar aplicação...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SafeAppWrapper;
