import React from "react";

export const AppStatusIndicator: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        background: "#4CAF50",
        color: "white",
        padding: "8px 12px",
        borderRadius: "4px",
        fontSize: "12px",
        zIndex: 9999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      ✅ App Funcional
    </div>
  );
};

export default AppStatusIndicator;
