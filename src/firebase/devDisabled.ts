// Wrapper para desativar Firebase completamente durante desenvolvimento

// Funções mock que retornam valores seguros
export const getFirebaseApp = () => null;
export const getAuth = () => null;
export const getFirebaseFirestore = () => null;
export const getFirebaseFirestoreAsync = async () => null;
export const isFirebaseReady = () => false;
export const isFirestoreReady = () => false;
export const testFirebaseConnection = async () => ({
  success: false,
  results: ["Firebase desativado em desenvolvimento"],
  errors: [],
});

// Outros mocks necessários
export const db = null;
export const auth = null;
export const app = null;

console.log("🚫 Firebase DESATIVADO em desenvolvimento");
console.log("📝 Use apenas localStorage durante desenvolvimento");
console.log("🚀 Firebase será ativo apenas no Netlify");
