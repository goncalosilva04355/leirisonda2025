import React, { useState } from "react";
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

export const FirebaseFixButton: React.FC = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [lastFix, setLastFix] = useState<string | null>(null);

  const handleManualFix = async () => {
    setIsFixing(true);

    try {
      console.log("🔧 Manual Firebase fix initiated...");

      // Clear localStorage Firebase data
      const firebaseKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes("firebase") || key.includes("firestore"))) {
          firebaseKeys.push(key);
        }
      }

      firebaseKeys.forEach((key) => localStorage.removeItem(key));

      // Reinitialize Firebase
      const { getFirebaseApp } = await import("../firebase/basicConfig");
      const app = getFirebaseApp();
      console.log("Firebase reinitialized:", app ? "✅" : "❌");

      // Clear any Auth state
      try {
        const { firebaseAuthFix } = await import("../services/firebaseAuthFix");
        await firebaseAuthFix.getEmergencyAuth();
      } catch (authError) {
        console.warn("Auth reinit warning:", authError);
      }

      setLastFix(new Date().toLocaleTimeString());

      // Show success notification
      const notification = document.createElement("div");
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #10b981;
          color: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          text-align: center;
          min-width: 300px;
        ">
          <div style="font-size: 24px; margin-bottom: 8px;">✅</div>
          <div style="font-weight: 600; margin-bottom: 4px;">Firebase Corrigido!</div>
          <div style="font-size: 14px; opacity: 0.9;">Sistema reinicializado com sucesso</div>
        </div>
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    } catch (error) {
      console.error("❌ Manual fix failed:", error);

      // Show error notification
      const notification = document.createElement("div");
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #ef4444;
          color: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          text-align: center;
          min-width: 300px;
          cursor: pointer;
        ">
          <div style="font-size: 24px; margin-bottom: 8px;">❌</div>
          <div style="font-weight: 600; margin-bottom: 4px;">Fix Falhou</div>
          <div style="font-size: 14px; opacity: 0.9;">Clique para recarregar página</div>
        </div>
      `;

      notification.addEventListener("click", () => {
        window.location.reload();
      });

      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 8000);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <button
      onClick={handleManualFix}
      disabled={isFixing}
      className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 ${
        isFixing
          ? "bg-yellow-500 text-white cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
      title="Corrigir problemas Firebase manualmente"
    >
      {isFixing ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Corrigindo...</span>
        </>
      ) : (
        <>
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Fix Firebase</span>
        </>
      )}

      {lastFix && (
        <div className="absolute -bottom-6 right-0 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
          Último fix: {lastFix}
        </div>
      )}
    </button>
  );
};

export default FirebaseFixButton;
