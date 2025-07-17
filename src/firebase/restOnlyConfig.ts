// CONFIGURAÇÃO APENAS PARA REST API - SEM SDK FIREBASE
// Mantemos apenas as configurações necessárias para usar REST API

export const PROJECT_ID = "leiria-1cfc9";
export const API_KEY = "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw";

// Base URL da REST API do Firestore
export const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Configuração para notificações (se necessário)
export const MESSAGING_CONFIG = {
  apiKey: API_KEY,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  projectId: PROJECT_ID,
  storageBucket: `${PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
  measurementId: "G-Q2QWQVH60L",
};

console.log("✅ Configuração REST API carregada:", PROJECT_ID);
