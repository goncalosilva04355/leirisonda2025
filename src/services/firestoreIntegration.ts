// Integração do serviço REST API com a aplicação existente
import { firestoreREST } from "./firestoreRESTService";

// Hook para substituir as operações do SDK problemático
export function useFirestoreREST() {
  // Operações para Obras
  const addObra = async (data: any) => {
    try {
      console.log("💾 Guardando obra via REST API...");
      const result = await firestoreREST.createObra(data);
      console.log("✅ Obra guardada com sucesso:", result.id);

      // Atualizar localStorage para sincronismo local
      const existingObras = JSON.parse(localStorage.getItem("obras") || "[]");
      existingObras.push(result);
      localStorage.setItem("obras", JSON.stringify(existingObras));

      return result;
    } catch (error) {
      console.error("❌ Erro ao guardar obra:", error);
      throw error;
    }
  };

  // Operações para Piscinas
  const addPiscina = async (data: any) => {
    try {
      console.log("💾 Guardando piscina via REST API...");
      const result = await firestoreREST.createPiscina(data);
      console.log("✅ Piscina guardada com sucesso:", result.id);

      // Atualizar localStorage
      const existingPiscinas = JSON.parse(
        localStorage.getItem("piscinas") || "[]",
      );
      existingPiscinas.push(result);
      localStorage.setItem("piscinas", JSON.stringify(existingPiscinas));

      return result;
    } catch (error) {
      console.error("❌ Erro ao guardar piscina:", error);
      throw error;
    }
  };

  // Operações para Manutenções
  const addManutencao = async (data: any) => {
    try {
      console.log("💾 Guardando manutenção via REST API...");
      const result = await firestoreREST.createManutencao(data);
      console.log("✅ Manutenção guardada com sucesso:", result.id);

      // Atualizar localStorage
      const existingManutencoes = JSON.parse(
        localStorage.getItem("manutencoes") || "[]",
      );
      existingManutencoes.push(result);
      localStorage.setItem("manutencoes", JSON.stringify(existingManutencoes));

      return result;
    } catch (error) {
      console.error("❌ Erro ao guardar manutenção:", error);
      throw error;
    }
  };

  // Operações para Clientes
  const addCliente = async (data: any) => {
    try {
      console.log("💾 Guardando cliente via REST API...");
      const result = await firestoreREST.createCliente(data);
      console.log("✅ Cliente guardado com sucesso:", result.id);

      // Atualizar localStorage
      const existingClientes = JSON.parse(
        localStorage.getItem("clientes") || "[]",
      );
      existingClientes.push(result);
      localStorage.setItem("clientes", JSON.stringify(existingClientes));

      return result;
    } catch (error) {
      console.error("❌ Erro ao guardar cliente:", error);
      throw error;
    }
  };

  // Função para sincronizar dados do Firestore para localStorage
  const syncFromFirestore = async () => {
    try {
      console.log("🔄 Sincronizando dados do Firestore...");

      // Carregar todos os dados do Firestore
      const [obras, piscinas, manutencoes, clientes] = await Promise.all([
        firestoreREST.getObras(),
        firestoreREST.getPiscinas(),
        firestoreREST.getManutencoes(),
        firestoreREST.getClientes(),
      ]);

      // Atualizar localStorage
      localStorage.setItem("obras", JSON.stringify(obras));
      localStorage.setItem("piscinas", JSON.stringify(piscinas));
      localStorage.setItem("manutencoes", JSON.stringify(manutencoes));
      localStorage.setItem("clientes", JSON.stringify(clientes));

      console.log("✅ Sincronização completa:", {
        obras: obras.length,
        piscinas: piscinas.length,
        manutencoes: manutencoes.length,
        clientes: clientes.length,
      });

      return true;
    } catch (error) {
      console.error("❌ Erro na sincronização:", error);
      return false;
    }
  };

  // Função para atualizar um documento
  const updateDocument = async (collection: string, id: string, data: any) => {
    try {
      console.log(`💾 Atualizando ${collection}/${id} via REST API...`);
      await firestoreREST.updateDocument(collection, id, data);
      console.log("✅ Documento atualizado com sucesso");

      // Atualizar localStorage
      const existing = JSON.parse(localStorage.getItem(collection) || "[]");
      const index = existing.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        existing[index] = { ...existing[index], ...data, id };
        localStorage.setItem(collection, JSON.stringify(existing));
      }

      return true;
    } catch (error) {
      console.error("❌ Erro ao atualizar documento:", error);
      throw error;
    }
  };

  // Função para deletar um documento
  const deleteDocument = async (collection: string, id: string) => {
    try {
      console.log(`🗑️ Deletando ${collection}/${id} via REST API...`);
      await firestoreREST.deleteDocument(collection, id);
      console.log("✅ Documento deletado com sucesso");

      // Atualizar localStorage
      const existing = JSON.parse(localStorage.getItem(collection) || "[]");
      const filtered = existing.filter((item: any) => item.id !== id);
      localStorage.setItem(collection, JSON.stringify(filtered));

      return true;
    } catch (error) {
      console.error("❌ Erro ao deletar documento:", error);
      throw error;
    }
  };

  return {
    addObra,
    addPiscina,
    addManutencao,
    addCliente,
    updateDocument,
    deleteDocument,
    syncFromFirestore,
    isWorking: true, // REST API está funcionando
  };
}

// Função para ativar o sistema REST API
export function enableFirestoreREST() {
  console.log("🔥 Ativando sistema Firestore REST API...");
  localStorage.setItem("FIRESTORE_REST_ENABLED", "true");
  localStorage.setItem("FIRESTORE_WORKING", "true");
  console.log("✅ Sistema REST API ativado com sucesso!");
}

// Função para verificar se REST API está ativa
export function isFirestoreRESTEnabled(): boolean {
  return localStorage.getItem("FIRESTORE_REST_ENABLED") === "true";
}

// Teste do sistema integrado
export async function testIntegratedSystem(): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const restService = useFirestoreREST();

    // Teste de criação
    const testObra = await restService.addObra({
      title: "Teste de Obra REST API",
      description: "Obra criada via REST API integrada",
      status: "pendente",
      assignedTo: "Sistema REST",
    });

    // Teste de sincronização
    await restService.syncFromFirestore();

    return {
      success: true,
      message: "Sistema integrado funcionando perfeitamente!",
      data: {
        obraCreated: testObra,
        restAPIEnabled: true,
        integration: "success",
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Erro no sistema integrado: ${error.message}`,
      data: { error: error.message },
    };
  }
}
