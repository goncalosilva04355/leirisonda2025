import React, { useEffect, useState } from "react";
import {
  isFirebaseReady,
  waitForFirebaseInit,
  getFirebaseStatus,
} from "../firebase/config";

interface FirebaseStatus {
  app: boolean;
  auth: boolean;
  db: boolean;
  ready: boolean;
  quotaExceeded: boolean;
}

export const FirebaseInitStatus: React.FC = () => {
  const [status, setStatus] = useState<FirebaseStatus | null>(null);
  const [initTime, setInitTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkFirebaseStatus = async () => {
      try {
        const startTime = Date.now();
        setStatus(getFirebaseStatus());

        // Wait for Firebase initialization
        const initResult = await waitForFirebaseInit();
        const endTime = Date.now();

        setInitTime(endTime - startTime);
        setStatus(getFirebaseStatus());

        if (!initResult) {
          setError("Firebase initialization failed");
        }
      } catch (err: any) {
        setError(err.message || "Unknown error during Firebase initialization");
      }
    };

    checkFirebaseStatus();
  }, []);

  if (!status) {
    return (
      <div className="p-4 border rounded-lg bg-blue-50">
        <div className="text-sm text-blue-600">⏳ Initializing Firebase...</div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold mb-3 text-sm">Firebase Initialization Status</h3>

      <div className="space-y-2 text-xs">
        <div
          className={`flex items-center gap-2 ${status.app ? "text-green-600" : "text-red-600"}`}
        >
          <span>{status.app ? "✅" : "❌"}</span>
          Firebase App: {status.app ? "Initialized" : "Not Available"}
        </div>

        <div
          className={`flex items-center gap-2 ${status.auth ? "text-green-600" : "text-red-600"}`}
        >
          <span>{status.auth ? "✅" : "❌"}</span>
          Firebase Auth: {status.auth ? "Initialized" : "Not Available"}
        </div>

        <div
          className={`flex items-center gap-2 ${status.db ? "text-green-600" : "text-red-600"}`}
        >
          <span>{status.db ? "✅" : "❌"}</span>
          Firestore: {status.db ? "Initialized" : "Not Available"}
        </div>

        <div
          className={`flex items-center gap-2 ${status.ready ? "text-green-600" : "text-yellow-600"}`}
        >
          <span>{status.ready ? "✅" : "⚠️"}</span>
          Overall Status: {status.ready ? "Ready" : "Partial/Fallback Mode"}
        </div>

        {initTime !== null && (
          <div className="text-gray-600 text-xs mt-2">
            ⏱️ Initialization time: {initTime}ms
          </div>
        )}

        {error && (
          <div className="text-red-600 text-xs mt-2 bg-red-50 p-2 rounded">
            ❌ Error: {error}
          </div>
        )}

        <div className="text-gray-500 text-xs mt-3 border-t pt-2">
          This component verifies that the Firebase initialization fix is
          working correctly.
          {!status.ready &&
            " The app will work in fallback mode if Firebase is not fully ready."}
        </div>
      </div>
    </div>
  );
};

export default FirebaseInitStatus;
