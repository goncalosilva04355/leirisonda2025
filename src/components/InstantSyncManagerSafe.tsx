import React from "react";

interface InstantSyncManagerSafeProps {
  children: React.ReactNode;
}

export const InstantSyncManagerSafe: React.FC<InstantSyncManagerSafeProps> = ({
  children,
}) => {
  return <>{children}</>;
};
