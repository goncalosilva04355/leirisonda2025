import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
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

  // Clear localStorage if it contains corrupted data
  try {
    const testKey = "leirisonda-test";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
  } catch (error) {
    console.warn("LocalStorage error detected, clearing:", error);
    try {
      localStorage.clear();
    } catch (clearError) {
      console.error("Could not clear localStorage:", clearError);
    }
  }

  // Handle unhandled promise rejections that might crash Chrome
  window.addEventListener("unhandledrejection", (event) => {
    console.warn("Unhandled promise rejection:", event.reason);
    event.preventDefault();
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
