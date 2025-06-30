/**
 * Utilitário de diagnóstico para problemas de salvamento de obras
 * Usado para diagnosticar e corrigir problemas quando obras não são guardadas corretamente
 */

import { Work } from "@shared/types";

export interface WorkSaveDiagnostics {
  totalWorks: number;
  backupLocations: {
    works: number;
    leirisonda_works: number;
    temp_works: number;
    emergency_works: number;
  };
  lastWorkSaved?: Work;
  potentialIssues: string[];
  recommendations: string[];
}

export class WorkSaveHelper {
  /**
   * Executa diagnóstico completo dos backups de obras
   */
  static diagnose(): WorkSaveDiagnostics {
    const diagnostics: WorkSaveDiagnostics = {
      totalWorks: 0,
      backupLocations: {
        works: 0,
        leirisonda_works: 0,
        temp_works: 0,
        emergency_works: 0,
      },
      potentialIssues: [],
      recommendations: [],
    };

    try {
      // Verificar localStorage - works
      const works1 = JSON.parse(localStorage.getItem("works") || "[]");
      diagnostics.backupLocations.works = Array.isArray(works1)
        ? works1.length
        : 0;

      // Verificar localStorage - leirisonda_works
      const works2 = JSON.parse(
        localStorage.getItem("leirisonda_works") || "[]",
      );
      diagnostics.backupLocations.leirisonda_works = Array.isArray(works2)
        ? works2.length
        : 0;

      // Verificar sessionStorage - temp_works
      const works3 = JSON.parse(sessionStorage.getItem("temp_works") || "[]");
      diagnostics.backupLocations.temp_works = Array.isArray(works3)
        ? works3.length
        : 0;

      // Verificar obras de emergência
      let emergencyCount = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("emergency_work_")) {
          emergencyCount++;
        }
      }
      diagnostics.backupLocations.emergency_works = emergencyCount;

      // Calcular total
      const allWorks = [...works1, ...works2, ...works3];
      const uniqueWorks = this.removeDuplicateWorks(allWorks);
      diagnostics.totalWorks = uniqueWorks.length;

      // Encontrar última obra
      if (uniqueWorks.length > 0) {
        const sortedWorks = uniqueWorks.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        diagnostics.lastWorkSaved = sortedWorks[0];
      }

      // Identificar problemas potenciais
      if (diagnostics.backupLocations.works === 0) {
        diagnostics.potentialIssues.push("Backup principal 'works' vazio");
      }

      if (diagnostics.backupLocations.leirisonda_works === 0) {
        diagnostics.potentialIssues.push(
          "Backup secundário 'leirisonda_works' vazio",
        );
      }

      if (diagnostics.backupLocations.emergency_works > 0) {
        diagnostics.potentialIssues.push(
          `${diagnostics.backupLocations.emergency_works} obras em modo de emergência encontradas`,
        );
      }

      const inconsistentBackups = Math.abs(
        diagnostics.backupLocations.works -
          diagnostics.backupLocations.leirisonda_works,
      );
      if (inconsistentBackups > 2) {
        diagnostics.potentialIssues.push(
          "Backups inconsistentes entre localizações",
        );
      }

