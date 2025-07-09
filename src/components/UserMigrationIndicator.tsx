import React from "react";
import { Users, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

interface UserMigrationIndicatorProps {
  migrationStatus: {
    status: {
      isRunning: boolean;
      completed: boolean;
      migrated: number;
      skipped: number;
      failed: number;
      error?: string;
    };
    isActive: boolean;
  };
}

export const UserMigrationIndicator: React.FC<UserMigrationIndicatorProps> = ({
  migrationStatus,
}) => {
  const { status, isActive } = migrationStatus;

  // Don't show if migration is completed and successful
  if (status.completed && status.failed === 0 && !status.error) {
    return null;
  }

  // Don't show if not active
  if (!isActive && !status.isRunning) {
    return null;
  }

  const getStatusColor = () => {
    if (status.isRunning) return "text-blue-500";
    if (status.error || status.failed > 0) return "text-red-500";
    if (status.completed) return "text-green-500";
    return "text-yellow-500";
  };

  const getStatusIcon = () => {
    if (status.isRunning) {
      return <RefreshCw className="h-3 w-3 animate-spin" />;
    } else if (status.error || status.failed > 0) {
      return <AlertCircle className="h-3 w-3" />;
    } else if (status.completed) {
      return <CheckCircle className="h-3 w-3" />;
    } else {
      return <Users className="h-3 w-3" />;
    }
  };

  const getTooltip = () => {
    if (status.isRunning) {
      return "Migrando utilizadores para Firestore...";
    } else if (status.error) {
      return `Erro na migração: ${status.error}`;
    } else if (status.completed) {
      return `Migração concluída: ${status.migrated} utilizadores migrados`;
    } else {
      return "Sistema de migração automática ativo";
    }
  };

  return (
    <div
      className={`fixed top-16 right-4 z-40 ${getStatusColor()}`}
      title={getTooltip()}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 shadow-sm border border-gray-200">
        {getStatusIcon()}
      </div>
    </div>
  );
};

export default UserMigrationIndicator;
