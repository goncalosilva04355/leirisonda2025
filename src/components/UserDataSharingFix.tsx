// UserDataSharingFix - DISABLED (Firestore not available)
import React from "react";

export const UserDataSharingFix: React.FC = () => {
  console.log("🚫 UserDataSharingFix disabled - Firestore not available");

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-yellow-800">
        ⚠️ User data sharing fix disabled - Firestore not available
      </p>
      <p className="text-sm text-yellow-600 mt-1">
        Using local storage mode only
      </p>
    </div>
  );
};

export default UserDataSharingFix;
