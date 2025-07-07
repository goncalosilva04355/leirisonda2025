import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ImprovedErrorBoundary from "./components/ImprovedErrorBoundary";
import "./index.css";

// Chrome-specific fixes for PWA compatibility
if (typeof window !== "undefined") {
  // Clear any cached data that might be causing issues in Chrome
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        if (
          name.includes("leirisonda-v1") ||
          name.includes("leirisonda-v2") ||
          name.includes("leirisonda-v3")
        ) {
          caches.delete(name);
        }
      });
    });
  }

  // Firebase handles data persistence automatically - no localStorage needed
  console.log("🔥 Firebase handles data persistence automatically");

  // Handle unhandled promise rejections that might crash Chrome
  window.addEventListener("unhandledrejection", (event) => {
    console.warn("Unhandled promise rejection:", event.reason);
    event.preventDefault();
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ImprovedErrorBoundary>
    <App />
  </ImprovedErrorBoundary>,
);
