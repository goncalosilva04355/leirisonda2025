import React from "react";

interface AdminSidebarProps {
  currentUser?: any;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentUser,
  onClose,
}) => {
  return (
    <div className="space-y-2">
      {/* Mensagem simples de administração */}
      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600">
          Área administrativa simplificada
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;

export default AdminSidebar;
