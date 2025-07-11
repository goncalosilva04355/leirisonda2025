/**
 * Migração de localStorage para Firebase-Only
 * Move todos os dados do localStorage para Firebase e limpa localStorage
 */

import { FirebaseOnlyService } from "../services/firebaseOnlyService";
import { FirebaseOnlyAuth } from "../services/firebaseOnlyAuth";

export class MigrateToFirebaseOnly {
  static async runMigration(): Promise<{
    success: boolean;
    migrated: any;
    errors: string[];
  }> {
    console.log("\n🚀 MIGRAÇÃO PARA FIREBASE-ONLY");
    console.log("===============================");

    const result = {
      success: false,
      migrated: {
        users: 0,
        pools: 0,
        works: 0,
        maintenance: 0,
        clients: 0,
      },
      errors: [] as string[],
    };

    try {
      // Garantir que Firebase está inicializado
      await FirebaseOnlyService.initialize();
      await FirebaseOnlyAuth.initialize();

      // 1. Migrar utilizadores
      console.log("\n1️⃣ Migrando utilizadores...");
      await this.migrateUsers(result);

      // 2. Migrar piscinas
      console.log("\n2️⃣ Migrando piscinas...");
      await this.migratePools(result);

      // 3. Migrar obras
      console.log("\n3️⃣ Migrando obras...");
      await this.migrateWorks(result);

      // 4. Migrar manutenções
      console.log("\n4️⃣ Migrando manutenções...");
      await this.migrateMaintenance(result);

      // 5. Migrar clientes
      console.log("\n5️⃣ Migrando clientes...");
      await this.migrateClients(result);

      // 6. Limpar localStorage
      console.log("\n6️⃣ Limpando localStorage...");
      this.cleanLocalStorage();

      // 7. Marcar migração como completa
      console.log("\n7️⃣ Finalizando migração...");
      localStorage.setItem("migratedToFirebaseOnly", "true");
      localStorage.setItem("migrationDate", new Date().toISOString());

      result.success = result.errors.length === 0;

      console.log("\n📊 RESULTADO DA MIGRAÇÃO:");
      console.log("=========================");
      console.log(`Utilizadores: ${result.migrated.users}`);
      console.log(`Piscinas: ${result.migrated.pools}`);
      console.log(`Obras: ${result.migrated.works}`);
      console.log(`Manutenções: ${result.migrated.maintenance}`);
      console.log(`Clientes: ${result.migrated.clients}`);
      console.log(`Erros: ${result.errors.length}`);

      if (result.success) {
        console.log("✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!");
      } else {
        console.log("⚠️ Migração concluída com alguns erros");
        result.errors.forEach((error) => console.log(`  - ${error}`));
      }

      return result;
    } catch (error) {
      console.error("❌ Erro crítico na migração:", error);
      result.errors.push(
        `Erro crítico: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
      return result;
    }
  }

  private static async migrateUsers(result: any): Promise<void> {
    try {
      const userKeys = ["app-users", "mock-users", "users"];
      const allUsers = new Map(); // Para evitar duplicatas

      // Coletar utilizadores de todas as fontes
      userKeys.forEach((key) => {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const users = JSON.parse(data);
            if (Array.isArray(users)) {
              users.forEach((user) => {
                if (user.email) {
                  allUsers.set(user.email, user);
                }
              });
            }
          }
        } catch (error) {
          result.errors.push(`Erro ao ler ${key}: ${error}`);
        }
      });

      // Migrar utilizadores únicos para Firebase
      for (const [email, userData] of allUsers) {
        try {
          const success = await FirebaseOnlyService.addUser({
            email: userData.email,
            name: userData.name || "Utilizador",
            role: userData.role || "technician",
            permissions: userData.permissions || this.getDefaultPermissions(),
            active: userData.active !== false,
          });

          if (success) {
            result.migrated.users++;
            console.log(`✅ Utilizador migrado: ${email}`);
          } else {
            result.errors.push(`Falhou ao migrar utilizador: ${email}`);
          }
        } catch (error) {
          result.errors.push(`Erro ao migrar utilizador ${email}: ${error}`);
        }
      }
    } catch (error) {
      result.errors.push(`Erro geral na migração de utilizadores: ${error}`);
    }
  }

  private static async migratePools(result: any): Promise<void> {
    try {
      const data = localStorage.getItem("pools");
      if (data) {
        const pools = JSON.parse(data);
        if (Array.isArray(pools)) {
          for (const pool of pools) {
            try {
              const success = await FirebaseOnlyService.addPool(pool);
              if (success) {
                result.migrated.pools++;
                console.log(`✅ Piscina migrada: ${pool.name || pool.id}`);
              } else {
                result.errors.push(
                  `Falhou ao migrar piscina: ${pool.name || pool.id}`,
                );
              }
            } catch (error) {
              result.errors.push(`Erro ao migrar piscina: ${error}`);
            }
          }
        }
      }
    } catch (error) {
      result.errors.push(`Erro geral na migração de piscinas: ${error}`);
    }
  }

  private static async migrateWorks(result: any): Promise<void> {
    try {
      const data = localStorage.getItem("works");
      if (data) {
        const works = JSON.parse(data);
        if (Array.isArray(works)) {
          for (const work of works) {
            try {
              const success = await FirebaseOnlyService.addWork(work);
              if (success) {
                result.migrated.works++;
                console.log(`✅ Obra migrada: ${work.title || work.id}`);
              } else {
                result.errors.push(
                  `Falhou ao migrar obra: ${work.title || work.id}`,
                );
              }
            } catch (error) {
              result.errors.push(`Erro ao migrar obra: ${error}`);
            }
          }
        }
      }
    } catch (error) {
      result.errors.push(`Erro geral na migração de obras: ${error}`);
    }
  }

  private static async migrateMaintenance(result: any): Promise<void> {
    try {
      const data = localStorage.getItem("maintenance");
      if (data) {
        const maintenance = JSON.parse(data);
        if (Array.isArray(maintenance)) {
          for (const item of maintenance) {
            try {
              const success = await FirebaseOnlyService.addMaintenance(item);
              if (success) {
                result.migrated.maintenance++;
                console.log(`✅ Manutenção migrada: ${item.poolId || item.id}`);
              } else {
                result.errors.push(
                  `Falhou ao migrar manutenção: ${item.poolId || item.id}`,
                );
              }
            } catch (error) {
              result.errors.push(`Erro ao migrar manutenção: ${error}`);
            }
          }
        }
      }
    } catch (error) {
      result.errors.push(`Erro geral na migração de manutenções: ${error}`);
    }
  }

  private static async migrateClients(result: any): Promise<void> {
    try {
      const data = localStorage.getItem("clients");
      if (data) {
        const clients = JSON.parse(data);
        if (Array.isArray(clients)) {
          for (const client of clients) {
            try {
              const success = await FirebaseOnlyService.addClient(client);
              if (success) {
                result.migrated.clients++;
                console.log(`✅ Cliente migrado: ${client.name || client.id}`);
              } else {
                result.errors.push(
                  `Falhou ao migrar cliente: ${client.name || client.id}`,
                );
              }
            } catch (error) {
              result.errors.push(`Erro ao migrar cliente: ${error}`);
            }
          }
        }
      }
    } catch (error) {
      result.errors.push(`Erro geral na migração de clientes: ${error}`);
    }
  }

  private static cleanLocalStorage(): void {
    try {
      const keysToRemove = [
        // Dados de utilizadores
        "app-users",
        "mock-users",
        "users",
        "saved-users",
        // Dados da aplicação
        "pools",
        "works",
        "maintenance",
        "clients",
        "interventions",
        // Cache e backups
        "lastSyncTime",
        "lastBackup",
        "app-cleaned",
        "last-cleanup",
        // Flags de migração antiga
        "crossUserDataMigrated",
        "lastCrossUserSync",
      ];

      keysToRemove.forEach((key) => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`🗑️ Removido localStorage: ${key}`);
        }
      });

      // Remover todos os backups antigos
      const allKeys = Object.keys(localStorage);
      allKeys.forEach((key) => {
        if (
          key.includes("backup_") ||
          key.includes("emergency_") ||
          key.includes("_rolling")
        ) {
          localStorage.removeItem(key);
          console.log(`🗑️ Removido backup: ${key}`);
        }
      });

      console.log("✅ localStorage limpo");
    } catch (error) {
      console.error("❌ Erro ao limpar localStorage:", error);
    }
  }

  private static getDefaultPermissions() {
    return {
      obras: { view: true, create: false, edit: false, delete: false },
      manutencoes: { view: true, create: true, edit: true, delete: false },
      piscinas: { view: true, create: false, edit: false, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: true, create: false, edit: false, delete: false },
      clientes: { view: true, create: false, edit: false, delete: false },
    };
  }

  // Verificar se migração já foi feita
  static isMigrationCompleted(): boolean {
    return localStorage.getItem("migratedToFirebaseOnly") === "true";
  }

  // Forçar migração mesmo se já foi feita
  static async forceMigration(): Promise<any> {
    localStorage.removeItem("migratedToFirebaseOnly");
    return await this.runMigration();
  }
}

// Executar migração automaticamente se necessário
if (typeof window !== "undefined") {
  setTimeout(() => {
    if (!MigrateToFirebaseOnly.isMigrationCompleted()) {
      console.log("🚀 Iniciando migração automática para Firebase-Only...");
      MigrateToFirebaseOnly.runMigration().then((result) => {
        if (result.success) {
          console.log("🎉 Migração para Firebase-Only concluída!");
          window.dispatchEvent(
            new CustomEvent("migrationCompleted", { detail: result }),
          );
        }
      });
    } else {
      console.log("✅ Sistema já migrado para Firebase-Only");
    }
  }, 8000); // Aguardar 8 segundos para Firebase inicializar
}
