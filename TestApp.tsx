import React from "react";

function TestApp() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🔧 Leirisonda App Test</h1>
      <p>✅ React is working</p>
      <p>✅ TypeScript is compiling</p>
      <p>✅ Vite dev server is running on port 5173</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default TestApp;
