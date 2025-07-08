import React, { useEffect, useState } from "react";

interface TestResult {
  readableStreamAvailable: boolean;
  getReaderAvailable: boolean;
  canCreateReader: boolean;
  error?: string;
}

export const ReadableStreamTest: React.FC = () => {
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  useEffect(() => {
    const runTest = async () => {
      try {
        const result: TestResult = {
          readableStreamAvailable:
            typeof globalThis.ReadableStream !== "undefined",
          getReaderAvailable: false,
          canCreateReader: false,
        };

        if (result.readableStreamAvailable) {
          result.getReaderAvailable =
            typeof globalThis.ReadableStream.prototype.getReader === "function";

          if (result.getReaderAvailable) {
            try {
              const stream = new globalThis.ReadableStream();
              const reader = stream.getReader();
              result.canCreateReader = true;
              reader.releaseLock();
            } catch (error: any) {
              result.error = `Reader creation failed: ${error.message}`;
            }
          }
        }

        setTestResult(result);
      } catch (error: any) {
        setTestResult({
          readableStreamAvailable: false,
          getReaderAvailable: false,
          canCreateReader: false,
          error: error.message,
        });
      }
    };

    runTest();
  }, []);

  if (!testResult) {
    return (
      <div className="p-4">Running ReadableStream compatibility test...</div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold mb-2">ReadableStream Compatibility Test</h3>
      <div className="space-y-2 text-sm">
        <div
          className={`flex items-center gap-2 ${testResult.readableStreamAvailable ? "text-green-600" : "text-red-600"}`}
        >
          <span>{testResult.readableStreamAvailable ? "✅" : "❌"}</span>
          ReadableStream available:{" "}
          {testResult.readableStreamAvailable.toString()}
        </div>
        <div
          className={`flex items-center gap-2 ${testResult.getReaderAvailable ? "text-green-600" : "text-red-600"}`}
        >
          <span>{testResult.getReaderAvailable ? "✅" : "❌"}</span>
          getReader method available: {testResult.getReaderAvailable.toString()}
        </div>
        <div
          className={`flex items-center gap-2 ${testResult.canCreateReader ? "text-green-600" : "text-red-600"}`}
        >
          <span>{testResult.canCreateReader ? "✅" : "❌"}</span>
          Can create reader: {testResult.canCreateReader.toString()}
        </div>
        {testResult.error && (
          <div className="text-red-600 text-xs bg-red-50 p-2 rounded">
            Error: {testResult.error}
          </div>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        This test verifies that the ReadableStream polyfill is working correctly
        for Firebase compatibility.
      </div>
    </div>
  );
};

export default ReadableStreamTest;
