import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Basic imports first
import App from "./App-fixed";
import ImprovedErrorBoundary from "./components/ImprovedErrorBoundary";

// Ensure single root creation
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

console.log("🚀 Inicializando aplicação principal...");

// Check if root is already rendered
if (!rootElement.hasAttribute("data-react-root")) {
  rootElement.setAttribute("data-react-root", "true");
  ReactDOM.createRoot(rootElement).render(
    <ImprovedErrorBoundary>
      <App />
    </ImprovedErrorBoundary>,
  );
  console.log("✅ Aplicação principal renderizada com sucesso!");
}
