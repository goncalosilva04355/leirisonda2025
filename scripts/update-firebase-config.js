#!/usr/bin/env node

/**
 * Script para atualizar automaticamente a configuração Firebase
 * Lê o template e atualiza o arquivo principal
 */

const fs = require("fs");
const path = require("path");

const templatePath = path.join(__dirname, "../src/firebase/config-template.ts");
const configPath = path.join(__dirname, "../src/firebase/config.ts");

console.log("🔥 Atualizando configuração Firebase...");

try {
  // Verificar se template existe
  if (!fs.existsSync(templatePath)) {
    console.error("❌ Template não encontrado:", templatePath);
    process.exit(1);
  }

  // Ler template
  const templateContent = fs.readFileSync(templatePath, "utf8");

  // Extrair configuração do template
  const configMatch = templateContent.match(
    /export const newFirebaseConfig = {([\s\S]*?)};/,
  );

  if (!configMatch) {
    console.error("❌ Configuração não encontrada no template");
    process.exit(1);
  }

  const configText = configMatch[1];

  // Verificar se ainda tem placeholders
  if (configText.includes("COLE_AQUI_")) {
    console.error("❌ Ainda existem placeholders por preencher no template!");
    console.log("📝 Edite o arquivo: src/firebase/config-template.ts");
    console.log("🔗 Siga as instruções em: FIREBASE-SETUP-GUIDE.md");
    process.exit(1);
  }

  // Ler configuração atual
  const currentConfig = fs.readFileSync(configPath, "utf8");

  // Substituir configuração
  const newConfig = currentConfig.replace(
    /\/\/ Firebase config.*?{[\s\S]*?};/,
    `// Firebase config - Updated automatically
const defaultFirebaseConfig = {${configText}};`,
  );

  // Reativar Firebase
  const finalConfig = newConfig
    .replace(
      /\/\/ Force local mode since Firebase project is inactive\s*console\.log\(.*?\);\s*return false;/,
      "return !!(app && auth && db);",
    )
    .replace(
      /\/\/ Firebase project appears to be inactive - force local mode\s*console\.log\(.*?\);\s*return true;/,
      "// Firebase handles quota management automatically\n  return false;",
    );

  // Escrever nova configuração
  fs.writeFileSync(configPath, finalConfig);

  console.log("✅ Configuração Firebase atualizada com sucesso!");
  console.log(
    "🔄 Reinicie o servidor de desenvolvimento para aplicar as mudanças",
  );
  console.log("📱 A sincronização entre dispositivos está agora ativa!");
} catch (error) {
  console.error("❌ Erro ao atualizar configuração:", error.message);
  process.exit(1);
}
