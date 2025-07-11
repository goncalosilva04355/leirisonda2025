// Versão simples do WorkAssignmentNotifications sem useState problemático
import React from "react";

interface WorkAssignmentNotificationsProps {
  currentUser?: any;
}

const WorkAssignmentNotificationsSimple: React.FC<
  WorkAssignmentNotificationsProps
> = ({ currentUser }) => {
  // Versão estática sem state
  return null; // Não mostrar por enquanto
};

export default WorkAssignmentNotificationsSimple;
