import React from "react";

export const HotReloadTest: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
        background: "blue",
        color: "white",
        padding: "5px",
        zIndex: 9999,
        fontSize: "12px",
      }}
    >
      Hot Reload TESTE - {new Date().toLocaleTimeString()}
    </div>
  );
};

export default HotReloadTest;
