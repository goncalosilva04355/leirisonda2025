import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, ExternalLink, Settings } from "lucide-react";

export const FirebaseSetupChecker: React.FC = () => {
  const [firebaseStatus, setFirebaseStatus] = useState<{
    app: boolean;
    auth: boolean;
    firestore: boolean;
    storage: boolean;
    error?: string;
  }>({
    app: false,
    auth: false,
    firestore: false,
    storage: false,
  });

  const checkFirebaseServices = async () => {
    try {
      // Test Firebase App
      const { initializeApp, getApps } = await import("firebase/app");
      const existingApps = getApps();
      const hasApp = existingApps.length > 0;

      let hasAuth = false;
      let hasFirestore = false;
      let hasStorage = false;
      let errorMessage = "";

      if (hasApp) {
        // Test Auth
        try {
          const { getAuth } = await import("firebase/auth");
          const auth = getAuth(existingApps[0]);
          hasAuth = !!auth;
        } catch (authError) {
          console.warn("Auth not available:", authError);
        }

        // Test Firestore
        try {
          const { getFirestore, connectFirestoreEmulator } = await import(
            "firebase/firestore"
          );
          const db = getFirestore(existingApps[0]);

          // Try to access Firestore
          const { collection, getDocs } = await import("firebase/firestore");
          const testCollection = collection(db, "__test__");
          await getDocs(testCollection);
          hasFirestore = true;
        } catch (firestoreError: any) {
          console.warn("Firestore not available:", firestoreError);
          if (firestoreError.message.includes("requires indexes")) {
            errorMessage =
              "Firestore precisa de configuração de regras/índices";
          } else if (firestoreError.message.includes("permission-denied")) {
            errorMessage =
              "Firestore: permissões negadas - configure as regras";
          } else {
            errorMessage = "Firestore não está ativado ou configurado";
          }
        }

        // Test Storage
        try {
          const { getStorage } = await import("firebase/storage");
          const storage = getStorage(existingApps[0]);
          hasStorage = !!storage;
        } catch (storageError) {
          console.warn("Storage not available:", storageError);
        }
      }

      setFirebaseStatus({
        app: hasApp,
        auth: hasAuth,
        firestore: hasFirestore,
        storage: hasStorage,
        error: errorMessage,
      });
    } catch (error: any) {
      setFirebaseStatus({
        app: false,
        auth: false,
        firestore: false,
        storage: false,
        error: error.message,
      });
    }
  };

  useEffect(() => {
    checkFirebaseServices();
  }, []);

  const StatusIcon = ({ status }: { status: boolean }) =>
    status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-500" />
    );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <Settings className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Estado do Firebase</h2>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <StatusIcon status={firebaseStatus.app} />
            <span className="ml-3 font-medium">Firebase App</span>
          </div>
          <span
            className={`text-sm ${firebaseStatus.app ? "text-green-600" : "text-red-600"}`}
          >
            {firebaseStatus.app ? "Conectado" : "Não conectado"}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <StatusIcon status={firebaseStatus.auth} />
            <span className="ml-3 font-medium">Firebase Authentication</span>
          </div>
          <span
            className={`text-sm ${firebaseStatus.auth ? "text-green-600" : "text-red-600"}`}
          >
            {firebaseStatus.auth ? "Ativo" : "Inativo"}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <StatusIcon status={firebaseStatus.firestore} />
            <span className="ml-3 font-medium">Firestore Database</span>
          </div>
          <span
            className={`text-sm ${firebaseStatus.firestore ? "text-green-600" : "text-red-600"}`}
          >
            {firebaseStatus.firestore ? "Configurado" : "Não configurado"}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <StatusIcon status={firebaseStatus.storage} />
            <span className="ml-3 font-medium">Firebase Storage</span>
          </div>
          <span
            className={`text-sm ${firebaseStatus.storage ? "text-green-600" : "text-red-600"}`}
          >
            {firebaseStatus.storage ? "Disponível" : "Não configurado"}
          </span>
        </div>
      </div>

      {firebaseStatus.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Erro detectado:
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {firebaseStatus.error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Próximos passos:
        </h3>
        <div className="space-y-2 text-sm text-blue-700">
          {!firebaseStatus.firestore && (
            <div>
              • <strong>Firestore:</strong> Ative e configure regras no Firebase
              Console
            </div>
          )}
          {!firebaseStatus.storage && (
            <div>
              • <strong>Storage:</strong> Ative o Firebase Storage no console
            </div>
          )}
          <div className="mt-3">
            <a
              href="https://console.firebase.google.com/project/leiria-1cfc9/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Abrir Firebase Console
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={checkFirebaseServices}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Verificar novamente
        </button>
      </div>
    </div>
  );
};
