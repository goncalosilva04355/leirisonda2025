/**
 * Serviço de Integridade de Dados
 *
 * Este serviço garante que os dados não aparecem e desaparecem
 * e resolve problemas de sincronização entre Firebase e localStorage
 */

interface DataState {
  pools: any[];
  maintenance: any[];
  works: any[];
  clients: any[];
  users: any[];
}

interface IntegrityCheckResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class DataIntegrityService {
  private lastKnownState: DataState | null = null;
  private integrityCheckInterval: NodeJS.Timeout | null = null;

  /**
   * Inicia o monitoramento contínuo da integridade dos dados
   */
  startIntegrityMonitoring() {
    // Verifica integridade a cada 5 minutos (reduzido para melhorar performance)
    this.integrityCheckInterval = setInterval(() => {
      this.performIntegrityCheck();
    }, 300000);

    // Integrity monitoring started silently
  }

  /**
   * Para o monitoramento de integridade
   */
  stopIntegrityMonitoring() {
    if (this.integrityCheckInterval) {
      clearInterval(this.integrityCheckInterval);
      this.integrityCheckInterval = null;
    }
    // Integrity monitoring stopped silently
  }

  /**
   * Valida a integridade dos dados atuais
   */
  validateDataIntegrity(currentData: DataState): IntegrityCheckResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Verifica se há dados duplicados
    this.checkForDuplicates(currentData, errors);

    // Verifica se há dados corrompidos (caracteres estranhos)
    this.checkForCorruptedData(currentData, errors);

    // Verifica consistência de referências
    this.checkReferentialIntegrity(currentData, warnings);

