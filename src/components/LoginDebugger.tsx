import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { mockAuthService } from "../services/mockAuthService";

interface LoginDebuggerProps {
  isVisible: boolean;
  onClose: () => void;
}

export const LoginDebugger: React.FC<LoginDebuggerProps> = ({
  isVisible,
  onClose,
}) => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testCredentials, setTestCredentials] = useState({
    email: "gongonsilva@gmail.com",
    password: "19867gsf",
  });

  useEffect(() => {
    if (isVisible) {
      loadDebugInfo();
    }
  }, [isVisible]);

  const loadDebugInfo = () => {
    const info = {
      localStorage: {
        currentUser: localStorage.getItem("currentUser"),
        mockCurrentUser: localStorage.getItem("mock-current-user"),
        mockUsers: localStorage.getItem("mock-users"),
        savedCredentials: localStorage.getItem("savedLoginCredentials"),
      },
      mockUsers: mockAuthService.getAllUsers(),
      firebaseConfig: {
        hasAuth: !!authService,
        isReady: typeof authService.getCurrentUserProfile === "function",
      },
    };
    setDebugInfo(info);
  };

  const testMockLogin = async () => {
    try {
      console.log("🧪 Testing mock login...");
      const result = await mockAuthService.login(
        testCredentials.email,
        testCredentials.password,
      );
      console.log("🧪 Mock login result:", result);
      alert(
        `Mock Login: ${result.success ? "SUCCESS" : "FAILED"}\nError: ${result.error || "None"}`,
      );
    } catch (error) {
      console.error("🧪 Mock login error:", error);
      alert(`Mock Login ERROR: ${error}`);
    }
  };

  const testAuthServiceLogin = async () => {
    try {
      console.log("🧪 Testing auth service login...");
      const result = await authService.login(
        testCredentials.email,
        testCredentials.password,
      );
      console.log("🧪 Auth service result:", result);
      alert(
        `Auth Service: ${result.success ? "SUCCESS" : "FAILED"}\nError: ${result.error || "None"}`,
      );
    } catch (error) {
      console.error("🧪 Auth service error:", error);
      alert(`Auth Service ERROR: ${error}`);
    }
  };

  const clearAllData = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("mock-current-user");
    localStorage.removeItem("mock-users");
    localStorage.removeItem("savedLoginCredentials");
    localStorage.removeItem("isAuthenticated");
    sessionStorage.clear();
    alert("All authentication data cleared!");
    loadDebugInfo();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Login Debugger</h2>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              Fechar
            </button>
          </div>

          {/* Test Credentials */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Test Credentials</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Email:</label>
                <input
                  type="email"
                  value={testCredentials.email}
                  onChange={(e) =>
                    setTestCredentials({
                      ...testCredentials,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Password:</label>
                <input
                  type="text"
                  value={testCredentials.password}
                  onChange={(e) =>
                    setTestCredentials({
                      ...testCredentials,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={testMockLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Test Mock Login
              </button>
              <button
                onClick={testAuthServiceLogin}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Test Auth Service
              </button>
              <button
                onClick={clearAllData}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear All Data
              </button>
              <button
                onClick={loadDebugInfo}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Debug Information */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">LocalStorage Data:</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo.localStorage, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Mock Users:</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo.mockUsers, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Firebase Status:</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo.firebaseConfig, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
