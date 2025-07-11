import React from "react";

interface InstantSyncManagerProps {
  children: React.ReactNode;
}

export const InstantSyncManagerSafe: React.FC<InstantSyncManagerProps> = ({
  children,
}) => {
  // Simple wrapper without complex sync hooks
  // Just render children without causing hook errors
  return <>{children}</>;
};
