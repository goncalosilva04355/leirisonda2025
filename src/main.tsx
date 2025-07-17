import React from "react";
import ReactDOM from "react-dom/client";
import "./minimal.css";

// Minimal application component for validation testing
import App from "./AppMinimalValidation";
// Error Boundary for safety
import ErrorBoundary from "./components/ErrorBoundary";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Simple error handling
window.addEventListener("error", (event) => {
  console.error("Application error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
} catch (error) {
  console.error("Failed to render application:", error);
  rootElement.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: system-ui;">
      <div style="text-align: center; padding: 2rem;">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Loading Error</h1>
        <p style="margin-bottom: 1rem;">The application failed to load properly.</p>
        <button onclick="location.reload()" style="background: #3b82f6; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.25rem; cursor: pointer;">
          Reload Page
        </button>
      </div>
    </div>
  `;
}
