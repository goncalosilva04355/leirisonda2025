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

// Wrapper para localStorage que faz backup automático
export class ProtectedLocalStorage {
  static setItem(key: string, value: string): void {
    // Se é uma chave crítica, fazer backup antes
    if (CRITICAL_KEYS.includes(key)) {
      console.log(`🔒 Backup automático antes de guardar: ${key}`);
      DataProtectionService.autoBackupBeforeOperation(`save_${key}`);
    }

    // Guardar no localStorage normal
    localStorage.setItem(key, value);

    console.log(`✅ Dados guardados: ${key} (${value.length} chars)`);
  }

  static getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  static removeItem(key: string): void {
    // Se é uma chave crítica, fazer backup antes de remover
    if (CRITICAL_KEYS.includes(key)) {
      console.log(`🔒 Backup automático antes de remover: ${key}`);
      DataProtectionService.autoBackupBeforeOperation(`remove_${key}`);
    }

    // Use the original method to avoid recursion
    this.originalRemoveItem.call(localStorage, key);
    console.log(`🗑️ Dados removidos: ${key}`);
  }

  static clear(): void {
    console.log("🚨 BACKUP COMPLETO antes de limpar localStorage");
    DataProtectionService.autoBackupBeforeOperation("clear_localStorage");
    localStorage.clear();
  }

  // Interceptar operações diretas no localStorage original
  static interceptLocalStorage(): void {
    // Guardar referências originais
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    const originalClear = localStorage.clear;

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
}

// Auto-ativar proteção
ProtectedLocalStorage.interceptLocalStorage();
