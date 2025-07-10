import React from "react";

function TestApp() {
  console.log("🧪 TestApp component rendering");

  return (
    <div style={{ padding: "20px", backgroundColor: "lightblue" }}>
      <h1>Test App - Se vê isto, a aplicação está a funcionar!</h1>
      <p>Data/Hora: {new Date().toLocaleString()}</p>
      <button onClick={() => alert("Botão funciona!")}>Testar Botão</button>
    </div>
  );
}

export default TestApp;