      // Gerar recomendações
      if (diagnostics.potentialIssues.length === 0) {
        diagnostics.recommendations.push(
          "Sistema de backup funcionando corretamente",
        );
      } else {
        if (diagnostics.backupLocations.emergency_works > 0) {
          diagnostics.recommendations.push(
            "Executar consolidação de obras de emergência",
          );
        }
        if (inconsistentBackups > 2) {
          diagnostics.recommendations.push("Executar sincronização de backups");
        }
        diagnostics.recommendations.push("Verificar conectividade Firebase");
        diagnostics.recommendations.push(
          "Considerar limpeza de dados corrompidos",
        );
      }
    } catch (error) {
      diagnostics.potentialIssues.push(
        `Erro ao executar diagnóstico: ${error}`,
      );
      diagnostics.recommendations.push("Recarregar página e tentar novamente");
    }

    return diagnostics;
  }

  /**
   * Consolida obras de emergência para os backups principais
   */
  static consolidateEmergencyWorks(): {
    consolidated: number;
    errors: string[];
  } {
    const result = { consolidated: 0, errors: [] };

    try {
      const emergencyWorks: Work[] = [];

      // Encontrar todas as obras de emergência
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("emergency_work_")) {
          try {
            const workData = JSON.parse(localStorage.getItem(key) || "{}");
            if (workData.id) {
              emergencyWorks.push(workData);
            }
          } catch (error) {
            result.errors.push(`Erro ao recuperar obra de emergência ${key}`);
          }
        }
      }

      if (emergencyWorks.length === 0) {
        return result;
      }

      // Consolidar nos backups principais
      const mainWorks = JSON.parse(localStorage.getItem("works") || "[]");
      const backupWorks = JSON.parse(
        localStorage.getItem("leirisonda_works") || "[]",
      );

      for (const emergencyWork of emergencyWorks) {
        // Verificar se já existe
        const existsInMain = mainWorks.find(
          (w: Work) => w.id === emergencyWork.id,
        );
        const existsInBackup = backupWorks.find(
          (w: Work) => w.id === emergencyWork.id,
        );

        if (!existsInMain) {
          mainWorks.push(emergencyWork);
        }
        if (!existsInBackup) {
          backupWorks.push(emergencyWork);
        }

        // Remover da emergência
        localStorage.removeItem(`emergency_work_${emergencyWork.id}`);
        result.consolidated++;
      }

      // Salvar backups atualizados
      localStorage.setItem("works", JSON.stringify(mainWorks));
      localStorage.setItem("leirisonda_works", JSON.stringify(backupWorks));
    } catch (error) {
      result.errors.push(`Erro na consolidação: ${error}`);
    }

    return result;
  }

  /**
   * Sincroniza backups inconsistentes
   */
  static syncBackups(): { synced: boolean; details: string } {
    try {
      const works1 = JSON.parse(localStorage.getItem("works") || "[]");
      const works2 = JSON.parse(
        localStorage.getItem("leirisonda_works") || "[]",
      );
      const works3 = JSON.parse(sessionStorage.getItem("temp_works") || "[]");

      // Combinar todas as obras e remover duplicatas
      const allWorks = [...works1, ...works2, ...works3];
      const uniqueWorks = this.removeDuplicateWorks(allWorks);

      // Atualizar todos os backups
      localStorage.setItem("works", JSON.stringify(uniqueWorks));
      localStorage.setItem("leirisonda_works", JSON.stringify(uniqueWorks));
      sessionStorage.setItem("temp_works", JSON.stringify(uniqueWorks));

      return {
        synced: true,
        details: `${uniqueWorks.length} obras sincronizadas em todos os backups`,
      };
    } catch (error) {
      return {
        synced: false,
        details: `Erro na sincronização: ${error}`,
      };
    }
  }

  /**
   * Remove obras duplicadas baseado no ID
   */
  private static removeDuplicateWorks(works: Work[]): Work[] {
    const seen = new Set();
    return works.filter((work) => {
      if (seen.has(work.id)) {
        return false;
      }
      seen.add(work.id);
      return true;
    });
  }

  /**
   * Verificação rápida se uma obra específica foi salva
   */
  static isWorkSaved(workId: string): boolean {
    try {
      const works1 = JSON.parse(localStorage.getItem("works") || "[]");
      const works2 = JSON.parse(
        localStorage.getItem("leirisonda_works") || "[]",
      );
      const works3 = JSON.parse(sessionStorage.getItem("temp_works") || "[]");

      const foundInWorks1 = works1.find((w: Work) => w.id === workId);
      const foundInWorks2 = works2.find((w: Work) => w.id === workId);
      const foundInWorks3 = works3.find((w: Work) => w.id === workId);

      return !!(foundInWorks1 || foundInWorks2 || foundInWorks3);
    } catch (error) {
      console.error("Erro ao verificar se obra foi salva:", error);
      return false;
    }
  }

  /**
   * Limpa dados corrompidos que podem estar causando problemas
   */
  static cleanCorruptedData(): { cleaned: boolean; details: string } {
    try {
      const corruptedKeys: string[] = [];

      // Verificar localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              JSON.parse(value); // Tentar parse para detectar JSON corrompido
            }
          } catch (error) {
            corruptedKeys.push(key);
          }
        }
      }

      // Remover chaves corrompidas
      corruptedKeys.forEach((key) => {
        localStorage.removeItem(key);
      });

      return {
        cleaned: true,
        details:
          corruptedKeys.length > 0
            ? `${corruptedKeys.length} itens corrompidos removidos`
            : "Nenhum dado corrompido encontrado",
      };
    } catch (error) {
      return {
        cleaned: false,
        details: `Erro na limpeza: ${error}`,
      };
    }
  }
}
