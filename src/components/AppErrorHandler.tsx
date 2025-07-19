import React from "react";

interface AppErrorHandlerProps {
  children: React.ReactNode;
}

interface AppErrorHandlerState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

class AppErrorHandler extends React.Component<
  AppErrorHandlerProps,
  AppErrorHandlerState
> {
  constructor(props: AppErrorHandlerProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AppErrorHandlerState {
    console.error("🚨 App-specific error caught:", error);
    return { hasError: true, error, errorInfo: error.stack };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 App Error Details:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#dc2626",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Arial, sans-serif",
            padding: "2rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "600px" }}>
            <h1>🚨 Erro na Aplicação</h1>
            <p style={{ marginBottom: "1rem" }}>
              A aplicação encontrou um erro específico no componente principal.
            </p>

            {this.state.error && (
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  textAlign: "left",
                }}
              >
                <h3>Detalhes do Erro:</h3>
                <pre
                  style={{
                    fontSize: "12px",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: "white",
                  color: "#dc2626",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Recarregar Aplicação
              </button>

              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  padding: "12px 24px",
                  border: "1px solid white",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Limpar Dados e Recarregar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorHandler;