    // Verifica se dados desapareceram inesperadamente
    this.checkForDataLoss(currentData, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Verifica por dados duplicados
   */
  private checkForDuplicates(data: DataState, errors: string[]) {
    // Verifica pools duplicadas
    const poolIds = data.pools.map((p) => p.id);
    const duplicatePoolIds = poolIds.filter(
      (id, index) => poolIds.indexOf(id) !== index,
    );
    if (duplicatePoolIds.length > 0) {
      errors.push(
        `Piscinas duplicadas encontradas: ${duplicatePoolIds.join(", ")}`,
      );
    }

    // Verifica manutenções duplicadas
    const maintenanceIds = data.maintenance.map((m) => m.id);
    const duplicateMaintenanceIds = maintenanceIds.filter(
      (id, index) => maintenanceIds.indexOf(id) !== index,
    );
    if (duplicateMaintenanceIds.length > 0) {
      errors.push(
        `Manutenções duplicadas encontradas: ${duplicateMaintenanceIds.join(", ")}`,
      );
    }

    // Verifica obras duplicadas
    const workIds = data.works.map((w) => w.id);
    const duplicateWorkIds = workIds.filter(
      (id, index) => workIds.indexOf(id) !== index,
    );
    if (duplicateWorkIds.length > 0) {
      errors.push(
        `Obras duplicadas encontradas: ${duplicateWorkIds.join(", ")}`,
      );
    }
  }

  /**
   * Verifica por dados corrompidos (caracteres especiais malformados)
   */
  private checkForCorruptedData(data: DataState, errors: string[]) {
    const corruptedCharPattern = /��|�/g;

    // Verifica todas as strings em todos os objetos
    const checkObject = (obj: any, type: string, id: string) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "string" && corruptedCharPattern.test(value)) {
          errors.push(
            `Dados corrompidos encontrados em ${type} (${id}), campo: ${key}`,
          );
        }
      });
    };

    data.pools.forEach((pool) => checkObject(pool, "piscina", pool.id));
    data.maintenance.forEach((maint) =>
      checkObject(maint, "manutenção", maint.id),
    );
    data.works.forEach((work) => checkObject(work, "obra", work.id));
    data.clients.forEach((client) => checkObject(client, "cliente", client.id));
  }

  /**
   * Verifica integridade referencial
   */
  private checkReferentialIntegrity(data: DataState, warnings: string[]) {
    // Verifica se manutenções referenciam piscinas existentes
    data.maintenance.forEach((maint) => {
      if (maint.poolId && !data.pools.find((p) => p.id === maint.poolId)) {
        warnings.push(
          `Manutenção ${maint.id} referencia piscina inexistente: ${maint.poolId}`,
        );
      }
    });

    // Verifica se obras referenciam clientes existentes
    data.works.forEach((work) => {
      if (work.clientId && !data.clients.find((c) => c.id === work.clientId)) {
        warnings.push(
          `Obra ${work.id} referencia cliente inexistente: ${work.clientId}`,
        );
      }
    });
  }

  /**
   * Verifica se dados desapareceram inesperadamente
   */
  private checkForDataLoss(currentData: DataState, warnings: string[]) {
    if (!this.lastKnownState) {
      this.lastKnownState = JSON.parse(JSON.stringify(currentData));
      return;
    }

    // Verifica se piscinas desapareceram
    const missingPools = this.lastKnownState.pools.filter(
      (lastPool) =>
        !currentData.pools.find(
          (currentPool) => currentPool.id === lastPool.id,
        ),
    );
    if (missingPools.length > 0) {
      warnings.push(
        `Piscinas desapareceram: ${missingPools.map((p) => p.name).join(", ")}`,
      );
    }

    // Verifica se manutenções desapareceram
    const missingMaintenance = this.lastKnownState.maintenance.filter(
      (lastMaint) =>
        !currentData.maintenance.find(
          (currentMaint) => currentMaint.id === lastMaint.id,
        ),
    );
    if (missingMaintenance.length > 0) {
      warnings.push(
        `Manutenções desapareceram: ${missingMaintenance.length} registos`,
      );
    }

    // Verifica se obras desapareceram
    const missingWorks = this.lastKnownState.works.filter(
      (lastWork) =>
        !currentData.works.find(
          (currentWork) => currentWork.id === lastWork.id,
        ),
    );
    if (missingWorks.length > 0) {
      warnings.push(
        `Obras desapareceram: ${missingWorks.map((w) => w.title).join(", ")}`,
      );
    }

    // Atualiza estado conhecido
    this.lastKnownState = JSON.parse(JSON.stringify(currentData));
  }

  /**
   * Executa verificação completa de integridade
   */
  private performIntegrityCheck() {
    try {
      // Obter dados atuais do localStorage
      const currentData: DataState = {
        pools: JSON.parse(localStorage.getItem("pools") || "[]"),
        maintenance: JSON.parse(localStorage.getItem("maintenance") || "[]"),
        works: JSON.parse(localStorage.getItem("works") || "[]"),
        clients: JSON.parse(localStorage.getItem("clients") || "[]"),
        users: JSON.parse(localStorage.getItem("users") || "[]"),
      };

      const result = this.validateDataIntegrity(currentData);

      if (!result.isValid) {
        console.error("🚨 Problemas de integridade detectados:", result.errors);
        // Aqui você pode implementar ações corretivas automáticas
        this.attemptDataRecovery(result.errors);
      }

      // Integrity warnings removed per user request
    } catch (error) {
      console.error("❌ Erro durante verificação de integridade:", error);
    }
  }

  /**
   * Tenta recuperar dados corrompidos ou perdidos
   */
  private attemptDataRecovery(errors: string[]) {
    console.log("🔧 Tentando recuperar dados...");

    // Implementar lógica de recuperação baseada nos tipos de erro
    errors.forEach((error) => {
      if (error.includes("Dados corrompidos")) {
        this.fixCorruptedCharacters();
      }
      if (error.includes("duplicadas")) {
        this.removeDuplicates();
      }
    });
  }

  /**
   * Corrige caracteres corrompidos nos dados
   */
  private fixCorruptedCharacters() {
    const fixString = (str: string): string => {
      return str
        .replace(/��/g, "ção")
        .replace(/�/g, "")
        .replace(/ç��o/g, "ção")
        .replace(/manuten��ão/g, "manutenção")
        .replace(/atribu��da/g, "atribuída")
        .replace(/gestão/g, "gestão")
        .replace(/configurações/g, "configurações")
        .replace(/filtração/g, "filtração");
    };

    const fixObject = (obj: any): any => {
      const fixed = { ...obj };
      Object.keys(fixed).forEach((key) => {
        if (typeof fixed[key] === "string") {
          fixed[key] = fixString(fixed[key]);
        }
      });
      return fixed;
    };

    // Corrigir dados no localStorage
    ["pools", "maintenance", "works", "clients"].forEach((dataType) => {
      const data = JSON.parse(localStorage.getItem(dataType) || "[]");
      const fixedData = data.map(fixObject);
      localStorage.setItem(dataType, JSON.stringify(fixedData));
    });

    console.log("✅ Caracteres corrompidos corrigidos");
  }

  /**
   * Remove dados duplicados
   */
  private removeDuplicates() {
    ["pools", "maintenance", "works", "clients"].forEach((dataType) => {
      const data = JSON.parse(localStorage.getItem(dataType) || "[]");
      const uniqueData = data.filter(
        (item: any, index: number, arr: any[]) =>
          arr.findIndex((t) => t.id === item.id) === index,
      );

      if (uniqueData.length !== data.length) {
        localStorage.setItem(dataType, JSON.stringify(uniqueData));
        console.log(
          `✅ Removidas ${data.length - uniqueData.length} duplicações em ${dataType}`,
        );
      }
    });
  }

  /**
   * Força sincronização com Firebase para recuperar dados perdidos
   */
  async forceDataSync() {
    console.log("🔄 Forçando sincronização para recuperar dados...");

    // Aqui você pode implementar uma lógica para forçar o re-download
    // dos dados do Firebase para recuperar dados perdidos
    try {
      // Emit custom event para trigger sync
      window.dispatchEvent(new CustomEvent("force-data-recovery"));
      console.log("✅ Sincronização forçada iniciada");
    } catch (error) {
      console.error("❌ Erro ao forçar sincronização:", error);
    }
  }
}

// Exportar instância singleton
export const dataIntegrityService = new DataIntegrityService();

// Exportar tipos para uso externo
export type { DataState, IntegrityCheckResult };
