import { firestoreService } from "./firestoreService";
import { forceFirestoreService } from "./forceFirestoreService";

// Fallback para casos em que os serviços não estão disponíveis
const safeFallback = {
  async getUtilizadores() {
    return JSON.parse(localStorage.getItem("app-users") || "[]");
  },
  async getWorks() {
    return JSON.parse(localStorage.getItem("works") || "[]");
  },
  async updateWork(id: string, work: any) {
    const works = JSON.parse(localStorage.getItem("works") || "[]");
    const index = works.findIndex((w: any) => w.id === id);
    if (index >= 0) {
      works[index] = { ...works[index], ...work };
      localStorage.setItem("works", JSON.stringify(works));
    }
  },
};

interface Work {
  id: string;
  assignedUsers?: Array<{ id: string; name: string }>;
  assignedUserIds?: string[];
  assignedTo?: string;
  [key: string]: any;
}

interface User {
  id: string | number;
  email: string;
  name: string;
  [key: string]: any;
}

export class OrphanUserCleanupService {
  private static instance: OrphanUserCleanupService;

  static getInstance(): OrphanUserCleanupService {
    if (!OrphanUserCleanupService.instance) {
      OrphanUserCleanupService.instance = new OrphanUserCleanupService();
    }
    return OrphanUserCleanupService.instance;
  }

  /**
   * Remove utilizadores inexistentes das obras atribuídas
   */
  async cleanOrphanUsersFromWorks(): Promise<{
    success: boolean;
    cleaned: number;
    errors: string[];
    details: any[];
  }> {
    const result = {
      success: false,
      cleaned: 0,
      errors: [] as string[],
      details: [] as any[],
    };

    try {
      console.log(
        "🧹 Iniciando limpeza de utilizadores inexistentes das obras...",
      );

      // 1. Carregar todos os utilizadores válidos do Firestore
      const validUsers = await this.loadValidUsers();
      const validUserIds = new Set(validUsers.map((u) => String(u.id)));
      const validUserEmails = new Set(validUsers.map((u) => u.email));

      console.log(
        `📋 Encontrados ${validUsers.length} utilizadores válidos no Firestore`,
      );

      // 2. Carregar todas as obras
      const works = await this.loadAllWorks();
      console.log(`📋 Encontradas ${works.length} obras para verificar`);

      // 3. Processar cada obra
      for (const work of works) {
        const cleanupInfo = await this.cleanWorkAssignments(
          work,
          validUserIds,
          validUserEmails,
        );

        if (cleanupInfo.hasChanges) {
          result.cleaned++;
          result.details.push(cleanupInfo);
        }
      }

      result.success = true;
      console.log(`✅ Limpeza concluída: ${result.cleaned} obras atualizadas`);
    } catch (error) {
      console.error("❌ Erro durante limpeza:", error);
      result.errors.push(`Erro geral: ${error.message}`);
    }

    return result;
  }

  /**
   * Carrega utilizadores válidos do Firestore
   */
  private async loadValidUsers(): Promise<User[]> {
    const fallbackPromises = [
      // Método 1: firestoreService
      this.tryMethod("firestoreService.getUtilizadores", () =>
        firestoreService.getUtilizadores(),
      ),

      // Método 2: forceFirestoreService
      this.tryMethod("forceFirestoreService.getUsers", () =>
        forceFirestoreService.getUsers(),
      ),

      // Método 3: localStorage
      this.tryMethod("localStorage fallback", () =>
        safeFallback.getUtilizadores(),
      ),
    ];

    for (const method of fallbackPromises) {
      try {
        const result = await method;
        if (result && result.length > 0) {
          return result;
        }
      } catch (error) {
        console.warn("Método falhou, tentando próximo...", error);
      }
    }

    console.warn(
      "⚠️ Nenhum método conseguiu carregar utilizadores, retornando array vazio",
    );
    return [];
  }

  private async tryMethod<T>(
    name: string,
    method: () => Promise<T>,
  ): Promise<T> {
    console.log(`🔄 Tentando carregar utilizadores via ${name}`);
    const result = await method();
    console.log(
      `✅ ${name}: ${Array.isArray(result) ? result.length : "dados"} carregados`,
    );
    return result;
  }

  /**
   * Carrega todas as obras
   */
  private async loadAllWorks(): Promise<Work[]> {
    const fallbackPromises = [
      // Método 1: firestoreService
      this.tryMethod("firestoreService.getWorks", () =>
        firestoreService.getWorks(),
      ),

      // Método 2: forceFirestoreService
      this.tryMethod("forceFirestoreService.getWorks", () =>
        forceFirestoreService.getWorks(),
      ),

      // Método 3: localStorage
      this.tryMethod("localStorage fallback", () => safeFallback.getWorks()),
    ];

    for (const method of fallbackPromises) {
      try {
        const result = await method;
        if (result && result.length > 0) {
          return result;
        }
      } catch (error) {
        console.warn("Método falhou, tentando próximo...", error);
      }
    }

    console.warn(
      "⚠️ Nenhum método conseguiu carregar obras, retornando array vazio",
    );
    return [];
  }

