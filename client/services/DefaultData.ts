import { User, Work, PoolMaintenance, UserPermissions } from "@shared/types";

const defaultAdminPermissions: UserPermissions = {
  canViewWorks: true,
  canCreateWorks: true,
  canEditWorks: true,
  canDeleteWorks: true,
  canViewMaintenance: true,
  canCreateMaintenance: true,
  canEditMaintenance: true,
  canDeleteMaintenance: true,
  canViewUsers: true,
  canCreateUsers: true,
  canEditUsers: true,
  canDeleteUsers: true,
  canViewReports: true,
  canExportData: true,
  canViewDashboard: true,
  canViewStats: true,
};

const defaultUserPermissions: UserPermissions = {
  canViewWorks: true,
  canCreateWorks: false,
  canEditWorks: false,
  canDeleteWorks: false,
  canViewMaintenance: true,
  canCreateMaintenance: false,
  canEditMaintenance: false,
  canDeleteMaintenance: false,
  canViewUsers: false,
  canCreateUsers: false,
  canEditUsers: false,
  canDeleteUsers: false,
  canViewReports: false,
  canExportData: false,
  canViewDashboard: true,
  canViewStats: true,
};

export class DefaultDataService {
  static initializeDefaultUsers(): void {
    const existingUsers = localStorage.getItem("users");

    if (!existingUsers || JSON.parse(existingUsers).length === 0) {
      console.log("🔧 Initializing default users...");

      const defaultUsers: User[] = [
        {
          id: crypto.randomUUID(),
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Silva",
          role: "admin",
          permissions: defaultAdminPermissions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          email: "tecnico@leirisonda.pt",
          name: "Técnico Leirisonda",
          role: "user",
          permissions: defaultUserPermissions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          email: "supervisor@leirisonda.pt",
          name: "Supervisor",
          role: "admin",
          permissions: {
            ...defaultAdminPermissions,
            canDeleteWorks: false,
            canDeleteMaintenance: false,
            canDeleteUsers: false,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          email: "user@leirisonda.pt",
          name: "Utilizador",
          role: "user",
          permissions: defaultUserPermissions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem("users", JSON.stringify(defaultUsers));
      console.log("✅ Default users created successfully");
    }
  }

  static initializeDefaultWorks(): void {
    const existingWorks = localStorage.getItem("works");

    if (!existingWorks || JSON.parse(existingWorks).length === 0) {
      console.log("🔧 Initializing sample works...");

      const sampleWorks: Work[] = [
        {
          id: crypto.randomUUID(),
          title: "Piscina Villa Marina",
          location: "Vieira de Leiria",
          date: new Date().toISOString(),
          startTime: "09:00",
          endTime: "17:00",
          clientName: "Maria Silva",
          clientPhone: "910123456",
          clientEmail: "maria@email.com",
          type: "piscina",
          status: "completed",
          priority: "medium",
          description:
            "Construção de piscina exterior 8x4m com sistema de filtração completo",
          technicians: ["João Santos", "Pedro Costa"],
          vehicles: ["LC-12-34"],
          materials: "Betão, azulejos, sistema filtração",
          budget: 25000,
          finalCost: 24500,
          photos: [],
          observations: "Obra concluída com sucesso. Cliente muito satisfeito.",
          workPerformed:
            "Escavação, betonagem, revestimento, instalação sistema filtração, enchimento e testes",
          workSheetCompleted: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem("works", JSON.stringify(sampleWorks));
      console.log("✅ Sample works created successfully");
    }
  }

  static initializeDefaultMaintenances(): void {
    const existingMaintenances = localStorage.getItem("pool_maintenances");

    if (
      !existingMaintenances ||
      JSON.parse(existingMaintenances).length === 0
    ) {
      console.log("🔧 Initializing sample maintenances...");

      const sampleMaintenances: PoolMaintenance[] = [
        {
          id: crypto.randomUUID(),
          poolName: "Piscina Magnolia",
          location: "Vieira de Leiria",
          clientName: "MICHEL Duarte",
          clientPhone: "913456789",
          clientEmail: "michel@email.com",
          poolType: "outdoor",
          waterCubicage: "48m³",
          status: "active",
          photos: [],
          interventions: [
            {
              id: crypto.randomUUID(),
              maintenanceId: "",
              date: new Date().toISOString(),
              timeStart: "09:00",
              timeEnd: "11:00",
              technicians: ["Técnico Leirisonda"],
              vehicles: ["LC-45-67"],
              waterValues: {
                ph: 7.2,
                salt: 3200,
                temperature: 24,
                chlorine: 1.5,
                bromine: 0,
                alkalinity: 120,
                hardness: 250,
                stabilizer: 50,
              },
              chemicalProducts: [
                {
                  productName: "Cloro líquido",
                  quantity: 2,
                  unit: "l",
                },
              ],
              workPerformed: {
                filtros: true,
                preFiltro: true,
                filtroAreiaVidro: false,
                alimenta: true,
                enchimentoAutomatico: false,
                linhaAgua: true,
                limpezaFundo: true,
                limpezaParedes: true,
                limpezaSkimmers: true,
                verificacaoEquipamentos: true,
                outros: "Verificação bomba e sistema automático",
              },
              problems: [],
              nextMaintenanceDate: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              photos: [],
              observations:
                "Manutenção completa realizada. Qualidade da água excelente.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          observations: "Piscina em excelente estado. Manutenção regular.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // Set maintenance ID in interventions
      sampleMaintenances[0].interventions[0].maintenanceId =
        sampleMaintenances[0].id;

      localStorage.setItem(
        "pool_maintenances",
        JSON.stringify(sampleMaintenances),
      );
      console.log("✅ Sample maintenances created successfully");
    }
  }

  static initializeAllDefaults(): void {
    console.log("🚀 Initializing default data for Leirisonda system...");

    this.initializeDefaultUsers();
    this.initializeDefaultWorks();
    this.initializeDefaultMaintenances();

    console.log("✅ All default data initialized successfully");
  }

  static resetAllData(): void {
    if (confirm("⚠️ ATENÇÃO: Isto vai apagar todos os dados! Continuar?")) {
      localStorage.removeItem("users");
      localStorage.removeItem("works");
      localStorage.removeItem("pool_maintenances");
      localStorage.removeItem("leirisonda_backups");

      console.log("🗑️ All data reset");

      // Re-initialize defaults
      this.initializeAllDefaults();

      alert("✅ Sistema reiniciado com dados de exemplo!");
      window.location.reload();
    }
  }
}

// Initialize defaults when module loads
DefaultDataService.initializeAllDefaults();
