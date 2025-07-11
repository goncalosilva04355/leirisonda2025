import React from "react";
import { ArrowLeft } from "lucide-react";
import { UserLocationMap } from "./UserLocationMap";

interface LocationPageProps {
  onBack?: () => void;
  currentUser?: {
    id: string;
    name: string;
    email: string;
  };
  allUsers?: Array<{
    id: number | string;
    name: string;
    email: string;
    role: string;
    active: boolean;
  }>;
}

export const LocationPage: React.FC<LocationPageProps> = ({
  onBack,
  currentUser,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Voltar às Configurações</span>
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">Mapa da Equipa</h1>
        <p className="text-gray-600 text-sm">
          Visualize as localizações de todos os utilizadores da equipa
        </p>
      </div>

      {/* User Location Map */}
      <UserLocationMap currentUser={currentUser} />
    </div>
  );
};