  /**
   * Limpa atribuições de uma obra específica
   */
  private async cleanWorkAssignments(
    work: Work,
    validUserIds: Set<string>,
    validUserEmails: Set<string>,
  ): Promise<{
    workId: string;
    workTitle: string;
    hasChanges: boolean;
    removedUsers: string[];
    updatedAssignedUsers: any[];
    updatedAssignedUserIds: string[];
  }> {
    const cleanupInfo = {
      workId: work.id,
      workTitle: work.workSheetNumber || work.title || `Obra ${work.id}`,
      hasChanges: false,
      removedUsers: [] as string[],
      updatedAssignedUsers: [] as any[],
      updatedAssignedUserIds: [] as string[],
    };

    try {
      let hasChanges = false;

      // Limpar assignedUsers
      if (work.assignedUsers && Array.isArray(work.assignedUsers)) {
        const validAssignedUsers = work.assignedUsers.filter((user) => {
          const isValid =
            validUserIds.has(String(user.id)) ||
            validUserEmails.has(user.email);
          if (!isValid) {
            cleanupInfo.removedUsers.push(`${user.name} (ID: ${user.id})`);
            hasChanges = true;
          }
          return isValid;
        });

        if (validAssignedUsers.length !== work.assignedUsers.length) {
          cleanupInfo.updatedAssignedUsers = validAssignedUsers;
        }
      }

      // Limpar assignedUserIds
      if (work.assignedUserIds && Array.isArray(work.assignedUserIds)) {
        const validAssignedUserIds = work.assignedUserIds.filter((userId) => {
          const isValid = validUserIds.has(String(userId));
          if (!isValid) {
            hasChanges = true;
          }
          return isValid;
        });

        if (validAssignedUserIds.length !== work.assignedUserIds.length) {
          cleanupInfo.updatedAssignedUserIds = validAssignedUserIds;
        }
      }

      // Atualizar obra se houver mudanças
      if (hasChanges) {
        const updatedWork = {
          ...work,
          assignedUsers:
            cleanupInfo.updatedAssignedUsers.length > 0
              ? cleanupInfo.updatedAssignedUsers
              : work.assignedUsers || [],
          assignedUserIds:
            cleanupInfo.updatedAssignedUserIds.length > 0
              ? cleanupInfo.updatedAssignedUserIds
              : work.assignedUserIds || [],
          updatedAt: new Date().toISOString(),
        };

        // Limpar assignedTo se estiver vazio ou inválido
        if (updatedWork.assignedUsers.length === 0) {
          updatedWork.assignedTo = "";
        } else {
          updatedWork.assignedTo = updatedWork.assignedUsers
            .map((u) => u.name)
            .join(", ");
        }

        // Salvar alterações
        await this.saveUpdatedWork(updatedWork);

        console.log(
          `🧹 Obra "${cleanupInfo.workTitle}" atualizada: removidos ${cleanupInfo.removedUsers.length} utilizadores inexistentes`,
        );

        cleanupInfo.hasChanges = true;
      }
    } catch (error) {
      console.error(`❌ Erro ao limpar obra ${work.id}:`, error);
    }

    return cleanupInfo;
  }

  /**
   * Salva obra atualizada no Firestore e localStorage
   */
  private async saveUpdatedWork(work: Work): Promise<void> {
    try {
      // Salvar no Firestore via firestoreService
      try {
        await firestoreService.updateWork(work.id, work);
        console.log(`✅ Obra ${work.id} atualizada no Firestore`);
      } catch (firestoreError) {
        console.warn(`⚠️ Erro ao salvar no firestoreService:`, firestoreError);

        // Fallback para forceFirestoreService
        try {
          await forceFirestoreService.updateWork(work.id, work);
          console.log(
            `✅ Obra ${work.id} atualizada via forceFirestoreService`,
          );
        } catch (forceError) {
          console.warn(
            `⚠️ Erro ao salvar no forceFirestoreService:`,
            forceError,
          );
        }
      }

      // Salvar no localStorage como backup
      const localWorks = JSON.parse(localStorage.getItem("works") || "[]");
      const workIndex = localWorks.findIndex((w: any) => w.id === work.id);

      if (workIndex >= 0) {
        localWorks[workIndex] = work;
      } else {
        localWorks.push(work);
      }

      localStorage.setItem("works", JSON.stringify(localWorks));
      console.log(`💾 Obra ${work.id} atualizada no localStorage`);
    } catch (error) {
      console.error(`❌ Erro ao salvar obra ${work.id}:`, error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas de utilizadores órfãos sem fazer alterações
   */
  async getOrphanUsersReport(): Promise<{
    totalWorks: number;
    worksWithOrphans: number;
    totalOrphanUsers: number;
    orphanDetails: any[];
  }> {
    const report = {
      totalWorks: 0,
      worksWithOrphans: 0,
      totalOrphanUsers: 0,
      orphanDetails: [] as any[],
    };

    try {
      const validUsers = await this.loadValidUsers();
      const validUserIds = new Set(validUsers.map((u) => String(u.id)));
      const validUserEmails = new Set(validUsers.map((u) => u.email));

      const works = await this.loadAllWorks();
      report.totalWorks = works.length;

      for (const work of works) {
        const orphanUsers = [];

        // Verificar assignedUsers
        if (work.assignedUsers && Array.isArray(work.assignedUsers)) {
          for (const user of work.assignedUsers) {
            if (
              !validUserIds.has(String(user.id)) &&
              !validUserEmails.has(user.email)
            ) {
              orphanUsers.push(user);
            }
          }
        }

        if (orphanUsers.length > 0) {
          report.worksWithOrphans++;
          report.totalOrphanUsers += orphanUsers.length;
          report.orphanDetails.push({
            workId: work.id,
            workTitle: work.workSheetNumber || work.title || `Obra ${work.id}`,
            orphanUsers: orphanUsers,
          });
        }
      }
    } catch (error) {
      console.error("❌ Erro ao gerar relatório:", error);
    }

    return report;
  }
}

// Exportar instância singleton
export const orphanUserCleanupService = OrphanUserCleanupService.getInstance();
