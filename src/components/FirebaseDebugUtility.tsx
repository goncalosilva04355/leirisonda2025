import React, { useState, useEffect } from "react";
import {
  Bug,
  Database,
  HardDrive,
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Play,
  Trash2,
  Plus,
  ExternalLink,
  Download,
  Copy,
  X,
} from "lucide-react";
import AppDiagnostics from "../utils/appDiagnostics";

interface FirebaseStatus {
  app: boolean;
  auth: boolean;
  firestore: boolean;
  storage: boolean;
  connected: boolean;
  error?: string;
}

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
}

export const FirebaseDebugUtility: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("status");
  const [status, setStatus] = useState<FirebaseStatus>({
    app: false,
    auth: false,
    firestore: false,
    storage: false,
    connected: false,
  });
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testData, setTestData] = useState(
    '{"test": "data", "timestamp": "' + new Date().toISOString() + '"}',
  );
  const [loading, setLoading] = useState(false);

  // Test Firebase Status
  const testFirebaseStatus = async () => {
    setLoading(true);
    try {
      const results: FirebaseStatus = {
        app: false,
        auth: false,
        firestore: false,
        storage: false,
        connected: false,
      };

      // Test Firebase App
      try {
        const { getApps } = await import("firebase/app");
        const apps = getApps();
        results.app = apps.length > 0;

        if (results.app) {
          const app = apps[0];

          // Test Auth
          try {
            const { getAuth } = await import("firebase/auth");
            const auth = getAuth(app);
            results.auth = !!auth;
          } catch (e) {
            console.warn("Auth test failed:", e);
          }

          // Test Firestore
          try {
            const { getFirestore, collection, getDocs } = await import(
              "firebase/firestore"
            );
            const db = getFirestore(app);

            // Try to read from a test collection
            const testCollection = collection(db, "__test__");
            await getDocs(testCollection);
            results.firestore = true;
            results.connected = true;
          } catch (e) {
            console.warn("Firestore test failed:", e);
            results.error =
              e instanceof Error ? e.message : "Firestore connection failed";
          }

          // Test Storage
          try {
            const { getStorage } = await import("firebase/storage");
            const storage = getStorage(app);
            results.storage = !!storage;
          } catch (e) {
            console.warn("Storage test failed:", e);
          }
        }
      } catch (e) {
        results.error =
          e instanceof Error ? e.message : "Firebase app initialization failed";
      }

      setStatus(results);
    } catch (error) {
      setStatus({
        app: false,
        auth: false,
        firestore: false,
        storage: false,
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
    setLoading(false);
  };

  // Test CRUD Operations
  const testFirestoreWrite = async () => {
    setLoading(true);
    try {
      const { getApps } = await import("firebase/app");
      const { getFirestore, collection, addDoc } = await import(
        "firebase/firestore"
      );

      const apps = getApps();
      if (apps.length === 0) throw new Error("No Firebase app found");

      const db = getFirestore(apps[0]);
      const testCollection = collection(db, "debug_tests");

      const testDocument = {
        ...JSON.parse(testData),
        createdAt: new Date().toISOString(),
        test_type: "debug_utility",
      };

      const docRef = await addDoc(testCollection, testDocument);

      const result: TestResult = {
        success: true,
        message: `Document created with ID: ${docRef.id}`,
        data: testDocument,
      };

      setTestResults((prev) => [result, ...prev.slice(0, 9)]);
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: `Write failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
      setTestResults((prev) => [result, ...prev.slice(0, 9)]);
    }
    setLoading(false);
  };

  const testFirestoreRead = async () => {
    setLoading(true);
    try {
      const { getApps } = await import("firebase/app");
      const { getFirestore, collection, getDocs, query, orderBy, limit } =
        await import("firebase/firestore");

      const apps = getApps();
      if (apps.length === 0) throw new Error("No Firebase app found");

      const db = getFirestore(apps[0]);
      const testCollection = collection(db, "debug_tests");
      const q = query(testCollection, orderBy("createdAt", "desc"), limit(5));

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const result: TestResult = {
        success: true,
        message: `Read ${docs.length} documents`,
        data: docs,
      };

      setTestResults((prev) => [result, ...prev.slice(0, 9)]);
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: `Read failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
      setTestResults((prev) => [result, ...prev.slice(0, 9)]);
    }
    setLoading(false);
  };

  const clearTestData = async () => {
    setLoading(true);
    try {
      const { getApps } = await import("firebase/app");
      const { getFirestore, collection, getDocs, deleteDoc, doc } =
        await import("firebase/firestore");

      const apps = getApps();
      if (apps.length === 0) throw new Error("No Firebase app found");

      const db = getFirestore(apps[0]);
      const testCollection = collection(db, "debug_tests");

      const querySnapshot = await getDocs(testCollection);
      const deletePromises = querySnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(db, "debug_tests", docSnapshot.id)),
      );

      await Promise.all(deletePromises);

      const result: TestResult = {
        success: true,
        message: `Deleted ${querySnapshot.docs.length} test documents`,
      };

      setTestResults((prev) => [result, ...prev.slice(0, 9)]);
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: `Clear failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
      setTestResults((prev) => [result, ...prev.slice(0, 9)]);
    }
    setLoading(false);
  };

  // Auto-test on open
  useEffect(() => {
    if (isOpen) {
      testFirebaseStatus();
    }
  }, [isOpen]);

  const StatusIcon = ({ success }: { success: boolean }) =>
    success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
          isOpen
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-600 hover:bg-gray-50"
        }`}
        title="Firebase Debug Utility"
      >
        <Bug className="h-5 w-5" />
      </button>

      {/* Utility Panel */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bug className="h-5 w-5 mr-2 text-blue-600" />
                Firebase Debug
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mt-3">
              {[
                { id: "status", label: "Status", icon: Database },
                { id: "test", label: "Test", icon: Play },
                { id: "tools", label: "Tools", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-1 rounded text-sm ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-1" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-96">
            {/* Status Tab */}
            {activeTab === "status" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    Firebase Services
                  </h4>
                  <button
                    onClick={testFirebaseStatus}
                    disabled={loading}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <StatusIcon success={status.app} />
                      <span className="ml-2 text-sm">Firebase App</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {status.app ? "Connected" : "Not Found"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <StatusIcon success={status.auth} />
                      <span className="ml-2 text-sm">Authentication</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {status.auth ? "Available" : "Not Available"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <StatusIcon success={status.firestore} />
                      <span className="ml-2 text-sm">Firestore</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {status.firestore ? "Connected" : "Not Connected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <StatusIcon success={status.storage} />
                      <span className="ml-2 text-sm">Storage</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {status.storage ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>

                {status.error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-700">{status.error}</p>
                  </div>
                )}
              </div>
            )}

            {/* Test Tab */}
            {activeTab === "test" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Data (JSON)
                  </label>
                  <textarea
                    value={testData}
                    onChange={(e) => setTestData(e.target.value)}
                    className="w-full h-20 p-2 text-xs border border-gray-300 rounded resize-none"
                    placeholder='{"key": "value"}'
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={testFirestoreWrite}
                    disabled={loading}
                    className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Write
                  </button>
                  <button
                    onClick={testFirestoreRead}
                    disabled={loading}
                    className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Read
                  </button>
                </div>

                <button
                  onClick={clearTestData}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear Test Data
                </button>

                {/* Test Results */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">
                    Results:
                  </h5>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-xs ${
                          result.success
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <div className="font-medium">{result.message}</div>
                        {result.data && (
                          <pre className="mt-1 text-xs overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                    {testResults.length === 0 && (
                      <p className="text-xs text-gray-500 italic">
                        No tests run yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tools Tab */}
            {activeTab === "tools" && (
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Quick Actions
                  </h5>
                  <div className="space-y-2">
                    <a
                      href="https://console.firebase.google.com/project/leiria-1cfc9/overview"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full px-3 py-2 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Firebase Console
                    </a>

                    <a
                      href="https://console.firebase.google.com/project/leiria-1cfc9/firestore"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full px-3 py-2 bg-orange-50 text-orange-700 rounded text-sm hover:bg-orange-100"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Open Firestore
                    </a>

                    <a
                      href="https://console.firebase.google.com/project/leiria-1cfc9/storage"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full px-3 py-2 bg-purple-50 text-purple-700 rounded text-sm hover:bg-purple-100"
                    >
                      <HardDrive className="h-4 w-4 mr-2" />
                      Open Storage
                    </a>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Config Info
                  </h5>
                  <div className="p-3 bg-gray-50 rounded text-xs">
                    <div>
                      <strong>Project ID:</strong> leiria-1cfc9
                    </div>
                    <div>
                      <strong>Auth Domain:</strong> leiria-1cfc9.firebaseapp.com
                    </div>
                    <div>
                      <strong>API Key:</strong> AIzaSyBM6g...QwKE0...
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Debug Info
                  </h5>
                  <div className="p-3 bg-gray-50 rounded text-xs">
                    <div>
                      <strong>Connection:</strong>{" "}
                      {status.connected ? "✅ Connected" : "❌ Disconnected"}
                    </div>
                    <div>
                      <strong>Last Check:</strong>{" "}
                      {new Date().toLocaleTimeString()}
                    </div>
                    <div>
                      <strong>Environment:</strong> {window.location.hostname}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
