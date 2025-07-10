// UserPermissionsManager - DISABLED (Firestore not available)
import React from "react";

export const UserPermissionsManager: React.FC = () => {
  console.log("🚫 UserPermissionsManager disabled - Firestore not available");

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-yellow-800">
        ⚠️ User permissions manager disabled - Firestore not available
      </p>
      <p className="text-sm text-yellow-600 mt-1">
        Using local storage mode only
      </p>
    </div>
  );
};

export default UserPermissionsManager;
