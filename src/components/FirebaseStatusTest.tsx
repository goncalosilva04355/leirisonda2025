import React, { useState, useEffect } from "react";

import React, { useState, useEffect } from "react";

export const FirebaseStatusTest: React.FC = () => {
  const [firebaseStatus, setFirebaseStatus] = useState<{
    firebase: boolean;
    firestore: boolean;
    leiriaConfig: boolean;
    error?: string;
  }>({
    firebase: false,
    firestore: false,
    leiriaConfig: false,
  });

  useEffect(() => {
    const testFirebaseStatus = async () => {
      try {
        // Test basic config
        const { isFirebaseReady, isFirestoreReady } = await import(
          "../firebase/basicConfig"
        );

        // Test leiria config
        const {
          isFirebaseReady: leiriaFirebaseReady,
          isFirestoreReady: leiriaFirestoreReady,
          getFirebaseFirestore,
        } = await import("../firebase/leiriaConfig");

        const firebaseActive = isFirebaseReady();
        const firestoreActive = isFirestoreReady();
        const leiriaFirebaseActive = leiriaFirebaseReady();
        const leiriaFirestoreActive = leiriaFirestoreReady();

        console.log("🔍 Firebase Status Test:");
        console.log("  - Basic Firebase Ready:", firebaseActive);
        console.log("  - Basic Firestore Ready:", firestoreActive);
        console.log("  - Leiria Firebase Ready:", leiriaFirebaseActive);
        console.log("  - Leiria Firestore Ready:", leiriaFirestoreActive);
        console.log(
          "  - VITE_FORCE_FIREBASE:",
          import.meta.env.VITE_FORCE_FIREBASE,
        );
        console.log("  - DEV mode:", import.meta.env.DEV);

        // Try to get Firestore instance
        const firestoreInstance = getFirebaseFirestore();
        console.log(
          "  - Firestore Instance:",
          firestoreInstance ? "✅ Available" : "❌ Not available",
        );

        setFirebaseStatus({
          firebase: firebaseActive || leiriaFirebaseActive,
          firestore: firestoreActive || leiriaFirestoreActive,
          leiriaConfig: leiriaFirebaseActive,
        });
      } catch (error: any) {
        console.error("❌ Error testing Firebase status:", error);
        setFirebaseStatus({
          firebase: false,
          firestore: false,
          leiriaConfig: false,
          error: error.message,
        });
      }
    };

    testFirebaseStatus();
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        🔥 Status do Firebase/Firestore
      </h3>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${firebaseStatus.firebase ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="text-sm">
            Firebase: {firebaseStatus.firebase ? "✅ Ativo" : "❌ Inativo"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${firebaseStatus.firestore ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="text-sm">
            Firestore: {firebaseStatus.firestore ? "✅ Ativo" : "❌ Inativo"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${firebaseStatus.leiriaConfig ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="text-sm">
            Configuração Leiria:{" "}
            {firebaseStatus.leiriaConfig ? "✅ Ativo" : "❌ Inativo"}
          </span>
        </div>
      </div>

      {firebaseStatus.error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          ❌ Erro: {firebaseStatus.error}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <p>
          VITE_FORCE_FIREBASE:{" "}
          {import.meta.env.VITE_FORCE_FIREBASE ? "✅ true" : "❌ false"}
        </p>
        <p>Modo DEV: {import.meta.env.DEV ? "✅ true" : "❌ false"}</p>
      </div>
    </div>
  );
};

export default FirebaseStatusTest;
