// Utilitário para validar configuração Firebase ao inicializar

import { getFirebaseConfig } from "../config/firebaseConfigHelper";

export const validateAppConfiguration = (): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const config = getFirebaseConfig();

    // Verificações obrigatórias
    if (!config.apiKey) {
      errors.push("API Key do Firebase está faltando");
    }

    if (!config.projectId) {
      errors.push("Project ID do Firebase está faltando");
    }

    if (!config.authDomain) {
      errors.push("Auth Domain do Firebase está faltando");
    }

    if (!config.databaseURL) {
      warnings.push(
        "Database URL está faltando - funcionalidade de Realtime Database pode não funcionar",
      );
    }

    // Verificar se está em desenvolvimento
    const isDev =
      import.meta.env.DEV || import.meta.env.NODE_ENV !== "production";
    if (isDev && config.apiKey === "AIzaSyBM6gvL9L6K0CEnM3s5ZzPGqHzut7idLQw") {
      console.log("🔧 Usando configuração de desenvolvimento com fallbacks");
    }

    const isValid = errors.length === 0;

    if (isValid) {
      console.log("✅ Configuração Firebase válida");
      console.log("📍 Projeto:", config.projectId);
    } else {
      console.error("❌ Configuração Firebase inválida:", errors);
    }

    if (warnings.length > 0) {
      console.warn("⚠️ Avisos de configuração:", warnings);
    }

    return { isValid, errors, warnings };
  } catch (error) {
    errors.push(`Erro ao validar configuração: ${error}`);
    return { isValid: false, errors, warnings };
  }
};

// Auto-executar validação quando o módulo for importado
export const configValidationResult = validateAppConfiguration();
