import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export const FirebaseAuthTest: React.FC = () => {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testFirebaseAuth = async () => {
    setLoading(true);
    setResult("Testing...");

    try {
      console.log("Auth object:", auth);
      console.log("Auth config:", auth?.config);

      if (!auth) {
        setResult("ERROR: Auth not initialized");
        return;
      }

      // Test with a simple email/password
      const testEmail = `test${Date.now()}@example.com`;
      const testPassword = "test123456";

      console.log("Attempting registration with:", testEmail);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        testEmail,
        testPassword,
      );

      setResult(`SUCCESS: User created with UID: ${userCredential.user.uid}`);
    } catch (error: any) {
      console.error("Test error:", error);
      setResult(`ERROR: ${error.code} - ${error.message}`);

      if (error.code === "auth/operation-not-allowed") {
        setResult(
          result +
            "\n\nEmail/Password authentication is not enabled in Firebase Console!",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Firebase Auth Test</h3>

      <button
        onClick={testFirebaseAuth}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 mb-4"
      >
        {loading ? "Testing..." : "Test Firebase Auth"}
      </button>

      {result && (
        <div className="p-4 bg-gray-100 rounded-md">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};
