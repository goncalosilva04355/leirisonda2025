// CrossDeviceUserManager - DISABLED (Firestore not available)
import React from "react";

export const CrossDeviceUserManager: React.FC = () => {
  console.log("🚫 CrossDeviceUserManager disabled - Firestore not available");

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-yellow-800">
        ⚠️ Cross-device user management disabled - Firestore not available
      </p>
      <p className="text-sm text-yellow-600 mt-1">
        Using local storage mode only
      </p>
    </div>
  );
};

export default CrossDeviceUserManager;
