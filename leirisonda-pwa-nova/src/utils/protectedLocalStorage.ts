import { DataProtectionService } from "../services/dataProtectionService";

// Chaves críticas que precisam de backup automático
const CRITICAL_KEYS = [
  "app-users",
  "authorizedUsers",
  "works",
  "pools",
  "maintenances",
  "clients",
  "interventions",
];

// Guardar referências originais antes de interceptar
const originalLocalStorage = {
  setItem: localStorage.setItem.bind(localStorage),
  getItem: localStorage.getItem.bind(localStorage),
  removeItem: localStorage.removeItem.bind(localStorage),
  clear: localStorage.clear.bind(localStorage),
};

// Wrapper para localStorage que faz backup automático
export class ProtectedLocalStorage {
  static setItem(key: string, value: string): void {
    // Se é uma chave crítica, fazer backup antes
    if (CRITICAL_KEYS.includes(key)) {
      console.log(`🔒 Backup automático antes de guardar: ${key}`);
      DataProtectionService.autoBackupBeforeOperation(`save_${key}`);
    }

    // Guardar no localStorage usando método original
    originalLocalStorage.setItem(key, value);

    console.log(`✅ Dados guardados: ${key} (${value.length} chars)`);
  }

  static getItem(key: string): string | null {
    return originalLocalStorage.getItem(key);
  }

  static removeItem(key: string): void {
    // Se é uma chave crítica, fazer backup antes de remover
    if (CRITICAL_KEYS.includes(key)) {
      console.log(`🔒 Backup automático antes de remover: ${key}`);
      DataProtectionService.autoBackupBeforeOperation(`remove_${key}`);
    }

    // Remover usando método original
    originalLocalStorage.removeItem(key);
    console.log(`🗑️ Dados removidos: ${key}`);
  }

  static clear(): void {
    console.log("🚨 BACKUP COMPLETO antes de limpar localStorage");
    DataProtectionService.autoBackupBeforeOperation("clear_localStorage");
    // Limpar usando método original
    originalLocalStorage.clear();
  }

  // Interceptar operações diretas no localStorage original
  static interceptLocalStorage(): void {
    // Interceptar setItem
    localStorage.setItem = function (key: string, value: string) {
      ProtectedLocalStorage.setItem(key, value);
    };

    // Interceptar removeItem
    localStorage.removeItem = function (key: string) {
      ProtectedLocalStorage.removeItem(key);
    };

    // Interceptar clear
    localStorage.clear = function () {
      ProtectedLocalStorage.clear();
    };

    console.log(
      "🛡️ LocalStorage protegido ativado - backup automático em todas as operações críticas",
    );
  }

  // Método para restaurar comportamento original (útil para debug)
  static restoreOriginalLocalStorage(): void {
    localStorage.setItem = originalLocalStorage.setItem;
    localStorage.getItem = originalLocalStorage.getItem;
    localStorage.removeItem = originalLocalStorage.removeItem;
    localStorage.clear = originalLocalStorage.clear;
    console.log("🔓 LocalStorage restaurado ao comportamento original");
  }
}

// Auto-ativar proteção
ProtectedLocalStorage.interceptLocalStorage();
