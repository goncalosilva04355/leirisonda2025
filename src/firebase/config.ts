// CONFIGURAÇÃO FIREBASE LIMPA
// Apenas o essencial, sem complicações

export const firebaseConfig = {
  // Cole aqui as suas configurações Firebase
  apiKey: "COLE_AQUI_O_SEU_API_KEY",
  authDomain: "COLE_AQUI_O_SEU_AUTH_DOMAIN",
  projectId: "COLE_AQUI_O_SEU_PROJECT_ID",
  storageBucket: "COLE_AQUI_O_SEU_STORAGE_BUCKET",
  messagingSenderId: "COLE_AQUI_O_SEU_MESSAGING_SENDER_ID",
  appId: "COLE_AQUI_O_SEU_APP_ID",
  measurementId: "COLE_AQUI_O_SEU_MEASUREMENT_ID",
};

// Exports vazios por agora - vamos configurar passo a passo
export let app: any = null;
export let db: any = null;
export let auth: any = null;
