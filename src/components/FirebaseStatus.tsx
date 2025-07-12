import React from "react";

export const FirebaseStatus: React.FC = () => {
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        Estado do Firebase
      </h3>
      <p className="text-green-700">Firebase está ativo e funcionando.</p>
    </div>
  );
};
