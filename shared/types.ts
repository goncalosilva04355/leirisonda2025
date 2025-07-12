export interface UserPermissions {
  // Obras
  canViewWorks: boolean;
  canCreateWorks: boolean;
  canEditWorks: boolean;
  canDeleteWorks: boolean;

  // Manutenção
  canViewMaintenance: boolean;
  canCreateMaintenance: boolean;
  canEditMaintenance: boolean;
  canDeleteMaintenance: boolean;

  // Utilizadores (apenas admin)
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;

  // Relatórios
  canViewReports: boolean;
  canExportData: boolean;

  // Dashboard
  canViewDashboard: boolean;
  canViewStats: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "manager" | "technician";
  permissions: UserPermissions;
  createdAt: string;
}

export interface Work {
  id: string;
  workSheetNumber: string; // Folha obra Leirisonda
  type: "piscina" | "manutencao" | "avaria" | "montagem";
  clientName: string;
  address: string;
  contact: string;
  entryTime: string;
  exitTime?: string;
  status: "pendente" | "em_progresso" | "concluida";
  vehicles: string[]; // Viaturas utilizadas
  technicians: string[]; // Técnicos que efetuaram o trabalho
  assignedTo?: string; // Legacy field for compatibility
  assignedUsers?: Array<{ id: string; name: string }>; // Multiple users assigned
  assignedUserIds?: string[]; // User IDs for reference
  photos: WorkPhoto[];
  observations: string;
  workPerformed: string; // Trabalho realizado
  workSheetCompleted: boolean; // Se a folha de obra foi preenchida/feita
  createdAt: string;
  updatedAt: string;
}

export interface WorkPhoto {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;
}

export interface PoolMaintenance {
  id: string;
  poolName: string;
  location: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  poolType: "outdoor" | "indoor" | "spa" | "olympic";
  waterCubicage: string; // Ex: "50m³" ou "50000L"
  lastMaintenanceDate?: string;
  interventions: MaintenanceIntervention[];
  status: "active" | "inactive" | "seasonal";
  photos: PoolPhoto[];
  observations: string;
  createdAt: string;
  updatedAt: string;
}

export interface PoolPhoto {
  id: string;
  url: string;
  filename: string;
  description: string;
  category: "general" | "equipment" | "issues" | "before" | "after";
  uploadedAt: string;
}

export interface MaintenanceIntervention {
  id: string;
  maintenanceId: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  technicians: string[];
  vehicles: string[];
  waterValues: {
    ph: number;
    salt: number;
    temperature: number;
    chlorine: number;
    bromine: number;
    alkalinity: number;
    hardness: number;
    stabilizer: number;
  };
  chemicalProducts: {
    productName: string;
    quantity: number;
    unit: string; // kg, l, g, etc
  }[];
  workPerformed: {
    filtros: boolean;
    preFiltero: boolean;
    filtroAreiaVidro: boolean;
    alimenta: boolean;
    enchimentoAutomatico: boolean;
    linhaAgua: boolean;
    limpezaFundo: boolean;
    limpezaParedes: boolean;
    limpezaSkimmers: boolean;
    verificacaoEquipamentos: boolean;
    outros: string;
  };
  problems: {
    description: string;
    severity: "low" | "medium" | "high";
    resolved: boolean;
  }[];
  nextMaintenanceDate?: string;
  photos: InterventionPhoto[];
  observations: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterventionPhoto {
  id: string;
  url: string;
  filename: string;
  description: string;
  uploadedAt: string;
}

export interface DashboardStats {
  totalWorks: number;
  pendingWorks: number;
  inProgressWorks: number;
  completedWorks: number;
  remainingWorkSheets: number;
  workSheetsPending: number; // Folhas de obra por fazer
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface CreateWorkData {
  workSheetNumber: string;
  type: "piscina" | "manutencao" | "avaria" | "montagem";
  clientName: string;
  address: string;
  contact: string;
  entryTime: string;
  exitTime?: string;
  status: "pendente" | "em_progresso" | "concluida";
  vehicles: string[];
  technicians: string[];
  photos: File[];
  observations: string;
  workPerformed: string;
  workSheetCompleted: boolean;
}

// Add missing interfaces that are used in the app
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "manager" | "technician";
  permissions: UserPermissions;
  createdAt: Date | string;
  active?: boolean;
  password?: string;
}

export interface Pool {
  id: string;
  name: string;
  location: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  poolType?: "outdoor" | "indoor" | "spa" | "olympic" | string;
  waterCubicage: string;
  status: "active" | "inactive" | "seasonal";
  photos: PoolPhoto[];
  observations: string;
  createdAt: string;
  updatedAt: string;
}

export interface Maintenance {
  id: string;
  poolId: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  technician?: string;
  technicians: string[];
  vehicles: string[];
  workPerformed: string;
  observations: string;
  createdAt: string;
  updatedAt: string;
}
