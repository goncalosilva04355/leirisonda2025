import React from "react";

interface AutoSyncProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
  syncInterval?: number;
  collections?: string[];
  showNotifications?: boolean;
}

export const AutoSyncProviderSafe: React.FC<AutoSyncProviderProps> = ({
  children,
  enabled = true,
  syncInterval = 3000,
  collections = ["users", "pools", "maintenance", "works", "clients"],
  showNotifications = true,
}) => {
  // Simple wrapper without complex state management
  // Just render children without causing hook errors
  return <>{children}</>;
};
