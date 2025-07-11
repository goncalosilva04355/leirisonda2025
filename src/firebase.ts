import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

let app: any;
let firestore: any;
let auth: any;

const firebaseConfig = {
  apiKey: "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw",
  authDomain: "leiria-1cfc9.firebaseapp.com",
  databaseURL:
    "https://leiria-1cfc9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leiria-1cfc9",
  storageBucket: "leiria-1cfc9.firebasestorage.app",
  messagingSenderId: "632599887141",
  appId: "1:632599887141:web:1290b471d41fc3ad64eecc",
  measurementId: "G-Q2QWQVH60L",
};

export const getFirebaseApp = () => {
  if (!app) app = initializeApp(firebaseConfig);
  return app;
};

export const getDB = () => {
  if (!firestore) firestore = getFirestore(getFirebaseApp());
  return firestore;
};

export const getFirebaseAuth = () => {
  if (!auth) auth = getAuth(getFirebaseApp());
  return auth;
};

// Compatibilidade com código existente
export const getFirebaseFirestore = getDB;
export const getAuthService = getFirebaseAuth;
export const isFirebaseReady = () => !!app;
export const isFirestoreReady = () => !!firestore;
export const isFirebaseAuthReady = () => !!auth;

// Exports diretos para compatibilidade
export { app, firestore as db, auth };

export default app;
