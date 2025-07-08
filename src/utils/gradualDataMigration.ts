/**
 * Utilitário para Migração Gradual de Dados
 * Preserva o acesso aos dados existentes durante a transição
 */

export class GradualDataMigration {
  private static migrationMode = true; // Ativar modo migração

  /**
   * Verifica se está em modo migração
   */
  public static isMigrationMode(): boolean {
    return this.migrationMode;
  }

  /**
   * Ativa o modo migração (acesso preservado)
   */
  public static enableMigrationMode(): void {
    this.migrationMode = true;
    console.log("🔄 Modo migração ATIVADO - dados existentes preservados");
  }

  /**
   * Desativa o modo migração (isolamento rigoroso)
   */
  public static disableMigrationMode(): void {
    this.migrationMode = false;
    console.log("🔒 Modo migração DESATIVADO - isolamento rigoroso aplicado");
  }

  /**
   * Adiciona metadados de proprietário apenas para novos dados
   */
  public static addOwnershipToNewData(data: any, userId: string): any {
    if (!this.migrationMode) {
      // Se não estiver em migração, sempre adicionar proprietário
      return {
        ...data,
        createdByUser: userId,
        ownerId: userId,
        isPrivate: true,
        createdAt: data.createdAt || new Date().toISOString(),
      };
    }

    // Em modo migração, só adicionar proprietário se for novo
    const isNewData =
      !data.id ||
      data.id.toString().startsWith(Date.now().toString().substring(0, 10));

    if (isNewData) {
      console.log("🆕 Adicionando proprietário a dados novos");
      return {
        ...data,
        createdByUser: userId,
        ownerId: userId,
        isPrivate: true,
        createdAt: data.createdAt || new Date().toISOString(),
      };
    } else {
      console.log("📄 Preservando dados existentes sem modificação");
      return data;
    }
  }

  /**
   * Verifica se um item deve ser acessível baseado no modo migração
   */
  public static shouldAllowAccess(item: any, currentUserId: string): boolean {
    if (this.migrationMode) {
      // Em modo migração, permitir acesso a tudo
      return true;
    }

    // Fora do modo migração, verificar propriedade
    const ownerField = item.createdByUser || item.ownerId || item.userId;
    return !ownerField || ownerField === currentUserId;
  }

  /**
   * Migra gradualmente um array de dados para ter proprietários
   */
  public static migrateDataArray(
    dataArray: any[],
    currentUserId: string,
  ): any[] {
    if (!this.migrationMode) {
      return dataArray;
    }

    return dataArray.map((item) => {
      const hasOwner = item.createdByUser || item.ownerId || item.userId;

      if (!hasOwner) {
        // Para dados sem proprietário, adicionar silenciosamente
        return {
          ...item,
          migratedAt: new Date().toISOString(),
          migratedBy: currentUserId,
          isLegacyData: true,
        };
      }

      return item;
    });
  }

  /**
   * Obtém estatísticas da migração
   */
  public static getMigrationStats(dataArrays: Record<string, any[]>): {
    total: number;
    withOwner: number;
    withoutOwner: number;
    migrationComplete: boolean;
  } {
    let total = 0;
    let withOwner = 0;
    let withoutOwner = 0;

    Object.values(dataArrays).forEach((array) => {
      array.forEach((item) => {
        total++;
        const hasOwner = item.createdByUser || item.ownerId || item.userId;
        if (hasOwner) {
          withOwner++;
        } else {
          withoutOwner++;
        }
      });
    });

    const migrationComplete = withoutOwner === 0;

    return {
      total,
      withOwner,
      withoutOwner,
      migrationComplete,
    };
  }
}

// Ativar modo migração por padrão
GradualDataMigration.enableMigrationMode();

export default GradualDataMigration;
