// BACKUP CRIADO EM: 2024-12-30
// VERSÃO SIMPLIFICADA ESTÁVEL DO useDataSync
// Esta versão funciona sem erros e fornece funcionalidade básica de works

import { useState, useEffect } from "react";

export interface Work {
  id: string;
  title: string;
  client: string;
  contact: string;
  location: string;
  startTime: string;
  endTime: string;
  observations: string;
  workPerformed: string;
  status: "pending" | "in_progress" | "completed";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

// ESTE É UM BACKUP - Para restaurar, copie para useDataSync_simple.ts
