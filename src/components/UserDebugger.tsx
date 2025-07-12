import React from "react";

export const UserDebugger: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        User Debugger
      </h3>
      <div className="text-sm text-gray-600">
        <p>Ferramenta para debug de problemas de utilizadores.</p>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800">
            Esta funcionalidade está em desenvolvimento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDebugger;
