import React from "react";
import { safeLocalStorage } from "../utils/storageUtils";

export const DebugInfo: React.FC = () => {
  const currentUser = safeLocalStorage.getItem("currentUser");
  const isAuthenticated = safeLocalStorage.getItem("isAuthenticated");

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg text-xs max-w-xs z-50">
      <h4 className="font-bold mb-2">🐛 Debug Info</h4>
      <div className="space-y-1">
        <p>
          <strong>Dev Mode:</strong> {import.meta.env.DEV ? "✅" : "❌"}
        </p>
        <p>
          <strong>Auto Login:</strong> {import.meta.env.VITE_AUTO_LOGIN}
        </p>
        <p>
          <strong>Auth Status:</strong> {isAuthenticated || "false"}
        </p>
        <p>
          <strong>Current User:</strong> {currentUser ? "✅" : "❌"}
        </p>
        <p>
          <strong>Firebase Force:</strong> {import.meta.env.VITE_FORCE_FIREBASE}
        </p>
        <p>
          <strong>Port:</strong> {window.location.port}
        </p>
      </div>
      <button
        onClick={() => {
          console.log("🐛 Debug Info:", {
            env: import.meta.env,
            localStorage: {
              currentUser: safeLocalStorage.getItem("currentUser"),
              isAuthenticated: safeLocalStorage.getItem("isAuthenticated"),
              rememberMe: safeLocalStorage.getItem("rememberMe"),
            },
          });
        }}
        className="mt-2 bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
      >
        Log Debug
      </button>
    </div>
  );
};

export default DebugInfo;
