import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { DebugBlankPage } from "./debug-blank-page";

console.log("🔍 Inicializando modo debug...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Teste simples sem error boundary
ReactDOM.createRoot(rootElement).render(<DebugBlankPage />);

console.log("✅ Debug mode renderizado");
