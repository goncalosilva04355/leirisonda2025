import React from "react";

interface AutoSyncProviderSafeProps {
  enabled: boolean;
  children: React.ReactNode;
}

export const AutoSyncProviderSafe: React.FC<AutoSyncProviderSafeProps> = ({
  children,
}) => {
  return <>{children}</>;
};
