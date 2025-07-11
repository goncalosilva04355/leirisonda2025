import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { getDB } from "../firebase/basicConfig";

// Get Firestore instance
const getFirestore = () => {
  const db = getDB();
  if (!db) {
    throw new Error("Firestore não está disponível");
  }
  return db;
};

/**
 * Serviço para corrigir dados existentes que podem estar isolados por utilizador
 * Garante que TODAS as obras, piscinas, manutenções e clientes sejam visíveis para todos
 */
export class FixDataVisibilityService {
  private static readonly COLLECTIONS = {
    WORKS: "works",
    POOLS: "pools",
    MAINTENANCE: "maintenance",
    CLIENTS: "clients",
  };

  /**
   * Executa a correção completa de visibilidade de dados
   */
  static async fixAllDataVisibility(): Promise<{
    success: boolean;
    message: string;
    details: string[];
    fixed: {
      works: number;
      pools: number;
      maintenance: number;
      clients: number;
    };
  }> {
    const result = {
      success: true,
      message: "",
      details: [],
      fixed: { works: 0, pools: 0, maintenance: 0, clients: 0 },
    };

    if (!db) {
      result.success = false;
      result.message = "Firebase não disponível";
      return result;
    }

    console.log("🔄 INICIANDO CORREÇÃO DE VISIBILIDADE DE DADOS...");
    result.details.push("🔄 Iniciando correção de visibilidade de dados...");

    try {
      // Corrigir obras
      result.fixed.works = await this.fixCollectionVisibility(
        this.COLLECTIONS.WORKS,
        "obras",
      );
      result.details.push(
        `��� ${result.fixed.works} obras corrigidas para visibilidade global`,
      );

      // Corrigir piscinas
      result.fixed.pools = await this.fixCollectionVisibility(
        this.COLLECTIONS.POOLS,
        "piscinas",
      );
      result.details.push(
        `✅ ${result.fixed.pools} piscinas corrigidas para visibilidade global`,
      );

      // Corrigir manutenções
      result.fixed.maintenance = await this.fixCollectionVisibility(
        this.COLLECTIONS.MAINTENANCE,
        "manutenções",
      );
      result.details.push(
        `✅ ${result.fixed.maintenance} manutenções corrigidas para visibilidade global`,
      );

      // Corrigir clientes
      result.fixed.clients = await this.fixCollectionVisibility(
        this.COLLECTIONS.CLIENTS,
        "clientes",
      );
      result.details.push(
        `✅ ${result.fixed.clients} clientes corrigidos para visibilidade global`,
      );

      const totalFixed =
        result.fixed.works +
        result.fixed.pools +
        result.fixed.maintenance +
        result.fixed.clients;

      result.message = `Correção concluída! ${totalFixed} registros agora são visíveis para todos os utilizadores.`;
      result.details.push(
        `🎉 CORREÇÃO COMPLETA: ${totalFixed} registros agora partilhados globalmente`,
      );

      console.log("✅ CORREÇÃO DE VISIBILIDADE CONCLUÍDA:", result);
    } catch (error: any) {
      console.error("❌ Erro na correção de visibilidade:", error);
      result.success = false;
      result.message = `Erro na correção: ${error.message}`;
      result.details.push(`❌ Erro: ${error.message}`);
    }

    return result;
  }

  /**
   * Corrige a visibilidade de uma coleção específica
   */
  private static async fixCollectionVisibility(
    collectionName: string,
    displayName: string,
  ): Promise<number> {
    console.log(`🔍 Verificando ${displayName} para correção...`);

    try {
      // Buscar todos os documentos da coleção
      const querySnapshot = await getDocs(
        collection(getFirestore(), collectionName),
      );
      let fixedCount = 0;

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();

        // Verificar se o documento precisa de correção
        const needsFix =
          !data.sharedGlobally ||
          !data.visibleToAllUsers ||
          !data.isGlobalData ||
          data.dataSharing !== "all_users";

        if (needsFix) {
          console.log(
            `🔧 Corrigindo ${displayName} ID: ${docSnap.id} para visibilidade global`,
          );

          // Atualizar documento para ser globalmente visível
          await updateDoc(doc(getFirestore(), collectionName, docSnap.id), {
            sharedGlobally: true,
            visibleToAllUsers: true,
            isGlobalData: true,
            dataSharing: "all_users",
            fixedAt: new Date().toISOString(),
            fixedByService: "FixDataVisibilityService",
          });

          fixedCount++;
        }
      }

      console.log(
        `✅ ${displayName}: ${fixedCount} registros corrigidos de ${querySnapshot.size} total`,
      );
      return fixedCount;
    } catch (error: any) {
      console.error(`❌ Erro ao corrigir ${displayName}:`, error);
      throw error;
    }
  }

  /**
   * Verifica se há dados que precisam de correção
   */
  static async checkDataVisibilityStatus(): Promise<{
    needsFix: boolean;
    counts: {
      works: { total: number; needsFix: number };
      pools: { total: number; needsFix: number };
      maintenance: { total: number; needsFix: number };
      clients: { total: number; needsFix: number };
    };
  }> {
    const result = {
      needsFix: false,
      counts: {
        works: { total: 0, needsFix: 0 },
        pools: { total: 0, needsFix: 0 },
        maintenance: { total: 0, needsFix: 0 },
        clients: { total: 0, needsFix: 0 },
      },
    };

    if (!db) {
      return result;
    }

    try {
      // Verificar cada coleção
      for (const [key, collectionName] of Object.entries(this.COLLECTIONS)) {
        const collectionKey = key.toLowerCase() as keyof typeof result.counts;
        const querySnapshot = await getDocs(
          collection(getFirestore(), collectionName),
        );

        result.counts[collectionKey].total = querySnapshot.size;

        querySnapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const needsFix =
            !data.sharedGlobally ||
            !data.visibleToAllUsers ||
            !data.isGlobalData ||
            data.dataSharing !== "all_users";

          if (needsFix) {
            result.counts[collectionKey].needsFix++;
            result.needsFix = true;
          }
        });
      }

      console.log("📊 Status de visibilidade dos dados:", result);
    } catch (error) {
      console.error("❌ Erro ao verificar status de visibilidade:", error);
    }

    return result;
  }

  /**
   * Força sincronização imediata de todos os dados para todos os utilizadores
   */
  static async forceCrossUserSync(): Promise<boolean> {
    if (!db) {
      console.warn("❌ Firebase não disponível para sincronização");
      return false;
    }

    try {
      console.log("🚀 Forçando sincronização entre todos os utilizadores...");

      // Notificar todos os listeners ativos para recarregar dados
      const syncEvent = new CustomEvent("force-cross-user-sync", {
        detail: {
          timestamp: Date.now(),
          source: "FixDataVisibilityService",
          message: "Dados atualizados - recarregamento necessário",
        },
      });

      window.dispatchEvent(syncEvent);

      // Também enviar evento de storage para cross-tab sync
      localStorage.setItem(
        "lastGlobalDataFix",
        JSON.stringify({
          timestamp: new Date().toISOString(),
          fixApplied: true,
        }),
      );

      console.log("✅ Sincronização entre utilizadores ativada");
      return true;
    } catch (error) {
      console.error("❌ Erro na sincronização entre utilizadores:", error);
      return false;
    }
  }
}

export default FixDataVisibilityService;
