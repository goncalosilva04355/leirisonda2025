// Configuração Firestore temporariamente em modo local para evitar erros getImmediate
// Esta versão evita completamente os problemas de inicialização

import { Firestore } from "firebase/firestore";

// Estado atual: sempre em modo local para evitar erros
const LOCAL_MODE = true;

// Variável para armazenar a instância do Firestore (sempre null em modo local)
let firestoreInstance: Firestore | null = null;

// Função principal para obter Firestore (sempre retorna null em modo local)
export function getFirebaseFirestore(): Firestore | null {
  if (LOCAL_MODE) {
    console.log("📱 Firestore em modo local - dados guardados no localStorage");
    return null;
  }
  return firestoreInstance;
}

// Função assíncrona para obter Firestore (sempre retorna null em modo local)
export async function getFirebaseFirestoreAsync(): Promise<Firestore | null> {
  if (LOCAL_MODE) {
    console.log("📱 Firestore em modo local - dados guardados no localStorage");
    return null;
  }
  return firestoreInstance;
}

// Função para verificar se Firestore está pronto (sempre false em modo local)
export function isFirestoreReady(): boolean {
  return false;
}

// Função de teste simples para Firestore (sempre retorna false em modo local)
export async function testFirestore(): Promise<boolean> {
  console.log("📱 Firestore teste: modo local ativo");
  return false;
}

// Função para forçar inicialização (não faz nada em modo local)
export async function forceFirestoreInit(): Promise<boolean> {
  console.log("📱 Firestore forçado: modo local ativo");
  return false;
}

// Função para limpar instância (não faz nada em modo local)
export function clearFirestoreInstance(): void {
  console.log("🧹 Firestore limpo: modo local ativo");
}

// Função para ativar modo local
export function enableLocalMode(): void {
  console.log("✅ Modo local Firestore ativado");
  console.log("💾 Todos os dados serão guardados no localStorage");
  console.log("🚫 Erros Firebase eliminados");
}

// Ativar modo local automaticamente
enableLocalMode();

// Exportações
export { firestoreInstance };
export default firestoreInstance;
