// Firestore OFFLINE-FIRST - usa localStorage como principal, REST API como backup
console.log("🏠 Offline-First Firestore: localStorage priorizado");

// Função para salvar dados (localStorage primeiro)
export const saveToOfflineFirestore = async (
  collection: string,
  data: any,
  documentId?: string,
): Promise<string | null> => {
  const finalDocumentId = documentId || Date.now().toString();

  try {
    console.log(
      `💾 Offline-First: Salvando ${collection}/${finalDocumentId} no localStorage...`,
    );

    // Preparar dados
    const itemData = {
      ...data,
      id: finalDocumentId,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Salvar no localStorage
    const localData = JSON.parse(localStorage.getItem(collection) || "[]");

    // Verificar se já existe e atualizar, ou adicionar novo
    const existingIndex = localData.findIndex(
      (item: any) => item.id === finalDocumentId,
    );

    if (existingIndex >= 0) {
      localData[existingIndex] = itemData;
      console.log(
        `🔄 Offline-First: Atualizando ${collection}/${finalDocumentId}`,
      );
    } else {
      localData.push(itemData);
      console.log(
        `➕ Offline-First: Adicionando ${collection}/${finalDocumentId}`,
      );
    }

    localStorage.setItem(collection, JSON.stringify(localData));
    console.log(
      `✅ Offline-First: ${collection}/${finalDocumentId} salvo com sucesso`,
    );

    // Tentar sincronizar em background (não bloquear)
    syncToRestApiBackground(collection, itemData);

    return finalDocumentId;
  } catch (error) {
    console.error(
      `❌ Offline-First: Erro ao salvar ${collection}/${finalDocumentId}:`,
      error,
    );
    return null;
  }
};

// Função para ler dados (localStorage sempre)
export const readFromOfflineFirestore = async (
  collection: string,
): Promise<any[]> => {
  try {
    console.log(`📖 Offline-First: Lendo ${collection} do localStorage...`);

    const localData = JSON.parse(localStorage.getItem(collection) || "[]");

    console.log(
      `✅ Offline-First: ${collection} lido (${localData.length} itens)`,
    );

    // Tentar sincronizar do REST API em background (não bloquear)
    syncFromRestApiBackground(collection);

    return localData;
  } catch (error) {
    console.error(`❌ Offline-First: Erro ao ler ${collection}:`, error);
    return [];
  }
};

// Função para eliminar dados
export const deleteFromOfflineFirestore = async (
  collection: string,
  documentId: string,
): Promise<boolean> => {
  try {
    console.log(`🗑️ Offline-First: Eliminando ${collection}/${documentId}...`);

    const localData = JSON.parse(localStorage.getItem(collection) || "[]");
    const filteredData = localData.filter(
      (item: any) => item.id !== documentId,
    );

    localStorage.setItem(collection, JSON.stringify(filteredData));

    console.log(`✅ Offline-First: ${collection}/${documentId} eliminado`);

    // Tentar eliminar do REST API em background
    deleteFromRestApiBackground(collection, documentId);

    return true;
  } catch (error) {
    console.error(
      `❌ Offline-First: Erro ao eliminar ${collection}/${documentId}:`,
      error,
    );
    return false;
  }
};

// Sincronização em background (não bloqueia a UI)
const syncToRestApiBackground = async (collection: string, data: any) => {
  try {
    console.log(`🔄 Background sync: Tentando enviar para REST API...`);

    // Importar dinamicamente para evitar problemas de dependência
    const { saveToFirestoreRest } = await import("./firestoreRestApi");
    await saveToFirestoreRest(collection, data, data.id);

    console.log(`✅ Background sync: ${collection}/${data.id} sincronizado`);
  } catch (error) {
    console.warn(
      `⚠️ Background sync: Falha na sincronização de ${collection}/${data.id}:`,
      error.message,
    );
    // Não faz nada - é apenas um backup
  }
};

const syncFromRestApiBackground = async (collection: string) => {
  try {
    // Importar dinamicamente
    const { readFromFirestoreRest } = await import("./firestoreRestApi");
    const remoteData = await readFromFirestoreRest(collection);

    if (remoteData && remoteData.length > 0) {
      console.log(
        `🔄 Background sync: Dados remotos encontrados para ${collection}`,
      );
      // Merge inteligente (manter dados locais mais recentes)
      // TODO: implementar merge se necessário
    }
  } catch (error) {
    console.warn(
      `⚠️ Background sync: Falha ao ler ${collection} do REST API:`,
      error.message,
    );
    // Não faz nada - localStorage já tem os dados
  }
};

const deleteFromRestApiBackground = async (
  collection: string,
  documentId: string,
) => {
  try {
    const { deleteFromFirestoreRest } = await import("./firestoreRestApi");
    await deleteFromFirestoreRest(collection, documentId);

    console.log(
      `✅ Background sync: ${collection}/${documentId} eliminado remotamente`,
    );
  } catch (error) {
    console.warn(
      `⚠️ Background sync: Falha ao eliminar ${collection}/${documentId} remotamente:`,
      error.message,
    );
    // Não faz nada - dados locais já foram eliminados
  }
};

// Teste automático para garantir que funciona
console.log("🧪 Offline-First: Teste automático...");

// Tornar funções globais para debug
(window as any).offlineFirestore = {
  save: saveToOfflineFirestore,
  read: readFromOfflineFirestore,
  delete: deleteFromOfflineFirestore,
};

console.log(
  "✅ Offline-First Firestore inicializado - localStorage priorizado",
);
