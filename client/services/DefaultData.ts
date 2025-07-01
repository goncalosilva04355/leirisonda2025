import { User, Work, PoolMaintenance } from "@shared/types";

export class DefaultData {
  static initializeDefaultUsers(): void {
    const existingUsers = localStorage.getItem("users");

    if (!existingUsers || JSON.parse(existingUsers).length === 0) {
      console.log("🔧 Initializing default users...");

      const defaultUsers: User[] = [
        {
          id: "admin_goncalo",
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Fonseca",
          role: "admin",
          password: "19867gsf",
          permissions: {
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
            canManageSettings: true,
            canViewReports: true,
            canExportData: true,
            canManageBackups: true,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "user_alexandre",
          email: "alexkamaryta@gmail.com",
          name: "Alexandre Kamarýta",
          role: "user",
          password: "69alexandre",
          permissions: {
            canViewWorks: true,
            canCreateWorks: true,
            canEditWorks: true,
            canDeleteWorks: false,
            canViewMaintenance: true,
            canCreateMaintenance: true,
            canEditMaintenance: true,
            canDeleteMaintenance: false,
            canViewUsers: false,
            canCreateUsers: false,
            canEditUsers: false,
            canDeleteUsers: false,
            canManageSettings: false,
            canViewReports: true,
            canExportData: false,
            canManageBackups: false,
          },
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
          workSheetNumber: "FS-001-2025",
          clientName: "Cliente Exemplo",
          clientAddress: "Rua Exemplo, 123",
          clientPhone: "912345678",
          clientEmail: "cliente@exemplo.com",
          workDescription: "Obra de exemplo para demonstração",
          workType: "Manutenção",
          priority: "medium",
          status: "in_progress",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          assignedUsers: ["user_alexandre"],
          materials: [],
          photos: [],
          observations: "Obra de exemplo criada automaticamente",
          workSheetCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem("works", JSON.stringify(sampleWorks));
      console.log("✅ Sample works created successfully");
    }
  }

  static initializeDefaultMaintenances(): void {
    console.log("🚫 BLOQUEADO: Não inicializar dados de exemplo de piscinas");
    // Sistema completamente limpo - sem dados de exemplo de piscinas
    return;
  }

  static initializeAllDefaults(): void {
    console.log("🚀 Initializing default data for Leirisonda system...");

    this.initializeDefaultUsers();
    this.initializeDefaultWorks();
    this.initializeDefaultMaintenances();

    console.log("✅ All default data initialized successfully");
    console.log("📋 Available users:");
    console.log("• gongonsilva@gmail.com / 19867gsf (Admin)");
    console.log("• alexkamaryta@gmail.com / 69alexandre (User)");
  }

  static forceCleanUserSystem(): void {
    console.log("🧹 Forçando limpeza completa do sistema de utilizadores...");

    localStorage.removeItem("users");
    localStorage.removeItem("leirisonda_user");

    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (key.startsWith("password_")) {
        localStorage.removeItem(key);
      }
    });

    console.log("✅ Sistema de utilizadores limpo");
    this.initializeDefaultUsers();
  }

  static clearAllData(): void {
    console.log("🗑️ Limpando todos os dados do sistema...");

    localStorage.removeItem("works");
    localStorage.removeItem("users");
    localStorage.removeItem("pool_maintenances");
    localStorage.removeItem("leirisonda_works");
    localStorage.removeItem("leirisonda_user");

    console.log("✅ Todos os dados removidos");
  }
}
