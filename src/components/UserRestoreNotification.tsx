import React, { useState, useEffect } from "react";
import { CheckCircle, Users, AlertTriangle } from "lucide-react";

export const UserRestoreNotification: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [restoredUsers, setRestoredUsers] = useState(0);

  useEffect(() => {
    const handleUserRestore = (event: CustomEvent) => {
      if (event.detail?.restored) {
        setRestoredUsers(event.detail.count || 0);
        setShowNotification(true);

        // Ocultar após 5 segundos
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
    };

    window.addEventListener(
      "usersRestored",
      handleUserRestore as EventListener,
    );

    return () => {
      window.removeEventListener(
        "usersRestored",
        handleUserRestore as EventListener,
      );
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
        <div>
          <h4 className="font-medium">Utilizadores Restaurados</h4>
          <p className="text-sm">
            {restoredUsers} utilizadores foram restaurados com sucesso!
          </p>
          <div className="flex items-center mt-2 text-xs">
            <Users className="h-3 w-3 mr-1" />
            <span>Sistema pronto para login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRestoreNotification;
