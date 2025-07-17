// Configuração Firebase de produção funcional
import {
  getFirebaseApp,
  getFirestoreInstance,
  getAuthInstance,
} from "./config";

// Obter instâncias do Firebase centralizadas
const app = getFirebaseApp();
const db = getFirestoreInstance();
const auth = getAuthInstance();

console.log("🔥 Firebase configuração de produção carregada");
console.log("📱 Projeto:", app.options.projectId);

export { app, db, auth };
export default { app, db, auth };
