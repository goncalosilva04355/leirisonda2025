import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error("🚨 Error Boundary caught error:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 Error Boundary details:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            fontFamily: "system-ui",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              maxWidth: "600px",
              width: "100%",
            }}
          >
            <h1
              style={{
                color: "#dc2626",
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Leirisonda - Erro da Aplicação
            </h1>

            <p
              style={{
                marginBottom: "1rem",
                color: "#6b7280",
              }}
            >
              A aplicação encontrou um erro e precisa ser recarregada:
            </p>

            {this.state.error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "0.375rem",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <h3
                  style={{
                    color: "#dc2626",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  Detalhes do Erro:
                </h3>
                <pre
                  style={{
                    color: "#dc2626",
                    fontSize: "0.75rem",
                    whiteSpace: "pre-wrap",
                    margin: 0,
                    fontFamily: "monospace",
                  }}
                >
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Recarregar
              </button>

              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                style={{
                  background: "#dc2626",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Limpar Dados e Recarregar
              </button>
            </div>

            <p
              style={{
                color: "#9ca3af",
                fontSize: "0.75rem",
                marginTop: "1rem",
              }}
            >
              Timestamp: {new Date().toLocaleString("pt-PT")}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
