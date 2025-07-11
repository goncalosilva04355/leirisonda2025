// Bypass simples para parar erros getImmediate
// Esta solução desativa Firebase temporariamente para app funcionar

console.log(
  "🚫 FIREBASE BYPASS: Desativando Firebase para evitar erros getImmediate",
);

// Criar mock objects para substituir Firebase
const mockFirestore = {
  app: { options: { projectId: "leiria-1cfc9" } },
  collection: () => mockCollection,
  doc: () => mockDoc,
};

const mockCollection = {
  add: async () => ({ id: "mock-id" }),
  get: async () => ({ docs: [], size: 0, forEach: () => {} }),
};

const mockDoc = {
  set: async () => {},
  get: async () => ({ exists: () => false, data: () => null }),
  delete: async () => {},
};

// Substituir funções Firebase problemáticas
export function getFirebaseFirestoreSafe() {
  console.log(
    "🚫 BYPASS: Retornando null para Firestore (app funcionará em modo local)",
  );
  return null;
}

export function isFirestoreReady() {
  return false; // Sempre false para forçar modo local
}

export function testFirestore() {
  console.log("🚫 BYPASS: Teste Firestore desativado (modo local ativo)");
  return Promise.resolve(false);
}

// Substituir getDB para evitar erros
export function getDB() {
  console.log(
    "🚫 BYPASS: getDB retornando null (dados funcionam via localStorage)",
  );
  return null;
}

// Função para verificar se bypass está ativo
export function isBypassActive() {
  return true;
}

console.log("✅ FIREBASE BYPASS ativo - App funcionará em modo localStorage");
console.log(
  "💡 Para reativar Firebase, comente a linha de import do firebaseBypass",
);
