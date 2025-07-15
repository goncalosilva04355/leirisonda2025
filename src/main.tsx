// ULTIMATE STABILIZER - MUST BE FIRST
import "./utils/ultmateStabilizer";

// Load polyfills first
import "./polyfills";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ImprovedErrorBoundary from "./components/ImprovedErrorBoundary";
import { isPrivateBrowsing } from "./utils/storageUtils";
import "./index.css";

// Restauração imediata de utilizadores
import "./utils/immediateUserRestore";

// Firebase Service Worker DESATIVADO - modo emergência
if (false && "serviceWorker" in navigator && !isPrivateBrowsing()) {
  // Tentar registrar Firebase messaging service worker
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("✅ Firebase SW registered:", registration);
    })
    .catch((error) => {
      console.warn(
        "❌ Firebase Messaging Service Worker registration failed:",
        error,
      );

      // Fallback para service worker básico
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Fallback SW registered:", registration);
        })
        .catch((fallbackError) => {
          console.warn(
            "❌ Fallback Service Worker registration also failed:",
            fallbackError,
          );
          // Aplicação continua funcionando normalmente mesmo sem SW
        });
    });
} else if (isPrivateBrowsing()) {
  console.log("�� Modo privado: Service Worker desabilitado");
}

// ReadableStream polyfill is handled by ./polyfills.ts
console.log("🔧 ReadableStream polyfill loaded via polyfills.ts");

// Chrome-specific fixes for PWA compatibility
if (typeof window !== "undefined") {
  // Check for private browsing mode
  if (isPrivateBrowsing()) {
    console.log(
      "🔒 Modo privado detectado - algumas funcionalidades podem estar limitadas",
    );
  }

  // Clear any cached data that might be causing issues in Chrome (skip in private mode)
  if ("caches" in window && !isPrivateBrowsing()) {
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

  // Enhanced promise rejection handler DESATIVADO - modo emergência
  if (false)
    window.addEventListener("unhandledrejection", (event) => {
      console.warn("Unhandled promise rejection:", event.reason);

      // Check if it's a Firebase ReadableStream error
      if (
        event.reason?.message?.includes("ReadableStream") ||
        event.reason?.message?.includes(
          "initializeReadableStreamDefaultReader",
        ) ||
        event.reason?.stack?.includes("firebase_firestore.js")
      ) {
        console.log("🔧 Handling Firebase ReadableStream error");
        event.preventDefault(); // Prevent the error from crashing the app

        // Try to recover by reinitializing Firebase after a delay
        setTimeout(async () => {
          try {
            const { FirebaseErrorFix } = await import(
              "./utils/firebaseErrorFix"
            );
            await FirebaseErrorFix.safeFirebaseReinitialization();
          } catch (error) {
            console.error("Failed to reinitialize Firebase:", error);
          }
        }, 1000);
      } else {
        event.preventDefault();
      }
    });

  // Add error event listener DESATIVADO - modo emergência
  if (false)
    window.addEventListener("error", (event) => {
      if (
        event.error?.message?.includes("ReadableStream") ||
        event.error?.stack?.includes("firebase_firestore.js")
      ) {
        console.log(
          "🔧 Handling Firebase ReadableStream error via error event",
        );
        event.preventDefault();
      }
    });
}

// Ensure single root creation
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Check if root is already rendered
if (!rootElement.hasAttribute("data-react-root")) {
  rootElement.setAttribute("data-react-root", "true");
  ReactDOM.createRoot(rootElement).render(
    <ImprovedErrorBoundary>
      <App />
    </ImprovedErrorBoundary>,
  );
}
